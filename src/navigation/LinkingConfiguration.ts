import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const LinkingConfiguration: LinkingOptions<any> = {
  prefixes: [prefix, 'cartorio3risp://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: 'welcome',
          Login: 'login',
        },
      },
      Main: {
        screens: {
          HomeTab: 'home',
          PrenotacoesTab: {
            path: 'protocolo/:protocolId',
            parse: {
              protocolId: (id: string) => `${id}`,
            },
          },
          PedidoTab: 'certidao',
          PerfilTab: 'perfil',
        },
      },
      CarteiraDashboard: 'carteira',
      MeusPedidos: 'pedidos',
    },
  },
};
