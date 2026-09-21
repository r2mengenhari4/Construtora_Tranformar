import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { 
  X, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogOut, 
  PlusCircle, 
  Settings, 
  SlidersHorizontal,
  CheckCircle2, 
  AlertCircle,
  RotateCcw,
  Database,
  Check
} from 'lucide-react';

export const MemberLoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    isLoggedIn, 
    currentMember, 
    login, 
    logout,
    openNewProjectModal,
    openCompanyModal,
    openSiteEditor,
    resetProjectsToDefault,
    supabaseStatus,
    refreshSupabaseStatus,
    openSupabaseConfigModal
  } = useMember();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmResetProjects, setConfirmResetProjects] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Por favor, informe seu nome de usuário ou e-mail cadastrado.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Por favor, informe sua senha.');
      return;
    }

    const res = login(identifier, password);
    if (res.success) {
      setSuccessMessage('Acesso autorizado com sucesso!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 1500);
    } else {
      setErrorMessage(res.message || 'Credenciais inválidas. Verifique seu usuário/e-mail e senha.');
    }
  };

  return (
    <div 
      id="member-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={closeLoginModal}
    >
      <div 
        id="member-modal-container"
        className="bg-[#0A1628] border border-amber-500/30 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
        
        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide">
                {isLoggedIn ? 'Painel de Membros' : 'Acesso de Membros'}
              </h3>
              <p className="text-xs text-slate-400">
                {isLoggedIn ? 'Gerenciamento interativo do site' : 'Área restrita à equipe técnica e engenharia'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLoginModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {isLoggedIn && currentMember ? (
            /* Logged in state */
            <div className="space-y-6">
              {/* Member Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F223D] to-[#0A182B] border border-amber-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center text-base">
                    {currentMember.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white capitalize">
                        {currentMember.name}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{currentMember.email}</p>
                  </div>
                </div>
                <div className="text-[11px] font-medium text-amber-300/90 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span>Cargo / Função:</span>
                  <span className="font-semibold text-slate-200">{currentMember.role}</span>
                </div>
              </div>

              {/* Supabase Cloud Sync Card */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Database className="w-4 h-4" />
                    <span>Supabase Cloud Sync</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    supabaseStatus?.configured 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {supabaseStatus?.configured ? 'Ativo & Conectado' : 'Pronto para Conectar'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 leading-snug space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Banco PostgreSQL:</span>
                    <span className="font-semibold text-slate-200">
                      {supabaseStatus?.database ? 'Conectado (site_settings)' : supabaseStatus?.configured ? 'Pronto (site_settings)' : 'Sincronizado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Armazenamento Mídia:</span>
                    <span className="font-semibold text-slate-200">
                      {supabaseStatus?.storage ? 'Bucket transformar-media (CDN)' : 'Supabase Storage pronto'}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">Sincronização persistente cross-browser</span>
                  <button
                    type="button"
                    onClick={() => {
                      closeLoginModal();
                      openSupabaseConfigModal();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Conferir / Modificar Conexão</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                <span className="font-bold block text-amber-300 mb-1">
                  Você está no Modo Editor Interativo:
                </span>
                Você pode editar textos, imagens e dados de todas as abas do site diretamente nos botões dourados "Editar" de cada seção ou pelo painel geral abaixo.
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    closeLoginModal();
                    openSiteEditor('inicio');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-[#0C243D] hover:from-blue-500 hover:to-slate-800 border border-amber-400/40 transition-all shadow-lg cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>Editar Todas as Abas do Site</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeLoginModal();
                    openNewProjectModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Cadastrar Nova Obra no Site</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeLoginModal();
                    openCompanyModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>Editar Telefones e Dados da Empresa</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeLoginModal();
                    openSupabaseConfigModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 transition-colors cursor-pointer"
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Conferir e Modificar Conexão Supabase</span>
                </button>

                {confirmResetProjects ? (
                  <div className="w-full p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
                    <span className="text-amber-200">Restaurar lista original de obras?</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          resetProjectsToDefault();
                          setConfirmResetProjects(false);
                        }}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg cursor-pointer"
                      >
                        Sim, restaurar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmResetProjects(false)}
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg cursor-pointer"
                      >
                        Não
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmResetProjects(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Projetos Padrão</span>
                  </button>
                )}
              </div>

              {/* Logout */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeLoginModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Encerrar Sessão (Sair)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome de Usuário ou E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="member-login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Digite seu nome ou e-mail"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F223D]/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="member-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha cadastrada"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#0F223D]/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="member-login-submit-btn"
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Entrar na Área de Membros</span>
                </button>
              </div>

              {/* Informative notice: only registered in code */}
              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Apenas pessoas autorizadas pela Construtora Transformar podem acessar.
                  Novos cadastros são efetuados diretamente na base de código do sistema.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
