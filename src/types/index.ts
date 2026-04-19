// ============================================================
// TIPOS COMPARTILHADOS — 3RISP App
// Contrato frontend ↔ backend. Backend implementa esses tipos.
// ============================================================

// ---- Usuário ------------------------------------------------

export interface User {
  id?: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  avatarUrl: string | null;
}

// ---- Carteira / Wallet --------------------------------------

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
  /** Detalhamento dos emolumentos (apenas para débitos de certidão) */
  emolumentos?: EmolumentoDetalhe[];
}

export interface EmolumentoDetalhe {
  label: string;   // ex: "Estado", "IPESP", "Oficial (Taxa)"
  value: number;
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

// ---- Carrinho de Certidões ----------------------------------

export interface CartItem {
  id: string;
  matricula: string;
  address: string;
  price: number;
  /** Tipo de certidão solicitada */
  tipo: 'certidao_digital' | 'visualizacao_matricula';
}

// ---- Prenotação (Protocolo) ---------------------------------

export type PrenotacaoStatus =
  | 'Em Andamento'
  | 'Com Exigência'
  | 'Registrado'
  | 'Cancelado'
  | 'Aguardando Pagamento';

export interface Prenotacao {
  id: string;
  protocolo: string;
  dv: string;
  status: PrenotacaoStatus;
  data: string;
  /** Nota devolutiva / exigência (quando aplicável) */
  exigencia?: string;
  /** Prazo em dias para cumprimento da exigência */
  prazoExigencia?: number;
  /** Valor de complemento a pagar (se existir) */
  complementoValor?: number;
  /** Histórico de movimentações do título */
  historico?: PrenotacaoHistoricoItem[];
}

export interface PrenotacaoHistoricoItem {
  data: string;
  descricao: string;
  status: PrenotacaoStatus;
}

// ---- Pedido de Certidão (pronto para download) --------------

export type PedidoStatus = 'Em Processamento' | 'Pronto' | 'Expirado' | 'Erro';

export interface Pedido {
  id: string;
  matricula: string;
  data: string;
  status: PedidoStatus;
  /** URL para download do PDF (quando pronto) */
  downloadUrl: string;
}

// ---- Status do Cartório -------------------------------------

export interface OfficeStatus {
  isOpen: boolean;
  openHours: string;
  dayOfWeek: string;
  queueCount: number;
  avgWaitSeconds: number;
  lastUpdated: string;
}

// ---- ViaCEP -------------------------------------------------

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export interface EnderecoFormatado {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento: string;
  /** Endereço completo formatado para exibição */
  enderecoCompleto: string;
}

// ---- Circunscrição ------------------------------------------

export interface Circunscricao {
  nome: string;           // ex: "Brás", "Santana", "Vila Nova Cachoeirinha"
  subdistrito: string;    // ex: "6º Subdistrito"
  descricao: string;
}

// Bairros que pertencem ao 3º RISP
export const CIRCUNSCRICAO_3RISP: Circunscricao[] = [
  {
    nome: 'Brás',
    subdistrito: '6º Subdistrito',
    descricao: 'Brás pertence a esta Serventia desde 18/10/1934.',
  },
  {
    nome: 'Santana',
    subdistrito: '8º Subdistrito',
    descricao: 'Santana pertence a esta Serventia desde 10/08/1931.',
  },
  {
    nome: 'Vila Nova Cachoeirinha',
    subdistrito: '48º Subdistrito',
    descricao: 'Vila Nova Cachoeirinha pertence a esta Serventia desde 01/01/1954.',
  },
];

// ---- Requests / Responses para API --------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface ConsultaPrenotacaoRequest {
  protocolo: string;
  dv: string;
}

export interface SolicitarCertidaoRequest {
  matricula: string;
  address: string;
  tipo: CartItem['tipo'];
}

export interface SolicitarCertidaoResponse {
  success: boolean;
  pedidoId: string;
  message: string;
}

export interface AdicionarCreditoRequest {
  amount: number;
  /** Método de pagamento */
  method: 'pix' | 'boleto';
}

export interface AdicionarCreditoResponse {
  success: boolean;
  /** chave/QR Code PIX ou linha do boleto */
  paymentKey?: string;
  /** URL do QR Code PIX */
  qrCodeUrl?: string;
  transactionId?: string;
}

// ---- Estado Global do App -----------------------------------

export interface AppState {
  user: User;
  wallet: Wallet;
  office: OfficeStatus;
  cart: {
    items: CartItem[];
  };
  certidaoPrice: number;
  isLoggedIn: boolean;
  biometricsEnabled: boolean;
  sessionToken: string | null;
  expoPushToken: string | null;
}
