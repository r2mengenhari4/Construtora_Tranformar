import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { 
  ShieldCheck, 
  PlusCircle, 
  SlidersHorizontal,
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  RefreshCw,
  Code2,
  Database
} from 'lucide-react';

export const MemberAdminToolbar: React.FC = () => {
  const { 
    isLoggedIn, 
    currentMember, 
    openNewProjectModal, 
    openCompanyModal, 
    openSiteEditor,
    openLoginModal, 
    logout,
    isSyncingSourceCode,
    sourceCodeSyncNotice,
    clearSyncNotice,
    supabaseStatus,
    openSupabaseConfigModal
  } = useMember();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isLoggedIn || !currentMember) return null;

  return (
    <aside 
      id="member-admin-toolbar"
      aria-label="Barra de Ferramentas de Membro"
      className="fixed bottom-4 left-4 z-40 max-w-lg transition-all duration-300 flex flex-col gap-2"
    >
      {/* Toast popup when sync completes */}
      {sourceCodeSyncNotice && (
        <div 
          onClick={clearSyncNotice}
          className="cursor-pointer bg-slate-900/95 border border-emerald-500/60 text-emerald-300 text-xs px-3.5 py-2 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fadeIn transition-all"
        >
          <Database className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-100">{sourceCodeSyncNotice.message}</span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80 shrink-0">
            Supabase + GitHub
          </span>
        </div>
      )}

      <div className="bg-[#0A1628]/95 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-2xl p-2.5 sm:p-3 text-white">
        <div className="flex items-center justify-between gap-3">
          {/* Status badge & greeting */}
          <div 
            onClick={openLoginModal}
            className="flex items-center gap-2 cursor-pointer group"
            title="Abrir painel de membro"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-300 capitalize group-hover:underline">
                  {currentMember.name}
                </span>
                {isSyncingSourceCode ? (
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 block truncate max-w-[130px] sm:max-w-[170px]">
                {isSyncingSourceCode 
                  ? 'Salvando no Supabase...' 
                  : supabaseStatus?.configured 
                    ? 'Supabase & Código Ativos' 
                    : 'Supabase pronto / Código Ativo'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {!isMinimized && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openSiteEditor('inicio')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all shadow cursor-pointer shrink-0"
                title="Editar textos, imagens e dados de todas as abas do site"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Editar Site</span>
              </button>

              <button
                type="button"
                onClick={openNewProjectModal}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow cursor-pointer shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ Nova Obra</span>
                <span className="sm:hidden">+ Obra</span>
              </button>

              <button
                type="button"
                onClick={openSupabaseConfigModal}
                className="p-2 rounded-xl text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                title="Conferir e Modificar Conexão Supabase"
                aria-label="Conferir e Modificar Conexão Supabase"
              >
                <Database className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={openCompanyModal}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Editar dados da empresa (WhatsApp, endereço, etc)"
                aria-label="Editar dados da empresa"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Sair da conta"
                aria-label="Encerrar sessão de membro"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Minimize / expand toggle */}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label={isMinimized ? "Expandir barra de ferramentas" : "Recolher barra de ferramentas"}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
