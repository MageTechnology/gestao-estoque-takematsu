# Hayai Zaiko - Gestão de Estoque Simplificada

![Hayai Zaiko](public/images/Hayai%20Zaiko.png)

Este é um projeto de um sistema de contagem de estoque simplificado, construído com Next.js e projetado para ser uma PWA (Progressive Web App) para facilitar o uso em dispositivos móveis diretamente no campo.

## ✨ Visão Geral

O objetivo do "Hayai Zaiko" (Estoque Rápido em japonês) é fornecer uma interface limpa e eficiente para que os funcionários possam realizar contagens de inventário de forma rápida, com os dados sendo enviados e consolidados em uma planilha do Google Sheets para análise posterior.

## 🚀 Stack de Tecnologia

O projeto é construído com um conjunto de tecnologias modernas e robustas, focadas em performance e experiência do desenvolvedor:

- **Framework:** [Next.js 14](https://nextjs.org/) (com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **UI:** [ShadCN UI](https://ui.shadcn.com/) & [TailwindCSS](https://tailwindcss.com/)
- **Banco de Dados & Backend:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **Integração com IA:** [LangChain.js](https://js.langchain.com/) & [OpenAI](https://openai.com/)
- **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Formulários:** [React Hook Form](https://react-hook-form.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## 📂 Estrutura do Projeto

A estrutura de pastas segue as convenções do Next.js e está organizada da seguinte forma:

```
/
├── public/               # Arquivos estáticos
├── src/
│   ├── app/              # Rotas, páginas e layouts (App Router)
│   │   ├── api/          # API Routes
│   │   └── contagem/     # Rota principal da aplicação
│   ├── components/       # Componentes React reutilizáveis
│   │   └── ui/           # Componentes base do ShadCN UI
│   ├── lib/              # Funções utilitárias e serviços (ex: Google Sheets)
│   ├── hooks/            # Hooks customizados
│   └── types/            # Definições de tipos TypeScript
└── ...
```

## 🏁 Como Começar

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 20.x ou superior)
- [pnpm](https://pnpm.io/installation)

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd gestao-estoque
```

### 2. Instalar as Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto, copiando o exemplo de `.env.example` (se houver). Você precisará preencher as variáveis relacionadas ao Supabase e ao Google Cloud.

```env
# Exemplo de variáveis de ambiente
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Google Sheets API (para integração direta)
GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_SHEETS_PRIVATE_KEY=...
SPREADSHEET_ID=...
```

### 4. Rodar o Servidor de Desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

## 📜 Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento.
- `pnpm build`: Compila a aplicação para produção.
- `pnpm start`: Inicia um servidor de produção.
- `pnpm test`: Roda os testes (configuração pendente).
- `pnpm lint`: Executa o linter para análise de código estática.

### Tipos do Supabase

Para gerar ou atualizar os tipos do banco de dados a partir do seu projeto Supabase, execute o comando:

```bash
npx supabase gen types typescript --local > src/types/supabase-generated.ts
```
