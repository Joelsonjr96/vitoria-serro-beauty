import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data: servicos, error } = await supabase.from('servicos').select('*');

  if (error) {
    console.error('Error fetching services:', error);
    return <div className="p-6 text-red-600">Erro ao carregar serviços.</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Vitória Serro Beauty</h1>
        <p className="text-zinc-600">Escolha um serviço para agendar</p>
      </header>

      <main className="grid gap-4">
        {servicos && servicos.length > 0 ? (
          servicos.map((servico) => (
            <div key={servico.id} className="bg-white p-4 rounded shadow-sm border border-zinc-200">
              <h2 className="text-lg font-semibold text-zinc-900">{servico.nome}</h2>
              <p className="text-zinc-600">Duração: {servico.duracao_minutos} min</p>
              <p className="font-bold text-zinc-900">R$ {Number(servico.preco).toFixed(2)}</p>
              <Link
                href={`/agendar/${servico.id}`}
                className="mt-4 block w-full bg-zinc-900 text-white py-2 rounded text-center"
              >
                Selecionar
              </Link>
            </div>
          ))
        ) : (
          <p className="text-zinc-500">Nenhum serviço disponível no momento.</p>
        )}
      </main>
    </div>
  );
}