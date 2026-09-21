import React from 'react';
import { useMember } from '../context/MemberContext';
import { SectionTabKey } from '../types/siteContent';
import { Edit3, Sparkles } from 'lucide-react';

interface SectionEditButtonProps {
  tab: SectionTabKey;
  label?: string;
  className?: string;
}

export const SectionEditButton: React.FC<SectionEditButtonProps> = ({
  tab,
  label = 'Editar esta Seção',
  className = ''
}) => {
  const { isLoggedIn, openSiteEditor } = useMember();

  if (!isLoggedIn) return null;

  return (
    <div className={`relative z-30 inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => openSiteEditor(tab)}
        className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/90 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 border border-amber-300 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        title="Clique para editar os textos, dados e imagens desta seção"
      >
        <Edit3 className="w-3.5 h-3.5 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
        <span>{label}</span>
        <Sparkles className="w-3 h-3 text-amber-900/60" />
      </button>
    </div>
  );
};
