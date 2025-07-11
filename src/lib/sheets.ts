import { Produto } from '@/types';

// URL pública da planilha Google Sheets no formato CSV
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRwgXDxiy8_P5IjRrpEtytlFww9kb3tUm81dMHnlgYGt7dmVx1W6nArmytUtD9xkSPcypuaO9B6-HoH/pub?gid=877069221&single=true&output=csv';

/**
 * Busca e processa os dados de produtos da planilha do Google Sheets.
 * @returns Uma promessa que resolve para um array de produtos.
 */
export async function getProductsFromSheet(): Promise<Produto[]> {
  try {
    // Adiciona um timestamp para evitar o cache da planilha
    const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`, {
      next: {
        revalidate: 60, // Revalida os dados a cada 60 segundos
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar dados da planilha.');
    }

    const dataCSV = await response.text();
    const produtos = parseCSV(dataCSV);

    return produtos;
  } catch (error) {
    console.error('Erro ao carregar dados da planilha:', error);
    // Em caso de erro, retorna um array vazio para não quebrar a UI
    return [];
  }
}

/**
 * Processa o texto CSV e o converte para um array de objetos Produto.
 * @param csvText O conteúdo da planilha em formato CSV.
 * @returns Um array de produtos.
 */
function parseCSV(csvText: string): Produto[] {
  const linhas = csvText.trim().split('\n');
  
  // Encontra o índice da linha de cabeçalho dinamicamente
  const headerRowIndex = linhas.findIndex(l => 
    l.toUpperCase().includes('INGREDIENTES') && 
    l.toUpperCase().includes('CATEGORIA') &&
    l.toUpperCase().includes('UND DE MEDIDA')
  );

  if (headerRowIndex === -1) {
    console.error("Cabeçalho 'INGREDIENTES,CATEGORIA,UND DE MEDIDA' não encontrado no CSV.");
    return [];
  }

  // Pega a linha do cabeçalho e as linhas de dados subsequentes
  const cabecalho = linhas[headerRowIndex].split(',').map(h => h.trim().replace(/"/g, '').toUpperCase());
  const linhasDeDados = linhas.slice(headerRowIndex + 1);

  const idxIngrediente = cabecalho.indexOf('INGREDIENTES');
  const idxCategoria = cabecalho.indexOf('CATEGORIA');
  const idxUnidade = cabecalho.indexOf('UND DE MEDIDA');

  if ([idxIngrediente, idxCategoria, idxUnidade].includes(-1)) {
    console.error("Colunas essenciais não foram encontradas no cabeçalho.");
    return [];
  }

  const produtos: Produto[] = [];
  linhasDeDados.forEach(linha => {
    const colunas = linha.split(',');
    
    // Função auxiliar para limpar e extrair o valor da coluna
    const cleanCol = (index: number) => colunas[index] ? colunas[index].trim().replace(/"/g, '') : '';

    const nome = cleanCol(idxIngrediente);
    const categoria = cleanCol(idxCategoria);
    const unidade = cleanCol(idxUnidade);

    // Adiciona o produto apenas se os campos essenciais existirem
    if (nome && categoria && unidade) {
      produtos.push({ nome, categoria, unidade });
    }
  });

  return produtos;
} 