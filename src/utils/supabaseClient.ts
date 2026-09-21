import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

/**
 * Retorna o cliente Supabase do navegador (client-side) caso as variáveis
 * VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estejam definidas no ambiente da Vercel ou local.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return browserClient;
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
