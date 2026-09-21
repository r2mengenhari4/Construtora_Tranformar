import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

let supabaseClient: SupabaseClient | null = null;
const BUCKET_NAME = "transformar-media";
let bucketChecked = false;
const RUNTIME_CONFIG_PATH = path.join(process.cwd(), "supabase-runtime-config.json");

// Load stored runtime config if present and environment variables are not already set
try {
  if (!process.env.SUPABASE_URL && fs.existsSync(RUNTIME_CONFIG_PATH)) {
    const raw = fs.readFileSync(RUNTIME_CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.url) {
      process.env.SUPABASE_URL = parsed.url;
      if (parsed.anonKey) process.env.SUPABASE_ANON_KEY = parsed.anonKey;
      if (parsed.serviceRoleKey) process.env.SUPABASE_SERVICE_ROLE_KEY = parsed.serviceRoleKey;
      console.log(`[SUPABASE] Credenciais carregadas do arquivo de configuração em runtime: ${parsed.url}`);
    }
  }
} catch (e) {
  console.warn("[SUPABASE] Falha ao carregar supabase-runtime-config.json:", e);
}

/**
 * Lazy-initializes and returns the Supabase client if credentials are configured
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)?.trim();

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log(`[SUPABASE] Cliente inicializado com sucesso para: ${url}`);
  }

  return supabaseClient;
}

/**
 * Updates runtime credentials, recreates the client, and persists to disk
 */
export async function updateRuntimeSupabaseConfig(
  url: string,
  anonKey?: string,
  serviceRoleKey?: string
): Promise<{ success: boolean; message: string; diagnostic: any }> {
  try {
    const cleanUrl = url.trim();
    const cleanAnon = anonKey?.trim() || "";
    const cleanService = serviceRoleKey?.trim() || "";

    if (!cleanUrl) {
      return {
        success: false,
        message: "URL do Supabase inválida ou em branco.",
        diagnostic: await getSupabaseDiagnostic(),
      };
    }

    // Update in process.env
    process.env.SUPABASE_URL = cleanUrl;
    if (cleanAnon) process.env.SUPABASE_ANON_KEY = cleanAnon;
    if (cleanService) process.env.SUPABASE_SERVICE_ROLE_KEY = cleanService;

    // Reset and recreate client
    const key = cleanService || cleanAnon;
    if (key) {
      supabaseClient = createClient(cleanUrl, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } else {
      supabaseClient = null;
    }
    bucketChecked = false;

    // Persist to file if possible
    try {
      fs.writeFileSync(
        RUNTIME_CONFIG_PATH,
        JSON.stringify(
          {
            url: cleanUrl,
            anonKey: cleanAnon,
            serviceRoleKey: cleanService,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        ),
        "utf-8"
      );
    } catch (fsErr) {
      console.warn("[SUPABASE] Não foi possível salvar supabase-runtime-config.json:", fsErr);
    }

    const diagnostic = await getSupabaseDiagnostic();
    return {
      success: diagnostic.configured && diagnostic.database,
      message: diagnostic.database
        ? "Conexão com o Supabase estabelecida e testada com sucesso!"
        : diagnostic.configured
        ? "Conectado ao Supabase, mas a tabela 'site_settings' necessita ser inicializada."
        : "Verifique a URL e as chaves informadas.",
      diagnostic,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro ao salvar credenciais: ${err?.message || "Desconhecido"}`,
      diagnostic: await getSupabaseDiagnostic(),
    };
  }
}

/**
 * Ensures the public storage bucket exists
 */
export async function ensureStorageBucket(client?: SupabaseClient | null): Promise<boolean> {
  const sb = client || getSupabase();
  if (!sb) return false;

  try {
    const { data: buckets, error } = await sb.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some((b) => b.name === BUCKET_NAME);
      if (!exists) {
        console.log(`[SUPABASE STORAGE] Criando bucket público "${BUCKET_NAME}"...`);
        const { error: createErr } = await sb.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 60 * 1024 * 1024, // 60MB max
        });
        if (createErr) {
          console.warn("[SUPABASE STORAGE] Aviso ao criar bucket:", createErr.message);
          return false;
        }
      }
      bucketChecked = true;
      return true;
    }
    return false;
  } catch (err) {
    console.warn("[SUPABASE STORAGE] Aviso ao verificar/criar bucket:", err);
    return false;
  }
}

/**
 * Verifies table site_settings and storage bucket, initializes data if empty
 */
export async function initializeSupabaseTablesAndSeed(
  defaultContent?: any,
  defaultConfig?: any,
  defaultProjects?: any[]
): Promise<{ success: boolean; message: string; details: any }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: "Supabase não configurado. Por favor, preencha a URL e a Chave de API primeiro.",
      details: null,
    };
  }

  const results = {
    database: false,
    siteSettingsTable: false,
    storageBucket: false,
    seededRows: [] as string[],
    error: "",
  };

  try {
    // 1. Check if site_settings table exists and fetch current rows
    const { data: existingData, error: tableErr } = await client
      .from("site_settings")
      .select("id, data")
      .limit(10);

    if (tableErr) {
      results.error = tableErr.message;
      return {
        success: false,
        message: `A tabela 'site_settings' não foi encontrada ou não possui permissão: ${tableErr.message}. Execute o script supabase-schema.sql no SQL Editor do Supabase.`,
        details: results,
      };
    }

    results.database = true;
    results.siteSettingsTable = true;

    // Check existing keys and their data health
    const existingMap = new Map((existingData || []).map((row: any) => [row.id, row.data]));

    const isCompanyConfigEmpty = !existingMap.has("company_config") || 
      !existingMap.get("company_config") || 
      Object.keys(existingMap.get("company_config")).length === 0;

    const isSiteContentEmpty = !existingMap.has("site_content") || 
      !existingMap.get("site_content") || 
      !existingMap.get("site_content").hero;

    const isProjectsEmpty = !existingMap.has("projects") || 
      !Array.isArray(existingMap.get("projects")) || 
      existingMap.get("projects").length === 0;

    // Seed or repair initial records if not present or empty
    if (isCompanyConfigEmpty && defaultConfig) {
      await client.from("site_settings").upsert({
        id: "company_config",
        data: defaultConfig,
        updated_at: new Date().toISOString(),
      });
      results.seededRows.push("company_config");
    }

    if (isSiteContentEmpty && defaultContent) {
      await client.from("site_settings").upsert({
        id: "site_content",
        data: defaultContent,
        updated_at: new Date().toISOString(),
      });
      results.seededRows.push("site_content");
    }

    if (isProjectsEmpty && defaultProjects) {
      await client.from("site_settings").upsert({
        id: "projects",
        data: defaultProjects,
        updated_at: new Date().toISOString(),
      });
      results.seededRows.push("projects");
    }

    // 2. Check and ensure storage bucket
    const bucketOk = await ensureStorageBucket(client);
    results.storageBucket = bucketOk;

    return {
      success: true,
      message: "Tabela 'site_settings' e bucket de mídias verificados e prontos para sincronização cross-browser!",
      details: results,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro na verificação de tabelas: ${err?.message || "Desconhecido"}`,
      details: results,
    };
  }
}

/**
 * Fetches all persistent data from Supabase PostgreSQL (table: site_settings)
 */
export async function getSiteDataFromSupabase(): Promise<{
  siteContent: any | null;
  companyConfig: any | null;
  projects: any[] | null;
} | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from("site_settings")
      .select("id, data, updated_at");

    if (error) {
      console.warn("[SUPABASE DB] Tabela 'site_settings' ainda não acessível ou inexistente:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const result: { siteContent: any | null; companyConfig: any | null; projects: any[] | null } = {
      siteContent: null,
      companyConfig: null,
      projects: null,
    };

    for (const item of data) {
      if (item.id === "site_content") result.siteContent = item.data;
      if (item.id === "company_config") result.companyConfig = item.data;
      if (item.id === "projects") result.projects = item.data;
    }

    return result;
  } catch (err: any) {
    console.warn("[SUPABASE DB] Erro ao consultar dados:", err?.message);
    return null;
  }
}

/**
 * Saves site content into Supabase PostgreSQL
 */
export async function saveSiteContentToSupabase(siteContent: any): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from("site_settings").upsert(
      {
        id: "site_content",
        data: siteContent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[SUPABASE DB] Erro ao salvar site_content:", error.message);
      return false;
    }
    console.log("[SUPABASE DB] site_content gravado com sucesso no PostgreSQL.");
    return true;
  } catch (err: any) {
    console.error("[SUPABASE DB] Exceção ao gravar site_content:", err?.message);
    return false;
  }
}

/**
 * Saves company config into Supabase PostgreSQL
 */
export async function saveCompanyConfigToSupabase(companyConfig: any): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from("site_settings").upsert(
      {
        id: "company_config",
        data: companyConfig,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[SUPABASE DB] Erro ao salvar company_config:", error.message);
      return false;
    }
    console.log("[SUPABASE DB] company_config gravado com sucesso no PostgreSQL.");
    return true;
  } catch (err: any) {
    console.error("[SUPABASE DB] Exceção ao gravar company_config:", err?.message);
    return false;
  }
}

/**
 * Saves portfolio projects into Supabase PostgreSQL
 */
export async function saveProjectsToSupabase(projects: any[]): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from("site_settings").upsert(
      {
        id: "projects",
        data: projects,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("[SUPABASE DB] Erro ao salvar projects:", error.message);
      return false;
    }
    console.log("[SUPABASE DB] projects gravado com sucesso no PostgreSQL.");
    return true;
  } catch (err: any) {
    console.error("[SUPABASE DB] Exceção ao gravar projects:", err?.message);
    return false;
  }
}

/**
 * Uploads media (images and short videos) into Supabase Storage
 */
export async function uploadMediaToSupabaseStorage(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      error: "Supabase não configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente.",
    };
  }

  try {
    await ensureStorageBucket(client);

    // Sanitize filename and create unique path
    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `uploads/${Date.now()}_${cleanName}`;

    const { error: uploadError } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("[SUPABASE STORAGE] Erro no upload:", uploadError.message);
      return { success: false, error: uploadError.message };
    }

    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    console.log(`[SUPABASE STORAGE] Arquivo enviado com sucesso: ${publicUrl}`);
    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error("[SUPABASE STORAGE] Exceção no upload:", err?.message);
    return { success: false, error: err?.message || "Falha ao enviar para o Supabase Storage." };
  }
}

/**
 * Returns diagnostic status of Supabase configuration
 */
export async function getSupabaseDiagnostic() {
  const url = process.env.SUPABASE_URL?.trim();
  const hasKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);
  const client = getSupabase();

  if (!client || !url || !hasKey) {
    return {
      configured: false,
      database: false,
      storage: false,
      message: "Variáveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas no ambiente.",
    };
  }

  let dbOk = false;
  let storageOk = false;
  let dbMessage = "";

  try {
    const { error } = await client.from("site_settings").select("id").limit(1);
    if (!error) {
      dbOk = true;
    } else {
      dbMessage = error.message;
    }
  } catch (e: any) {
    dbMessage = e?.message || "Erro de conexão";
  }

  try {
    const { error } = await client.storage.listBuckets();
    if (!error) {
      storageOk = true;
    }
  } catch {
    storageOk = false;
  }

  return {
    configured: true,
    url,
    database: dbOk,
    storage: storageOk,
    bucketName: BUCKET_NAME,
    details: dbOk
      ? "Supabase PostgreSQL e Storage conectados com sucesso!"
      : `Banco necessita da tabela 'site_settings' (${dbMessage || "Aguardando criação da tabela"}).`,
  };
}
