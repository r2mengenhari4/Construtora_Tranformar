/**
 * Utilitários para formatação e envio de mensagens estruturadas para o WhatsApp
 * da Construtora Transformar com base nas informações preenchidas pelos clientes.
 */

export interface LeadContactData {
  name: string;
  phone: string;
  email?: string;
  neighborhood?: string;
  hasLand?: string;
  serviceNeeded?: string;
  message?: string;
}

/**
 * Normaliza o número de telefone e gera o link wa.me com a mensagem codificada.
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  let digits = (phoneNumber || '').replace(/\D/g, '');
  if (!digits) {
    digits = '5521999999999';
  } else if (digits.length === 10 || digits.length === 11) {
    digits = `55${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Monta o texto legível e profissional da mensagem com todos os campos preenchidos.
 */
export function formatContactLeadMessage(lead: LeadContactData): string {
  const parts: string[] = [
    `*Solicitação de Atendimento & Orçamento*`,
    `*Construtora Transformar • Maricá – RJ*`,
    ``,
    `👤 *Nome:* ${lead.name?.trim() || 'Cliente'}`,
    `📱 *Telefone / WhatsApp:* ${lead.phone?.trim() || 'Não informado'}`,
  ];

  if (lead.email && lead.email.trim()) {
    parts.push(`✉️ *E-mail:* ${lead.email.trim()}`);
  }

  if (lead.neighborhood && lead.neighborhood.trim()) {
    parts.push(`📍 *Local / Bairro em Maricá:* ${lead.neighborhood.trim()}`);
  }

  if (lead.hasLand && lead.hasLand.trim()) {
    parts.push(`🏡 *Possui Terreno:* ${lead.hasLand.trim()}`);
  }

  if (lead.serviceNeeded && lead.serviceNeeded.trim()) {
    parts.push(`🏗️ *O que procura:* ${lead.serviceNeeded.trim()}`);
  }

  if (lead.message && lead.message.trim()) {
    parts.push(``);
    parts.push(`📝 *Sobre o Projeto:*`);
    parts.push(lead.message.trim());
  }

  parts.push(``);
  parts.push(`_Enviado pelo formulário do site da Construtora Transformar._`);

  return parts.join('\n');
}

/**
 * Redireciona o usuário diretamente para a página do WhatsApp com fallback seguro contra bloqueadores de pop-up.
 */
export function forwardToWhatsApp(targetUrl: string) {
  try {
    const opened = window.open(targetUrl, '_blank', 'noopener,noreferrer');
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      window.location.href = targetUrl;
    }
  } catch {
    window.location.href = targetUrl;
  }
}
