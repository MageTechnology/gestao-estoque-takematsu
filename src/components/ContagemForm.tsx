'use client';

import { useState, useTransition } from 'react';
import { Produto } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2 } from 'lucide-react';
import { submitContagem } from '@/app/actions';
import { toast } from 'sonner';

interface ContagemFormProps {
  produtos: Produto[];
}

export function ContagemForm({ produtos }: ContagemFormProps) {
  const [responsavel, setResponsavel] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleGoToSelection = () => {
    setProdutoSelecionado(null);
    setQuantidade('');
  };

  const handleSelectProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!produtoSelecionado || !responsavel || !quantidade) return;

    startTransition(async () => {
      const result = await submitContagem({
        responsavel,
        produto: produtoSelecionado,
        quantidade,
      });

      if (result.success) {
        toast.success(result.message);
        handleGoToSelection(); // Volta para a tela de seleção
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Contagem de Estoque</CardTitle>
        <CardDescription>
          {!produtoSelecionado
            ? 'Digite para buscar um ingrediente e selecioná-lo.'
            : 'Informe a quantidade para o item selecionado.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="responsavel">1. Responsável</Label>
            <Input
              id="responsavel"
              placeholder="Digite seu nome"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          {!produtoSelecionado ? (
            <div className="space-y-2">
              <Label>2. Ingrediente</Label>
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Buscar ingrediente..." />
                <CommandList>
                  <CommandEmpty>Nenhum ingrediente encontrado.</CommandEmpty>
                  <CommandGroup>
                    {produtos.map((produto) => (
                      <CommandItem
                        key={produto.nome}
                        value={produto.nome}
                        onSelect={() => handleSelectProduto(produto)}
                      >
                        {produto.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          ) : (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label>2. Ingrediente Selecionado</Label>
                <Button variant="link" size="sm" onClick={handleGoToSelection} className="h-auto p-0" type="button">
                  Trocar item
                </Button>
              </div>
              <div className="border rounded-md px-3 py-2 bg-muted text-sm">
                <p className="font-medium">{produtoSelecionado.nome}</p>
                <p className="text-xs text-muted-foreground">{produtoSelecionado.categoria}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantidade">3. Nova Quantidade ({produtoSelecionado.unidade})</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="0.00"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  required
                  disabled={isPending}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!responsavel || !produtoSelecionado || !quantidade || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Atualização'
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 