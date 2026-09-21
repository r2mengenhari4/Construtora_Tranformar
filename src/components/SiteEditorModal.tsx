import React, { useState, useEffect } from 'react';
import { useMember } from '../context/MemberContext';
import { Project } from '../types';
import { SectionTabKey, SiteContent } from '../types/siteContent';
import { 
  validateVideoDuration, 
  isVideoMedia, 
  readFileAsDataURL,
  uploadMediaAssetToServer, 
  ARCHITECTURAL_SAMPLE_VIDEOS 
} from '../utils/mediaUtils';
import { 
  X, 
  Save, 
  RotateCcw, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  Home, 
  Briefcase, 
  Layers, 
  CalendarClock, 
  Wrench, 
  Award, 
  Building2, 
  PhoneCall,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Edit3,
  Video,
  Play,
  Film,
  AlertCircle
} from 'lucide-react';

export const SiteEditorModal: React.FC = () => {
  const { 
    isSiteEditorOpen, 
    closeSiteEditor, 
    activeEditorTab, 
    setActiveEditorTab, 
    siteContent, 
    updateSiteSection, 
    resetSiteSection,
    openNewProjectModal,
    openEditProjectModal,
    deleteProject,
    projects
  } = useMember();

  // Local draft state for the current editing section so users can modify multiple fields cleanly
  const [draftContent, setDraftContent] = useState<SiteContent>(siteContent);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [mediaNotice, setMediaNotice] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Sync draft with siteContent whenever modal opens or tab changes
  useEffect(() => {
    if (isSiteEditorOpen) {
      setDraftContent(siteContent);
      setSavedSuccess(false);
      setResetConfirm(false);
      setMediaNotice(null);
      setProjectToDelete(null);
    }
  }, [isSiteEditorOpen, siteContent]);

  if (!isSiteEditorOpen) return null;

  const tabs: { key: SectionTabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { key: 'inicio', label: 'Início (Hero)', icon: <Home className="w-4 h-4" /> },
    { key: 'portfolio', label: 'Projetos', icon: <Briefcase className="w-4 h-4" />, badge: `${projects.length}` },
    { key: 'solucao-completa', label: 'Construa sem Complicação', icon: <Layers className="w-4 h-4" /> },
    { key: 'etapas-obra', label: 'Do Terreno à Entrega', icon: <CalendarClock className="w-4 h-4" /> },
    { key: 'servicos', label: 'Serviços', icon: <Wrench className="w-4 h-4" /> },
    { key: 'diferenciais', label: 'Diferenciais', icon: <Award className="w-4 h-4" /> },
    { key: 'sobre', label: 'A Transformar', icon: <Building2 className="w-4 h-4" /> },
    { key: 'contato', label: 'Contato & Mapa', icon: <PhoneCall className="w-4 h-4" /> }
  ];

  const tabToSectionKey = (tab: SectionTabKey): keyof SiteContent => {
    switch (tab) {
      case 'inicio': return 'hero';
      case 'portfolio': return 'portfolio';
      case 'solucao-completa': return 'allInOne';
      case 'etapas-obra': return 'timeline';
      case 'servicos': return 'services';
      case 'diferenciais': return 'differentials';
      case 'sobre': return 'about';
      case 'contato': return 'contact';
      default: return 'hero';
    }
  };

  const handleSaveCurrentTab = () => {
    const secKey = tabToSectionKey(activeEditorTab);
    updateSiteSection(secKey, draftContent[secKey]);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const handleResetCurrentTab = () => {
    const secKey = tabToSectionKey(activeEditorTab);
    resetSiteSection(secKey);
    setResetConfirm(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  // Helper for photo / short video upload (up to 30s) -> DataURL
  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>, 
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingMedia(true);
    setMediaNotice(null);

    try {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);

      if (isVideo) {
        // Enforce 30 second limit
        const validation = await validateVideoDuration(file, 30);
        if (!validation.isValid) {
          setMediaNotice({
            text: validation.error || 'O vídeo selecionado ultrapassa o limite máximo de 30 segundos.',
            type: 'error'
          });
          setIsProcessingMedia(false);
          e.target.value = '';
          return;
        }

        const uploadResult = await uploadMediaAssetToServer(file);
        onSuccess(uploadResult.url);
        const sourceLabel = uploadResult.source === 'supabase_storage' ? ' (Supabase Storage)' : '';
        setMediaNotice({
          text: `Vídeo curto (${validation.duration?.toFixed(1)}s) validado e salvo com sucesso!${sourceLabel}`,
          type: 'success'
        });
      } else {
        const uploadResult = await uploadMediaAssetToServer(file);
        onSuccess(uploadResult.url);
        const sourceLabel = uploadResult.source === 'supabase_storage' ? ' (Supabase Storage)' : '';
        setMediaNotice({
          text: `Imagem salva com sucesso!${sourceLabel}`,
          type: 'success'
        });
      }
    } catch (err: any) {
      setMediaNotice({
        text: err?.message || 'Erro ao processar mídia. Verifique o arquivo.',
        type: 'error'
      });
    } finally {
      setIsProcessingMedia(false);
      e.target.value = '';
    }
  };

  // Fallback for legacy calls
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    onSuccess: (dataUrl: string) => void
  ) => {
    handleMediaUpload(e, onSuccess);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#0C243D] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-white">
                  Editor de Conteúdo do Site
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                  Modo Membro
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Edite textos, dados, imagens e configurações de todas as abas do site
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrentTab}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Alterações Salvas!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Esta Aba</span>
                </>
              )}
            </button>

            <button
              onClick={closeSiteEditor}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar matching the top navbar */}
        <div className="px-4 bg-slate-100 border-b border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 py-2">
          {tabs.map((tab) => {
            const isActive = activeEditorTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveEditorTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-[#0C243D] shadow-sm border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/60">
          {/* =========================================================================
              TAB: INÍCIO (HERO)
             ========================================================================= */}
          {activeEditorTab === 'inicio' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-500" />
                  Textos Principais da Primeira Dobra (Hero)
                </h4>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Etiqueta Superior (Pill Tag)
                  </label>
                  <input
                    type="text"
                    value={draftContent.hero.tagline}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      hero: { ...draftContent.hero, tagline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título Principal (Linha 1)
                    </label>
                    <input
                      type="text"
                      value={draftContent.hero.title}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, title: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Destaque em Dourado (Linha 2)
                    </label>
                    <input
                      type="text"
                      value={draftContent.hero.titleHighlight}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, titleHighlight: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo / Descrição da Proposta de Valor
                  </label>
                  <textarea
                    rows={3}
                    value={draftContent.hero.subtitle}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      hero: { ...draftContent.hero, subtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Texto do Botão 1 (CTA Principal)
                    </label>
                    <input
                      type="text"
                      value={draftContent.hero.ctaPrimaryText}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, ctaPrimaryText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Texto do Botão 2 (CTA Secundário)
                    </label>
                    <input
                      type="text"
                      value={draftContent.hero.ctaSecondaryText}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, ctaSecondaryText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Background Image or Video (up to 30s) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                    <Film className="w-4 h-4 text-amber-500" />
                    Mídia de Fundo do Início (Foto ou Vídeo Curto até 30s)
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Suporta fotos e vídeos de até 30s
                  </span>
                </div>

                {mediaNotice && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    mediaNotice.type === 'error' 
                      ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}>
                    {mediaNotice.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                    <span>{mediaNotice.text}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-full sm:w-56 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 relative">
                    {isVideoMedia(draftContent.hero.backgroundImage) ? (
                      <div className="w-full h-full relative">
                        <video 
                          src={draftContent.hero.backgroundImage} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute bottom-1 right-2 text-[9px] bg-slate-950/80 border border-amber-400 text-amber-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Video className="w-2.5 h-2.5" />
                          VÍDEO 30S
                        </span>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={draftContent.hero.backgroundImage} 
                          alt="Preview Hero"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded">
                          Prévia
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        URL da Foto ou Vídeo Web
                      </label>
                      <input
                        type="text"
                        value={draftContent.hero.backgroundImage}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          hero: { ...draftContent.hero, backgroundImage: e.target.value }
                        })}
                        placeholder="https://.../foto.jpg ou video.mp4"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer border border-slate-300 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Carregar Foto ou Vídeo Curto (até 30s)</span>
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime,video/mov"
                          disabled={isProcessingMedia}
                          className="hidden"
                          onChange={(e) => handleMediaUpload(e, (dataUrl) => {
                            setDraftContent({
                              ...draftContent,
                              hero: { ...draftContent.hero, backgroundImage: dataUrl }
                            });
                          })}
                        />
                      </label>

                      {/* Video sample preset */}
                      <button
                        type="button"
                        onClick={() => {
                          const sampleVideo = ARCHITECTURAL_SAMPLE_VIDEOS[0];
                          setDraftContent({
                            ...draftContent,
                            hero: { ...draftContent.hero, backgroundImage: sampleVideo.url }
                          });
                          setMediaNotice({
                            text: `Vídeo cinematográfico (${sampleVideo.duration}s) aplicado ao fundo do Hero!`,
                            type: 'success'
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5 text-amber-600" />
                        <span>Usar Vídeo Modelo (20s)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Selos do Hero */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D]">
                  3 Selos de Credibilidade (Abaixo dos Botões)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Selo 1</label>
                    <input
                      type="text"
                      value={draftContent.hero.badge1}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, badge1: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Selo 2</label>
                    <input
                      type="text"
                      value={draftContent.hero.badge2}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, badge2: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Selo 3</label>
                    <input
                      type="text"
                      value={draftContent.hero.badge3}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        hero: { ...draftContent.hero, badge3: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: PROJETOS (PORTFÓLIO)
             ========================================================================= */}
          {activeEditorTab === 'portfolio' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center justify-between">
                  <span>Títulos e Cabeçalho da Seção Projetos</span>
                  <button
                    type="button"
                    onClick={() => {
                      closeSiteEditor();
                      openNewProjectModal();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Cadastrar Nova Obra</span>
                  </button>
                </h4>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={draftContent.portfolio.tagline}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      portfolio: { ...draftContent.portfolio, tagline: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={draftContent.portfolio.title}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      portfolio: { ...draftContent.portfolio, title: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo da Seção
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.portfolio.subtitle}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      portfolio: { ...draftContent.portfolio, subtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Quick Summary of Existing Projects */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-[#0C243D]">
                    Obras Cadastradas ({projects.length})
                  </h4>
                  <span className="text-xs text-slate-500">
                    Você também pode clicar no botão de editar em cada card da página
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((proj) => (
                    <div 
                      key={proj.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 group hover:border-amber-400/50 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={proj.mainImage} 
                          alt={proj.title}
                          className="w-14 h-14 rounded-lg object-cover bg-slate-200 shrink-0 border border-slate-200" 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-slate-900 truncate">{proj.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{proj.location}</p>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 mt-1">
                            {proj.category} • {proj.status}
                          </span>
                        </div>
                      </div>

                      {/* CRUD Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            closeSiteEditor();
                            openEditProjectModal(proj);
                          }}
                          className="p-2 rounded-lg bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer"
                          title="Editar dados e fotos desta obra"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(proj)}
                          className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
                          title="Excluir esta obra"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: CONSTRUA SEM COMPLICAÇÃO (SOLUÇÃO COMPLETA)
             ========================================================================= */}
          {activeEditorTab === 'solucao-completa' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  Cabeçalho da Seção "Construa sem Complicação"
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={draftContent.allInOne.tagline}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        allInOne: { ...draftContent.allInOne, tagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={draftContent.allInOne.title}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        allInOne: { ...draftContent.allInOne, title: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.allInOne.subtitle}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      allInOne: { ...draftContent.allInOne, subtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Comparativo: Mercado vs Método Transformar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D]">
                  Quadro Comparativo: Mercado Tradicional vs. Método Transformar
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Mercado Tradicional */}
                  <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-3">
                    <span className="text-xs font-bold uppercase text-rose-700">Mercado Tradicional</span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Título do Problema</label>
                      <input
                        type="text"
                        value={draftContent.allInOne.marketTitle}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          allInOne: { ...draftContent.allInOne, marketTitle: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Descrição</label>
                      <textarea
                        rows={3}
                        value={draftContent.allInOne.marketDescription}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          allInOne: { ...draftContent.allInOne, marketDescription: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Consequência</label>
                      <input
                        type="text"
                        value={draftContent.allInOne.marketConsequence}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          allInOne: { ...draftContent.allInOne, marketConsequence: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Método Transformar */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <span className="text-xs font-bold uppercase text-amber-800">Método Transformar</span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Título da Solução</label>
                      <input
                        type="text"
                        value={draftContent.allInOne.solutionTitle}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          allInOne: { ...draftContent.allInOne, solutionTitle: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Descrição</label>
                      <textarea
                        rows={3}
                        value={draftContent.allInOne.solutionDescription}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          allInOne: { ...draftContent.allInOne, solutionDescription: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Consequência</label>
                      <input
                        type="text"
                        value={draftContent.allInOne.solutionConsequence}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          allInOne: { ...draftContent.allInOne, solutionConsequence: e.target.value }
                        })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Os Pilares Integrados */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-[#0C243D]">
                    Pilares da Solução Completa ({draftContent.allInOne.pillars.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newPillar = {
                        id: `pilar-${Date.now()}`,
                        title: `Novo Pilar ${(draftContent.allInOne.pillars.length + 1)}`,
                        description: 'Descrição clara do que este pilar garante na obra.',
                        deliverable: 'Entregável contratual garantido para o cliente.',
                        iconName: 'Compass'
                      };
                      setDraftContent({
                        ...draftContent,
                        allInOne: {
                          ...draftContent.allInOne,
                          pillars: [...draftContent.allInOne.pillars, newPillar]
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Pilar</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {draftContent.allInOne.pillars.map((pillar, idx) => (
                    <div key={pillar.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const updatedPillars = [...draftContent.allInOne.pillars];
                            updatedPillars[idx] = { ...pillar, title: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              allInOne: { ...draftContent.allInOne, pillars: updatedPillars }
                            });
                          }}
                          className="font-bold text-xs text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded-lg flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = draftContent.allInOne.pillars.filter((_, pIdx) => pIdx !== idx);
                            setDraftContent({
                              ...draftContent,
                              allInOne: { ...draftContent.allInOne, pillars: filtered }
                            });
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                          title="Excluir este pilar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Descrição</label>
                          <textarea
                            rows={2}
                            value={pillar.description}
                            onChange={(e) => {
                              const updatedPillars = [...draftContent.allInOne.pillars];
                              updatedPillars[idx] = { ...pillar, description: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                allInOne: { ...draftContent.allInOne, pillars: updatedPillars }
                              });
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Entregável</label>
                          <textarea
                            rows={2}
                            value={pillar.deliverable}
                            onChange={(e) => {
                              const updatedPillars = [...draftContent.allInOne.pillars];
                              updatedPillars[idx] = { ...pillar, deliverable: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                allInOne: { ...draftContent.allInOne, pillars: updatedPillars }
                              });
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: DO TERRENO À ENTREGA (ETAPAS DA OBRA)
             ========================================================================= */}
          {activeEditorTab === 'etapas-obra' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-amber-500" />
                  Cabeçalho da Timeline: "Do Terreno à Entrega"
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={draftContent.timeline.tagline}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        timeline: { ...draftContent.timeline, tagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={draftContent.timeline.title}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        timeline: { ...draftContent.timeline, title: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.timeline.subtitle}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      timeline: { ...draftContent.timeline, subtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* As Etapas do Processo */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-[#0C243D]">
                    Etapas do Processo Construtivo ({draftContent.timeline.steps.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const nextNum = String(draftContent.timeline.steps.length + 1).padStart(2, '0');
                      const newStep = {
                        number: nextNum,
                        title: `Etapa ${nextNum} - Nova Fase`,
                        description: 'Descrição detalhada dos processos, fiscalização e acompanhamento técnico.',
                        deliverable: 'Entrega formal com aprovação do cliente.',
                        icon: 'CheckCircle',
                        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80'
                      };
                      setDraftContent({
                        ...draftContent,
                        timeline: {
                          ...draftContent.timeline,
                          steps: [...draftContent.timeline.steps, newStep]
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Etapa</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draftContent.timeline.steps.map((step, idx) => (
                    <div key={step.number || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={step.number}
                          onChange={(e) => {
                            const updatedSteps = [...draftContent.timeline.steps];
                            updatedSteps[idx] = { ...step, number: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              timeline: { ...draftContent.timeline, steps: updatedSteps }
                            });
                          }}
                          className="w-12 h-9 rounded-lg bg-[#0C243D] text-amber-400 font-mono font-bold text-xs text-center border border-slate-700 shrink-0"
                          title="Número da etapa"
                        />
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updatedSteps = [...draftContent.timeline.steps];
                            updatedSteps[idx] = { ...step, title: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              timeline: { ...draftContent.timeline, steps: updatedSteps }
                            });
                          }}
                          className="font-bold text-sm text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg flex-1"
                          placeholder="Título da etapa"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = draftContent.timeline.steps.filter((_, sIdx) => sIdx !== idx);
                            setDraftContent({
                              ...draftContent,
                              timeline: { ...draftContent.timeline, steps: filtered }
                            });
                          }}
                          className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                          title="Excluir esta etapa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Descrição da Etapa</label>
                          <textarea
                            rows={2}
                            value={step.description}
                            onChange={(e) => {
                              const updatedSteps = [...draftContent.timeline.steps];
                              updatedSteps[idx] = { ...step, description: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                timeline: { ...draftContent.timeline, steps: updatedSteps }
                              });
                            }}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Entregável ao Cliente</label>
                          <input
                            type="text"
                            value={step.deliverable}
                            onChange={(e) => {
                              const updatedSteps = [...draftContent.timeline.steps];
                              updatedSteps[idx] = { ...step, deliverable: e.target.value };
                              setDraftContent({
                                ...draftContent,
                                timeline: { ...draftContent.timeline, steps: updatedSteps }
                              });
                            }}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            URL ou Mídia da Etapa (Foto ou Vídeo Curto até 30s)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={step.image || ''}
                              placeholder="https://.../foto.jpg ou video.mp4"
                              onChange={(e) => {
                                const updatedSteps = [...draftContent.timeline.steps];
                                updatedSteps[idx] = { ...step, image: e.target.value };
                                setDraftContent({
                                  ...draftContent,
                                  timeline: { ...draftContent.timeline, steps: updatedSteps }
                                });
                              }}
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                            />
                            <label className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 cursor-pointer shrink-0" title="Upload de foto ou vídeo até 30s">
                              <Upload className="w-3.5 h-3.5" />
                              <input
                                type="file"
                                accept="image/*,video/mp4,video/webm,video/quicktime,video/mov"
                                disabled={isProcessingMedia}
                                className="hidden"
                                onChange={(e) => handleMediaUpload(e, (dataUrl) => {
                                  const updatedSteps = [...draftContent.timeline.steps];
                                  updatedSteps[idx] = { ...step, image: dataUrl };
                                  setDraftContent({
                                    ...draftContent,
                                    timeline: { ...draftContent.timeline, steps: updatedSteps }
                                  });
                                })}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: SERVIÇOS
             ========================================================================= */}
          {activeEditorTab === 'servicos' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  Cabeçalho da Seção de Serviços
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={draftContent.services.tagline}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        services: { ...draftContent.services, tagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={draftContent.services.title}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        services: { ...draftContent.services, title: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.services.subtitle}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      services: { ...draftContent.services, subtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Lista de Serviços Oferecidos */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-[#0C243D]">
                    Serviços Oferecidos ({draftContent.services.services.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newService = {
                        id: `servico-${Date.now()}`,
                        title: 'Novo Serviço de Construção',
                        subtitle: 'Especialidade Construtora Transformar',
                        tag: 'Engenharia',
                        icon: 'Compass',
                        description: 'Descrição detalhada com as metodologias e padrões de entrega deste serviço em Maricá.',
                        benefits: [
                          'Projetos 100% aprovados na Prefeitura de Maricá',
                          'Gestão orçamentária detalhada e sem custos ocultos',
                          'Supervisão técnica contínua com emissão de ART'
                        ]
                      };
                      setDraftContent({
                        ...draftContent,
                        services: {
                          ...draftContent.services,
                          services: [...draftContent.services.services, newService]
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Serviço</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draftContent.services.services.map((srv, idx) => (
                    <div key={srv.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const updated = [...draftContent.services.services];
                            updated[idx] = { ...srv, title: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              services: { ...draftContent.services, services: updated }
                            });
                          }}
                          className="font-bold text-sm text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg flex-1"
                          placeholder="Nome do Serviço"
                        />
                        <input
                          type="text"
                          value={srv.tag}
                          placeholder="Etiqueta (ex: Completa)"
                          onChange={(e) => {
                            const updated = [...draftContent.services.services];
                            updated[idx] = { ...srv, tag: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              services: { ...draftContent.services, services: updated }
                            });
                          }}
                          className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg font-semibold w-36"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = draftContent.services.services.filter((_, sIdx) => sIdx !== idx);
                            setDraftContent({
                              ...draftContent,
                              services: { ...draftContent.services, services: filtered }
                            });
                          }}
                          className="p-2 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                          title="Excluir este serviço"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Subtítulo do Serviço</label>
                        <input
                          type="text"
                          value={srv.subtitle}
                          onChange={(e) => {
                            const updated = [...draftContent.services.services];
                            updated[idx] = { ...srv, subtitle: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              services: { ...draftContent.services, services: updated }
                            });
                          }}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Descrição Completa</label>
                        <textarea
                          rows={2}
                          value={srv.description}
                          onChange={(e) => {
                            const updated = [...draftContent.services.services];
                            updated[idx] = { ...srv, description: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              services: { ...draftContent.services, services: updated }
                            });
                          }}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                      </div>

                      {/* Benefícios / Entregáveis do Serviço */}
                      <div className="pt-1 border-t border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-700">Destaques e Vantagens deste Serviço</label>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...draftContent.services.services];
                              const currentBenefits = srv.benefits || [];
                              updated[idx] = { ...srv, benefits: [...currentBenefits, 'Nova vantagem garantida'] };
                              setDraftContent({
                                ...draftContent,
                                services: { ...draftContent.services, services: updated }
                              });
                            }}
                            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Adicionar Vantagem</span>
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          {(srv.benefits || []).map((ben, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ben}
                                onChange={(e) => {
                                  const updated = [...draftContent.services.services];
                                  const updatedBenefits = [...(srv.benefits || [])];
                                  updatedBenefits[bIdx] = e.target.value;
                                  updated[idx] = { ...srv, benefits: updatedBenefits };
                                  setDraftContent({
                                    ...draftContent,
                                    services: { ...draftContent.services, services: updated }
                                  });
                                }}
                                className="w-full px-2.5 py-1 border border-slate-300 rounded-lg text-xs bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...draftContent.services.services];
                                  const updatedBenefits = (srv.benefits || []).filter((_, i) => i !== bIdx);
                                  updated[idx] = { ...srv, benefits: updatedBenefits };
                                  setDraftContent({
                                    ...draftContent,
                                    services: { ...draftContent.services, services: updated }
                                  });
                                }}
                                className="p-1 rounded bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 shrink-0"
                                title="Remover vantagem"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: DIFERENCIAIS
             ========================================================================= */}
          {activeEditorTab === 'diferenciais' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Cabeçalho da Seção de Diferenciais
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={draftContent.differentials.tagline}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        differentials: { ...draftContent.differentials, tagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={draftContent.differentials.title}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        differentials: { ...draftContent.differentials, title: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.differentials.subtitle}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      differentials: { ...draftContent.differentials, subtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Cards de Diferenciais */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-[#0C243D]">
                    Cards de Diferenciais Exclusivos ({draftContent.differentials.items.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const newDiff = {
                        title: 'Novo Diferencial Exclusivo',
                        description: 'Descrição sucinta deste diferencial técnico.',
                        detail: 'Garantia de conformidade, agilidade e excelência.',
                        icon: 'ShieldCheck'
                      };
                      setDraftContent({
                        ...draftContent,
                        differentials: {
                          ...draftContent.differentials,
                          items: [...draftContent.differentials.items, newDiff]
                        }
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Diferencial</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draftContent.differentials.items.map((diff, idx) => (
                    <div key={diff.title || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={diff.title}
                          onChange={(e) => {
                            const updated = [...draftContent.differentials.items];
                            updated[idx] = { ...diff, title: e.target.value };
                            setDraftContent({
                              ...draftContent,
                              differentials: { ...draftContent.differentials, items: updated }
                            });
                          }}
                          className="font-bold text-sm text-slate-900 bg-white border border-slate-300 px-2.5 py-1 rounded-lg flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = draftContent.differentials.items.filter((_, dIdx) => dIdx !== idx);
                            setDraftContent({
                              ...draftContent,
                              differentials: { ...draftContent.differentials, items: filtered }
                            });
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer shrink-0"
                          title="Excluir este diferencial"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={diff.description}
                        placeholder="Descrição curta"
                        onChange={(e) => {
                          const updated = [...draftContent.differentials.items];
                          updated[idx] = { ...diff, description: e.target.value };
                          setDraftContent({
                            ...draftContent,
                            differentials: { ...draftContent.differentials, items: updated }
                          });
                        }}
                        className="w-full px-2.5 py-1 border border-slate-300 rounded-lg text-xs bg-white"
                      />
                      <textarea
                        rows={2}
                        value={diff.detail}
                        placeholder="Detalhe do diferencial"
                        onChange={(e) => {
                          const updated = [...draftContent.differentials.items];
                          updated[idx] = { ...diff, detail: e.target.value };
                          setDraftContent({
                            ...draftContent,
                            differentials: { ...draftContent.differentials, items: updated }
                          });
                        }}
                        className="w-full px-2.5 py-1 border border-slate-300 rounded-lg text-xs bg-white text-slate-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: A TRANSFORMAR (SOBRE NÓS)
             ========================================================================= */}
          {activeEditorTab === 'sobre' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  Institucional da Construtora Transformar
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={draftContent.about.tagline}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, tagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={draftContent.about.title}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, title: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Parágrafo 1 da História
                    </label>
                    <textarea
                      rows={2}
                      value={draftContent.about.paragraph1}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, paragraph1: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Parágrafo 2 da História
                    </label>
                    <textarea
                      rows={2}
                      value={draftContent.about.paragraph2}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, paragraph2: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Parágrafo 3 da História (Atuação em Maricá)
                    </label>
                    <textarea
                      rows={2}
                      value={draftContent.about.paragraph3}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, paragraph3: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Imagem ou Vídeo Institucional (até 30s) & Selo */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                    <Film className="w-4 h-4 text-amber-500" />
                    Mídia Institucional da Construtora (Foto ou Vídeo Curto até 30s)
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Até 30 segundos
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-44 h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0 relative">
                    {isVideoMedia(draftContent.about.image) ? (
                      <div className="w-full h-full relative">
                        <video 
                          src={draftContent.about.image} 
                          autoPlay 
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute bottom-2 left-2 text-[9px] bg-slate-950/80 border border-amber-400 text-amber-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Video className="w-2.5 h-2.5" />
                          VÍDEO 30S
                        </span>
                      </div>
                    ) : (
                      <img 
                        src={draftContent.about.image} 
                        alt="Preview Sobre Nós"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        URL da Foto ou Vídeo Web
                      </label>
                      <input
                        type="text"
                        value={draftContent.about.image}
                        placeholder="https://.../foto.jpg ou video.mp4"
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          about: { ...draftContent.about, image: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer border border-slate-300 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Carregar Foto ou Vídeo Curto (até 30s)</span>
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime,video/mov"
                          disabled={isProcessingMedia}
                          className="hidden"
                          onChange={(e) => handleMediaUpload(e, (dataUrl) => {
                            setDraftContent({
                              ...draftContent,
                              about: { ...draftContent.about, image: dataUrl }
                            });
                          })}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          const sampleVideo = ARCHITECTURAL_SAMPLE_VIDEOS[2] || ARCHITECTURAL_SAMPLE_VIDEOS[0];
                          setDraftContent({
                            ...draftContent,
                            about: { ...draftContent.about, image: sampleVideo.url }
                          });
                          setMediaNotice({
                            text: `Vídeo do canteiro (${sampleVideo.duration}s) aplicado à seção Sobre a Construtora!`,
                            type: 'success'
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors cursor-pointer"
                      >
                        <Video className="w-3 h-3 text-amber-600" />
                        <span>Usar Vídeo Canteiro (16s)</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Legenda / Categoria</label>
                        <input
                          type="text"
                          value={draftContent.about.imageBadgeCategory}
                          onChange={(e) => setDraftContent({
                            ...draftContent,
                            about: { ...draftContent.about, imageBadgeCategory: e.target.value }
                          })}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Texto do Destaque da Imagem</label>
                        <input
                          type="text"
                          value={draftContent.about.imageBadgeText}
                          onChange={(e) => setDraftContent({
                            ...draftContent,
                            about: { ...draftContent.about, imageBadgeText: e.target.value }
                          })}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missão e Valores */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D]">
                  Missão, Valores & Equipe Técnica
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-700">Missão</label>
                    <textarea
                      rows={4}
                      value={draftContent.about.missionText}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, missionText: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-slate-700">Valores Institucionais</label>
                      <button
                        type="button"
                        onClick={() => {
                          setDraftContent({
                            ...draftContent,
                            about: {
                              ...draftContent.about,
                              valuesList: [...draftContent.about.valuesList, 'Novo valor e compromisso']
                            }
                          });
                        }}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar Valor</span>
                      </button>
                    </div>
                    {draftContent.about.valuesList.map((val, vIdx) => (
                      <div key={vIdx} className="flex items-center gap-2 mb-1.5">
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => {
                            const updatedList = [...draftContent.about.valuesList];
                            updatedList[vIdx] = e.target.value;
                            setDraftContent({
                              ...draftContent,
                              about: { ...draftContent.about, valuesList: updatedList }
                            });
                          }}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedList = draftContent.about.valuesList.filter((_, i) => i !== vIdx);
                            setDraftContent({
                              ...draftContent,
                              about: { ...draftContent.about, valuesList: updatedList }
                            });
                          }}
                          className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 shrink-0 cursor-pointer"
                          title="Excluir este valor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-700">Equipe & Localização</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={draftContent.about.teamTitle}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, teamTitle: e.target.value }
                      })}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={draftContent.about.teamLocation}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        about: { ...draftContent.about, teamLocation: e.target.value }
                      })}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <input
                    type="text"
                    value={draftContent.about.teamText}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      about: { ...draftContent.about, teamText: e.target.value }
                    })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: CONTATO & MAPA
             ========================================================================= */}
          {activeEditorTab === 'contato' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D] flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-500" />
                  Textos da Chamada de Contato & Orçamento
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Etiqueta Superior
                    </label>
                    <input
                      type="text"
                      value={draftContent.contact.tagline}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        contact: { ...draftContent.contact, tagline: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={draftContent.contact.title}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        contact: { ...draftContent.contact, title: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Subtítulo / Chamada
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.contact.subtitle}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      contact: { ...draftContent.contact, subtitle: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Endereço Exato & Link do Google Maps */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D]">
                  Endereço Físico do Escritório & Google Maps
                </h4>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Endereço Exato em Texto
                  </label>
                  <input
                    type="text"
                    value={draftContent.contact.officeAddress}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      contact: { ...draftContent.contact, officeAddress: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Link Direto do Google Maps (Aberto ao Clicar no Minimapa)
                    </label>
                    {draftContent.contact.officeMapsUrl && (
                      <a 
                        href={draftContent.contact.officeMapsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                      >
                        Testar Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={draftContent.contact.officeMapsUrl}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      contact: { ...draftContent.contact, officeMapsUrl: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    value={draftContent.contact.openingHours}
                    onChange={(e) => setDraftContent({
                      ...draftContent,
                      contact: { ...draftContent.contact, openingHours: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Contatos Digitais (WhatsApp, Email, Instagram) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-display font-bold text-base text-[#0C243D]">
                  Canais de Comunicação
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      WhatsApp (Apenas Dígitos com DDI e DDD)
                    </label>
                    <input
                      type="text"
                      value={draftContent.contact.whatsappNumber}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        contact: { ...draftContent.contact, whatsappNumber: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      WhatsApp (Formato de Exibição na Tela)
                    </label>
                    <input
                      type="text"
                      value={draftContent.contact.whatsappDisplay}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        contact: { ...draftContent.contact, whatsappDisplay: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      E-mail de Atendimento
                    </label>
                    <input
                      type="email"
                      value={draftContent.contact.emailContact}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        contact: { ...draftContent.contact, emailContact: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={draftContent.contact.instagramHandle}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        contact: { ...draftContent.contact, instagramHandle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar: Actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            {resetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-700 font-semibold">
                  Restaurar padrão desta aba?
                </span>
                <button
                  type="button"
                  onClick={handleResetCurrentTab}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                >
                  Confirmar Reset
                </button>
                <button
                  type="button"
                  onClick={() => setResetConfirm(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão Desta Aba</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={closeSiteEditor}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={handleSaveCurrentTab}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-slate-950 shadow-amber-500/25 hover:from-amber-300 hover:to-amber-400'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Project Confirmation Dialog inside SiteEditor */}
      {projectToDelete && (
        <div 
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setProjectToDelete(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Excluir Obra</h3>
                <p className="text-xs text-slate-500">Esta ação removerá a obra do portfólio.</p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p>Tem certeza que deseja excluir esta obra?</p>
              <p className="font-bold text-slate-900 text-sm mt-1">{projectToDelete.title}</p>
              <p className="text-xs text-slate-500">{projectToDelete.location} • {projectToDelete.category}</p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
