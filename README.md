<p align="center">
  <img src="https://img.shields.io/badge/Expo_SDK-54-blue?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/React_Native-0.79.x-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Plataforma-iOS_|_Android_|_Web-green?style=for-the-badge" />
</p>

<h1 align="center">🏛️ Cartório 3º Ofício — App Mobile & Web</h1>

<p align="center">
  Aplicativo oficial do <strong>3º Ofício de Justiça de Duque de Caxias</strong>.<br/>
  Solicite certidões, acompanhe prenotações, gerencie sua carteira digital e visualize o mapa de matrículas — tudo pelo celular.
</p>

---

## ✨ Funcionalidades

| Módulo | Descrição |
|---|---|
| **🔐 Onboarding & Auth** | Carrossel de 3 slides com Login, Registro e tela de boas-vindas. Validação de CPF e máscara de telefone. |
| **🏠 Home Dashboard** | Status ao vivo do cartório (aberto/fechado), câmera da recepção com overlay de fila, atalhos rápidos. |
| **📋 Prenotações** | Listagem completa de prenotações com filtros por status, busca por protocolo e detalhamento com timeline. |
| **🛒 Pedido de Certidão** | Carrinho de matrículas com FAB animado, wizard de localização com autopreenchimento por CEP e integração com mapa. |
| **💳 Carteira Digital** | Saldo, histórico de transações, adição de créditos via PIX/Boleto e indicadores financeiros (Selic/CDI) do Banco Central. |
| **🗺️ Mapa de Matrícula** | Geolocalização de imóveis via Nominatim (OpenStreetMap) com marker customizado e fallback web. |
| **👤 Perfil** | Dados do usuário, toggle de biometria, logout seguro. |

---

## 🔌 Integrações de APIs Públicas

```
src/lib/publicApis.ts     ← Camada centralizada de serviço
src/hooks/useCep.ts       ← Autopreenchimento por CEP
src/hooks/useCnpj.ts      ← Busca de dados PJ por CNPJ
src/hooks/useIndicadores.ts ← Taxas Selic/CDI do BCB
```

| API | Finalidade | Fallback |
|---|---|---|
| **ViaCEP** | Autopreenchimento de endereço por CEP (Em caso de erro na requisição ou resposta HTTP com status de erro) | BrasilAPI v2 |
| **BrasilAPI** | Fallback de CEP quando ViaCEP falha | — |
| **Nominatim (OSM)** | Geocoding de endereço → coordenadas para o mapa (requer conectividade — sem suporte offline para geocoding) | Centro de SP |
| **Banco Central (BCB)** | Taxas Selic e CDI em tempo real | Valores zerados |
| **CNPJ.ws** | Busca de razão social e endereço por CNPJ | — |

---

## 📁 Estrutura do Projeto

```
cartorio/
├── App.tsx                    # Entry point + Sentry + Navigation
├── app.json                   # Config Expo
├── eas.json                   # Config EAS Build
├── LICENSE                    # Licença proprietária
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── auth/              # AuthInput, PageDots
│   │   ├── AppErrorBoundary   # Error boundary global
│   │   ├── BaseComponents     # SectionCard, StatusBadge
│   │   └── OfflineBanner      # Banner de modo offline
│   ├── context/
│   │   └── AppContext.tsx     # Estado global (useReducer)
│   ├── hooks/                 # Custom hooks
│   ├── lib/
│   │   ├── api.ts             # Mock API (preparado para backend real)
│   │   ├── config.ts          # Constantes e flags (USE_MOCK)
│   │   └── publicApis.ts      # APIs públicas gratuitas
│   ├── modals/
│   │   ├── CameraModal.tsx    # Modal da câmera de recepção
│   │   └── LocationWizard.tsx # Wizard de busca de endereço
│   ├── navigation/            # Stack + Tab navigators
│   ├── screens/               # Todas as telas do app
│   │   └── auth/              # Login, Register, Welcome
│   ├── theme/
│   │   └── theme.ts           # Design tokens (cores, spacing, radius)
│   └── types/
│       └── index.ts           # Interfaces TypeScript globais
```

---

## 🚀 Rodando o Projeto

```bash
# Instalar dependências
npm install

# Rodar no navegador
npm run web

# Rodar no dispositivo/simulador
npx expo start

# Build Android (APK)
eas build --platform android --profile preview

# Export web estático
npx expo export -p web
```

---

## ⚙️ Handoff para Backend

O app está 100% funcional com dados mock. Para conectar ao backend real:

1. Em `src/lib/config.ts`, trocar `USE_MOCK = false`
2. Configurar `API_BASE_URL` para a URL real da API
3. Os endpoints esperados estão documentados em `src/lib/api.ts`

> **Nenhum arquivo do backend precisa ser alterado no frontend** — toda a lógica de switching mock/real já está implementada.

---

## 🔒 Segurança & Compliance

- **RLS + Zero-Trust**: Nenhuma credencial hardcoded (regra `[REDACTED]`)
- **LGPD**: APIs públicas não persistem dados pessoais
- **Lei 9.610/98**: Código protegido por licença proprietária
- **Sanitização**: CPFs e e-mails não aparecem em logs

---

## 📄 Licença

**Proprietária** — © 2026 Cartório 3º Ofício / Allan Martins.  
Todos os direitos reservados. Veja o arquivo [LICENSE](./LICENSE) para detalhes.
