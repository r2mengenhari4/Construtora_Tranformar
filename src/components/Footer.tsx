import React from 'react';
import { Logo } from './Logo';
import { useMember } from '../context/MemberContext';
import { 
  Instagram, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUp,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { companyConfig, openLoginModal, isLoggedIn, currentMember } = useMember();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'A Transformar', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Projetos', href: '#portfolio' },
    { label: 'Construção', href: '#solucao-completa' },
    { label: 'Contato', href: '#contato' },
  ];

  const serviceLinks = [
    { label: 'Projeto Arquitetônico', href: '#servicos' },
    { label: 'Engenharia Estrutural', href: '#servicos' },
    { label: 'Instalações Elétricas', href: '#servicos' },
    { label: 'Instalações Hidrossanitárias', href: '#servicos' },
    { label: 'Construção Residencial Completa', href: '#servicos' },
    { label: 'Gerenciamento de Obras', href: '#servicos' }
  ];

  return (
    <footer id="main-footer" className="bg-[#050A14] text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-14 border-b border-slate-850">
          {/* Brand Presentation */}
          <div className="lg:col-span-3 space-y-4">
            <Logo variant="horizontal" size="sm" theme="dark" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-2">
              Solução completa para construção residencial em Maricá e Região Oceânica. Unimos arquitetura contemporânea, projetos de engenharia e execução de alto padrão com previsibilidade e rigor técnico.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                id="footer-instagram-btn"
                href={companyConfig.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Construtora Transformar"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-600 hover:to-rose-600 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                id="footer-whatsapp-btn"
                href={`https://wa.me/${companyConfig.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Construtora Transformar"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-emerald-600 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <Phone className="w-5 h-5" />
              </a>

              <a
                id="footer-email-btn"
                href={`mailto:${companyConfig.EMAIL_CONTACT}`}
                aria-label="E-mail Construtora Transformar"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-amber-600 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  id="footer-membros-btn"
                  type="button"
                  onClick={openLoginModal}
                  className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1.5 py-0.5 cursor-pointer text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isLoggedIn && currentMember ? `Membros (${currentMember.name})` : 'Acesso Membros'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
              Especialidades
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {serviceLinks.map((srv) => (
                <li key={srv.label}>
                  <a
                    href={srv.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors block py-0.5"
                  >
                    {srv.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Office Location & Clickable Minimap */}
          <div className="lg:col-span-5 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
              Localização & Atendimento
            </h4>
            
            {/* Exact Address in Text */}
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white block font-semibold text-sm">Escritório Central</strong>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-0.5">
                  {companyConfig.OFFICE_ADDRESS}
                </p>
              </div>
            </div>

            {/* Clickable Minimap redirecting to Google Maps */}
            <div className="pt-1">
              <a
                id="footer-minimap-google-maps"
                href={companyConfig.OFFICE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Clique para abrir a localização exata no Google Maps"
                className="group relative block w-full h-36 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-400/80 transition-all duration-300 shadow-xl bg-[#0B1528] cursor-pointer"
              >
                {/* Styled Map Background */}
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80"
                  alt="Mapa Construtora Transformar - Itaipuaçu, Maricá - RJ"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                />

                {/* Ambient dark blue overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050A14] via-[#050A14]/40 to-transparent" />

                {/* Animated Central Pin Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-40" />
                    <div className="relative w-8 h-8 rounded-full bg-[#0C243D] border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/80 group-hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4 fill-amber-400/40 text-amber-400" />
                    </div>
                  </div>
                  <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#0C243D]/95 backdrop-blur border border-amber-400/50 text-[10px] font-bold text-white shadow-md whitespace-nowrap">
                    Transformar • Loja 205
                  </span>
                </div>

                {/* Bottom Callout Bar */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#050A14]/90 backdrop-blur-md border border-slate-700/60 text-[11px] group-hover:border-amber-400/50 transition-colors">
                  <span className="font-semibold text-slate-200 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ver rota no Google Maps</span>
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-medium">
                    <span className="text-[10px] uppercase tracking-wider">Abrir mapa</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            </div>

            {/* Contact details */}
            <div className="pt-1 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1.5">
                <span className="text-slate-500">Instagram:</span>
                <a 
                  href={companyConfig.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline"
                >
                  {companyConfig.INSTAGRAM_HANDLE}
                </a>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-slate-500">E-mail:</span>
                <span className="text-slate-300">{companyConfig.EMAIL_CONTACT}</span>
              </p>
            </div>

            {/* Corporate placeholders */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-0.5">
              <p>• CNPJ: Disponível sob consulta contratual</p>
              <p>• Responsabilidade Técnica: Engenheiro Civil Habilitado (CREA-RJ)</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Construtora Transformar. Todos os direitos reservados.</p>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-slate-400">
              Desenvolvido com excelência arquitetônica e engenharia de precisão.
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Topo</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
