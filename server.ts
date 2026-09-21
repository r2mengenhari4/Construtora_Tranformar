import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import {
  getSupabaseDiagnostic,
  getSiteDataFromSupabase,
  saveSiteContentToSupabase,
  saveCompanyConfigToSupabase,
  saveProjectsToSupabase,
  uploadMediaToSupabaseStorage,
} from "./server/supabase";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with large limit for media data URLs (short videos up to 30s)
  app.use(express.json({ limit: "60mb" }));
  app.use(express.urlencoded({ extended: true, limit: "60mb" }));

  // Path constants
  const COMPANY_DATA_PATH = path.join(process.cwd(), "src", "data", "companyData.ts");
  const DEFAULT_SITE_CONTENT_PATH = path.join(process.cwd(), "src", "data", "defaultSiteContent.ts");

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  /**
   * GET /api/supabase-status
   * Returns current status and connectivity of Supabase PostgreSQL and Storage
   */
  app.get("/api/supabase-status", async (_req, res) => {
    try {
      const status = await getSupabaseDiagnostic();
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Erro no diagnóstico do Supabase" });
    }
  });

  /**
   * GET /api/site-data
   * Fetches latest data for all visitors. Priority: Supabase PostgreSQL -> local code files
   */
  app.get("/api/site-data", async (_req, res) => {
    try {
      const diagnostic = await getSupabaseDiagnostic();
      const supabaseData = await getSiteDataFromSupabase();

      if (
        supabaseData &&
        (supabaseData.siteContent || supabaseData.companyConfig || supabaseData.projects)
      ) {
        res.json({
          success: true,
          source: "supabase",
          supabase: diagnostic,
          data: {
            siteContent: supabaseData.siteContent,
            companyConfig: supabaseData.companyConfig,
            projects: supabaseData.projects,
          },
        });
        return;
      }

      res.json({
        success: true,
        source: "code",
        supabase: diagnostic,
        data: null,
      });
    } catch (err: any) {
      console.error("[SERVER] Erro ao obter dados do site:", err);
      res.status(500).json({ success: false, error: err?.message || "Erro ao carregar dados" });
    }
  });

  /**
   * Helper to write formatted TypeScript exports to file safely
   */
  const writeSourceFile = (filePath: string, content: string) => {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, content, "utf-8");
    fs.renameSync(tempPath, filePath);
  };

  /**
   * POST /api/upload-media
   * Uploads photos and short videos (<30s) to Supabase Storage and returns the public CDN URL
   */
  app.post("/api/upload-media", async (req, res) => {
    try {
      const { dataUrl, filename, contentType } = req.body;
      if (!dataUrl || typeof dataUrl !== "string") {
        res.status(400).json({ success: false, error: "dataUrl é obrigatório." });
        return;
      }

      // If already a public web URL, return as-is
      if (dataUrl.startsWith("http://") || dataUrl.startsWith("https://")) {
        res.json({ success: true, url: dataUrl, source: "url" });
        return;
      }

      // Extract base64 content
      const matches = dataUrl.match(/^data:([A-Za-z0-9-+/.]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        res.json({ success: true, url: dataUrl, source: "raw" });
        return;
      }

      const mimeType = contentType || matches[1];
      const base64Content = matches[2];
      const buffer = Buffer.from(base64Content, "base64");

      let ext = "jpg";
      if (mimeType.includes("png")) ext = "png";
      else if (mimeType.includes("webp")) ext = "webp";
      else if (mimeType.includes("mp4")) ext = "mp4";
      else if (mimeType.includes("webm")) ext = "webm";
      else if (mimeType.includes("quicktime")) ext = "mov";

      const finalName = filename || `media_${Date.now()}.${ext}`;
      const uploadResult = await uploadMediaToSupabaseStorage(buffer, finalName, mimeType);

      if (uploadResult.success && uploadResult.url) {
        res.json({
          success: true,
          url: uploadResult.url,
          source: "supabase_storage",
        });
      } else {
        // Graceful fallback to dataUrl if Supabase keys aren't added yet
        res.json({
          success: true,
          url: dataUrl,
          source: "local_fallback",
          warning: uploadResult.error,
        });
      }
    } catch (err: any) {
      console.error("[SERVER] Erro em /api/upload-media:", err);
      res.status(500).json({ success: false, error: err?.message || "Falha no upload de mídia." });
    }
  });

  /**
   * POST /api/save-site-content
   * Saves into Supabase PostgreSQL AND updates src/data/defaultSiteContent.ts for GitHub version control
   */
  app.post("/api/save-site-content", async (req, res) => {
    try {
      const { siteContent } = req.body;
      if (!siteContent) {
        res.status(400).json({ success: false, error: "siteContent é obrigatório." });
        return;
      }

      // 1. Save in Supabase PostgreSQL
      const supabaseOk = await saveSiteContentToSupabase(siteContent);

      // 2. Update local TypeScript source file for GitHub/build
      const fileContent = `// Arquivo gerado e sincronizado automaticamente via Área de Membros da Construtora Transformar
import { SiteContent } from '../types/siteContent';

export const DEFAULT_SITE_CONTENT: SiteContent = ${JSON.stringify(siteContent, null, 2)};
`;
      writeSourceFile(DEFAULT_SITE_CONTENT_PATH, fileContent);
      console.log("[SERVER] src/data/defaultSiteContent.ts e Supabase atualizados com sucesso.");

      res.json({
        success: true,
        savedToSupabase: supabaseOk,
        message: supabaseOk
          ? "Conteúdo salvo no Supabase PostgreSQL e gravado no código-fonte!"
          : "Conteúdo salvo no código-fonte com sucesso (configure as variáveis do Supabase para persistir no banco).",
      });
    } catch (err: any) {
      console.error("[SERVER] Erro ao gravar defaultSiteContent.ts:", err);
      res.status(500).json({ success: false, error: err?.message || "Falha ao gravar arquivo no código-fonte." });
    }
  });

  /**
   * POST /api/save-company-config
   * Saves into Supabase PostgreSQL AND updates COMPANY_CONFIG in src/data/companyData.ts
   */
  app.post("/api/save-company-config", async (req, res) => {
    try {
      const { companyConfig } = req.body;
      if (!companyConfig) {
        res.status(400).json({ success: false, error: "companyConfig é obrigatório." });
        return;
      }

      // 1. Save in Supabase PostgreSQL
      const supabaseOk = await saveCompanyConfigToSupabase(companyConfig);

      // 2. Update local TypeScript file for GitHub
      const currentFile = fs.readFileSync(COMPANY_DATA_PATH, "utf-8");
      const configJson = JSON.stringify(companyConfig, null, 2);

      const regex = /export const COMPANY_CONFIG = \{[\s\S]*?\n\};/;
      if (regex.test(currentFile)) {
        const updated = currentFile.replace(regex, `export const COMPANY_CONFIG = ${configJson};`);
        writeSourceFile(COMPANY_DATA_PATH, updated);
        console.log("[SERVER] COMPANY_CONFIG atualizado com sucesso no código e Supabase.");
        res.json({
          success: true,
          savedToSupabase: supabaseOk,
          message: supabaseOk
            ? "Configuração gravada no Supabase PostgreSQL e no código-fonte!"
            : "Configuração gravada no código-fonte com sucesso.",
        });
      } else {
        res.status(500).json({ success: false, error: "Padrão de COMPANY_CONFIG não encontrado no arquivo." });
      }
    } catch (err: any) {
      console.error("[SERVER] Erro ao salvar companyConfig:", err);
      res.status(500).json({ success: false, error: err?.message || "Falha ao atualizar dados da empresa no código-fonte." });
    }
  });

  /**
   * POST /api/save-projects
   * Saves into Supabase PostgreSQL AND updates PORTFOLIO_PROJECTS in src/data/companyData.ts
   */
  app.post("/api/save-projects", async (req, res) => {
    try {
      const { projects } = req.body;
      if (!projects || !Array.isArray(projects)) {
        res.status(400).json({ success: false, error: "projects array é obrigatório." });
        return;
      }

      // 1. Save in Supabase PostgreSQL
      const supabaseOk = await saveProjectsToSupabase(projects);

      // 2. Update local TypeScript file for GitHub
      const currentFile = fs.readFileSync(COMPANY_DATA_PATH, "utf-8");
      const projectsJson = JSON.stringify(projects, null, 2);

      const regex = /export const PORTFOLIO_PROJECTS:\s*Project\[\]\s*=\s*\[[\s\S]*?\n\];/;
      if (regex.test(currentFile)) {
        const updated = currentFile.replace(regex, `export const PORTFOLIO_PROJECTS: Project[] = ${projectsJson};`);
        writeSourceFile(COMPANY_DATA_PATH, updated);
        console.log("[SERVER] PORTFOLIO_PROJECTS atualizado com sucesso no código e Supabase.");
        res.json({
          success: true,
          savedToSupabase: supabaseOk,
          message: supabaseOk
            ? "Obras e projetos gravados no Supabase PostgreSQL e no código-fonte!"
            : "Projetos gravados no código-fonte com sucesso.",
        });
      } else {
        res.status(500).json({ success: false, error: "Padrão de PORTFOLIO_PROJECTS não encontrado no arquivo." });
      }
    } catch (err: any) {
      console.error("[SERVER] Erro ao salvar projects:", err);
      res.status(500).json({ success: false, error: err?.message || "Falha ao gravar projetos no código-fonte." });
    }
  });

  // Vite middleware for development vs Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Servidor fullstack Construtora Transformar ativo na porta ${PORT}`);
  });
}

startServer();
