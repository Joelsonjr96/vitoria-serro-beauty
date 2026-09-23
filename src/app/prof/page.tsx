import ProtectedRoute from '@/components/ProtectedRoute';
import HorarioManager from '@/components/HorarioManager';
import { supabase } from '@/lib/supabase';

export default async function ProfPage() {
  const { data: agendamentos } = await supabase
    .from('agendamentos')
    .select('*, servicos(nome), horarios_disponiveis(hora_inicio)');

  const { data: horarios } = await supabase
    .from('horarios_disponiveis')
    .select('*')
    .order('data', { ascending: true })
    .order('hora_inicio', { ascending: true });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 p-6 font-sans">
        <h1 className="text-2xl font-bold mb-6 text-zinc-900">Agenda - Vitória Serro Beauty</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow-sm border border-zinc-200">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900">Agendamentos</h2>
            {agendamentos && agendamentos.length > 0 ? (
              <ul>
                {agendamentos.map((ag: any) => (
                  <li key={ag.id} className="border-b py-2">
                    <p className="font-semibold text-zinc-900">{ag.nome_cliente} - {ag.servicos?.nome}</p>
                    <p className="text-zinc-600">{ag.horarios_disponiveis?.hora_inicio}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-zinc-500">Nenhum agendamento hoje.</p>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow-sm border border-zinc-200">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900">Gerenciar Horários</h2>
            {horarios && horarios.map((h: any) => (
              <HorarioManager key={h.id} horario={h} />
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
