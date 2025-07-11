import { PreContagemForm } from '@/components/PreContagemForm';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Contagem de Estoque Takematsu</h1>
        <p className="text-gray-500">Bem-vindo ao sistema de contagem de estoque.</p>
      </div>
      <PreContagemForm />
    </main>
  );
}
