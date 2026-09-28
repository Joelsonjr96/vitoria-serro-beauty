'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import HorarioManager from '@/components/HorarioManager';
import CRMManager from '@/components/CRMManager';
import NovoAgendamento from '@/components/NovoAgendamento';
import AgendamentoCard from '@/components/AgendamentoCard';
import SafeImage from '@/components/SafeImage';
import LogoutButton from '@/components/LogoutButton';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useState } from 'react';
import { getSaoPauloDate, calculateMetrics, parseAgendamento } from '@/lib/utils';

export default function ProfPage() {
  const { agendamentos: rawAgendamentos, horarios, servicos, loading } = useDashboardStats();
  const [clientes, setClientes] = useState<any[]>([]); // TODO: move to hook

  const agendamentos = rawAgendamentos.map(parseAgendamento);

  if (loading) return <div className="min-h-screen bg-bg-primary flex items-center justify-center">Carregando...</div>;

  const VALID_STATUS = ['confirmado', 'concluido', 'confirmed', 'completed'];
  const agendamentosValidos = agendamentos.filter(ag => VALID_STATUS.includes((ag.status || '').toLowerCase()));
  const uniqueAgendamentos = Array.from(new Map(agendamentosValidos.map(ag => [ag.id, ag])).values());

  const now = new Date();
  const todayStr = getSaoPauloDate(now);
  const agora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

  const firstDayOfMonth = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  firstDayOfMonth.setDate(1);
  const startOfMonthStr = getSaoPauloDate(firstDayOfMonth);

  const lastDayOfMonth = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1, 0);
  const endOfMonthStr = getSaoPauloDate(lastDayOfMonth);

  const datePlus7 = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  datePlus7.setDate(datePlus7.getDate() + 7);
  const endOfWeekStr = getSaoPauloDate(datePlus7);

  const startOfWeek = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  const startOfWeekStr = getSaoPauloDate(startOfWeek);

  const statsHoje = calculateMetrics(uniqueAgendamentos, todayStr, todayStr);
  const statsSemana = calculateMetrics(uniqueAgendamentos, startOfWeekStr, endOfWeekStr);
  const statsMes = calculateMetrics(uniqueAgendamentos, startOfMonthStr, endOfMonthStr);
  const statsConfirmados = calculateMetrics(uniqueAgendamentos, todayStr, '9999-12-31');

  const agendamentosPendentes = agendamentos.filter(ag => ag.status === 'pendente');
  const faturamentoPendentes = agendamentosPendentes.reduce((acc, ag) => acc + (ag as any).valor, 0);


  const proximaCliente = Array.from(uniqueAgendamentos.values())
    .filter(ag => {
        const data = ag.horarios_disponiveis?.data;
        const hora = ag.horarios_disponiveis?.hora_inicio;
        return data === todayStr && hora && hora >= agora && ag.status === 'confirmado';
    })
    .sort((a, b) => (a.horarios_disponiveis?.hora_inicio || '').localeCompare(b.horarios_disponiveis?.hora_inicio || ''))[0];

  // Estrutura de Alertas Dinâmica
  interface Alerta {
    id: string;
    titulo: string;
    mensagem: string;
    link: string;
    textoBotao: string;
    prioridade: number;
    icone: string;
  }

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const amanhaStr = amanha.toISOString().split('T')[0];
  const horariosDisponiveisAmanha = horarios.filter(h => h.data === amanhaStr && h.status === 'livre');

  const limiteInativo = new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000);
  const clientesInativos = clientes.filter(c => {
    const ultimosAgendamentos = agendamentos
      .filter(a => a.telefone_cliente === c.telefone)
      .sort((a, b) => new Date(b.horarios_disponiveis?.data || '').getTime() - new Date(a.horarios_disponiveis?.data || '').getTime());

    if (ultimosAgendamentos.length === 0) return true;
    const dataUltima = new Date(ultimosAgendamentos[0].horarios_disponiveis?.data || '');
    return dataUltima < limiteInativo;
  });

  const alertas: Alerta[] = [
    agendamentosPendentes.length > 0 && {
      id: 'pendentes',
      titulo: 'Confirmações Pendentes',
      mensagem: `${agendamentosPendentes.length} agendamento(s) aguardando confirmação`,
      link: '#fila-atendimentos',
      textoBotao: 'Confirmar',
      prioridade: 1,
      icone: '🔔'
    },
    horariosDisponiveisAmanha.length > 0 && {
      id: 'vagas',
      titulo: 'Agenda Amanhã',
      mensagem: `${horariosDisponiveisAmanha.length} vaga(s) disponível(is)`,
      link: '#bloqueio-agenda',
      textoBotao: 'Agenda',
      prioridade: 2,
      icone: '📅'
    },
    clientesInativos.length > 0 && {
      id: 'inativos',
      titulo: 'Clientes para Reativar',
      mensagem: `${clientesInativos.length} cliente(s) inativo(s) (>60d)`,
      link: '#crm-section',
      textoBotao: 'Clientes',
      prioridade: 3,
      icone: '🔄'
    }
  ].filter(Boolean) as Alerta[];

  alertas.sort((a, b) => a.prioridade - b.prioridade);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-bg-primary p-4 md:p-12 font-sans text-text-main overflow-x-hidden" suppressHydrationWarning>
        <header className="w-full max-w-7xl mx-auto mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 border-b border-accent-lavender pb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-1 rounded-lg shadow-sm border border-accent-lavender/30">
                <SafeImage
                  src="/images/branding/logo-preta.png"
                  alt="Logo"
                  width={60}
                  height={36}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-serif text-text-main">Minha Agenda</h1>
                <p className="text-text-muted text-[10px] font-medium uppercase tracking-wider">Painel Administrativo</p>
              </div>
            </div>
            <LogoutButton />
          </div>

          {/* ÁREA DE ATENÇÃO */}
          {alertas.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-amber-800 flex items-center gap-2 mb-3">
                ⚠️ Atenção
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {alertas.map(alerta => (
                  <div key={alerta.id} className="bg-white p-3 rounded-lg shadow-sm border border-amber-100 flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[10px] font-bold text-amber-900 uppercase tracking-tighter">{alerta.icone} {alerta.titulo}</p>
                        <p className="text-[11px] font-medium text-text-main">{alerta.mensagem}</p>
                    </div>
                    <a href={alerta.link} className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded whitespace-nowrap">{alerta.textoBotao}</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DASHBOARD RÁPIDO */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full" suppressHydrationWarning>
            <div className="bg-bg-card border border-accent-lavender px-3 py-2 rounded-lg shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-0.5">Hoje</p>
              <p className="text-sm font-serif text-text-main">{statsHoje.count}</p>
              <p className="text-[10px] font-medium text-emerald-700">R$ {statsHoje.total.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-3 py-2 rounded-lg shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-0.5">Semana</p>
              <p className="text-sm font-serif text-text-main">{statsSemana.count}</p>
              <p className="text-[10px] font-medium text-emerald-700">R$ {statsSemana.total.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-3 py-2 rounded-lg shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-0.5">Mês</p>
              <p className="text-sm font-serif text-text-main">{statsMes.count}</p>
              <p className="text-[10px] font-medium text-emerald-700">R$ {statsMes.total.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-3 py-2 rounded-lg shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-0.5">Confirmados</p>
              <p className="text-sm font-serif text-text-main">{statsConfirmados.count}</p>
              <p className="text-[10px] font-medium text-button-bg">R$ {statsConfirmados.total.toFixed(2)}</p>
            </div>

            <div className="bg-bg-card border border-accent-lavender px-3 py-2 rounded-lg shadow-sm">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold mb-0.5">Pendentes</p>
              <p className="text-sm font-serif text-text-main">{agendamentosPendentes.length}</p>
              <p className="text-[10px] font-medium text-amber-600">R$ {faturamentoPendentes.toFixed(2)}</p>
            </div>
          </div>
        </header>

        {/* PRÓXIMA CLIENTE ALERTA */}
        <div className="w-full max-w-7xl mx-auto">
          {proximaCliente && (
            <div className="mb-8 bg-bg-lavender-soft border border-button-bg/30 p-4 rounded-[16px] flex items-center gap-4 animate-in">
              <span className="text-2xl animate-pulse">⏳</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-button-bg">Próxima Cliente agora</p>
                <p className="text-text-main font-medium">
                  <span className="font-bold">{proximaCliente.nome_cliente}</span> - {proximaCliente.horarios_disponiveis?.hora_inicio.slice(0, 5)} ({proximaCliente.servicos?.nome})
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Coluna de Agendamentos */}
          <section className="lg:col-span-2 space-y-12">
            <div id="fila-atendimentos" className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Fila de Atendimentos
              </h2>

              <NovoAgendamento servicos={servicos} />

              <div className="grid gap-4">
                {agendamentos.filter(ag => ag.status !== 'concluido').length > 0 ? (
                  agendamentos.filter(ag => ag.status !== 'concluido').map((ag) => (
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
            <div id="crm-section" className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                👥 Cadastro e Histórico de Clientes
              </h2>
              <div className="bg-bg-card p-8 rounded-[28px] border border-accent-lavender shadow-sm">
                <CRMManager agendamentos={agendamentos} />
              </div>
            </div>
          </section>

          {/* Coluna de Gestão de Horários Reformulada */}
          <section id="bloqueio-agenda" className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
              🗓️ Bloqueio de Agenda
            </h2>
            <div className="bg-bg-card p-8 rounded-[28px] border border-accent-lavender shadow-sm sticky top-24">
              <HorarioManager initialHorarios={horarios.filter(h => h.data > todayStr || (h.data === todayStr && h.hora_inicio >= agora)) || []} />
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
}