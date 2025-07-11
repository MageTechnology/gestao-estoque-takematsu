'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export function PreContagemForm() {
  const router = useRouter();
  const [responsavel, setResponsavel] = useState('');
  const [loja, setLoja] = useState('');
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleStart = () => {
    const params = new URLSearchParams({
      responsavel,
      loja,
      data,
    });
    router.push(`/contagem?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Nova Contagem de Estoque</CardTitle>
        <CardDescription>Preencha os dados da sessão para começar.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável</Label>
            <Input
              id="responsavel"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Seu nome"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loja">Loja</Label>
            <Input
              id="loja"
              value={loja}
              onChange={(e) => setLoja(e.target.value)}
              placeholder="Nome da loja"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data da Contagem</Label>
            <Input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <Button
            onClick={handleStart}
            className="w-full"
            disabled={!responsavel || !loja || !data}
          >
            Iniciar Contagem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 