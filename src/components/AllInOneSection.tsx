import React from 'react';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { 
  Compass, 
  Layers, 
  Zap, 
  Droplets, 
  Hammer, 
  Check, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface AllInOneSectionProps {
  onOpenBudgetModal?: () => void;
}

export const AllInOneSection: React.FC<AllInOneSectionProps> = ({ onOpenBudgetModal }) => {
  const { siteContent } = useMember();
  const allInOne = siteContent.allInOne;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-6 h-6 text-amber-500" />;
      case 'Layers': return <Layers className="w-6 h-6 text-amber-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-amber-500" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-amber-500" />;
      default: return <Compass className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <section id="solucao-completa" className="py-28 lg:py-36 bg-white relative overflow-hidden">
      {/* Subtle background ambient blur */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold tracking-wider uppercase">
              <span>{allInOne.tagline}</span>
            </div>
            <SectionEditButton tab="solucao-completa" label="Editar Construa sem Complicação" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight mb-6">
            {allInOne.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {allInOne.subtitle}
          </p>
        </div>

        {/* Architectural Comparison Showcase (Sleek Split Panel, No CRM Boxes) */}
        <div className="mb-20 rounded-3xl bg-gradient-to-br from-[#0C243D] via-[#0D1C2E] to-[#071320] text-white p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center relative z-10">
            {/* The Fragmented Reality */}
            <div className="space-y-4 pr-0 lg:pr-6 lg:border-r lg:border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>O Mercado Tradicional Fragmentado</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white tracking-tight">
                {allInOne.marketTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {allInOne.marketDescription}
              </p>
              <div className="pt-2 text-xs font-medium text-rose-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Consequência: {allInOne.marketConsequence}</span>
              </div>
            </div>

            {/* The Transformar Solution */}
            <div className="space-y-4 pl-0 lg:pl-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>O Método Construtora Transformar</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-white tracking-tight">
                {allInOne.solutionTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {allInOne.solutionDescription}
              </p>
              <div className="pt-2 text-xs font-medium text-amber-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Consequência: {allInOne.solutionConsequence}</span>
              </div>
            </div>
          </div>
        </div>

        {/* The 5 Key Pillars: Spacious Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allInOne.pillars.map((card, index) => (
            <div
              key={card.id || index}
              id={`pillar-card-${card.id || index}`}
              className="bg-[#FAFBFD] hover:bg-white rounded-3xl p-8 sm:p-9 border border-slate-200/60 hover:border-amber-400/50 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(12,36,61,0.08)] hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-500/20 transition-all duration-300">
                    {getIcon(card.iconName)}
                  </div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 mb-3 group-hover:text-amber-800 transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-5 border-t border-slate-200/70">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Entrega Técnica:
                </span>
                <span className="text-xs text-slate-700 font-medium leading-relaxed block">
                  {card.deliverable}
                </span>
              </div>
            </div>
          ))}

          {/* 6th Complementary Pillar Card for Architectural Balance */}
          <div className="bg-gradient-to-br from-[#0C243D] to-[#142642] text-white rounded-3xl p-8 sm:p-9 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase block mb-2">
                Garantia & Engenharia
              </span>
              <h3 className="text-xl font-display font-bold text-white mb-3">
                Gestão Completa e Integrada
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Acompanhamento contínuo por engenheiro residente, relatórios quinzenais com fotos de evolução e garantia legal pós-entrega.
              </p>
            </div>

            <div className="pt-5 border-t border-white/15">
              <button
                type="button"
                onClick={() => {
                  if (onOpenBudgetModal) {
                    onOpenBudgetModal();
                  }
                }}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group"
              >
                <span>Solicitar diagnóstico do terreno</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 text-center">
          <a
            href="#contato"
            onClick={(e) => {
              if (onOpenBudgetModal) {
                e.preventDefault();
                onOpenBudgetModal();
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all hover:scale-105 shadow-md cursor-pointer"
          >
            <span>Centralize sua obra com a Transformar</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
