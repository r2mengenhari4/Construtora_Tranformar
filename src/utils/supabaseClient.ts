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
