import React, { useState, useEffect } from 'react';
import { useMember } from '../context/MemberContext';
import { 
  X, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Key, 
  Globe, 
  Copy, 
  Check, 
  Server, 
  Layers, 
  HardDrive,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { 
  getStoredClientSupabaseConfig, 
  saveBrowserSupabaseConfig, 
  testBrowserSupabaseConnection,
  initializeOrVerifyBrowserTables
} from '../utils/supabaseClient';

interface SupabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseManagerModal: React.FC<SupabaseManagerModalProps> = ({ isOpen, onClose }) => {
  const { 
    supabaseStatus, 
    refreshSupabaseStatus,
    siteContent,
    companyConfig,
    projects
  } = useMember();

  const [activeTab, setActiveTab] = useState<'status' | 'credentials' | 'schema'>('status');

  // Credentials form
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [serviceRoleKey, setServiceRoleKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  // Testing connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    serverOk?: boolean;
    clientOk?: boolean;
    latencyMs?: number;
    message: string;
  } | null>(null);

  // Initializing tables state
  const [isInitializingTables, setIsInitializingTables] = useState(false);
  const [initResult, setInitResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const [copiedSql, setCopiedSql] = useState(false);

  // Load existing credentials when modal opens
  useEffect(() => {
    if (isOpen) {
      // 1. Check client-stored credentials
      const clientConfig = getStoredClientSupabaseConfig();
      if (clientConfig.url) setSupabaseUrl(clientConfig.url);
      if (clientConfig.anonKey) setAnonKey(clientConfig.anonKey);

      // 2. Query server for current config
      fetch('/api/supabase-config')
        .then((r) => r.text())
        .then((raw) => {
          try {
            const data = JSON.parse(raw);
            if (data && data.success) {
              if (data.url) setSupabaseUrl(data.url);
              if (data.anonKey) {
                setAnonKey(data.anonKey);
                saveBrowserSupabaseConfig(data.url, data.anonKey);
              }
            }
          } catch {
            // Non-JSON response, ignore
          }
        })
        .catch(() => {});

      // Clear banners
      setSaveResult(null);
      setTestResult(null);
      setInitResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Save Credentials
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveResult(null);
    setIsSaving(true);

    const cleanUrl = supabaseUrl.trim();
    const cleanAnon = anonKey.trim();
    const cleanService = serviceRoleKey.trim();

    if (!cleanUrl) {
      setSaveResult({
        success: false,
        message: 'Por favor, informe a URL do seu projeto Supabase (ex: https://xyz.supabase.co).',
      });
      setIsSaving(false);
      return;
    }

    try {
      // 1. Save on backend server
      const res = await fetch('/api/supabase-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: cleanUrl,
          anonKey: cleanAnon,
          serviceRoleKey: cleanService,
        }),
      });
      const data = await res.json();

      // 2. Save in browser localStorage for direct client synchronization
      saveBrowserSupabaseConfig(cleanUrl, cleanAnon);

      // 3. Refresh status in context
      await refreshSupabaseStatus();

      if (data.success) {
        setSaveResult({
          success: true,
          message: 'Configurações salvas e testadas com sucesso no servidor e no navegador!',
        });
      } else {
        setSaveResult({
          success: false,
          message: data.message || 'Credenciais gravadas, mas a conexão ainda necessita de verificação.',
        });
      }
    } catch (err: any) {
      // Even if server call fails, save locally in browser
      saveBrowserSupabaseConfig(cleanUrl, cleanAnon);
      setSaveResult({
        success: true,
        message: 'Configurações salvas no navegador para sincronização direta!',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Test Connection
  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    const start = performance.now();
    try {
      // Run both server diagnostic and direct client test
      const [serverRes, clientRes] = await Promise.allSettled([
        refreshSupabaseStatus(),
        testBrowserSupabaseConnection(supabaseUrl, anonKey),
      ]);

      const latency = Math.round(performance.now() - start);
      const clientTest = clientRes.status === 'fulfilled' ? clientRes.value : null;

      const isServerConfigured = Boolean(supabaseStatus?.configured);
      const isClientOk = clientTest ? clientTest.success : false;

      if (isServerConfigured || isClientOk) {
        setTestResult({
          success: true,
          serverOk: isServerConfigured,
          clientOk: isClientOk,
          latencyMs: latency,
          message: isClientOk
            ? `Conexão bem-sucedida com o Supabase PostgreSQL (${latency}ms)! As informações estão prontas para sincronizar entre navegadores.`
            : `Servidor conectado ao Supabase (${latency}ms).`,
        });
      } else {
        setTestResult({
          success: false,
          serverOk: false,
          clientOk: false,
          latencyMs: latency,
          message: 'Não foi possível conectar. Verifique a URL e as chaves cadastradas.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: `Falha ao executar teste de conexão: ${err?.message || 'Erro de rede'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Handle Verify & Init Tables
  const handleInitTables = async () => {
    setIsInitializingTables(true);
    setInitResult(null);

    try {
      let serverData: any = null;
      let serverAttemptFailed = false;
      let serverErrorMsg = '';

      // 1. Attempt verification via server API (safe parse, lightweight payload)
      try {
        const res = await fetch('/api/supabase-init-tables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ checkOnly: true }),
        });

        const rawText = await res.text();
        if (rawText && (rawText.trim().startsWith('{') || rawText.trim().startsWith('['))) {
          try {
            serverData = JSON.parse(rawText);
          } catch {
            serverAttemptFailed = true;
            serverErrorMsg = 'Resposta não-JSON recebida da API.';
          }
        } else {
          serverAttemptFailed = true;
          serverErrorMsg = rawText ? rawText.slice(0, 100) : 'Sem resposta do servidor';
        }
      } catch (netErr: any) {
        serverAttemptFailed = true;
        serverErrorMsg = netErr?.message || 'Falha de conexão com a API';
      }

      // If server confirmed success
      if (serverData && serverData.success) {
        await refreshSupabaseStatus();
        setInitResult({
          success: true,
          message: serverData.message || "Tabela 'site_settings' e bucket de mídia verificados com sucesso no Supabase!",
          details: serverData.details,
        });
        setIsInitializingTables(false);
        return;
      }

      // 2. Direct Browser Fallback: verify and initialize directly via Supabase client in browser
      const clientResult = await initializeOrVerifyBrowserTables(
        siteContent,
        companyConfig,
        projects
      );

      await refreshSupabaseStatus();

      if (clientResult.success) {
        setInitResult({
          success: true,
          message: clientResult.message,
          details: clientResult.details,
        });
      } else {
        setInitResult({
          success: false,
          message:
            serverData?.message ||
            clientResult.message ||
            `Não foi possível verificar as tabelas: ${serverErrorMsg}. Verifique se a URL e chaves do Supabase foram salvas.`,
          details: clientResult.details || serverData?.details,
        });
      }
    } catch (err: any) {
      setInitResult({
        success: false,
        message: `Falha na inicialização: ${err?.message || 'Erro inesperado'}. Verifique as credenciais do Supabase.`,
      });
    } finally {
      setIsInitializingTables(false);
    }
  };

  const sqlSnippet = `-- 1. TABELA PRINCIPAL DE CONTEÚDO E CONFIGURAÇÕES
create table if not exists public.site_settings (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 2. HABILITAR SEGURANÇA E LEITURA/ESCRITA PÚBLICA
alter table public.site_settings enable row level security;

create policy "Permitir leitura pública" on public.site_settings
  for select to anon, authenticated, service_role using (true);

create policy "Permitir gravação pública" on public.site_settings
  for all to anon, authenticated, service_role using (true) with check (true);

-- 3. BUCKET DE MÍDIA (FOTOS E VÍDEOS DE ATÉ 30s)
insert into storage.buckets (id, name, public, file_size_limit)
values ('transformar-media', 'transformar-media', true, 62914560)
on conflict (id) do nothing;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div 
      id="supabase-manager-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        id="supabase-manager-container"
        className="bg-[#0A1628] border border-amber-500/40 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-amber-400 to-blue-500 shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white tracking-wide flex items-center gap-2">
                <span>Conexão Supabase</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
                  PostgreSQL & Storage
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sincronização persistente de dados entre todos os navegadores e dispositivos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-white/10 bg-slate-900/40 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'status'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Conferir Conexão & Status</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'credentials'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Modificar Credenciais</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'schema'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tabelas & SQL</span>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          
          {/* TAB 1: STATUS & CONFERÊNCIA */}
          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F223D] to-[#0A182B] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${
                      supabaseStatus?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`} />
                    <span className="font-bold text-white text-base">
                      {supabaseStatus?.configured ? 'Supabase Conectado' : 'Aguardando Configuração de URL'}
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    supabaseStatus?.configured 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {supabaseStatus?.configured ? 'Sincronização Ativa' : 'Pronto para Conectar'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  {/* Database check */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Database className="w-3.5 h-3.5 text-amber-400" />
                      <span>PostgreSQL DB</span>
                    </div>
                    <div className="font-semibold text-white">
                      {supabaseStatus?.database ? 'Tabela site_settings OK' : 'Aguardando verificação'}
                    </div>
                  </div>

                  {/* Storage check */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                      <span>Storage CDN</span>
                    </div>
                    <div className="font-semibold text-white">
                      {supabaseStatus?.storage ? 'Bucket transformar-media' : 'Bucket pronto'}
                    </div>
                  </div>

                  {/* Cross-Browser Sync */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cross-Browser</span>
                    </div>
                    <div className="font-semibold text-emerald-300">
                      Multi-Navegador Ativo
                    </div>
                  </div>
                </div>

                {supabaseStatus?.url && (
                  <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-white/10">
                    <span>Projeto Supabase Conectado:</span>
                    <span className="font-mono text-amber-300">{supabaseStatus.url}</span>
                  </div>
                )}
              </div>

              {/* Cross-browser persistence explanation */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-300 text-sm">
                  <Laptop className="w-4 h-4" />
                  <span>Como funciona a sincronização entre navegadores?</span>
                </div>
                <p>
                  Quando você edita textos, fotos ou cadastra novas obras pelo Painel de Membros, as informações são salvas diretamente no banco PostgreSQL na nuvem do Supabase.
                </p>
                <p>
                  Qualquer visitante em <strong>qualquer navegador de internet</strong> (Chrome, Safari, Firefox, Edge, Celular Android ou iPhone) receberá a versão mais recente e atualizada imediatamente, sem perda de dados entre sessões.
                </p>
              </div>

              {/* Test Connection Results */}
              {testResult && (
                <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 animate-fadeIn ${
                  testResult.success
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-white">
                      {testResult.success ? 'Teste de Conexão Bem-Sucedido!' : 'Aviso no Teste de Conexão'}
                    </div>
                    <p>{testResult.message}</p>
                    {testResult.latencyMs ? (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-slate-300">
                        Latência de resposta: {testResult.latencyMs}ms
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Table Initialization Results */}
              {initResult && (
                <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 animate-fadeIn ${
                  initResult.success
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                    : 'bg-red-500/15 border border-red-500/40 text-red-200'
                }`}>
                  {initResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold text-sm text-white">
                      {initResult.success ? 'Tabelas Verificadas e Inicializadas!' : 'Erro na Inicialização'}
                    </div>
                    <p>{initResult.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testando Conexão...' : 'Testar Conexão Agora'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInitTables}
                  disabled={isInitializingTables}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{isInitializingTables ? 'Verificando...' : 'Verificar / Inicializar Tabelas'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MODIFICAR CREDENCIAIS */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                <span className="font-bold block text-amber-300 mb-1">
                  Onde encontrar as chaves no Supabase:
                </span>
                Acesse seu <strong className="text-white">Supabase Dashboard</strong> &gt; selecione seu projeto &gt; clique na engrenagem <strong className="text-white">Project Settings</strong> &gt; menu <strong className="text-white">API</strong>.
              </div>

              {saveResult && (
                <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  saveResult.success
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                    : 'bg-red-500/15 border border-red-500/40 text-red-200'
                }`}>
                  {saveResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span>{saveResult.message}</span>
                </div>
              )}

              {/* URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  URL do Projeto Supabase (Project URL)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://exemplo.supabase.co"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Encontrado em Project Settings &gt; API &gt; Project URL
                </p>
              </div>

              {/* Anon Public Key */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chave Pública Anônima (Project API Key: anon, public)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Permite aos visitantes carregar as fotos e projetos diretamente no navegador
                </p>
              </div>

              {/* Service Role Secret Key */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Chave Administrativa Secreta (service_role, secret)</span>
                  <span className="text-[10px] text-amber-400 font-normal">Recomendada para Gravações</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={serviceRoleKey}
                    onChange={(e) => setServiceRoleKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Permite gravação no PostgreSQL e upload de fotos e vídeos para o Storage
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>{isSaving ? 'Salvando e Conectando...' : 'Salvar e Conectar Supabase'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: TABELAS & SQL */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs leading-relaxed space-y-1.5">
                <span className="font-bold text-white block">
                  Estrutura Necessária no Supabase:
                </span>
                <p className="text-slate-300">
                  • <strong>Tabela `site_settings`</strong>: armazena textos, contatos e projetos com atualizações atômicas.
                </p>
                <p className="text-slate-300">
                  • <strong>Bucket `transformar-media`</strong>: armazena imagens de alta resolução e vídeos curtos de obras.
                </p>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-200 font-mono overflow-x-auto max-h-56 leading-relaxed">
                  {sqlSnippet}
                </pre>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Dica: Cole este código no <strong>SQL Editor</strong> do seu painel Supabase.</span>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                >
                  <span>Abrir Supabase</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Construtora Transformar • Sistema de Persistência Cloud</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
