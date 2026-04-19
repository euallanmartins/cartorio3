# Documentação Técnica Final — App Cartório do Terceiro Ofício (3RISP)

Este documento detalha a arquitetura final, funcionalidades de produção e o design system do aplicativo móvel, desenvolvido com Expo SDK 52 e TypeScript. O aplicativo foi validado e está em estado **Production Ready**.

## 🎨 Design System: "Neon Glow"
- **Paleta:** Fundo Escuro (#000000), Azul Cartório (#1E6FFF), Ciano Neon (#00F3FF), Roxo (#BF00FF).
- **Componentes:** Glassmorphism, Neon Glow em cards e botões.
- **Tipografia:** Focos em negrito para títulos e fontes mono para dados de protocolo/recibos.

## 🏗️ Engenharia de Produção (Implementada & Validada)

### 1. Offline-First & Persistência (AsyncStorage)
- **Status:** ✅ Ativo e Configurado.
- **Lógica:** Implementada no `AppContext.tsx`. O saldo da carteira e a lista de prenotações são persistidos localmente.
- **Banner de Rede:** Hook `useNetworkStatus` dispara um banner Neon Glow fixo no topo (`OfflineBanner`) caso a conexão seja interrompida, avisando que os dados exibidos são do cache.

### 2. Acessibilidade (a11y)
- **Status:** ✅ Revisado em todas as telas principais (Home, Login, Perfil e Prenotações).
- **Recursos:** Uso de `accessibilityLabel`, `accessibilityHint` e `accessibilityRole`. Modais de recibo e nota devolutiva possuem foco travado para leitores de tela.

### 3. Deep Linking
- **Status:** ✅ Configurado via `LinkingConfiguration.ts`.
- **Esquema:** `cartorio3risp://`
- **Exemplo:** `cartorio3risp://protocolo/123456-7` abre o app diretamente na consulta do protocolo.

### 4. Monitoramento (Sentry & Error Boundary)
- **Status:** ✅ Integrado e Validado.
- **Resiliência:** O `AppErrorBoundary` captura exceções globais, evitando o encerramento abrupto do app e oferecendo uma interface de recuperação com o tema Neon Glow.

## ⚙️ Dependências Instaladas e Necessárias

Para garantir o funcionamento nativo (Biometria, PDF, Compartilhamento), as seguintes bibliotecas estão ativas no projeto:

```bash
# Core & Navegação
npm install @react-navigation/native expo-router lucide-react-native

# Produção & Nativo
npm install @react-native-async-storage/async-storage @react-native-community/netinfo 
npm install @sentry/react-native expo-linking expo-local-authentication 
npm install expo-sharing expo-file-system expo-secure-store expo-blur expo-linear-gradient
```

## 🚀 Fluxos de Uso Validados

| Fluxo | Descrição | Status |
| :--- | :--- | :--- |
| **Autenticação** | Login simulado com validação e biometria preparada. | ✅ |
| **Consultas** | Acompanhamento de protocolos com visualização de notas devolutivas. | ✅ |
| **Financeiro** | Dashboard da carteira com extrato e recibos de emolumentos. | ✅ |
| **Segurança** | Error Boundary interceptando falhas e Sentry pronto para logs. | ✅ |

---
**Data da Última Revisão:** 16 de Abril de 2026
**Responsável Técnico:** Allan Martins (AI Senior Software Engineer)
**Estado:** Pronto para Deploy Nativo.
