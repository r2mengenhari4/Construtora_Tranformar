import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const { companyConfig } = useMember();

  const whatsappUrl = `https://wa.me/${companyConfig.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    companyConfig.WHATSAPP_DEFAULT_MESSAGE
  )}`;

  return (
    <aside 
      id="floating-whatsapp-container"
      aria-label="Atendimento via WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none"
    >
      {/* Speech Bubble Tooltip */}
      {!tooltipDismissed && (
        <div 
          id="whatsapp-callout-bubble"
          className="hidden sm:flex items-center gap-2 bg-[#0B1528] text-white py-2.5 px-4 rounded-2xl shadow-2xl border border-amber-500/30 text-xs font-semibold animate-pulse duration-3000"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Fale com um especialista</span>
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTooltipDismissed(true);
            }}
            className="text-slate-400 hover:text-white ml-1.5 p-0.5"
            aria-label="Fechar mensagem"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        id="floating-whatsapp-button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar com a Construtora Transformar no WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-950/50 hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-emerald-500/20"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white" />
        
        {/* Pulsing beacon ping effect */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[9px] font-bold text-slate-950 items-center justify-center">
            1
          </span>
        </span>
      </a>
    </aside>
  );
};
