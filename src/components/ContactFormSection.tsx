import React, { useState, useEffect } from 'react';
import { ContactFormData } from '../types';
import { COMPANY_CONFIG } from '../data/companyData';
import { useMember } from '../context/MemberContext';
import { SectionEditButton } from './SectionEditButton';
import { 
  Send, 
  CheckCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ContactFormSectionProps {
  prefilledService?: string;
  prefilledProjectName?: string;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({ 
  prefilledService,
  prefilledProjectName 
}) => {
  const { siteContent } = useMember();
  const contact = siteContent.contact;

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    neighborhood: '',
    hasLand: 'Sim, já possuo terreno',
    serviceNeeded: 'Projeto + construção',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({
        ...prev,
        serviceNeeded: prefilledService,
        message: prev.message || `Gostaria de uma proposta para o serviço de ${prefilledService}.`
      }));
    }
  }, [prefilledService]);

  useEffect(() => {
    if (prefilledProjectName) {
      setFormData(prev => ({
        ...prev,
        serviceNeeded: 'Projeto + construção',
        message: `Gostaria de informações para construir um projeto no padrão de "${prefilledProjectName}".`
      }));
    }
  }, [prefilledProjectName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate reliable submission feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const whatsappDirectMessage = `Olá, meu nome é ${formData.name || 'Cliente'}.
Telefone: ${formData.phone}
Local: ${formData.neighborhood}
Possui Terreno: ${formData.hasLand}
Interesse: ${formData.serviceNeeded}
Mensagem: ${formData.message || 'Gostaria de agendar uma conversa sobre meu projeto em Maricá.'}`;

  const directWhatsappUrl = `https://wa.me/${contact.whatsappNumber || COMPANY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappDirectMessage
  )}`;

  return (
    <section id="contato" className="py-28 lg:py-36 bg-[#070E1B] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Section 12: Call To Action Heading from Briefing */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{contact.tagline}</span>
            </div>
            <SectionEditButton tab="contato" label="Editar Dados de Contato" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-6">
            {contact.title}
          </h2>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            {contact.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="cta-falar-com-transformar"
              href={`https://wa.me/${contact.whatsappNumber || COMPANY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                COMPANY_CONFIG.WHATSAPP_DEFAULT_MESSAGE
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-950/40 transition-all hover:scale-105 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar com a Transformar</span>
            </a>

            <a
              id="cta-solicitar-orcamento"
              href="#formulario-orcamento"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 transition-all cursor-pointer"
            >
              <span>Preencher Formulário</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>

        {/* Section 13: Formulário de Contato & Informações de Atendimento */}
        <div id="formulario-orcamento" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact info & Trust */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0C243D]/90 rounded-3xl p-8 sm:p-10 border border-amber-500/20 shadow-2xl">
              <h3 className="text-2xl font-display font-bold text-white mb-4">
                Construa com tranquilidade e apoio técnico
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Receba uma consultoria inicial para compreender o potencial do seu terreno, prazos estimados e opções construtivas em Maricá e Região Oceânica.
              </p>

              <div className="space-y-4 text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Escritório & Atendimento</span>
                    <strong className="text-white block">Maricá – RJ (Itaipuaçu / Barroco)</strong>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {contact.officeAddress || COMPANY_CONFIG.OFFICE_ADDRESS}
                    </p>
                    <a
                      href={COMPANY_CONFIG.OFFICE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium mt-1 hover:underline"
                    >
                      <span>Abrir no Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">WhatsApp & Telefone</span>
                    <a
                      href={`https://wa.me/${contact.whatsappNumber || COMPANY_CONFIG.WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-semibold"
                    >
                      {contact.whatsappDisplay || COMPANY_CONFIG.WHATSAPP_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">E-mail</span>
                    <span className="text-slate-200">{contact.emailContact || COMPANY_CONFIG.EMAIL_CONTACT}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Horário de Atendimento</span>
                    <span className="text-slate-200">{contact.openingHours || COMPANY_CONFIG.OPENING_HOURS}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Seus dados são protegidos e utilizados exclusivamente para contato pela equipe técnica da Construtora Transformar.</span>
              </div>
            </div>
          </div>

          {/* Right Column: The Complete Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#101E38] rounded-3xl p-8 sm:p-10 border border-amber-500/30 shadow-2xl">
              {submitted ? (
                /* Success Confirmation State */
                <div id="contact-success-state" className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
                    Solicitação Enviada com Sucesso!
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8">
                    Obrigado, <strong className="text-amber-400">{formData.name}</strong>. Recebemos seus dados e nossa equipe de engenharia e arquitetura entrará em contato em breve para conversar sobre seu projeto em Maricá.
                  </p>

                  <div className="p-4 rounded-2xl bg-[#070E1B] border border-slate-800 mb-8 max-w-md mx-auto text-left text-xs text-slate-300 space-y-1">
                    <p><strong className="text-amber-400">Interesse:</strong> {formData.serviceNeeded}</p>
                    <p><strong className="text-amber-400">Bairro:</strong> {formData.neighborhood || 'Maricá'}</p>
                    <p><strong className="text-amber-400">Terreno:</strong> {formData.hasLand}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      id="success-whatsapp-forward-btn"
                      href={directWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Agilizar no WhatsApp Agora</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          phone: '',
                          email: '',
                          neighborhood: '',
                          hasLand: 'Sim, já possuo terreno',
                          serviceNeeded: 'Projeto + construção',
                          message: ''
                        });
                      }}
                      className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500"
                    >
                      Enviar outra solicitação
                    </button>
                  </div>
                </div>
              ) : (
                /* The Interactive Form */
                <form id="contact-inquiry-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-800 pb-4 mb-6">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
                      Fale sobre o que você deseja construir
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Preencha os campos abaixo para elaborarmos uma estimativa ou proposta inicial.
                    </p>
                  </div>

                  {/* Nome */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      id="form-input-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Roberto Silva"
                      className="w-full bg-[#070E1B] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Telefone / WhatsApp & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        id="form-input-phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: (21) 98765-4321"
                        className="w-full bg-[#070E1B] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        E-mail *
                      </label>
                      <input
                        id="form-input-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: seu@email.com"
                        className="w-full bg-[#070E1B] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Cidade / Bairro em Maricá & Terreno */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Cidade / Bairro em Maricá
                      </label>
                      <input
                        id="form-input-neighborhood"
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        placeholder="Ex: Itaipuaçu, Alphaville, Inoã..."
                        className="w-full bg-[#070E1B] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Você já possui terreno?
                      </label>
                      <select
                        id="form-select-has-land"
                        name="hasLand"
                        value={formData.hasLand}
                        onChange={handleChange}
                        className="w-full bg-[#070E1B] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-3 px-4 text-sm text-white focus:outline-none cursor-pointer"
                      >
                        <option value="Sim, já possuo terreno">Sim, já possuo terreno</option>
                        <option value="Estou em processo de compra / negociação">Estou em processo de negociação</option>
                        <option value="Ainda estou procurando terreno em Maricá">Ainda estou procurando terreno</option>
                        <option value="Trata-se de reforma em imóvel existente">Trata-se de reforma em imóvel existente</option>
                      </select>
                    </div>
                  </div>

                  {/* O que você procura? (Options exact from briefing) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      O que você procura? *
                    </label>
                    <select
                      id="form-select-service"
                      name="serviceNeeded"
                      value={formData.serviceNeeded}
                      onChange={handleChange}
                      className="w-full bg-[#070E1B] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-3 px-4 text-sm text-white focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="Projeto arquitetônico">Projeto arquitetônico</option>
                      <option value="Projeto estrutural">Projeto estrutural</option>
                      <option value="Projeto elétrico">Projeto elétrico</option>
                      <option value="Projeto hidrossanitário">Projeto hidrossanitário</option>
                      <option value="Construção">Construção</option>
                      <option value="Projeto + construção">Projeto + construção (Pacote Completo)</option>
                      <option value="Reforma">Reforma</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  {/* Conte um pouco sobre o seu projeto */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Conte um pouco sobre o seu projeto
                    </label>
                    <textarea
                      id="form-textarea-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Descreva detalhes como metragem aproximada desejada, número de quartos, se deseja piscina, área gourmet, prazo pretendido..."
                      className="w-full bg-[#070E1B] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Botão Enviar Solicitação */}
                  <div className="pt-2">
                    <button
                      id="form-submit-button"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>Enviando solicitação...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-slate-950" />
                          <span>Enviar Solicitação</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-[11px] text-slate-400">
                    Retornamos o contato em até 24 horas úteis.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
