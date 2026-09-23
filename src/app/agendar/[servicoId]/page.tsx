import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AgendamentoForm from '@/components/AgendamentoForm';

export default async function AgendarPage({
  params,
}: {
  params: Promise<{ servicoId: string }>;
}) {
  const { servicoId } = await params;

  // Busca o serviço
  const { data: servico, error: servicoError } = await supabase
    .from('servicos')
    .select('*')
    .eq('id', servicoId)
    .single();

  if (servicoError || !servico) {
    notFound();
  }

  // Busca horários livres
  const { data: horariosDisponiveis } = await supabase
    .from('horarios_disponiveis')
    .select('*')
    .eq('status', 'livre')
    .order('data', { ascending: true })
    .order('hora_inicio', { ascending: true });

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">{servico.nome}</h1>
        <p className="text-zinc-600">Selecione um horário disponível</p>
      </header>

      <main className="grid gap-4">
        {horariosDisponiveis && horariosDisponiveis.length > 0 ? (
          horariosDisponiveis.map((horario) => (
            <AgendamentoForm
              key={horario.id}
              servico={servico}
              horario={horario}
            />
          ))
        ) : (
          <p className="text-zinc-500">Nenhum horário disponível.</p>
        )}
      </main>
    </div>
  );
}