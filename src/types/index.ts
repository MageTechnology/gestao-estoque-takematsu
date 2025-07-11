export interface Produto {
  nome: string;
  categoria: string;
  unidade: string;
}

export interface Categoria {
  nome: string;
  produtos: Produto[];
} 