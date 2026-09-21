import React from 'react';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { Star, Quote, MapPin, Info } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { siteContent } = useMember();
  const testimonials = siteContent?.testimonials || {
    tagline: 'Experiência do Cliente',
    title: 'Quem constrói com a Transformar, recomenda.',
    subtitle: 'A satisfação de ver o sonho da casa própria realizado com segurança técnica, prazo e tranquilidade.',
    noticeText: 'Depoimentos e relatos de clientes de obras e projetos Construtora Transformar',
    items: []
  };

  return (
    <section id="depoimentos" className="py-28 lg:py-36 bg-[#FAFBFD] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold tracking-wider uppercase">
              <span>{testimonials.tagline || 'Experiência do Cliente'}</span>
            </div>
            <SectionEditButton tab="depoimentos" label="Editar Experiência do Cliente" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            {testimonials.title || 'Quem constrói com a Transformar, recomenda.'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {testimonials.subtitle || 'A satisfação de ver o sonho da casa própria realizado com segurança técnica, prazo e tranquilidade.'}
          </p>

          {/* Discreet Notice */}
          {testimonials.noticeText && (
            <div className="mt-5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-500 text-[11px]">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>{testimonials.noticeText}</span>
            </div>
          )}
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(testimonials.items || []).map((testimonial) => (
            <div
              key={testimonial.id}
              id={`testimonial-card-${testimonial.id}`}
              className="bg-white rounded-3xl p-8 sm:p-9 border border-slate-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(12,36,61,0.08)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between relative group"
            >
              <div>
                {/* Top: Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(Math.min(5, Math.max(1, testimonial.rating || 5)))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-slate-200 group-hover:text-amber-400/60 transition-colors" />
                </div>

                {/* Project Badge */}
                {testimonial.projectType && (
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      {testimonial.projectType}
                    </span>
                  </div>
                )}

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed mb-6 font-light">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Client Info Block */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {testimonial.clientName}
                  </h4>
                  {testimonial.neighborhood && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{testimonial.neighborhood}</span>
                    </p>
                  )}
                </div>
                {testimonial.date && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {testimonial.date}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
