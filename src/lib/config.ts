// ============================================================
// CONFIGURAÇÕES — 3RISP App
// O backend troca apenas API_BASE_URL e USE_MOCK = false.
// ============================================================

/**
 * Quando true, o app usa dados mock locais.
 * Quando false, o app faz requests reais para API_BASE_URL.
 * 
 * → Backend: trocar para false quando os endpoints estiverem prontos.
 */
export const USE_MOCK = true;

/**
 * URL base da API do backend.
 * 
 * → Backend: substituir pela URL real (ex: https://api.3risp.com.br/v1)
 */
export const API_BASE_URL = 'https://api.3risp.com.br/v1';

/**
 * URL da API ViaCEP — sempre real, gratuita, sem autenticação.
 */
export const VIACEP_BASE_URL = 'https://viacep.com.br/ws';

/**
 * Timeout das requests em milissegundos.
 */
export const REQUEST_TIMEOUT = 15000;

/**
 * Preço atual da certidão digital.
 * → Backend: esse valor deve vir de um endpoint /config ou /pricing
 */
export const CERTIDAO_PRICE = 76.54;

export const CARTORIO_INFO = {
  nome: '3º Ofício de Justiça de Duque de Caxias',
  nomeAbreviado: 'Cartório do Terceiro Ofício',
  endereco: 'Rua Conde de Porto Alegre, nº 24 - Lojas A & B, 25 de Agosto, Duque de Caxias - RJ',
  cep: '25070-350', // Approximated from the address
  telefone: '(21) 2672-1449',
  email: 'faleconosco@3oficiocaxias.com.br',
  site: 'www.3oficiocaxias.com.br',
  horario: 'Seg à Sex: 09:00h às 16:30h',
  circunscricao: '1º e 3º Distritos das 2ª e 4ª Circunscrições de Duque de Caxias',
  /** Aviso obrigatório de segurança */
  avisoSeguranca: 'Por motivos de segurança, não enviamos QR CODE PIX e/ou Boleto por e-mail.',
};
