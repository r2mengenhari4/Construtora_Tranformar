import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { MediaView } from './MediaView';
import { 
  MapPin, 
  MessageSquareText, 
  PenTool, 
  CalendarCheck, 
  HardHat, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

interface TimelineSectionProps {
  onOpenBudgetModal?: () => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ onOpenBudgetModal }) => {
  const { siteContent } = useMember();
  const timeline = siteContent.timeline;
  const steps = timeline.steps;

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const getStepIcon = (icon: string, isActive: boolean) => {
    const className = `w-6 h-6 ${isActive ? 'text-slate-950' : 'text-amber-400'}`;
    switch (icon) {
      case 'MapPin': return <MapPin className={className} />;
      case 'MessageSquareText': return <MessageSquareText className={className} />;
      case 'PenTool': return <PenTool className={className} />;
      case 'CalendarCheck': return <CalendarCheck className={className} />;
      case 'HardHat': return <HardHat className={className} />;
      case 'KeyRound': return <KeyRound className={className} />;
      default: return <CheckCircle2 className={className} />;
    }
  };

  const safeIndex = Math.min(activeStepIndex, steps.length - 1);
  const activeStep = steps[safeIndex] || steps[0];

  return (
    <section id="etapas-obra" className="py-28 lg:py-36 bg-[#0B1528] text-white relative overflow-hidden">
      {/* Subtle gold accent lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <span>{timeline.tagline}</span>
            </div>
            <SectionEditButton tab="etapas-obra" label="Editar Etapas da Obra" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mb-6">
            {timeline.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {timeline.subtitle}
          </p>
        </div>

        {/* Milestone Navigation Bar: Sleek architectural timeline */}
        <div className="mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
            {steps.map((step, idx) => {
              const isActive = idx === safeIndex;
              const isPast = idx < safeIndex;

              return (
                <button
                  key={step.number || idx}
                  id={`step-nav-btn-${step.number || idx}`}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex flex-col items-center text-center p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-amber-400 text-slate-950 shadow-xl shadow-amber-900/30 scale-105 ring-2 ring-amber-300' 
                      : isPast
                        ? 'bg-slate-900/90 text-white border border-amber-500/30 hover:bg-slate-800'
                        : 'bg-slate-900/40 text-slate-400 border border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div 
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isActive 
                        ? 'bg-white shadow-sm' 
                        : isPast 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    {getStepIcon(step.icon, isActive)}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                    isActive ? 'text-slate-800 font-bold' : 'text-amber-400/90'
                  }`}>
                    Etapa 0{step.number}
                  </span>
                  <span className={`text-xs sm:text-sm font-semibold line-clamp-2 ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-200'
                  }`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Detailed Focus Panel */}
        <div className="bg-[#101E38] border border-amber-500/25 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                  ETAPA 0{activeStep.number} DE 0{steps.length}
                </span>
                <span className="text-slate-400 text-xs font-medium">Metodologia Construtora Transformar</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4">
                {activeStep.title}
              </h3>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8">
                {activeStep.description}
              </p>

              <div className="border-l-2 border-amber-400 pl-4 py-1 mb-8">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Entrega Técnica desta etapa:
                </span>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {activeStep.deliverable}
                </p>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-4 pt-2">
                {safeIndex > 0 && (
                  <button
                    onClick={() => setActiveStepIndex(safeIndex - 1)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
                  >
                    ← Etapa Anterior
                  </button>
                )}

                {safeIndex < steps.length - 1 ? (
                  <button
                    onClick={() => setActiveStepIndex(safeIndex + 1)}
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Próxima Etapa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href="#contato"
                    onClick={(e) => {
                      if (onOpenBudgetModal) {
                        e.preventDefault();
                        onOpenBudgetModal();
                      }
                    }}
                    className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
                  >
                    <span>Quero iniciar meu projeto</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Visual preview card for step (Photo or Short Video up to 30s) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group aspect-[4/3] bg-slate-950">
                <MediaView
                  src={activeStep.image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80'}
                  alt={activeStep.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  containerClassName="w-full h-full relative"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  showBadge={true}
                  badgePosition="top-left"
                  interactiveControls={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent opacity-80 pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 pointer-events-none z-10">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest block mb-1">
                    Maricá & Região Oceânica
                  </span>
                  <span className="text-sm font-bold text-white">
                    Padrão Técnico Construtora Transformar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
