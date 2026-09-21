import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;
const BUCKET_NAME = "transformar-media";
let bucketChecked = false;

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
 * Ensures the public storage bucket exists
 */
async function ensureStorageBucket(client: SupabaseClient): Promise<void> {
  if (bucketChecked) return;
  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some((b) => b.name === BUCKET_NAME);
      if (!exists) {
        console.log(`[SUPABASE STORAGE] Criando bucket público "${BUCKET_NAME}"...`);
        await client.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 60 * 1024 * 1024, // 60MB max
        });
      }
    }
    bucketChecked = true;
  } catch (err) {
    console.warn("[SUPABASE STORAGE] Aviso ao verificar/criar bucket:", err);
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
