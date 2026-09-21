import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;
const STORAGE_URL_KEY = 'transformar_supabase_url';
const STORAGE_ANON_KEY = 'transformar_supabase_anon_key';

/**
 * Retorna as configurações de Supabase disponíveis no cliente (Vite env ou localStorage)
 */
export function getStoredClientSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let localUrl = '';
  let localAnon = '';
  try {
    localUrl = localStorage.getItem(STORAGE_URL_KEY) || '';
    localAnon = localStorage.getItem(STORAGE_ANON_KEY) || '';
  } catch {
    // fallback
  }

  return {
    url: envUrl || localUrl,
    anonKey: envAnonKey || localAnon,
  };
}

/**
 * Salva as credenciais do Supabase no localStorage para sincronização direta do navegador
 */
export function saveBrowserSupabaseConfig(url: string, anonKey: string) {
  try {
    if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
    if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
    browserClient = null; // force recreate
  } catch (e) {
    console.warn('Não foi possível salvar credenciais no localStorage:', e);
  }
}

/**
 * Retorna o cliente Supabase do navegador (client-side) caso as variáveis
 * VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou localStorage) estejam definidas.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredClientSupabaseConfig();

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    try {
      browserClient = createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.warn('[SUPABASE BROWSER] Falha ao criar cliente:', err);
      return null;
    }
  }

  return browserClient;
}

/**
 * Testa a conexão direta do navegador com o Supabase
 */
export async function testBrowserSupabaseConnection(
  testUrl?: string,
  testAnonKey?: string
): Promise<{ success: boolean; database: boolean; message: string; latencyMs: number }> {
  const start = performance.now();
  const { url: storedUrl, anonKey: storedKey } = getStoredClientSupabaseConfig();
  const finalUrl = testUrl || storedUrl;
  const finalKey = testAnonKey || storedKey;

  if (!finalUrl || !finalKey) {
    return {
      success: false,
      database: false,
      message: 'URL e Chave Anon do Supabase necessárias.',
      latencyMs: 0,
    };
  }

  try {
    const client = createClient(finalUrl, finalKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await client.from('site_settings').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      return {
        success: false,
        database: false,
        message: `Conectou ao Supabase, mas erro ao ler site_settings: ${error.message}`,
        latencyMs,
      };
    }

    return {
      success: true,
      database: true,
      message: `Conexão direta do navegador com Supabase PostgreSQL confirmada (${latencyMs}ms)!`,
      latencyMs,
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: false,
      database: false,
      message: `Falha na conexão: ${err?.message || 'Erro de rede ou URL inválida.'}`,
      latencyMs,
    };
  }
}

/**
 * Consulta diretamente a tabela site_settings no Supabase via cliente do navegador
 */
export async function fetchSiteDataDirectFromSupabase(): Promise<{
  siteContent: any | null;
  companyConfig: any | null;
  projects: any[] | null;
} | null> {
  const client = getBrowserSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('site_settings')
      .select('id, data, updated_at');

    if (error || !data || data.length === 0) {
      return null;
    }

    const result: { siteContent: any | null; companyConfig: any | null; projects: any[] | null } = {
      siteContent: null,
      companyConfig: null,
      projects: null,
    };

    for (const item of data) {
      if (item.id === 'site_content') result.siteContent = item.data;
      if (item.id === 'company_config') result.companyConfig = item.data;
      if (item.id === 'projects') result.projects = item.data;
    }

    return result;
  } catch (e) {
    console.warn('[SUPABASE BROWSER] Erro na consulta direta:', e);
    return null;
  }
}

/**
 * Inicializa e verifica tabelas e bucket de mídia diretamente através do cliente do navegador
 */
export async function initializeOrVerifyBrowserTables(
  siteContent?: any,
  companyConfig?: any,
  projects?: any[]
): Promise<{ success: boolean; message: string; details: any }> {
  const client = getBrowserSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase não configurado no navegador. Salve a URL e a Chave Anon primeiro.',
      details: null,
    };
  }

  const results = {
    database: false,
    siteSettingsTable: false,
    storageBucket: false,
    seededRows: [] as string[],
    error: '',
  };

  try {
    const { data: existingData, error: tableErr } = await client
      .from('site_settings')
      .select('id')
      .limit(10);

    if (tableErr) {
      results.error = tableErr.message;
      return {
        success: false,
        message: `A tabela 'site_settings' não foi encontrada no Supabase: ${tableErr.message}. Copie o código da aba 'Tabelas & SQL' e execute no SQL Editor do painel Supabase.`,
        details: results,
      };
    }

    results.database = true;
    results.siteSettingsTable = true;

    const existingIds = new Set((existingData || []).map((row: any) => row.id));

    // Seed missing rows if content provided
    if (!existingIds.has('company_config') && companyConfig) {
      await client.from('site_settings').upsert({
        id: 'company_config',
        data: companyConfig,
        updated_at: new Date().toISOString(),
      });
      results.seededRows.push('company_config');
    }

    if (!existingIds.has('site_content') && siteContent) {
      await client.from('site_settings').upsert({
        id: 'site_content',
        data: siteContent,
        updated_at: new Date().toISOString(),
      });
      results.seededRows.push('site_content');
    }

    if (!existingIds.has('projects') && projects) {
      await client.from('site_settings').upsert({
        id: 'projects',
        data: projects,
        updated_at: new Date().toISOString(),
      });
      results.seededRows.push('projects');
    }

    // Try check storage bucket
    try {
      const { data: buckets } = await client.storage.listBuckets();
      if (buckets && buckets.some((b) => b.name === 'transformar-media')) {
        results.storageBucket = true;
      }
    } catch {
      // ignore storage list if restricted by RLS
    }

    return {
      success: true,
      message: "Tabela 'site_settings' e banco de dados verificados com sucesso no Supabase! Dados ativos para sincronização entre navegadores.",
      details: results,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Erro na verificação direta: ${err?.message || 'Erro de conexão'}`,
      details: results,
    };
  }
}

/**
 * Salva site_content diretamente no Supabase pelo navegador
 */
export async function saveSiteContentDirectToSupabase(content: any): Promise<boolean> {
  const client = getBrowserSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('site_settings').upsert({
      id: 'site_content',
      data: content,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Salva company_config diretamente no Supabase pelo navegador
 */
export async function saveCompanyConfigDirectToSupabase(config: any): Promise<boolean> {
  const client = getBrowserSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('site_settings').upsert({
      id: 'company_config',
      data: config,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Salva projects diretamente no Supabase pelo navegador
 */
export async function saveProjectsDirectToSupabase(projects: any[]): Promise<boolean> {
  const client = getBrowserSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('site_settings').upsert({
      id: 'projects',
      data: projects,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}
