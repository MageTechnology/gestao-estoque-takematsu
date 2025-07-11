# Documentação: Sistema de Contagem de Estoque

Este documento detalha a arquitetura, o fluxo de dados e os componentes principais da aplicação de contagem de estoque desenvolvida com Next.js.

## 1. Visão Geral

O objetivo desta aplicação é fornecer uma interface moderna e eficiente para que os funcionários realizem a contagem de estoque de uma loja. Os dados dos produtos são carregados a partir de uma planilha do Google Sheets, e os resultados da contagem são enviados para um webhook do n8n para processamento posterior.

### Stack de Tecnologia
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **UI:** ShadCN UI
- **Estilização:** TailwindCSS
- **Fonte de Dados (Leitura):** Planilha pública do Google Sheets (em formato CSV).
- **Destino dos Dados (Escrita):** Webhook do n8n.

---

## 2. Fluxo do Usuário

A experiência do usuário foi projetada para ser um fluxo guiado e claro, dividido em duas telas principais:

### Tela 1: Início da Sessão (`/`)

1.  O usuário acessa a página inicial.
2.  É apresentado um formulário para preencher os metadados da sessão de contagem:
    - **Responsável:** Nome do funcionário que está realizando a contagem.
    - **Loja:** Nome da unidade ou loja.
    - **Data:** Data em que a contagem está sendo realizada (preenchida automaticamente com a data atual).
3.  Após preencher todos os campos, o botão "Iniciar Contagem" é habilitado.
4.  Ao clicar, o usuário é redirecionado para a tela principal de contagem (`/contagem`), e os dados da sessão são passados como parâmetros na URL.

### Tela 2: Contagem de Estoque (`/contagem`)

1.  A página exibe um cabeçalho com as informações da sessão (Responsável, Loja, Data) para contextualização.
2.  Uma **barra de pesquisa** no topo permite filtrar rapidamente a lista de produtos por nome.
3.  O conteúdo principal é um **acordeão de categorias**. Cada item do acordeão representa uma categoria de produto (ex: "PEIXES", "SOBREMESAS").
4.  O cabeçalho de cada categoria exibe um **contador de progresso** (ex: `4 / 7`), indicando quantos itens daquela categoria já foram contados.
5.  Ao abrir um item do acordeão, o usuário vê a lista de produtos daquela categoria. Cada linha de produto contém:
    - O nome do produto.
    - A unidade de medida.
    - Um campo de input para inserir a quantidade.
6.  As linhas de produtos já contados e salvos são destacadas com um fundo verde para feedback visual.
7.  Quando o usuário preenche uma ou mais quantidades em uma categoria, um botão **"Salvar Categoria"** aparece no final da seção.
8.  Ao clicar neste botão, todos os itens preenchidos naquela categoria são enviados de uma só vez para o webhook.

---

## 3. Arquitetura e Componentes Principais

O projeto é estruturado de forma modular para facilitar a manutenção e a escalabilidade.

-   **`/src/app/page.tsx`**: A página inicial. Apenas renderiza o formulário de início de sessão.
-   **`/src/app/contagem/page.tsx`**: A página de contagem. Atua como um container que renderiza o componente principal (`ContagemController`) dentro de um `<Suspense>` para uma melhor experiência de carregamento.
-   **`/src/components/PreContagemForm.tsx`**: Componente cliente que contém o formulário da tela inicial e gerencia a navegação para a página de contagem.
-   **`/src/components/ContagemController.tsx`**: O **cérebro** da aplicação. Este componente cliente é responsável por:
    - Ler os parâmetros da URL para obter os dados da sessão.
    - Chamar a função para buscar os produtos da planilha.
    - Gerenciar o estado de todos os itens da contagem (quantidades, status de "contado").
    - Filtrar os itens com base na barra de pesquisa.
    - Agrupar os itens por categoria.
    - Orquestrar o salvamento dos dados, chamando a Server Action correspondente.
-   **`/src/components/CategoryAccordion.tsx`**: Renderiza um único item do acordeão para uma categoria. Exibe o progresso e contém a lógica para renderizar as linhas de produto e o botão "Salvar Categoria".
-   **`/src/components/ProductRow.tsx`**: O componente mais granular. Exibe uma única linha de produto com o input de quantidade e reporta as mudanças para o `ContagemController`.
-   **`/src/lib/sheets.ts`**: Utilitário que contém a função `getProductsFromSheet`. Esta função é responsável por fazer o `fetch` dos dados da planilha e processar o texto CSV, transformando-o em um array de objetos `Produto`.
-   **`/src/app/actions.ts`**: Contém as **Server Actions** do Next.js. A função `submitContagemBatch` recebe os dados do frontend, formata-os e faz a chamada `fetch` segura do lado do servidor para o webhook do n8n.

---

## 4. Fluxo de Dados

### Leitura (Carregamento da Página)
1.  `ContagemController.tsx` é montado.
2.  `useEffect` dispara a chamada à função `getProductsFromSheet` em `sheets.ts`.
3.  `sheets.ts` busca o CSV do Google Sheets e o processa.
4.  O array de produtos retorna ao `ContagemController`, que inicializa seu estado.
5.  O estado é usado para renderizar os componentes `CategoryAccordion` e `ProductRow`.

### Escrita (Salvando uma Categoria)
1.  O usuário digita as quantidades nos inputs dentro de um `CategoryAccordion`.
2.  Cada `onChange` no `ProductRow` chama a função `handleQuantityChange` no `ContagemController`, que atualiza o estado central.
3.  O usuário clica no botão "Salvar Categoria".
4.  `CategoryAccordion` chama a função `handleSaveCategory` no `ContagemController`.
5.  `ContagemController` filtra os itens que precisam ser salvos e chama a Server Action `submitContagemBatch` em `actions.ts`, passando os dados.
6.  `actions.ts` executa no servidor, faz a chamada `POST` para o webhook do n8n.
7.  A Server Action retorna um resultado (sucesso/erro).
8.  `ContagemController` recebe o resultado, exibe uma notificação (toast) e atualiza o estado dos itens para `isCounted = true`, o que causa a re-renderização da UI com o feedback visual.

---

## 5. Como Executar Localmente

1.  **Instalar dependências:**
    ```bash
    pnpm install
    ```
2.  **Iniciar o servidor de desenvolvimento:**
    ```bash
    pnpm dev
    ```
3.  Acesse `http://localhost:3000` no seu navegador. 