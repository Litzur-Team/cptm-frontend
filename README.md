# CPTM App — Sistema de Inspeção e Relatórios

<p align="center">
  <img src="src/assets/cptm-logo.svg" alt="CPTM Logo" width="200" />
</p>

Aplicação web mobile-first desenvolvida para a **CPTM (Companhia Paulista de Trens Metropolitanos)**, voltada ao gerenciamento de inspeções e relatórios de ocorrências nas estações e linhas ferroviárias. O sistema possui dois perfis de acesso — **Administrador** e **Inspetor** — cada um com funcionalidades específicas.

> Projeto acadêmico desenvolvido na **FATEC**.

---

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Começando](#começando)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Credenciais de Teste](#credenciais-de-teste)
- [Capturas de Tela](#capturas-de-tela)

---

## Visão Geral

O CPTM App permite que inspetores registrem ocorrências nas estações (problemas em catracas, infraestrutura, limpeza etc.) com dados de localização GPS, e que administradores acompanhem, gerenciem e atualizem o status desses relatórios, além de cadastrar e gerenciar inspetores.

### Fluxo Principal

1. **Splash Screen** — Tela de carregamento com logo da CPTM (3 segundos)
2. **Login** — Autenticação com credenciais de teste (admin ou inspetor)
3. **Painel Principal** — Conteúdo baseado no perfil do usuário
4. **Navegação** — Menu inferior (bottom navigation) com abas contextuais

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| **Vue 3** | ^3.5 | Framework reativo (Composition API + `<script setup>`) |
| **Vite** | ^7.3 | Build tool e dev server |
| **Tailwind CSS** | ^4.2 | Framework CSS utility-first |
| **Leaflet** | ^1.9 | Mapas interativos (OpenStreetMap) |
| **JavaScript** | ES2022+ | Linguagem principal |

---

## Estrutura do Projeto

```
cptm-app/
├── index.html                  # Ponto de entrada HTML
├── package.json                # Dependências e scripts
├── vite.config.js              # Configuração do Vite + plugins
├── public/                     # Arquivos estáticos públicos
└── src/
    ├── main.js                 # Bootstrap da aplicação Vue
    ├── App.vue                 # Componente raiz (roteamento, estado global)
    ├── style.css               # Estilos globais e animações CSS
    ├── assets/
    │   ├── cptm-logo.svg       # Logo oficial da CPTM
    │   └── bg-expresso-turistico.jpg  # Imagem de fundo (tela de login)
    └── components/
        ├── SplashScreen.vue    # Tela de carregamento inicial
        ├── Login.vue           # Tela de login
        ├── ForgotPassword.vue  # Recuperação de senha (3 etapas)
        ├── AdminPanel.vue      # Painel do administrador (dashboard + gestão)
        ├── InspectorHome.vue   # Visão geral do inspetor (dashboard)
        ├── InspectorPanel.vue  # Criação de relatórios (wizard 5 etapas)
        ├── BottomNavigation.vue # Menu de navegação inferior
        ├── History.vue         # Histórico de relatórios (com filtros)
        ├── Profile.vue         # Perfil (info pessoal + opções de conta)
        ├── Settings.vue        # Configurações do app
        ├── ReportDetail.vue    # Detalhes de um relatório
        ├── InspectorDetail.vue # Detalhes de um inspetor (admin)
        └── ToastNotification.vue # Sistema de notificações toast
```

---

## Funcionalidades

### Gerais

- **Mobile-first** — Interface otimizada para dispositivos móveis
- **Splash Screen** — Tela de carregamento com animação
- **Sistema de Toast** — Notificações visuais globais (sucesso, erro, info, aviso) via `provide/inject`
- **Indicador de Conexão** — Detecta online/offline em tempo real no header
- **Animações e Transições** — Slide-fade para navegação, modal com escala, toasts animados
- **Background dinâmico** — Imagem de fundo nas telas de login/recuperação de senha

### Autenticação

- **Login** — Autenticação com perfil (admin ou inspetor)
- **Recuperação de Senha** — Fluxo em 3 etapas:
  1. Inserir e-mail
  2. Digitar código de verificação (6 dígitos)
  3. Definir nova senha
- **Logout** — Encerramento de sessão com toast informativo

### Perfil Administrador

- **Dashboard** — Cards de estatísticas (total, pendentes, em andamento, resolvidos, inspetores)
- **Busca e Filtros** — Barra de busca por texto + filtros por status (pills coloridas) na aba de relatórios
- **Gerenciar Inspetores** — Cadastrar, editar e excluir inspetores (modal com formulário e validação)
- **Visualizar Relatórios** — Listagem com cards clicáveis, barra de status colorida e avatar do inspetor
- **Detalhe do Relatório** — Informações completas + alteração de status (Pendente → Em Andamento → Resolvido)
- **Detalhe do Inspetor** — Perfil, estatísticas e relatórios associados

### Perfil Inspetor

- **Visão Geral (Início)** — Dashboard com estatísticas, botão de nova ocorrência e relatórios recentes
- **Criar Relatório** — Assistente de 5 etapas:
  1. Localização da estação
  2. Coordenadas GPS + **mapa interativo Leaflet** (marcador arrastável, clique para reposicionar)
  3. Categoria do problema (10 categorias selecionáveis) + descrição detalhada
  4. Mídia (fotos/vídeos)
  5. Revisão com preview de mapa estático e envio
- **Histórico** — Lista de relatórios com busca por texto e filtros por status
- **Detalhe do Relatório** — Visualização completa da ocorrência

### Navegação (Bottom Navigation)

| Aba | Admin | Inspetor |
|---|---|---|
| Início | ✅ | ✅ |
| Registrar | — | ✅ |
| Histórico | — | ✅ |
| Perfil | ✅ | ✅ |
| Ajustes | ✅ | ✅ |

### Configurações

- Toggle de Notificações
- Toggle de Modo Escuro (placeholder)
- Toggle de Geolocalização
- Opção de excluir conta (com aviso MVP)

### Perfil

- **Tela principal** — Card com avatar, dados básicos, e-mail e telefone
- **Informações Pessoais** — Visualizar e editar nome, e-mail e telefone + dados funcionais (CPF, cargo, departamento, matrícula, admissão)
- **Opções de Conta** — Alterar senha (com validação), informações da sessão ativa, zona de perigo (excluir conta)

---

## Começando

### Pré-requisitos

- **Node.js** >= 18
- **npm** >= 9

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd cptm-app

# Instalar dependências
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador (ou no celular na mesma rede).

### Build de Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

---

## Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `dev` | `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `build` | `npm run build` | Gera build otimizada para produção |
| `preview` | `npm run preview` | Serve a build de produção localmente |

---

## Credenciais de Teste

| Perfil | Usuário | Senha |
|---|---|---|
| Administrador | `admin` | `123` |
| Inspetor | `inspetor` | `123` |

> **Nota:** Os dados são mockados localmente. Não há integração com backend nesta versão.

---

## Arquitetura

### Gerenciamento de Estado

O estado da aplicação é gerenciado no componente raiz `App.vue` através de refs reativas:

- **`currentView`** — Controla a tela ativa (`login`, `forgot-password`, `admin`, `inspector`)
- **`currentTab`** — Controla a aba da navegação inferior (`home`, `new-report`, `history`, `profile`, `settings`)
- **`detailView`** — Controla a visualização de detalhes (`report-detail`, `inspector-detail`, `null`)

### Sistema de Toast (provide/inject)

O `App.vue` provê a função `showToast` via `provide`, e qualquer componente filho pode injetá-la com `inject('showToast')` para exibir notificações globais.

### Animações CSS

Definidas em `style.css`:
- **`slide-fade`** — Transição de páginas (translateY + opacity)
- **`fade`** — Fade simples para splash screen
- **`modal`** — Escala para modais
- **`overlay`** — Fade para backdrop de modais
- **`toast-in / toast-out`** — Animação de entrada/saída dos toasts

---

## Licença

Projeto acadêmico — FATEC.
