import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { ServiceItem } from '../types';
import { 
  Compass, 
  Layers, 
  Zap, 
  Droplets, 
  Home, 
  ClipboardCheck, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForBudget?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  onSelectServiceForBudget 
}) => {
  const { siteContent } = useMember();
  const servicesContent = siteContent.services;
  const servicesList: ServiceItem[] = servicesContent.services || [];

  const [activeFilter, setActiveFilter] = useState<'Todos' | 'Projetos' | 'Construção'>('Todos');

  const getServiceIcon = (icon: string) => {
    switch (icon) {
      case 'Compass': return <Compass className="w-7 h-7 text-amber-500" />;
      case 'Layers': return <Layers className="w-7 h-7 text-amber-500" />;
      case 'Zap': return <Zap className="w-7 h-7 text-amber-500" />;
      case 'Droplets': return <Droplets className="w-7 h-7 text-amber-500" />;
      case 'Home': return <Home className="w-7 h-7 text-amber-500" />;
      case 'ClipboardCheck': return <ClipboardCheck className="w-7 h-7 text-amber-500" />;
      default: return <Sparkles className="w-7 h-7 text-amber-500" />;
    }
  };

  const filteredServices = servicesList.filter((srv: ServiceItem) => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Projetos') return (srv.id || '').includes('projeto');
    if (activeFilter === 'Construção') return !(srv.id || '').includes('projeto');
    return true;
  });

  const handleHireService = (serviceTitle: string) => {
    if (onSelectServiceForBudget) {
      onSelectServiceForBudget(serviceTitle);
    }
    const contactEl = document.getElementById('contato');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="servicos" className="py-28 lg:py-36 bg-[#F8FAFC] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold tracking-wider uppercase">
              <span>{servicesContent.tagline}</span>
            </div>
            <SectionEditButton tab="servicos" label="Editar Serviços & Projetos" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight mb-6">
            {servicesContent.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {servicesContent.subtitle}
          </p>

          {/* Quick Filter tabs: Modern Floating Pill Bar */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm mt-8 gap-1">
            {(['Todos', 'Projetos', 'Construção'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#0C243D] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Large Sophisticated Cards: Modern Architectural Molds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service: ServiceItem) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-white rounded-3xl p-8 sm:p-9 border border-slate-200/70 hover:border-amber-400/60 transition-all duration-500 hover:-translate-y-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(12,36,61,0.09)] flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-500/20 transition-all duration-300">
                    {getServiceIcon(service.icon)}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100/80 text-slate-600 border border-slate-200/60 group-hover:bg-amber-50 group-hover:text-amber-900 group-hover:border-amber-300 transition-colors">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-amber-800 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs font-semibold text-amber-700 tracking-wider uppercase mb-3">
                  {service.subtitle}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-2.5 mb-8">
                  {service.benefits.map((benefit: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleHireService(service.title)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 bg-slate-100 hover:bg-[#0C243D] hover:text-white transition-all cursor-pointer shadow-sm group-hover:shadow"
                >
                  <span>Solicitar Proposta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Banner with Direct Contact reassurance */}
        <div className="mt-16 bg-gradient-to-r from-[#0C243D] to-[#142642] rounded-3xl p-8 sm:p-12 border border-slate-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-2">
              Atendimento Técnico Especializado
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-2">
              Possui um terreno e precisa de avaliação técnica prévia?
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Nossos engenheiros e arquitetos avaliam a topografia, insolação e restrições construtivas do seu lote em Maricá para orientar a melhor solução.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleHireService('Projeto + Construção Completa')}
            className="shrink-0 px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg hover:scale-105 cursor-pointer"
          >
            Falar com Engenheiro
          </button>
        </div>
      </div>
    </section>
  );
};
