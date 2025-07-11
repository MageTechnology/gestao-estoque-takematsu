import { ContagemController } from '@/components/ContagemController';
import { Suspense } from 'react';

// Componente de Carregamento para uma melhor UX
function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <p>Carregando dados da contagem...</p>
    </div>
  );
}

export default function ContagemPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <Suspense fallback={<Loading />}>
        <ContagemController />
      </Suspense>
    </main>
  );
} 