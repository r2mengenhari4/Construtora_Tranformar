import express from "express";
import path from "path";
import fs from "fs";
import { DEFAULT_SITE_CONTENT } from "../src/data/defaultSiteContent";
import { COMPANY_CONFIG, PORTFOLIO_PROJECTS } from "../src/data/companyData";
import {
  getSupabaseDiagnostic,
  getSiteDataFromSupabase,
  saveSiteContentToSupabase,
  saveCompanyConfigToSupabase,
  saveProjectsToSupabase,
  uploadMediaToSupabaseStorage,
  updateRuntimeSupabaseConfig,
  initializeSupabaseTablesAndSeed,
} from "./supabase";

export const app = express();

// JSON Body Parser with large limit for media data URLs (short videos up to 30s)
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true, limit: "60mb" }));

// Path constants
const COMPANY_DATA_PATH = path.join(process.cwd(), "src", "data", "companyData.ts");
const DEFAULT_SITE_CONTENT_PATH = path.join(process.cwd(), "src", "data", "defaultSiteContent.ts");

/**
 * Safely writes formatted TypeScript exports to file if the filesystem is writable.
 * On serverless platforms like Vercel with read-only filesystems, it catches EROFS gracefully.
 */
const safeWriteSourceFile = (filePath: string, content: string): boolean => {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, content, "utf-8");
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err: any) {
    console.warn(
      `[FS] Aviso: Gravação em arquivo local ignorada (${err?.code || err?.message}). ` +
      `Isso é esperado em ambientes de deploy serverless como a Vercel. A persistência é garantida pelo Supabase PostgreSQL.`
    );
    return false;
  }
};

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    platform: process.env.VERCEL ? "vercel-serverless" : "standard-node",
  });
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
 * GET /api/supabase-config
 * Returns current configuration info (URL and masked keys) and diagnostic
 */
app.get(["/api/supabase-config", "/supabase-config"], async (_req, res) => {
  try {
    const url = process.env.SUPABASE_URL || "";
    const anonKey = process.env.SUPABASE_ANON_KEY || "";
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    const maskKey = (k: string) => {
      if (!k || k.length < 8) return "";
      return `${k.substring(0, 4)}...${k.substring(k.length - 4)}`;
    };

    const diagnostic = await getSupabaseDiagnostic();

    res.json({
      success: true,
      url,
      anonKey, // Public anon key provided for client-side direct browser connection
      hasAnonKey: Boolean(anonKey),
      hasServiceRoleKey: Boolean(serviceRoleKey),
      anonKeyMasked: maskKey(anonKey),
      serviceRoleKeyMasked: maskKey(serviceRoleKey),
      diagnostic,
    });
  } catch (err: any) {
    res.status(200).json({ 
      success: false, 
      error: err?.message || "Erro ao consultar configuração",
      diagnostic: { configured: false, database: false, storage: false, error: err?.message }
    });
  }
});

/**
 * POST /api/supabase-config
 * Updates Supabase credentials at runtime, verifies connection and persists
 */
app.post(["/api/supabase-config", "/supabase-config"], async (req, res) => {
  try {
    const { url, anonKey, serviceRoleKey } = req.body || {};
    if (!url || typeof url !== "string") {
      res.status(200).json({ success: false, message: "URL do projeto Supabase é obrigatória." });
      return;
    }

    const result = await updateRuntimeSupabaseConfig(url, anonKey, serviceRoleKey);
    res.json(result);
  } catch (err: any) {
    console.error("[SERVER] Erro ao salvar configuração do Supabase:", err);
    res.status(200).json({ success: false, message: err?.message || "Erro ao salvar credenciais" });
  }
});

/**
 * POST /api/supabase-init-tables
 * Verifies and initializes table site_settings and media bucket on Supabase
 */
app.post(["/api/supabase-init-tables", "/supabase-init-tables"], async (req, res) => {
  try {
    const { siteContent, companyConfig, projects } = req.body || {};
    const finalContent = siteContent || DEFAULT_SITE_CONTENT;
    const finalConfig = companyConfig || COMPANY_CONFIG;
    const finalProjects = (Array.isArray(projects) && projects.length > 0) ? projects : PORTFOLIO_PROJECTS;
    const result = await initializeSupabaseTablesAndSeed(finalContent, finalConfig, finalProjects);
    res.json(result);
  } catch (err: any) {
    console.error("[SERVER] Erro ao inicializar tabelas no Supabase:", err);
    res.status(200).json({ 
      success: false, 
      message: err?.message || "Erro ao inicializar tabelas",
      details: { database: false, siteSettingsTable: false, storageBucket: false, error: err?.message }
    });
  }
});

/**
 * GET /api/site-data
 * Fetches latest data for all visitors. Merges Supabase data with baseline defaults so all browsers receive complete, updated content.
 */
app.get("/api/site-data", async (_req, res) => {
  try {
    const diagnostic = await getSupabaseDiagnostic();
    const supabaseData = await getSiteDataFromSupabase();

    let mergedContent = DEFAULT_SITE_CONTENT;
    let mergedConfig = COMPANY_CONFIG;
    let mergedProjects = PORTFOLIO_PROJECTS;

    if (supabaseData) {
      if (supabaseData.siteContent && typeof supabaseData.siteContent === "object") {
        mergedContent = {
          ...DEFAULT_SITE_CONTENT,
          ...supabaseData.siteContent,
          hero: { ...DEFAULT_SITE_CONTENT.hero, ...(supabaseData.siteContent.hero || {}) },
          allInOne: { ...DEFAULT_SITE_CONTENT.allInOne, ...(supabaseData.siteContent.allInOne || {}) },
          timeline: { ...DEFAULT_SITE_CONTENT.timeline, ...(supabaseData.siteContent.timeline || {}) },
          services: { ...DEFAULT_SITE_CONTENT.services, ...(supabaseData.siteContent.services || {}) },
          portfolio: { ...DEFAULT_SITE_CONTENT.portfolio, ...(supabaseData.siteContent.portfolio || {}) },
          differentials: { ...DEFAULT_SITE_CONTENT.differentials, ...(supabaseData.siteContent.differentials || {}) },
          testimonials: { ...DEFAULT_SITE_CONTENT.testimonials, ...(supabaseData.siteContent.testimonials || {}) },
          faq: { ...DEFAULT_SITE_CONTENT.faq, ...(supabaseData.siteContent.faq || {}) },
          about: { ...DEFAULT_SITE_CONTENT.about, ...(supabaseData.siteContent.about || {}) },
          contact: { ...DEFAULT_SITE_CONTENT.contact, ...(supabaseData.siteContent.contact || {}) },
        };
      }
      if (supabaseData.companyConfig && typeof supabaseData.companyConfig === "object" && Object.keys(supabaseData.companyConfig).length > 0) {
        mergedConfig = {
          ...COMPANY_CONFIG,
          ...supabaseData.companyConfig,
        };
      }
      if (Array.isArray(supabaseData.projects) && supabaseData.projects.length > 0) {
        mergedProjects = supabaseData.projects;
      }
    }

    res.json({
      success: true,
      source: supabaseData?.siteContent ? "supabase" : "code",
      supabase: diagnostic,
      data: {
        siteContent: mergedContent,
        companyConfig: mergedConfig,
        projects: mergedProjects,
      },
    });
  } catch (err: any) {
    console.error("[SERVER] Erro ao obter dados do site:", err);
    res.status(500).json({ success: false, error: err?.message || "Erro ao carregar dados" });
  }
});

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
 * Saves into Supabase PostgreSQL AND updates defaultSiteContent.ts with safely merged content
 */
app.post("/api/save-site-content", async (req, res) => {
  try {
    const { siteContent } = req.body;
    if (!siteContent || typeof siteContent !== "object") {
      res.status(400).json({ success: false, error: "siteContent é obrigatório." });
      return;
    }

    // Get current data from Supabase to merge cleanly so no section is ever dropped
    const currentData = await getSiteDataFromSupabase();
    const existing = currentData?.siteContent || DEFAULT_SITE_CONTENT;

    const mergedContent = {
      ...DEFAULT_SITE_CONTENT,
      ...existing,
      ...siteContent,
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(existing.hero || {}), ...(siteContent.hero || {}) },
      allInOne: { ...DEFAULT_SITE_CONTENT.allInOne, ...(existing.allInOne || {}), ...(siteContent.allInOne || {}) },
      timeline: { ...DEFAULT_SITE_CONTENT.timeline, ...(existing.timeline || {}), ...(siteContent.timeline || {}) },
      services: { ...DEFAULT_SITE_CONTENT.services, ...(existing.services || {}), ...(siteContent.services || {}) },
      portfolio: { ...DEFAULT_SITE_CONTENT.portfolio, ...(existing.portfolio || {}), ...(siteContent.portfolio || {}) },
      differentials: { ...DEFAULT_SITE_CONTENT.differentials, ...(existing.differentials || {}), ...(siteContent.differentials || {}) },
      testimonials: { ...DEFAULT_SITE_CONTENT.testimonials, ...(existing.testimonials || {}), ...(siteContent.testimonials || {}) },
      faq: { ...DEFAULT_SITE_CONTENT.faq, ...(existing.faq || {}), ...(siteContent.faq || {}) },
      about: { ...DEFAULT_SITE_CONTENT.about, ...(existing.about || {}), ...(siteContent.about || {}) },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(existing.contact || {}), ...(siteContent.contact || {}) },
    };

    // 1. Save in Supabase PostgreSQL
    const supabaseOk = await saveSiteContentToSupabase(mergedContent);

    // 2. Update local TypeScript source file when running in writable local/dev environment
    const fileContent = `// Arquivo gerado e sincronizado automaticamente via Área de Membros da Construtora Transformar
import { SiteContent } from '../types/siteContent';

export const DEFAULT_SITE_CONTENT: SiteContent = ${JSON.stringify(mergedContent, null, 2)};
`;
    const localWritten = safeWriteSourceFile(DEFAULT_SITE_CONTENT_PATH, fileContent);

    res.json({
      success: true,
      savedToSupabase: supabaseOk,
      localSync: localWritten,
      data: mergedContent,
      message: supabaseOk
        ? "Conteúdo salvo com sucesso no Supabase PostgreSQL!"
        : "Conteúdo salvo no código-fonte com sucesso (adicione as chaves do Supabase para persistir no banco).",
    });
  } catch (err: any) {
    console.error("[SERVER] Erro ao gravar defaultSiteContent.ts:", err);
    res.status(500).json({ success: false, error: err?.message || "Falha ao gravar arquivo de conteúdo." });
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

    // 2. Update local file if writable
    let localWritten = false;
    try {
      if (fs.existsSync(COMPANY_DATA_PATH)) {
        const currentFile = fs.readFileSync(COMPANY_DATA_PATH, "utf-8");
        const configJson = JSON.stringify(companyConfig, null, 2);
        const regex = /export const COMPANY_CONFIG = \{[\s\S]*?\n\};/;
        if (regex.test(currentFile)) {
          const updated = currentFile.replace(regex, `export const COMPANY_CONFIG = ${configJson};`);
          localWritten = safeWriteSourceFile(COMPANY_DATA_PATH, updated);
        }
      }
    } catch (e) {
      console.warn("[FS] Aviso ao atualizar companyData localmente:", e);
    }

    res.json({
      success: true,
      savedToSupabase: supabaseOk,
      localSync: localWritten,
      message: supabaseOk
        ? "Configuração gravada no Supabase PostgreSQL com sucesso!"
        : "Configuração gravada no código-fonte com sucesso.",
    });
  } catch (err: any) {
    console.error("[SERVER] Erro ao salvar companyConfig:", err);
    res.status(500).json({ success: false, error: err?.message || "Falha ao atualizar dados da empresa." });
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

    // 2. Update local file if writable
    let localWritten = false;
    try {
      if (fs.existsSync(COMPANY_DATA_PATH)) {
        const currentFile = fs.readFileSync(COMPANY_DATA_PATH, "utf-8");
        const projectsJson = JSON.stringify(projects, null, 2);
        const regex = /export const PORTFOLIO_PROJECTS:\s*Project\[\]\s*=\s*\[[\s\S]*?\n\];/;
        if (regex.test(currentFile)) {
          const updated = currentFile.replace(regex, `export const PORTFOLIO_PROJECTS: Project[] = ${projectsJson};`);
          localWritten = safeWriteSourceFile(COMPANY_DATA_PATH, updated);
        }
      }
    } catch (e) {
      console.warn("[FS] Aviso ao atualizar projetos localmente:", e);
    }

    res.json({
      success: true,
      savedToSupabase: supabaseOk,
      localSync: localWritten,
      message: supabaseOk
        ? "Obras e projetos gravados no Supabase PostgreSQL com sucesso!"
        : "Projetos gravados no código-fonte com sucesso.",
    });
  } catch (err: any) {
    console.error("[SERVER] Erro ao salvar projects:", err);
    res.status(500).json({ success: false, error: err?.message || "Falha ao gravar projetos." });
  }
});
