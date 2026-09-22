import React, { useState, useEffect } from 'react';
import { useMember } from '../context/MemberContext';
import { Project, ProjectAmenity, ProjectCategory, ProjectStatus } from '../types';
import { 
  X, 
  Upload, 
  Trash2, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  Building,
  Sparkles,
  Link as LinkIcon,
  Video,
  Film,
  Play,
  Waves,
  Flame,
  Car,
  SunMedium,
  Trees,
  Home,
  ShieldCheck
} from 'lucide-react';
import { 
  isVideoMedia, 
  validateVideoDuration, 
  ARCHITECTURAL_SAMPLE_VIDEOS,
  readFileAsDataURL,
  uploadMediaAssetToServer 
} from '../utils/mediaUtils';

const PRESET_AMENITIES: { icon: string; label: string }[] = [
  { icon: 'Waves', label: 'Piscina & Lazer' },
  { icon: 'Flame', label: 'Área Gourmet' },
  { icon: 'Car', label: 'Garagem' },
  { icon: 'SunMedium', label: 'Solário & Deck' },
  { icon: 'Sparkles', label: 'Alto Padrão' },
  { icon: 'Trees', label: 'Jardim & Quintal' },
  { icon: 'Home', label: 'Living Integrado' },
  { icon: 'ShieldCheck', label: 'Segurança / Condomínio' },
];

const renderAmenityPreviewIcon = (iconName: string) => {
  switch (iconName) {
    case 'Waves': return <Waves className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    case 'Flame': return <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    case 'Car': return <Car className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    case 'SunMedium': return <SunMedium className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    case 'Trees': return <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
    case 'Home': return <Home className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    case 'ShieldCheck': return <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    default: return <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
  }
};

const ARCHITECTURAL_SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
];

export const ProjectEditorModal: React.FC = () => {
  const { 
    isProjectModalOpen, 
    closeProjectModal, 
    editingProject, 
    saveProject,
    deleteProject 
  } = useMember();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Construção');
  const [status, setStatus] = useState<ProjectStatus>('Em Obras');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [suites, setSuites] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [amenities, setAmenities] = useState<ProjectAmenity[]>([]);
  const [newAmenityLabel, setNewAmenityLabel] = useState('');
  const [newAmenityIcon, setNewAmenityIcon] = useState('Waves');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [mediaStatusMessage, setMediaStatusMessage] = useState<{ text: string; type: 'error' | 'success' | 'info' } | null>(null);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    if (editingProject) {
      setTitle(editingProject.title);
      setLocation(editingProject.location);
      setCategory(editingProject.category);
      setStatus(editingProject.status);
      setArea(editingProject.area);
      setBedrooms(editingProject.bedrooms);
      setSuites(editingProject.suites);
      setTagline(editingProject.tagline);
      setDescription(editingProject.description);
      setMainImage(editingProject.mainImage);
      setGallery(editingProject.gallery || []);
      setFeatures(editingProject.features || []);
      setAmenities(
        editingProject.amenities && Array.isArray(editingProject.amenities)
          ? [...editingProject.amenities]
          : [
              { icon: 'Waves', label: 'Piscina & Lazer' },
              { icon: 'Flame', label: 'Área Gourmet' }
            ]
      );
    } else {
      // Default blank new project
      setTitle('');
      setLocation('Maricá – RJ');
      setCategory('Construção');
      setStatus('Em Obras');
      setArea('220 m²');
      setBedrooms('3 Quartos');
      setSuites('2 Suítes');
      setTagline('Arquitetura contemporânea de alto padrão com projeto personalizado.');
      setDescription('Projeto residencial concebido para proporcionar máximo conforto, luminosidade e integração com o lazer.');
      setMainImage(ARCHITECTURAL_SAMPLE_PHOTOS[0]);
      setGallery([ARCHITECTURAL_SAMPLE_PHOTOS[0], ARCHITECTURAL_SAMPLE_PHOTOS[1]]);
      setFeatures([
        'Estrutura com acompanhamento técnico integral',
        'Acabamentos de alto padrão',
        'Área gourmet com churrasqueira',
        'Tubulação preparada para água quente e solar'
      ]);
      setAmenities([
        { icon: 'Waves', label: 'Piscina & Lazer' },
        { icon: 'Flame', label: 'Área Gourmet' }
      ]);
    }
    setValidationError('');
    setNewFeatureText('');
    setNewAmenityLabel('');
    setNewAmenityIcon('Waves');
    setCustomImageUrl('');
  }, [editingProject, isProjectModalOpen]);

  if (!isProjectModalOpen) return null;

  // Handle local media file upload (images and short videos up to 30s)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setMediaStatusMessage(null);
    setIsProcessingMedia(true);

    try {
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);

        if (isVideo) {
          const validation = await validateVideoDuration(file, 30);
          if (!validation.valid) {
            setMediaStatusMessage({
              text: validation.error || `O vídeo "${file.name}" ultrapassa o limite de 30 segundos.`,
              type: 'error'
            });
            continue;
          }
        }

        const uploadResult = await uploadMediaAssetToServer(file);
        const result = uploadResult.url;
        if (isMain) {
          setMainImage(result);
          if (!gallery.includes(result)) {
            setGallery((prev) => [result, ...prev]);
          }
        } else {
          setGallery((prev) => [...prev, result]);
          if (!mainImage) {
            setMainImage(result);
          }
        }

        const sourceLabel = uploadResult.source === 'supabase_storage' ? ' (Supabase Storage)' : '';
        setMediaStatusMessage({
          text: isVideo 
            ? `Vídeo curto de ${file.name} salvo com sucesso!${sourceLabel}` 
            : `Foto salva com sucesso!${sourceLabel}`,
          type: 'success'
        });
      }
    } catch (err) {
      setMediaStatusMessage({
        text: 'Erro ao processar o arquivo de mídia. Tente novamente.',
        type: 'error'
      });
    } finally {
      setIsProcessingMedia(false);
      e.target.value = '';
    }
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures((prev) => [...prev, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePresetAmenity = (preset: { icon: string; label: string }) => {
    setAmenities((prev) => {
      const existsIndex = prev.findIndex(
        (a) => a.label.trim().toLowerCase() === preset.label.trim().toLowerCase() ||
               (a.icon === preset.icon && a.label.trim().toLowerCase().includes(preset.label.trim().toLowerCase()))
      );
      if (existsIndex >= 0) {
        return prev.filter((_, i) => i !== existsIndex);
      } else {
        return [...prev, { icon: preset.icon, label: preset.label }];
      }
    });
  };

  const handleAddCustomAmenity = () => {
    const text = newAmenityLabel.trim();
    if (!text) return;
    setAmenities((prev) => [...prev, { icon: newAmenityIcon, label: text }]);
    setNewAmenityLabel('');
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAmenity = (index: number, updated: Partial<ProjectAmenity>) => {
    setAmenities((prev) => {
      const list = [...prev];
      list[index] = { ...list[index], ...updated };
      return list;
    });
  };

  const handleAddCustomImageUrl = async () => {
    const url = customImageUrl.trim();
    if (!url) return;
    setMediaStatusMessage(null);
    setIsProcessingMedia(true);

    try {
      if (isVideoMedia(url)) {
        const validation = await validateVideoDuration(url, 30);
        if (!validation.valid) {
          setMediaStatusMessage({
            text: validation.error || 'O vídeo informado ultrapassa o limite máximo de 30 segundos.',
            type: 'error'
          });
          setIsProcessingMedia(false);
          return;
        }
      }

      if (!mainImage) {
        setMainImage(url);
      }
      setGallery((prev) => [...prev, url]);
      setCustomImageUrl('');
      setMediaStatusMessage({
        text: isVideoMedia(url) 
          ? 'Vídeo curto adicionado com sucesso à galeria!' 
          : 'Foto adicionada com sucesso à galeria!',
        type: 'success'
      });
    } finally {
      setIsProcessingMedia(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.includes(mainImage)) {
        setMainImage(updated[0]);
      }
      return updated;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Informe o título / nome da obra.');
      return;
    }
    if (!location.trim()) {
      setValidationError('Informe a localização da obra.');
      return;
    }
    if (!mainImage.trim()) {
      setValidationError('Defina pelo menos uma foto principal para a obra.');
      return;
    }

    const projectId = editingProject
      ? editingProject.id
      : `obra-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const projectData: Project = {
      id: projectId,
      title: title.trim(),
      location: location.trim(),
      category: category as Project['category'],
      status,
      area: area.trim() || 'Sob consulta',
      bedrooms: bedrooms.trim() || '3 Quartos',
      suites: suites.trim() || '1 Suíte',
      tagline: tagline.trim() || title.trim(),
      description: description.trim() || 'Obra executada pela equipe técnica da Construtora Transformar.',
      features: features.length > 0 ? features : ['Acabamento de alto padrão', 'Projeto integrado'],
      mainImage,
      gallery: gallery.length > 0 ? gallery : [mainImage],
      amenities: amenities
    };

    saveProject(projectData);
  };

  const handleDelete = () => {
    if (!editingProject) return;
    deleteProject(editingProject.id);
  };

  return (
    <div 
      id="project-editor-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={closeProjectModal}
    >
      <div 
        id="project-editor-container"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold">
                {editingProject ? 'Editar Obra / Projeto' : 'Cadastrar Nova Obra no Site'}
              </h3>
              <p className="text-xs text-slate-400">
                {editingProject 
                  ? 'As alterações serão refletidas em tempo real nos cards do site' 
                  : 'Preencha as informações e fotos para publicar no portfólio'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeProjectModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              1. Identificação da Obra
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título da Obra / Residência *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Residência Pedra de Inoã 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Localização / Bairro *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Itaipuaçu, Maricá – RJ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="Construção">Construção</option>
                  <option value="Arquitetura">Arquitetura</option>
                  <option value="Reformas">Reformas</option>
                  <option value="Interiores">Interiores</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="Em Obras">Em Obras</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Em Projeto">Em Projeto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Área Construída
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Ex: 240 m²"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quartos / Suítes
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="3 Qts"
                    className="w-1/2 px-2 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={suites}
                    onChange={(e) => setSuites(e.target.value)}
                    placeholder="2 Stes"
                    className="w-1/2 px-2 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Frase de Destaque (Tagline no Card)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Ex: Linhas retas modernas, pé-direito duplo e área gourmet integrada."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Descrição Completa do Projeto
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a concepção arquitetônica, materiais, soluções de engenharia..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Photos & Short Videos (up to 30s) */}
          <div className="space-y-4">
            <div className="pb-1 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-600" />
                <span>2. Fotos e Vídeos Curtos da Obra (Principal & Galeria)</span>
              </h4>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {gallery.length} mídia(s) • Vídeos de até 30 segundos
              </span>
            </div>

            {/* Media status notification */}
            {mediaStatusMessage && (
              <div 
                className={`p-3 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                  mediaStatusMessage.type === 'error'
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                }`}
              >
                {mediaStatusMessage.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                ) : (
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                )}
                <span>{mediaStatusMessage.text}</span>
              </div>
            )}

            {/* Photo & Video Upload & URL Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File upload button */}
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer text-center relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1 text-amber-600">
                  <Upload className="w-5 h-5" />
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Subir Foto ou Vídeo Curto (até 30s)
                </span>
                <span className="text-[11px] text-slate-500 max-w-[260px]">
                  Imagens (JPG, PNG, WEBP) ou Vídeos (MP4, WebM, MOV de até 30s)
                </span>
                {isProcessingMedia && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-amber-800">
                    Validando duração e processando...
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime,video/mov"
                  multiple
                  disabled={isProcessingMedia}
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
              </label>

              {/* URL input */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
                    Colar Link de Foto ou Vídeo MP4 Web
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://.../foto.jpg ou video.mp4"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      disabled={isProcessingMedia}
                      onClick={handleAddCustomImageUrl}
                      className="px-3 py-1.5 rounded-lg bg-[#0C243D] text-white text-xs font-bold hover:bg-[#153457] cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 mt-2 border-t border-slate-200/60 flex flex-col gap-1.5 text-[11px] text-slate-500">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-600">Modelos rápidos:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sample = ARCHITECTURAL_SAMPLE_PHOTOS[Math.floor(Math.random() * ARCHITECTURAL_SAMPLE_PHOTOS.length)];
                        setGallery((prev) => [...prev, sample]);
                        if (!mainImage) setMainImage(sample);
                      }}
                      className="text-amber-800 hover:underline font-semibold cursor-pointer"
                    >
                      + Foto Arquitetônica
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        const sampleVideo = ARCHITECTURAL_SAMPLE_VIDEOS[0];
                        setGallery((prev) => [...prev, sampleVideo.url]);
                        if (!mainImage) setMainImage(sampleVideo.url);
                        setMediaStatusMessage({
                          text: `Vídeo curto de demonstração (${sampleVideo.duration}s) adicionado à obra!`,
                          type: 'success'
                        });
                      }}
                      className="text-amber-800 hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      <Video className="w-3 h-3 text-amber-600" />
                      + Vídeo Tour Obra (20s)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails List */}
            {gallery.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 block">
                  Mídias da Obra (clique em qualquer foto ou vídeo para torná-la a Mídia Principal do Card):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {gallery.map((mediaUrl, idx) => {
                    const isVideo = isVideoMedia(mediaUrl);
                    const isMain = mainImage === mediaUrl;

                    return (
                      <div
                        key={idx}
                        className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          isMain ? 'border-amber-500 ring-2 ring-amber-400' : 'border-slate-200 hover:border-amber-300'
                        }`}
                        onClick={() => setMainImage(mediaUrl)}
                      >
                        {isVideo ? (
                          <div className="w-full h-full bg-slate-950 relative">
                            <video 
                              src={mediaUrl} 
                              muted 
                              playsInline 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-md">
                                <Play className="w-3 h-3 fill-slate-950 ml-0.5" />
                              </div>
                            </div>
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-amber-400/40 text-amber-300 font-bold text-[8px] flex items-center gap-1">
                              <Video className="w-2.5 h-2.5" />
                              <span>VÍDEO 30S</span>
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={mediaUrl} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        )}

                        {isMain && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[9px] shadow-sm z-10">
                            Principal
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveGalleryImage(idx);
                          }}
                          className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer z-10"
                          title="Remover esta mídia"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                Nenhuma foto ou vídeo cadastrado ainda. Adicione mídias através do botão acima ou selecione uma amostra.
              </div>
            )}
          </div>

          {/* Section 3: Differentials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              3. Diferenciais Construtivos
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Ex: Pé-direito duplo, Esquadrias linha premium, Piscina com cascata..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {features.map((feat, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <Check className="w-3 h-3 text-amber-600" />
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="ml-1 text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Destaques Inferiores do Card (Piscina, Gourmet, Lazer, etc.) */}
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>4. Destaques Inferiores do Card (Piscina, Lazer, Gourmet, etc.)</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full lowercase">
                    {amenities.length} {amenities.length === 1 ? 'destaque ativo' : 'destaques ativos'}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Decida exatamente o que deve ou não aparecer na barra inferior do card no portfólio.
                </p>
              </div>
            </div>

            {/* Quick Toggle Presets */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                Atalhos Rápidos (Clique para ativar ou desativar no card):
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_AMENITIES.map((preset) => {
                  const isSelected = amenities.some(
                    (a) => a.label.trim().toLowerCase() === preset.label.trim().toLowerCase() ||
                           (a.icon === preset.icon && a.label.trim().toLowerCase().includes(preset.label.trim().toLowerCase()))
                  );
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleTogglePresetAmenity(preset)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {renderAmenityPreviewIcon(preset.icon)}
                      <span>{preset.label}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Items with direct rename & icon selector */}
            {amenities.length > 0 ? (
              <div className="space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Destaques Ativos no Card (Personalize o texto, ícone ou remova):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition-colors shadow-2xs"
                    >
                      <select
                        value={item.icon}
                        onChange={(e) => handleUpdateAmenity(idx, { icon: e.target.value })}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-pointer"
                        title="Trocar ícone"
                      >
                        <option value="Waves">🌊 Piscina</option>
                        <option value="Flame">🔥 Gourmet</option>
                        <option value="Car">🚗 Garagem</option>
                        <option value="SunMedium">☀️ Solário</option>
                        <option value="Trees">🌿 Jardim</option>
                        <option value="Home">🏠 Casa</option>
                        <option value="Sparkles">✨ Padrão</option>
                        <option value="ShieldCheck">🛡️ Segurança</option>
                      </select>

                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleUpdateAmenity(idx, { label: e.target.value })}
                        placeholder="Nome do destaque"
                        className="flex-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-amber-400 font-medium text-slate-800"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remover do card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-center">
                <p className="text-xs text-amber-900 font-medium">
                  Nenhum destaque inferior ativo. O card exibirá uma barra limpa apenas com o link &ldquo;Ver detalhes&rdquo;.
                </p>
              </div>
            )}

            {/* Add Custom Highlight */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Adicionar Outro Destaque Personalizado:
              </span>
              <div className="flex gap-2">
                <select
                  value={newAmenityIcon}
                  onChange={(e) => setNewAmenityIcon(e.target.value)}
                  className="px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 cursor-pointer shrink-0"
                >
                  <option value="Waves">🌊 Piscina</option>
                  <option value="Flame">🔥 Gourmet</option>
                  <option value="Car">🚗 Garagem</option>
                  <option value="SunMedium">☀️ Solário</option>
                  <option value="Trees">🌿 Jardim</option>
                  <option value="Home">🏠 Casa</option>
                  <option value="Sparkles">✨ Padrão</option>
                  <option value="ShieldCheck">🛡️ Segurança</option>
                </select>
                <input
                  type="text"
                  value={newAmenityLabel}
                  onChange={(e) => setNewAmenityLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomAmenity();
                    }
                  }}
                  placeholder="Ex: Piscina Aquecida, Spa & Sauna, Placas Solares..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>

            {/* Live Preview of the Card Footer */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Prévia ao vivo no rodapé do card:
              </span>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
                <div className="flex flex-wrap items-center gap-3">
                  {amenities.length > 0 ? (
                    amenities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        {renderAmenityPreviewIcon(item.icon)}
                        <span className="font-medium text-slate-700">{item.label}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-xs">
                      (Nenhum destaque no rodapé — barra exibirá apenas &ldquo;Ver detalhes&rdquo;)
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-amber-700 underline shrink-0 ml-auto">
                  Ver detalhes
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {editingProject ? (
              confirmDelete ? (
                <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 bg-red-50 border border-red-200 p-2 rounded-xl animate-fadeIn">
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-red-700">Confirmar exclusão?</p>
                    <p className="text-[10px] text-red-600">Esta ação removerá a obra do site.</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow flex items-center gap-1.5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Sim, Excluir</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir esta Obra</span>
                </button>
              )
            ) : (
              <div />
            )}

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                type="button"
                onClick={closeProjectModal}
                className="w-1/2 sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-1/2 sm:w-auto px-7 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{editingProject ? 'Salvar Alterações' : 'Publicar Obra no Site'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
