import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Wallet, Transaction, OfficeStatus, CartItem, AppState } from '../types';
import { setSessionToken, officeService, walletService } from '../lib/api';
import { CERTIDAO_PRICE } from '../lib/config';

// Re-exportar tipos para quem importa daqui
export type { User, Wallet, Transaction, OfficeStatus, CartItem, AppState };

const MOCK_STATE: AppState = {
  user: {
    name: 'Usuário Convidado',
    email: 'usuario@exemplo.com.br',
    avatarUrl: null,
  },
  wallet: {
    balance: 0,
    transactions: [],
  },
  office: {
    isOpen: true,
    openHours: '09h às 16h',
    dayOfWeek: 'Quinta-feira',
    queueCount: 0,
    avgWaitSeconds: 12,
    lastUpdated: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
  },
  cart: {
    items: [],
  },
  certidaoPrice: CERTIDAO_PRICE,
  isLoggedIn: false,
  biometricsEnabled: false,
  sessionToken: null,
  expoPushToken: null,
};

type AppAction =
  | { type: 'ADD_CREDIT'; amount: number }
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOGIN_SUCCESS'; token?: string; user?: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; user: Partial<User> }
  | { type: 'SET_OFFICE_STATUS'; office: OfficeStatus }
  | { type: 'ADD_TRANSACTION'; transaction: Transaction }
  | { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
  | { type: 'SET_BALANCE'; balance: number }
  | { type: 'SET_BIOMETRICS'; enabled: boolean }
  | { type: 'SET_PUSH_TOKEN'; token: string }
  | { type: 'HYDRATE_STATE'; state: Partial<AppState> };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_CREDIT':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          balance: state.wallet.balance + action.amount,
        },
      };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.item],
        },
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item.id !== action.id),
        },
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: { items: [] },
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        sessionToken: action.token || 'session_token',
        ...(action.user ? { user: { ...state.user, ...action.user } } : {}),
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        sessionToken: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.user },
      };
    case 'SET_OFFICE_STATUS':
      return {
        ...state,
        office: action.office,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          transactions: [action.transaction, ...state.wallet.transactions],
        },
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          transactions: action.transactions,
        },
      };
    case 'SET_BALANCE':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          balance: action.balance,
        },
      };
    case 'SET_BIOMETRICS':
      return {
        ...state,
        biometricsEnabled: action.enabled,
      };
    case 'SET_PUSH_TOKEN':
      return {
        ...state,
        expoPushToken: action.token,
      };
    case 'HYDRATE_STATE':
      return {
        ...state,
        ...action.state,
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, MOCK_STATE);

  // Sincronizar token com a camada de API
  useEffect(() => {
    setSessionToken(state.sessionToken);
  }, [state.sessionToken]);

  // Carregar estado salvo e dados da API
  useEffect(() => {
    const hydrate = async () => {
      try {
        const saved = await AsyncStorage.getItem('@cartorio_app_state');
        if (saved) {
          dispatch({ type: 'HYDRATE_STATE', state: JSON.parse(saved) });
        }
      } catch (e) {
        console.error('Falha ao carregar estado offline', e);
      }
    };

    const fetchApiData = async () => {
      try {
        const officeStatus = await officeService.getStatus();
        dispatch({ type: 'SET_OFFICE_STATUS', office: officeStatus });

        // Apenas recarrega dados da carteira se já existir um token ou user hidratado (simulação de sessão)
        // No futuro, isso pode ser chamado após login bem sucedido
        const balanceData = await walletService.getSaldo();
        const transacoesData = await walletService.getTransacoes();
        
        dispatch({ type: 'SET_BALANCE', balance: balanceData.balance });
        dispatch({ type: 'SET_TRANSACTIONS', transactions: transacoesData });
      } catch (e) {
        console.warn('Falha ao carregar dados da API no contexto inicial', e);
      }
    };

    hydrate().then(() => fetchApiData());
  }, []);

  // Persistir estado sensível
  useEffect(() => {
    const persist = async () => {
      try {
        const toSave = {
          wallet: state.wallet,
          isLoggedIn: state.isLoggedIn,
          biometricsEnabled: state.biometricsEnabled,
          user: state.user,
        };
        await AsyncStorage.setItem('@cartorio_app_state', JSON.stringify(toSave));
      } catch (e) {
        console.error('Falha ao salvar estado offline', e);
      }
    };
    persist();
  }, [state.wallet, state.isLoggedIn, state.biometricsEnabled, state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
