import React, { useState } from 'react';
import { useMember } from '../context/MemberContext';
import { X, Check, RotateCcw, Building2 } from 'lucide-react';

export const CompanyConfigEditorModal: React.FC = () => {
  const { 
    isCompanyModalOpen, 
    closeCompanyModal, 
    companyConfig, 
    saveCompanyConfig, 
    resetCompanyConfig 
  } = useMember();

  const [whatsappNumber, setWhatsappNumber] = useState(companyConfig.WHATSAPP_NUMBER);
  const [whatsappDisplay, setWhatsappDisplay] = useState(companyConfig.WHATSAPP_DISPLAY);
  const [instagramHandle, setInstagramHandle] = useState(companyConfig.INSTAGRAM_HANDLE);
  const [instagramUrl, setInstagramUrl] = useState(companyConfig.INSTAGRAM_URL);
  const [emailContact, setEmailContact] = useState(companyConfig.EMAIL_CONTACT);
  const [officeAddress, setOfficeAddress] = useState(companyConfig.OFFICE_ADDRESS);
  const [openingHours, setOpeningHours] = useState(companyConfig.OPENING_HOURS);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isCompanyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompanyConfig({
      ...companyConfig,
      WHATSAPP_NUMBER: whatsappNumber.trim(),
      WHATSAPP_DISPLAY: whatsappDisplay.trim(),
      INSTAGRAM_HANDLE: instagramHandle.trim(),
      INSTAGRAM_URL: instagramUrl.trim(),
      EMAIL_CONTACT: emailContact.trim(),
      OFFICE_ADDRESS: officeAddress.trim(),
      OPENING_HOURS: openingHours.trim()
    });
  };

  return (
    <div 
      id="company-config-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={closeCompanyModal}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">
                Editar Informações da Construtora
              </h3>
              <p className="text-xs text-slate-400">
                Altere WhatsApp, e-mail, Instagram e endereço em poucos cliques
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCompanyModal}
            className="w-7 h-7 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp (apenas números com DDI)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="5521999999999"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Visível no Site
              </label>
              <input
                type="text"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
                placeholder="(21) 99999-9999"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Instagram (@perfil)
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@construtora_transformar"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Link Completo do Instagram
              </label>
              <input
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              E-mail de Contato
            </label>
            <input
              type="email"
              value={emailContact}
              onChange={(e) => setEmailContact(e.target.value)}
              placeholder="contato@construtoratransformar.com.br"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Endereço Comercial em Maricá
            </label>
            <textarea
              rows={2}
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Horário de Atendimento
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {confirmReset ? (
              <div className="flex items-center gap-1.5 text-xs bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg">
                <span className="text-amber-800 font-medium">Restaurar padrão?</span>
                <button
                  type="button"
                  onClick={() => {
                    resetCompanyConfig();
                    setConfirmReset(false);
                  }}
                  className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded text-[11px] cursor-pointer"
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[11px] cursor-pointer"
                >
                  Não
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar Padrão</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeCompanyModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Informações</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
