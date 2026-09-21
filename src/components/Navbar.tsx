import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useMember } from '../context/MemberContext';
import { 
  Phone, 
  Instagram, 
  MapPin, 
  Menu, 
  X, 
  ArrowRight,
  MessageCircle,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenBudgetModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBudgetModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, currentMember, openLoginModal, companyConfig } = useMember();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${companyConfig.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    companyConfig.WHATSAPP_DEFAULT_MESSAGE
  )}`;

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Projetos', href: '#portfolio' },
    { label: 'Construa sem Complicação', href: '#solucao-completa' },
    { label: 'Do Terreno à Entrega', href: '#etapas-obra' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'A Transformar', href: '#sobre' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div 
        id="top-utility-bar" 
        className={`bg-[#0C243D]/85 backdrop-blur-sm text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-white/10 transition-all duration-300 ${
          isScrolled ? 'hidden md:block py-1.5 opacity-90' : 'block'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Maricá – RJ e Região Oceânica</span>
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{companyConfig.OPENING_HOURS || 'Segunda a Sexta das 08h às 18h'}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              id="topbar-instagram-link"
              href={companyConfig.INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">{companyConfig.INSTAGRAM_HANDLE}</span>
            </a>
            <span className="text-slate-500">|</span>
            <a 
              id="topbar-phone-link"
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">{companyConfig.WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        id="primary-navbar" 
        className={`px-4 sm:px-8 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0C243D]/92 backdrop-blur-md shadow-xl py-3.5 border-b border-amber-500/20' 
            : 'bg-[#0C243D]/65 backdrop-blur-md py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#inicio" className="focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg">
            <Logo variant="horizontal" size="sm" theme="dark" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium text-slate-100 hover:text-amber-400 transition-colors rounded-md hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}

            {/* Membros Navigation Item (Requested by user) */}
            <button
              id="nav-link-membros"
              type="button"
              onClick={openLoginModal}
              className={`px-3 py-1.5 text-xs xl:text-sm font-semibold transition-all rounded-full flex items-center gap-1.5 cursor-pointer ml-1 ${
                isLoggedIn 
                  ? 'text-amber-300 bg-amber-500/20 border border-amber-400/40 hover:bg-amber-500/30 shadow-sm' 
                  : 'text-slate-100 hover:text-amber-400 hover:bg-white/10 border border-white/10'
              }`}
              title={isLoggedIn ? `Membro conectado: ${currentMember?.name}` : 'Acesso de Membros'}
            >
              {isLoggedIn ? (
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{isLoggedIn && currentMember ? `Membros (${currentMember.name})` : 'Membros'}</span>
              {isLoggedIn && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-amber-400 focus:outline-none cursor-pointer"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer" 
          className="lg:hidden bg-[#0B1528] border-b border-amber-500/30 shadow-2xl px-6 py-6 transition-all"
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-amber-400 py-2 border-b border-slate-800"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Membros Item */}
            <button
              id="mobile-nav-membros-btn"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openLoginModal();
              }}
              className="text-left text-base font-medium text-amber-300 hover:text-amber-200 py-2 border-b border-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>{isLoggedIn && currentMember ? `Membros (Logado: ${currentMember.name})` : 'Membros (Acesso Restrito)'}</span>
              </div>
              {isLoggedIn && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  Online
                </span>
              )}
            </button>

            <div className="pt-4 flex flex-col gap-3">
              <a
                id="mobile-whatsapp-btn"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </a>

              <a
                id="mobile-budget-btn"
                href="#contato"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (onOpenBudgetModal) {
                    e.preventDefault();
                    onOpenBudgetModal();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-400 hover:to-amber-500"
              >
                <span>Solicitar Orçamento</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
