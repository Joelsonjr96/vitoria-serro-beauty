import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function AgendadoPage({
  params,
}: {
  params: Promise<{ horarioId: string }>;
}) {
  const { horarioId } = await params;

  // Busca detalhes do horário (poderia buscar o agendamento completo,
  // mas aqui só mostra a confirmação simples como escopo)
  const { data: horario, error } = await supabase
    .from('horarios_disponiveis')
    .select('*')
    .eq('id', horarioId)
    .single();

  if (error || !horario) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-sm border border-zinc-200 text-center max-w-sm">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Agendado!</h1>
        <p className="text-zinc-600 mb-6">
          Seu horário foi confirmado para o dia {horario.data} às {horario.hora_inicio}.
        </p>
        <p className="text-sm text-zinc-500">
          Lembre-se de seguir as orientações do estúdio.
        </p>
      </div>
    </div>
  );
}
