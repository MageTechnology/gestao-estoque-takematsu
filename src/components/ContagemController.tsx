'use client';

import { useEffect, useState, useMemo, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProductsFromSheet } from '@/lib/sheets';
import type { Produto } from '@/types';
import { CategoryAccordion } from './CategoryAccordion';
import { Input } from './ui/input';
import { submitContagemBatch } from '@/app/actions';
import { toast } from 'sonner';

// Novo tipo para gerenciar o estado de cada item da contagem
type ContagemItem = Produto & {
  quantidade: string;
  isCounted: boolean;
};

export function ContagemController() {
  const searchParams = useSearchParams();
  const [contagemItems, setContagemItems] = useState<ContagemItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, startTransition] = useTransition();

  // Lê os dados da sessão da URL
  const responsavel = searchParams.get('responsavel') || 'N/A';
  const loja = searchParams.get('loja') || 'N/A';
  const data = searchParams.get('data') || 'N/A';

  // Efeito para buscar os dados da planilha na montagem do componente
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const produtosDaPlanilha = await getProductsFromSheet();
      const itemsParaContagem = produtosDaPlanilha.map(p => ({
        ...p,
        quantidade: '',
        isCounted: false,
      }));
      setContagemItems(itemsParaContagem);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleQuantityChange = (itemName: string, newQuantity: string) => {
    setContagemItems(prevItems =>
      prevItems.map(item =>
        item.nome === itemName ? { ...item, quantidade: newQuantity } : item
      )
    );
  };
  
  const handleSaveCategory = (categoryName: string) => {
    const itemsToSave = contagemItems.filter(item => 
      item.categoria === categoryName && item.quantidade && !item.isCounted
    );

    if (itemsToSave.length === 0) {
      toast.info('Nenhum item novo para salvar nesta categoria.');
      return;
    }

    startTransition(async () => {
      const result = await submitContagemBatch({
        responsavel,
        loja,
        items: itemsToSave.map(item => ({
          produto: {
            nome: item.nome,
            categoria: item.categoria,
            unidade: item.unidade,
          },
          quantidade: item.quantidade,
        })),
      });

      if (result.success) {
        toast.success(result.message);
        // Marcar itens como contados
        setContagemItems(prevItems =>
          prevItems.map(item =>
            itemsToSave.some(savedItem => savedItem.nome === item.nome)
              ? { ...item, isCounted: true }
              : item
          )
        );
      } else {
        toast.error(result.message);
      }
    });
  };

  const filteredItems = useMemo(() => {
    if (!searchTerm) return contagemItems;
    return contagemItems.filter(item => 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, contagemItems]);

  // Agrupa os itens por categoria para renderizar o acordeão
  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const { categoria } = item;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(item);
      return acc;
    }, {} as Record<string, ContagemItem[]>);
  }, [filteredItems]);

  if (isLoading) {
    return <div className="text-center p-8">Carregando produtos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg bg-slate-50">
        <h1 className="text-2xl font-bold">Sessão de Contagem</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-2">
          <p><strong>Responsável:</strong> {responsavel}</p>
          <p><strong>Loja:</strong> {loja}</p>
          <p><strong>Data:</strong> {data}</p>
        </div>
      </div>
      
      <div>
        <Input
          placeholder="Pesquisar ingrediente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>

      <div className="space-y-4">
        {Object.keys(groupedItems).length > 0 ? (
          Object.keys(groupedItems).sort().map(categoryName => (
            <CategoryAccordion
              key={categoryName}
              categoryName={categoryName}
              items={groupedItems[categoryName]}
              onQuantityChange={handleQuantityChange}
              onSaveCategory={handleSaveCategory}
              isSaving={isSaving}
            />
          ))
        ) : (
          <div className="text-center p-8 border-dashed border-2 rounded-lg text-muted-foreground">
            <p>Nenhum item encontrado para sua busca.</p>
          </div>
        )}
      </div>
    </div>
  );
} 