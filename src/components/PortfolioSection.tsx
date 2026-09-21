import React, { useState } from 'react';
import { Project, ProjectCategory } from '../types';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { MediaView } from './MediaView';
import { isVideoMedia } from '../utils/mediaUtils';
import { 
  MapPin, 
  Maximize2, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Waves, 
  Flame, 
  Car, 
  SunMedium, 
  Sparkles,
  Home,
  MessageCircle,
  ArrowUpRight,
  Pencil,
  Trash2,
  PlusCircle,
  Play,
  Video as VideoIcon
} from 'lucide-react';

interface PortfolioSectionProps {
  externalFilter?: string;
  onOpenBudgetModal?: (projectName?: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ 
  externalFilter, 
  onOpenBudgetModal 
}) => {
  const { 
    projects, 
    isLoggedIn, 
    openNewProjectModal, 
    openEditProjectModal, 
    deleteProject, 
    companyConfig,
    siteContent
  } = useMember();

  const portfolio = siteContent.portfolio;

  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const categories: ProjectCategory[] = [
    'Todos', 
    'Arquitetura', 
    'Construção', 
    'Reformas', 
    'Interiores'
  ];

  const filteredProjects = projects.filter(project => {
    if (activeCategory === 'Todos') return true;
    return project.category === activeCategory;
  });

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Em Obras':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-white bg-slate-950/75 backdrop-blur-md border border-white/20 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Em Obras</span>
          </span>
        );
      case 'Em Projeto':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-white bg-slate-950/75 backdrop-blur-md border border-white/20 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Em Projeto</span>
          </span>
        );
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-white bg-slate-950/75 backdrop-blur-md border border-white/20 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Concluído</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getAmenityIcon = (icon: string) => {
    switch (icon) {
      case 'Waves': return <Waves className="w-3.5 h-3.5 text-amber-600" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-amber-600" />;
      case 'Car': return <Car className="w-3.5 h-3.5 text-slate-500" />;
      case 'SunMedium': return <SunMedium className="w-3.5 h-3.5 text-amber-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  const handleNextImage = () => {
    if (!selectedProject) return;
    setActiveImageIndex((prev) => 
      prev === selectedProject.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!selectedProject) return;
    setActiveImageIndex((prev) => 
      prev === 0 ? selectedProject.gallery.length - 1 : prev - 1
    );
  };

  return (
    <section id="portfolio" className="py-28 lg:py-36 bg-[#F8FAFC] relative overflow-hidden">
      {/* Subtle architectural ambient background glow */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold tracking-wider uppercase">
              <span>{portfolio.tagline}</span>
            </div>
            <SectionEditButton tab="portfolio" label="Editar Título dos Projetos" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight mb-5">
            {portfolio.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {portfolio.subtitle}
          </p>

          {/* Floating Category Filter Pills */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="inline-flex flex-wrap items-center justify-center p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-pill-${cat.toLowerCase()}`}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#0C243D] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Member Action Bar when logged in */}
            {isLoggedIn && (
              <div className="inline-flex items-center gap-2.5 p-2 px-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-slate-900 shadow-sm animate-fadeIn">
                <span className="text-xs font-semibold text-amber-900 hidden sm:inline">
                  Painel de Membro:
                </span>
                <button
                  id="btn-add-new-project"
                  type="button"
                  onClick={openNewProjectModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md cursor-pointer hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Cadastrar Nova Obra</span>
                </button>
                <span className="text-[11px] text-amber-800/80 hidden md:inline">
                  (Você também pode editar ou excluir diretamente em cada card abaixo)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Projects Grid: Modern Architectural Cards with generous spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => openModal(project)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 hover:border-amber-400/60 transition-all duration-500 hover:-translate-y-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_rgba(12,36,61,0.12)] group flex flex-col justify-between cursor-pointer relative"
            >
              {/* Media Container with Cinematic Ratio (Supports Photo or Short Video up to 30s) */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <MediaView
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  containerClassName="w-full h-full relative"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  showBadge={true}
                  badgePosition="top-right"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

                {/* Status Badge: Refined Frosted Glass */}
                <div className="absolute top-4 left-4 z-10">
                  {getStatusBadge(project.status)}
                </div>

                {/* Area Badge: Sleek Minimalist Glass */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 text-[11px] font-semibold text-white bg-slate-950/70 backdrop-blur-md border border-white/15 rounded-full">
                    {project.area}
                  </span>
                </div>

                {/* Member Direct Card Actions (Pencil & Trash) */}
                {isLoggedIn && (
                  <div 
                    className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 px-1.5 rounded-full border border-amber-400/40 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditProjectModal(project);
                      }}
                      className="p-1.5 rounded-full bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 transition-colors cursor-pointer"
                      title="Editar esta obra"
                      aria-label="Editar esta obra"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectToDelete(project);
                      }}
                      className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-colors cursor-pointer"
                      title="Excluir esta obra"
                      aria-label="Excluir esta obra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Hover Expand Icon */}
                <div className="absolute bottom-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body: Generous Padding & Clean Typography */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {project.title}
                    </h3>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-700 flex items-center justify-center shrink-0 transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{project.location}</span>
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6">
                    {project.tagline}
                  </p>
                </div>

                {/* Amenities Strip: Refined minimalist line */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-3">
                    {project.amenities.slice(0, 2).map((amenity, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        {getAmenityIcon(amenity.icon)}
                        <span className="truncate">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 group-hover:underline">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Footer Action */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500 mb-4">
            Possui um terreno em condomínio ou bairro de Maricá e quer um projeto autoral?
          </p>
          <a
            href="#contato"
            onClick={(e) => {
              if (onOpenBudgetModal) {
                e.preventDefault();
                onOpenBudgetModal('Novo Projeto Sob Medida');
              }
            }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white bg-[#0C243D] hover:bg-[#142d4a] border border-amber-500/30 transition-all hover:scale-105 shadow-md"
          >
            <span>Conversar sobre meu terreno</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          id="project-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedProject.status)}
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const projToEdit = selectedProject;
                        closeModal();
                        openEditProjectModal(projToEdit);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 text-xs font-bold border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Editar esta Obra</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(selectedProject)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-700 text-xs font-bold border border-red-500/30 transition-colors cursor-pointer"
                      title="Excluir esta obra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Media Gallery Viewer (Photo or Short Video up to 30s) */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 mb-4 group">
                <MediaView
                  src={selectedProject.gallery[activeImageIndex] || selectedProject.mainImage}
                  alt={`${selectedProject.title} mídia ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full relative"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  showBadge={true}
                  badgePosition="top-left"
                  interactiveControls={true}
                />

                {/* Arrows if multiple items */}
                {selectedProject.gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-30"
                      aria-label="Mídia anterior"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-30"
                      aria-label="Próxima mídia"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-medium z-30">
                  {activeImageIndex + 1} de {selectedProject.gallery.length}
                </div>
              </div>

              {/* Thumbnail strip */}
              {selectedProject.gallery.length > 1 && (
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                  {selectedProject.gallery.map((mediaUrl, idx) => {
                    const isVid = isVideoMedia(mediaUrl);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeImageIndex === idx 
                            ? 'border-amber-500 scale-95 shadow-md ring-2 ring-amber-400' 
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        {isVid ? (
                          <div className="w-full h-full bg-slate-950 relative">
                            <video src={mediaUrl} muted className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400 ml-0.5" />
                            </div>
                            <div className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/80 text-[8px] font-bold text-amber-300">
                              30s
                            </div>
                          </div>
                        ) : (
                          <img src={mediaUrl} alt="" className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Title & Key Specs */}
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
                  {selectedProject.title}
                </h3>
                <p className="text-sm font-semibold text-amber-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>{selectedProject.location}</span>
                </p>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Área Construída</span>
                  <span className="text-sm sm:text-base font-bold text-slate-800">{selectedProject.area}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Quartos</span>
                  <span className="text-sm sm:text-base font-bold text-slate-800">{selectedProject.bedrooms}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Suítes</span>
                  <span className="text-sm sm:text-base font-bold text-slate-800">{selectedProject.suites}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Status da Obra</span>
                  <span className="text-sm sm:text-base font-bold text-amber-600">{selectedProject.status}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Sobre o Projeto
                </h4>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Differentials & Highlights of Project */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Diferenciais Construtivos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal CTAs */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <a
                  href={`https://wa.me/${companyConfig.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Olá! Vi o projeto "${selectedProject.title}" no site da Construtora Transformar e gostaria de saber mais detalhes e valores para meu terreno.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tirar dúvidas pelo WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    if (onOpenBudgetModal) {
                      onOpenBudgetModal(selectedProject.title);
                    }
                    const contactEl = document.getElementById('contato');
                    if (contactEl) {
                      contactEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md cursor-pointer"
                >
                  <span>Quero um projeto semelhante</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal (Replaces blocked window.confirm) */}
      {projectToDelete && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setProjectToDelete(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Excluir Obra do Portfólio</h3>
                <p className="text-xs text-slate-500">Esta ação é definitiva e removerá a obra do site.</p>
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
                  if (selectedProject?.id === projectToDelete.id) {
                    setSelectedProject(null);
                  }
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
    </section>
  );
};
