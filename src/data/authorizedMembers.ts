/**
 * CADASTRO DE MEMBROS AUTORIZADOS - CONSTRUTORA TRANSFORMAR
 * 
 * Este arquivo contém a lista de membros e engenheiros autorizados a acessar o modo
 * de edição e administração do site.
 * 
 * Conforme solicitado:
 * - O cadastro é feito exclusivamente por código nesta lista.
 * - Não há opção pública de cadastro no formulário do site.
 * - Para adicionar ou remover pessoas autorizadas, basta incluir ou editar novos objetos
 *   na lista AUTHORIZED_MEMBERS abaixo.
 */

export interface MemberUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const AUTHORIZED_MEMBERS: MemberUser[] = [
  {
    name: 'rafael',
    email: 'rafaelmendonca.net@gmail.com',
    password: 'Engenharia781227@',
    role: 'Engenheiro Responsável & Administrador'
  }
  /* 
  EXEMPLO DE COMO CADASTRAR UM NOVO MEMBRO:
  Descomente ou duplique o bloco abaixo preenchendo os dados do novo membro:

  ,{
    name: 'nome_do_membro',
    email: 'email_do_membro@exemplo.com',
    password: 'SuaSenhaSegura123@',
    role: 'Engenheiro de Obras'
  }
  */
];

/**
 * Valida credenciais informadas (aceita tanto o Nome quanto o E-mail)
 */
export function validateMemberCredentials(
  identifier: string,
  passwordAttempt: string
): MemberUser | null {
  const cleanIdentifier = identifier.trim().toLowerCase();
  const cleanPassword = passwordAttempt.trim();

  const found = AUTHORIZED_MEMBERS.find((member) => {
    const nameMatch = member.name.trim().toLowerCase() === cleanIdentifier;
    const emailMatch = member.email.trim().toLowerCase() === cleanIdentifier;
    return (nameMatch || emailMatch) && member.password === cleanPassword;
  });

  return found || null;
}
