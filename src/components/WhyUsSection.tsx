import React from 'react';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { 
  CalendarClock, 
  ShieldCheck, 
  Eye, 
  GitMerge, 
  Palette, 
  Smartphone,
  Check
} from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const { siteContent } = useMember();
  const differentialsContent = siteContent.differentials;
  const items = differentialsContent.items;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CalendarClock': return <CalendarClock className="w-6 h-6 text-amber-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-amber-500" />;
      case 'Eye': return <Eye className="w-6 h-6 text-amber-500" />;
      case 'GitMerge': return <GitMerge className="w-6 h-6 text-amber-500" />;
      case 'Palette': return <Palette className="w-6 h-6 text-amber-500" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-amber-500" />;
      default: return <Check className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section id="diferenciais" className="py-28 lg:py-36 bg-[#0B1528] text-white relative overflow-hidden">
      {/* Subtle lighting accents */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-sky-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <span>{differentialsContent.tagline}</span>
            </div>
            <SectionEditButton tab="diferenciais" label="Editar Diferenciais" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight mb-6">
            {differentialsContent.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {differentialsContent.subtitle}
          </p>
        </div>

        {/* 6 Differentials Grid: Modern Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((diff, index) => (
            <div
              key={diff.title || index}
              id={`diff-card-${index}`}
              className="bg-[#101E38]/90 hover:bg-[#132442] rounded-3xl p-8 sm:p-9 border border-amber-500/20 hover:border-amber-400/50 transition-all duration-500 hover:-translate-y-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between group"
            >
              <div>
                <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all duration-300">
                  {getIcon(diff.icon)}
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {diff.title}
                </h3>

                <p className="text-sm font-semibold text-amber-400 mb-3">
                  {diff.description}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {diff.detail}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Compromisso Contratual</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust summary strip */}
        <div className="mt-16 p-8 rounded-3xl bg-[#081220] border border-white/10 text-center max-w-4xl mx-auto shadow-xl">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-amber-400 font-semibold">Responsabilidade Técnica Registrada:</strong> Toda obra e projeto executado pela Construtora Transformar possui Anotação de Responsabilidade Técnica (ART/CREA) ou Registro de Responsabilidade Técnica (RRT/CAU), com cumprimento estrito das normas da ABNT e legislação urbana de Maricá.
          </p>
        </div>
      </div>
    </section>
  );
};
