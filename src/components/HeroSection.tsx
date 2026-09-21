import React from 'react';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { MediaView } from './MediaView';
import { 
  ArrowRight, 
  ChevronDown, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  onSelectSearchFilter?: (region: string, service: string, size: string) => void;
  onOpenBudgetModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onOpenBudgetModal 
}) => {
  const { siteContent } = useMember();
  const hero = siteContent.hero;

  return (
    <section 
      id="inicio" 
      className="relative min-h-[90vh] lg:min-h-[94vh] pt-36 pb-16 flex flex-col justify-between bg-[#070E1B] overflow-hidden"
    >
      {/* Background Coastal Landscape or Short Ambient Video with Transparent Oceanic Blue Overlay */}
      <div className="absolute inset-0 z-0">
        <MediaView
          src={hero.backgroundImage}
          alt="Vista panorâmica do litoral e montanhas de Maricá e região – Construtora Transformar"
          className="w-full h-full object-cover object-center scale-100"
          containerClassName="w-full h-full relative"
          autoPlay={true}
          loop={true}
          muted={true}
          showBadge={false}
        />
        {/* Transparent oceanic blue overlay to reveal background landscape */}
        <div className="absolute inset-0 bg-[#0C243D]/65 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C243D]/80 via-[#0C243D]/55 to-[#0C243D]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070E1B] via-transparent to-[#0C243D]/30" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full my-auto">
        <div className="max-w-3xl">
          {/* Subtle Pill Tag & Edit Section Button */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-amber-300 text-xs font-semibold tracking-wide uppercase backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{hero.tagline}</span>
            </div>
            <SectionEditButton tab="inicio" label="Editar Início (Hero)" />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.12] mb-6 drop-shadow-sm">
            {hero.title}{' '}
            <span className="block mt-1 text-gold-gradient font-black">
              {hero.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-100 font-normal leading-relaxed mb-8 max-w-2xl drop-shadow-sm">
            {hero.subtitle}
          </p>

          {/* Two Main Call-To-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <a
              id="hero-cta-quero-construir"
              href="#contato"
              onClick={(e) => {
                if (onOpenBudgetModal) {
                  e.preventDefault();
                  onOpenBudgetModal();
                }
              }}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm sm:text-base font-bold tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-950/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>{hero.ctaPrimaryText}</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </a>

            <a
              id="hero-cta-conhecer-projetos"
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm sm:text-base font-semibold text-white bg-slate-900/75 hover:bg-slate-800/90 border border-white/25 hover:border-amber-400/50 backdrop-blur-md transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>{hero.ctaSecondaryText}</span>
            </a>
          </div>

          {/* Value props micro-badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/15 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">{hero.badge1}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">{hero.badge2}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">{hero.badge3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8 text-slate-300">
        <a 
          href="#portfolio" 
          aria-label="Rolar para a seção de projetos e obras"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1.5 hover:text-amber-400 transition-colors group cursor-pointer"
        >
          <span className="text-[11px] tracking-widest uppercase font-medium text-slate-300 group-hover:text-amber-400">
            Conheça as Obras
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
        </a>
      </div>
    </section>
  );
};
