// ============================================================
// CAMADA DE API — 3RISP App
// Centraliza TODAS as chamadas de rede.
// O ViaCEP já funciona real. Os demais usam mock até o backend
// trocar USE_MOCK = false em config.ts.
// ============================================================

import {
  ViaCEPResponse,
  EnderecoFormatado,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Prenotacao,
  ConsultaPrenotacaoRequest,
  SolicitarCertidaoRequest,
  SolicitarCertidaoResponse,
  Pedido,
  Wallet,
  Transaction,
  AdicionarCreditoRequest,
  AdicionarCreditoResponse,
  OfficeStatus,
  User,
} from '../types';
import { API_BASE_URL, VIACEP_BASE_URL, REQUEST_TIMEOUT, USE_MOCK, CERTIDAO_PRICE } from './config';

// ---- Helpers ------------------------------------------------

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let _sessionToken: string | null = null;

export const setSessionToken = (token: string | null) => {
  _sessionToken = token;
};

const buildHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (_sessionToken) {
    headers['Authorization'] = `Bearer ${_sessionToken}`;
  }
  return headers;
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
};

const apiRequest = async <T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, {
      method,
      headers: buildHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Erro na requisição: ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Tempo de conexão esgotado. Verifique sua internet.', 408);
    }
    throw new ApiError(
      'Erro de conexão. Verifique sua internet e tente novamente.',
      0
    );
  }
};

// =============================================================
// CEP — INTEGRAÇÃO REAL COM VIACEP (sempre funciona)
// =============================================================

export const cepService = {
  /**
   * Busca endereço pelo CEP na API ViaCEP.
   * Esta é uma integração REAL, funciona independente de USE_MOCK.
   */
  async buscar(cep: string): Promise<EnderecoFormatado> {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new ApiError('CEP deve conter 8 dígitos.', 400);
    }

    try {
      const response = await fetchWithTimeout(`${VIACEP_BASE_URL}/${cepLimpo}/json/`);
      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        throw new ApiError('CEP não encontrado.', 404);
      }

      return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
        complemento: data.complemento,
        enderecoCompleto: [
          data.logradouro,
          data.bairro,
          `${data.localidade} - ${data.uf}`,
        ]
          .filter(Boolean)
          .join(', '),
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Erro ao buscar CEP. Verifique sua conexão.', 0);
    }
  },

  /**
   * Verifica se o CEP pertence à circunscrição do 3º RISP.
   * Bairros: Brás, Santana, Vila Nova Cachoeirinha.
   */
  verificarCircunscricao(bairro: string): boolean {
    const bairrosAbrangidos = [
      'brás', 'bras', 'santana', 'vila nova cachoeirinha',
      'cachoeirinha', 'vila nova', 'tucuruvi', 'mandaqui',
      'lauzane paulista', 'tremembé', 'jaçanã', 'jacana',
    ];
    return bairrosAbrangidos.some(b =>
      bairro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .includes(b.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    );
  },
};

// =============================================================
// AUTENTICAÇÃO
// → Backend: implementar POST /auth/login e POST /auth/register
// =============================================================

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    if (USE_MOCK) {
      // Simula delay de rede
      await new Promise(r => setTimeout(r, 800));
      return {
        token: 'mock_jwt_token_3risp',
        user: {
          name: 'Usuário 3RISP',
          email: data.email,
          avatarUrl: null,
        },
      };
    }
    return apiRequest<LoginResponse>('POST', '/auth/login', data);
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1000));
      return {
        success: true,
        message: 'Conta criada com sucesso!',
        user: {
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          phone: data.phone,
          avatarUrl: null,
        },
      };
    }
    return apiRequest<RegisterResponse>('POST', '/auth/register', data);
  },

  async refreshToken(): Promise<{ token: string }> {
    if (USE_MOCK) {
      return { token: 'mock_refreshed_token' };
    }
    return apiRequest<{ token: string }>('POST', '/auth/refresh');
  },
};

// =============================================================
// PRENOTAÇÕES / ACOMPANHAMENTO DE PROTOCOLO
// → Backend: implementar GET /prenotacoes/:protocolo/:dv
// =============================================================

export const prenotacaoService = {
  async consultar(data: ConsultaPrenotacaoRequest): Promise<Prenotacao> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        id: 'mock_' + data.protocolo,
        protocolo: data.protocolo,
        dv: data.dv,
        status: 'Com Exigência',
        data: new Date().toLocaleDateString('pt-BR'),
        exigencia:
          'Falha na qualificação negativa. Necessário apresentar certidão de casamento original ou cópia autenticada para averbação do estado civil conforme item 4 da nota anterior.',
        prazoExigencia: 30,
        historico: [
          {
            data: new Date().toLocaleDateString('pt-BR'),
            descricao: 'Título prenotado',
            status: 'Em Andamento',
          },
          {
            data: new Date().toLocaleDateString('pt-BR'),
            descricao: 'Exigência emitida',
            status: 'Com Exigência',
          },
        ],
      };
    }
    return apiRequest<Prenotacao>('GET', `/prenotacoes/${data.protocolo}/${data.dv}`);
  },

  /**
   * Pagar complemento de valor de uma prenotação.
   * → Backend: implementar POST /prenotacoes/:id/complemento
   */
  async pagarComplemento(
    prenotacaoId: string,
    amount: number
  ): Promise<AdicionarCreditoResponse> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      return { success: true, transactionId: 'comp_mock_123' };
    }
    return apiRequest<AdicionarCreditoResponse>(
      'POST',
      `/prenotacoes/${prenotacaoId}/complemento`,
      { amount }
    );
  },
};

// =============================================================
// CERTIDÕES
// → Backend: implementar POST /certidoes e GET /certidoes
// =============================================================

export const certidaoService = {
  async solicitar(data: SolicitarCertidaoRequest): Promise<SolicitarCertidaoResponse> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1500));
      return {
        success: true,
        pedidoId: 'ped_' + Date.now(),
        message: 'Certidão solicitada com sucesso! Aguarde o processamento.',
      };
    }
    return apiRequest<SolicitarCertidaoResponse>('POST', '/certidoes', data);
  },

  async listar(): Promise<Pedido[]> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600));
      return [
        {
          id: '1',
          matricula: '125.442',
          data: '15/04/2026',
          status: 'Pronto',
          downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
        {
          id: '2',
          matricula: '88.109',
          data: '14/04/2026',
          status: 'Pronto',
          downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
        {
          id: '3',
          matricula: '210.332',
          data: new Date().toLocaleDateString('pt-BR'),
          status: 'Em Processamento',
          downloadUrl: '',
        },
      ];
    }
    return apiRequest<Pedido[]>('GET', '/certidoes');
  },

  getPreco(): number {
    return CERTIDAO_PRICE;
  },
};

// =============================================================
// CARTEIRA DIGITAL / WALLET
// → Backend: implementar GET /wallet, POST /wallet/credito, GET /wallet/transacoes
// =============================================================

export const walletService = {
  async getSaldo(): Promise<{ balance: number }> {
    if (USE_MOCK) {
      return { balance: 0 };
    }
    return apiRequest<{ balance: number }>('GET', '/wallet');
  },

  async addCredito(data: AdicionarCreditoRequest): Promise<AdicionarCreditoResponse> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 1000));
      return {
        success: true,
        paymentKey: '00020126580014br.gov.bcb.pix0136mock-pix-key',
        qrCodeUrl: 'https://placeholder.com/qrcode',
        transactionId: 'tx_' + Date.now(),
      };
    }
    return apiRequest<AdicionarCreditoResponse>('POST', '/wallet/credito', data);
  },

  async getTransacoes(): Promise<Transaction[]> {
    if (USE_MOCK) {
      return [
        {
          id: '1',
          type: 'debit',
          amount: 76.54,
          date: '16/04/2026',
          description: 'Certidão Matrícula 125.442',
          emolumentos: [
            { label: 'Estado', value: 15.40 },
            { label: 'IPESP', value: 4.10 },
            { label: 'Registro Civil', value: 1.11 },
            { label: 'Tribunal de Justiça', value: 1.44 },
            { label: 'Ministério Público', value: 1.01 },
            { label: 'Oficial (Taxa)', value: 53.48 },
          ],
        },
        {
          id: '2',
          type: 'credit',
          amount: 100.00,
          date: '15/04/2026',
          description: 'Adição de Saldo - PIX',
        },
        {
          id: '3',
          type: 'debit',
          amount: 76.54,
          date: '14/04/2026',
          description: 'Certidão Matrícula 88.109',
          emolumentos: [
            { label: 'Estado', value: 15.40 },
            { label: 'IPESP', value: 4.10 },
            { label: 'Registro Civil', value: 1.11 },
            { label: 'Tribunal de Justiça', value: 1.44 },
            { label: 'Ministério Público', value: 1.01 },
            { label: 'Oficial (Taxa)', value: 53.48 },
          ],
        },
      ];
    }
    return apiRequest<Transaction[]>('GET', '/wallet/transacoes');
  },
};

// =============================================================
// STATUS DO CARTÓRIO
// → Backend: implementar GET /office/status
// =============================================================

export const officeService = {
  async getStatus(): Promise<OfficeStatus> {
    if (USE_MOCK) {
      const now = new Date();
      const hour = now.getHours();
      const isOpen = hour >= 9 && hour < 16;
      const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

      return {
        isOpen: isOpen && now.getDay() > 0 && now.getDay() < 6,
        openHours: '09h às 16h',
        dayOfWeek: dias[now.getDay()],
        queueCount: isOpen ? Math.floor(Math.random() * 15) : 0,
        avgWaitSeconds: isOpen ? Math.floor(Math.random() * 30) + 5 : 0,
        lastUpdated: `${now.getDate()}/${now.getMonth() + 1} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
      };
    }
    return apiRequest<OfficeStatus>('GET', '/office/status');
  },
};

// =============================================================
// PERFIL
// → Backend: implementar GET /user/me e PUT /user/me
// =============================================================

export const userService = {
  async getProfile(): Promise<User> {
    if (USE_MOCK) {
      return {
        name: 'Usuário Convidado',
        email: 'usuario@exemplo.com.br',
        avatarUrl: null,
      };
    }
    return apiRequest<User>('GET', '/user/me');
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      return { ...data, avatarUrl: null } as User;
    }
    return apiRequest<User>('PUT', '/user/me', data);
  },
};
