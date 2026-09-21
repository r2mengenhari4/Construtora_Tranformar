import React, { useState, useEffect } from 'react';
import { COMPANY_CONFIG } from '../data/companyData';
import { X, Send, MessageCircle, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  initialProject?: string;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Projeto + construção',
  initialProject = ''
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [service, setService] = useState(initialService);
  const [details, setDetails] = useState('');
  const [hasLand, setHasLand] = useState('Sim, já possuo terreno');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialService) setService(initialService);
    if (initialProject) setDetails(`Interesse baseado no projeto: ${initialProject}`);
  }, [initialService, initialProject]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const whatsappMessage = `Olá! Solicito atendimento da Construtora Transformar:
Nome: ${name || 'Cliente'}
Telefone: ${phone}
Bairro/Região: ${neighborhood || 'Maricá'}
Possui Terreno: ${hasLand}
Serviço de Interesse: ${service}
Observações: ${details || 'Gostaria de agendar uma reunião inicial.'}`;

  const whatsappUrl = `https://wa.me/${COMPANY_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[#0B1528] text-white border border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Solicitação Recebida!
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              A equipe da Transformar analisará seu pedido para Maricá e retornará com orientações técnicas.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continuar no WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Construtora Transformar • Maricá – RJ
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                Solicitar Atendimento & Orçamento
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Preencha os dados e receba uma orientação de nossos engenheiros e arquitetos.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Seu Nome *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Eduardo"
                className="w-full bg-[#070E1B] border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Telefone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(21) 98765-4321"
                  className="w-full bg-[#070E1B] border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bairro / Região em Maricá</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Itaipuaçu, Alphaville..."
                  className="w-full bg-[#070E1B] border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Você já tem terreno?</label>
                <select
                  value={hasLand}
                  onChange={(e) => setHasLand(e.target.value)}
                  className="w-full bg-[#070E1B] border border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Sim, já possuo terreno">Sim, já possuo terreno</option>
                  <option value="Em negociação">Em negociação</option>
                  <option value="Ainda procurando">Ainda procurando</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Serviço de Interesse</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#070E1B] border border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Projeto + construção">Projeto + Construção Completa</option>
                  <option value="Projeto arquitetônico">Projeto Arquitetônico</option>
                  <option value="Projeto estrutural">Projeto Estrutural</option>
                  <option value="Projeto elétrico">Projeto Elétrico</option>
                  <option value="Projeto hidrossanitário">Projeto Hidrossanitário</option>
                  <option value="Construção">Construção</option>
                  <option value="Reforma">Reforma Residencial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Conte sobre o que quer construir
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ex: Casa térrea ou 2 pavimentos, 3 quartos, piscina..."
                className="w-full bg-[#070E1B] border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitação</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Atendimento técnico sem compromisso</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
