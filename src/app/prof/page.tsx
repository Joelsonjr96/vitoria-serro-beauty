import ProtectedRoute from '@/components/ProtectedRoute';
import HorarioManager from '@/components/HorarioManager';
import CRMManager from '@/components/CRMManager';
import NovoAgendamento from '@/components/NovoAgendamento';
import AgendamentoCard from '@/components/AgendamentoCard';
import SafeImage from '@/components/SafeImage';
import LogoutButton from '@/components/LogoutButton';
import { supabase } from '@/lib/supabase';
import { Agendamento, Servico } from '@/types/allTypes';

export const revalidate = 0; // Força a página a buscar dados frescos sempre

export default async function ProfPage() {
  const today = new Date().toISOString().split('T')[0];

  // Busca dados em paralelo
  const [agendamentosRes, horariosRes, servicosRes] = await Promise.all([
    supabase
      .from('agendamentos')
      .select('*, servicos(nome, preco), horarios_disponiveis(data, hora_inicio)')
      .neq('status', 'cancelado'),
    supabase
      .from('horarios_disponiveis')
      .select('*')
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true }),
    supabase
      .from('servicos')
      .select('*')
      .order('nome', { ascending: true }),
  ]);

  const rawList = (agendamentosRes.data as Agendamento[]) || [];
  const horarios = horariosRes.data || [];
  const servicos = (servicosRes.data as Servico[]) || [];

  // Ordenação rigorosa: Data Crescente -> Hora Crescente
  const agendamentos = rawList.sort((a, b) => {
    const dataA = a.horarios_disponiveis?.data || '';
    const dataB = b.horarios_disponiveis?.data || '';
    if (dataA !== dataB) return dataA.localeCompare(dataB);

    const horaA = a.horarios_disponiveis?.hora_inicio || '';
    const horaB = b.horarios_disponiveis?.hora_inicio || '';
    return horaA.localeCompare(horaB);
  }) as Agendamento[];

  // Métricas para o Dashboard
  const agendamentosHoje = agendamentos.filter(ag => ag.horarios_disponiveis?.data === today && ag.status !== 'cancelado');
  const faturamentoHoje = agendamentosHoje.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

  // Métrica da Semana (próximos 7 dias a partir de hoje)
  const umaSemanaDepois = new Date();
  umaSemanaDepois.setDate(umaSemanaDepois.getDate() + 7);
  const umaSemanaDepoisStr = umaSemanaDepois.toISOString().split('T')[0];

  const agendamentosSemana = agendamentos.filter(ag => {
    const dataAg = ag.horarios_disponiveis?.data || '';
    return dataAg >= today && dataAg <= umaSemanaDepoisStr && ag.status !== 'cancelado';
  });
  const faturamentoSemana = agendamentosSemana.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

  // Total Pendente (tudo o que está confirmado e não concluído/cancelado de hoje em diante)
  const agendamentosPendentes = agendamentos.filter(ag => {
    const dataAg = ag.horarios_disponiveis?.data || '';
    return dataAg >= today && ag.status === 'confirmado';
  });
  const faturamentoPendente = agendamentosPendentes.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

  // Encontrar próxima cliente hoje (que não foi cancelada)
  const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const proximaCliente = agendamentosHoje
    .filter(ag => {
      const hora = ag.horarios_disponiveis?.hora_inicio;
      return hora && hora >= agora && ag.status === 'confirmado';
    })
    .sort((a, b) => (a.horarios_disponiveis?.hora_inicio || '').localeCompare(b.horarios_disponiveis?.hora_inicio || ''))[0];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary p-6 md:p-12 font-sans text-text-main" suppressHydrationWarning>
        <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-accent-lavender pb-8">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-accent-lavender/30">
               <SafeImage
                 src="/images/branding/logo-preta.png"
                 alt="Logo"
                 width={100}
                 height={60}
                 className="h-16 w-auto object-contain"
               />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-text-main">Minha Agenda</h1>
              <p className="text-text-muted text-sm font-medium italic">Painel Administrativo Vitória Serro Beauty</p>
            </div>
            <LogoutButton />
          </div>

          {/* DASHBOARD RÁPIDO */}
          <div className="flex flex-wrap gap-3" suppressHydrationWarning>
            <div className="bg-bg-card border border-accent-lavender px-5 py-3 rounded-[16px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">Hoje</p>
              <p className="text-xl font-serif text-text-main">{agendamentosHoje.length} <span className="text-xs font-sans text-text-muted">atend.</span></p>
              <p className="text-xs font-medium text-emerald-700">R$ {faturamentoHoje.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-5 py-3 rounded-[16px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">Na Semana</p>
              <p className="text-xl font-serif text-text-main">{agendamentosSemana.length} <span className="text-xs font-sans text-text-muted">atend.</span></p>
              <p className="text-xs font-medium text-emerald-700">R$ {faturamentoSemana.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-5 py-3 rounded-[16px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">Total Pendente</p>
              <p className="text-xl font-serif text-text-main">{agendamentosPendentes.length} <span className="text-xs font-sans text-text-muted">atend.</span></p>
              <p className="text-xs font-medium text-button-bg">R$ {faturamentoPendente.toFixed(2)}</p>
            </div>
          </div>
        </header>

        {/* PRÓXIMA CLIENTE ALERTA */}
        {proximaCliente && (
          <div className="max-w-6xl mx-auto mb-8 bg-bg-lavender-soft border border-button-bg/30 p-4 rounded-[16px] flex items-center gap-4 animate-in">
            <span className="text-2xl animate-pulse">⏳</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-button-bg">Próxima Cliente agora</p>
              <p className="text-text-main font-medium">
                <span className="font-bold">{proximaCliente.nome_cliente}</span> - {proximaCliente.horarios_disponiveis?.hora_inicio.slice(0, 5)} ({proximaCliente.servicos?.nome})
              </p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Coluna de Agendamentos */}
          <section className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Fila de Atendimentos
              </h2>

              <NovoAgendamento servicos={servicos} />

              <div className="grid gap-4">
                {agendamentos.length > 0 ? (
                  agendamentos.map((ag) => (
                    <AgendamentoCard key={ag.id} agendamento={ag} />
                  ))
                ) : (
                  <div className="bg-bg-card p-12 rounded-[24px] border border-dashed border-accent-lavender text-center">
                    <p className="text-text-muted italic">Nenhum agendamento encontrado.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Nova Seção: CRM */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                👥 Cadastro e Histórico de Clientes
              </h2>
              <div className="bg-bg-card p-8 rounded-[28px] border border-accent-lavender shadow-sm">
                <CRMManager agendamentos={agendamentos} />
              </div>
            </div>
          </section>

          {/* Coluna de Gestão de Horários Reformulada */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
              🗓️ Bloqueio de Agenda
            </h2>
            <div className="bg-bg-card p-8 rounded-[28px] border border-accent-lavender shadow-sm sticky top-24">
              <HorarioManager initialHorarios={horarios.filter(h => h.data > today || (h.data === today && h.hora_inicio >= agora)) || []} />
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}
