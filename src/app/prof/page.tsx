import ProtectedRoute from '@/components/ProtectedRoute';
import HorarioManager from '@/components/HorarioManager';
import CRMManager from '@/components/CRMManager';
import NovoAgendamento from '@/components/NovoAgendamento';
import AgendamentoCard from '@/components/AgendamentoCard';
import SafeImage from '@/components/SafeImage';
import LogoutButton from '@/components/LogoutButton';
import { supabase } from '@/lib/supabase';
import { Agendamento, Servico } from '@/types/allTypes';

export const revalidate = 0;

export default async function ProfPage() {
  const today = new Date().toISOString().split('T')[0];

  // Busca dados em paralelo
  const [agendamentosRes, horariosRes, servicosRes, clientesRes] = await Promise.all([
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
    supabase
      .from('clientes')
      .select('*'),
  ]);

  const rawList = (agendamentosRes.data as Agendamento[]) || [];
  const horarios = horariosRes.data || [];
  const servicos = (servicosRes.data as Servico[]) || [];
  const clientes = clientesRes.data || [];

  // Ordenação rigorosa: Data Crescente -> Hora Crescente
  const agendamentos = rawList.sort((a, b) => {
    const dataA = a.horarios_disponiveis?.data || '';
    const dataB = b.horarios_disponiveis?.data || '';
    if (dataA !== dataB) return dataA.localeCompare(dataB);

    const horaA = a.horarios_disponiveis?.hora_inicio || '';
    const horaB = b.horarios_disponiveis?.hora_inicio || '';
    return horaA.localeCompare(horaB);
  }) as Agendamento[];

  // Métricas de Atenção
  const agendamentosPendentes = agendamentos.filter(ag => ag.status === 'pendente');

  const hoje = new Date();
  const limiteInativo = new Date(hoje.getTime() - 60 * 24 * 60 * 60 * 1000);

  const clientesInativos = clientes.filter(c => {
    const ultimosAgendamentos = agendamentos
      .filter(a => a.telefone_cliente === c.telefone)
      .sort((a, b) => new Date(b.horarios_disponiveis?.data || '').getTime() - new Date(a.horarios_disponiveis?.data || '').getTime());

    if (ultimosAgendamentos.length === 0) return true; // Nunca agendou
    const dataUltima = new Date(ultimosAgendamentos[0].horarios_disponiveis?.data || '');
    return dataUltima < limiteInativo;
  });

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const amanhaStr = amanha.toISOString().split('T')[0];
  const horariosDisponiveisAmanha = horarios.filter(h => h.data === amanhaStr && h.status === 'livre');

  // Métricas para o Dashboard
  const agendamentosHoje = agendamentos.filter(ag => ag.horarios_disponiveis?.data === today);
  const faturamentoHoje = agendamentosHoje.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

  // Métrica da Semana
  const umaSemanaDepois = new Date();
  umaSemanaDepois.setDate(umaSemanaDepois.getDate() + 7);
  const umaSemanaDepoisStr = umaSemanaDepois.toISOString().split('T')[0];

  const agendamentosSemana = agendamentos.filter(ag => {
    const dataAg = ag.horarios_disponiveis?.data || '';
    return dataAg >= today && dataAg <= umaSemanaDepoisStr;
  });
  const faturamentoSemana = agendamentosSemana.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

  // Métrica do Mês
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

  const agendamentosMes = agendamentos.filter(ag => {
    const dataAg = ag.horarios_disponiveis?.data || '';
    return dataAg >= startOfMonth && dataAg <= endOfMonth;
  });
  const faturamentoMes = agendamentosMes.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

  // Status Separados
  const agendamentosConfirmados = agendamentos.filter(ag => ag.status === 'confirmado' && ag.horarios_disponiveis?.data >= today);
  const faturamentoConfirmados = agendamentosConfirmados.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

  const agendamentosPendentes = agendamentos.filter(ag => ag.status === 'pendente');
  const faturamentoPendentes = agendamentosPendentes.reduce((acc, ag) => acc + Number(ag.servicos?.preco || 0), 0);

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
        <header className="max-w-6xl mx-auto mb-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-accent-lavender pb-8">
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
          </div>

          {/* ÁREA DE ATENÇÃO */}
          {(agendamentosPendentes.length > 0 || clientesInativos.length > 0 || horariosDisponiveisAmanha.length > 0) && (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-[24px]">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-2 mb-6">
                ⚠️ Atenção
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {agendamentosPendentes.length > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex flex-col justify-between">
                    <p className="text-sm font-medium text-text-main mb-3">{agendamentosPendentes.length} agendamento(s) aguardando confirmação</p>
                    <a href="#fila-atendimentos" className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg w-fit">Confirmar</a>
                  </div>
                )}
                {clientesInativos.length > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex flex-col justify-between">
                    <p className="text-sm font-medium text-text-main mb-3">{clientesInativos.length} cliente(s) sem agendar há > 60 dias</p>
                    <a href="#crm-section" className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg w-fit">Ver clientes</a>
                  </div>
                )}
                {horariosDisponiveisAmanha.length > 0 && (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100 flex flex-col justify-between">
                    <p className="text-sm font-medium text-text-main mb-3">{horariosDisponiveisAmanha.length} horário(s) disponíveis amanhã</p>
                    <a href="#bloqueio-agenda" className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg w-fit">Ver agenda</a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DASHBOARD RÁPIDO */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3" suppressHydrationWarning>
            <div className="bg-bg-card border border-accent-lavender px-4 py-3 rounded-[16px] shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-1">Hoje</p>
              <p className="text-lg font-serif text-text-main">{agendamentosHoje.length}</p>
              <p className="text-[10px] font-medium text-emerald-700">R$ {faturamentoHoje.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-4 py-3 rounded-[16px] shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-1">Esta Semana</p>
              <p className="text-lg font-serif text-text-main">{agendamentosSemana.length}</p>
              <p className="text-[10px] font-medium text-emerald-700">R$ {faturamentoSemana.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-4 py-3 rounded-[16px] shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-1">Este Mês</p>
              <p className="text-lg font-serif text-text-main">{agendamentosMes.length}</p>
              <p className="text-[10px] font-medium text-emerald-700">R$ {faturamentoMes.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-4 py-3 rounded-[16px] shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-1">Confirmados</p>
              <p className="text-lg font-serif text-text-main">{agendamentosConfirmados.length}</p>
              <p className="text-[10px] font-medium text-button-bg">R$ {faturamentoConfirmados.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-4 py-3 rounded-[16px] shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-1">Aguardando Conf.</p>
              <p className="text-lg font-serif text-text-main">{agendamentosPendentes.length}</p>
              <p className="text-[10px] font-medium text-amber-600">R$ {faturamentoPendentes.toFixed(2)}</p>
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
            {/* Nova Seção: CRM */}
            <div id="crm-section" className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                👥 Cadastro e Histórico de Clientes
              </h2>
              <div className="bg-bg-card p-8 rounded-[28px] border border-accent-lavender shadow-sm">
                <CRMManager agendamentos={agendamentos} />
              </div>
            </div>

            <div id="fila-atendimentos" className="space-y-6">
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
          </section>

          {/* Coluna de Gestão de Horários Reformulada */}
          <section id="bloqueio-agenda" className="space-y-6">
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
