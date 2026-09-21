import React from 'react';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { Logo } from './Logo';
import { MediaView } from './MediaView';
import { 
  Target, 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  Building, 
  Award,
  CheckCircle2,
  Users
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { siteContent } = useMember();
  const about = siteContent.about;

  return (
    <section id="sobre" className="py-28 lg:py-36 bg-white relative overflow-hidden">
      {/* Subtle decorative background blur */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Presentation with Team / Office / Site placeholders */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Main Media (Photo or Short Video up to 30s) */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 aspect-[4/5] bg-slate-900">
                <MediaView
                  src={about.image}
                  alt="Acompanhamento técnico de engenharia e obras da Construtora Transformar"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full relative"
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  showBadge={true}
                  badgePosition="top-left"
                  interactiveControls={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C243D] via-transparent to-transparent opacity-80 pointer-events-none" />

                <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none z-10">
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 block mb-1">
                    {about.imageBadgeCategory || 'Canteiro & Engenharia'}
                  </span>
                  <p className="text-base font-bold leading-snug">
                    {about.imageBadgeText || 'Rigor técnico nos projetos e presença constante no canteiro de obras.'}
                  </p>
                </div>
              </div>

              {/* Floating Badge with the official Circular Brand Seal */}
              <div className="absolute -bottom-6 -right-6 sm:-right-8 bg-[#0C243D] p-3 rounded-full shadow-2xl border-2 border-amber-500/40">
                <Logo variant="badge" size="lg" theme="dark" />
              </div>

              {/* Floating Responsável Técnico info card */}
              <div className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/80 max-w-[220px]">
                <div className="flex items-center gap-2 mb-1 text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Responsabilidade</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Projetos e execuções com engenheiro técnico devidamente habilitado (CREA/CAU).
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative and Brand Pillars */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold tracking-wider uppercase">
                <span>{about.tagline}</span>
              </div>
              <SectionEditButton tab="sobre" label="Editar Sobre a Construtora" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight mb-6">
              {about.title}
            </h2>

            {/* Base Text from User Briefing */}
            <div className="space-y-4 text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              <p>{about.paragraph1}</p>
              <p>{about.paragraph2}</p>
              <p>{about.paragraph3}</p>
            </div>

            {/* Mission, Values blocks: Modern Crisp Architectural Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-200/70">
              {/* Missão */}
              <div className="p-6 rounded-3xl bg-[#FAFBFD] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 text-slate-900 font-bold text-sm mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <span>Nossa Missão</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {about.missionText}
                </p>
              </div>

              {/* Valores */}
              <div className="p-6 rounded-3xl bg-[#FAFBFD] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 text-slate-900 font-bold text-sm mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span>{about.valuesTitle || 'Nossos Valores'}</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                  {(about.valuesList || []).map((val: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{val}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Equipe & Responsável Técnico Section */}
            <div className="mt-8 p-6 rounded-3xl bg-[#0C243D] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Equipe & Responsável Técnico</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Engenheiros e arquitetos dedicados a cada detalhe da sua obra em Maricá.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
                <span>Atendimento local em Maricá</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
