'use server';

import { Produto } from '@/types';
import { revalidatePath } from 'next/cache';

const N8N_WEBHOOK_URL = 'https://webhookn8n.mage.technology/webhook/zaiko/ingredientes';

interface ContagemInfo {
  responsavel: string;
  loja: string;
  produto: Produto;
  quantidade: string;
}

export async function submitContagem(payload: ContagemInfo) {
  try {
    const dataToSend = {
      ...payload,
      data_contagem: new Date().toISOString(),
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro na API do n8n: ${response.status} ${errorBody}`);
    }

    revalidatePath('/contagem');
    return { success: true, message: 'Contagem enviada com sucesso!' };

  } catch (error) {
    console.error('Erro ao enviar contagem:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: errorMessage };
  }
}

interface ContagemBatchPayload {
  responsavel: string;
  loja: string;
  items: {
    produto: Produto;
    quantidade: string;
  }[];
}

export async function submitContagemBatch(payload: ContagemBatchPayload) {
  try {
    const dataToSend = {
      ...payload,
      data_contagem: new Date().toISOString(),
      is_batch: true,
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro na API do n8n (batch): ${response.status} ${errorBody}`);
    }

    revalidatePath('/contagem');
    return { success: true, message: 'Categoria salva com sucesso!' };

  } catch (error) {
    console.error('Erro ao enviar contagem em lote:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: errorMessage };
  }
} 