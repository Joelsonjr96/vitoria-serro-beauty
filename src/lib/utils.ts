export function formatarDataBrasileira(dataISO: string): string {
  const data = new Date(dataISO + 'T12:00:00'); // Evita problemas de fuso horário ao converter apenas data YYYY-MM-DD

  const diasSemana = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const diaSemana = diasSemana[data.getDay()];
  const diaMes = data.getDate();
  const mes = meses[data.getMonth()];

  return `${diaSemana}, ${diaMes} de ${mes}`;
}

export function formatarDataCurta(dataISO: string): string {
  const data = new Date(dataISO + 'T12:00:00');
  const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][data.getDay()];
  const diaMes = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');

  return `${diaSemana}, ${diaMes}/${mes}`;
}

export function formatarTelefone(telefone: string): string {
  const t = telefone.replace(/\D/g, '');
  if (t.length === 11) {
    return `(${t.slice(0, 2)}) ${t.slice(2, 7)}-${t.slice(7)}`;
  } else if (t.length === 10) {
    return `(${t.slice(0, 2)}) ${t.slice(2, 6)}-${t.slice(6)}`;
  }
  return telefone;
}

export function getSaoPauloDate(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

export function calculateMetrics(agendamentos: any[], startDateStr: string, endDateStr: string) {
  let count = 0;
  let total = 0;

  for (const ag of agendamentos) {
    const rawData = ag.horarios_disponiveis?.data || (ag as any).data;
    const agDataStr = rawData ? String(rawData).slice(0, 10) : null;

    if (agDataStr && agDataStr >= startDateStr && agDataStr <= endDateStr) {
      count++;
      total += getAgendamentoValor(ag);
    }
  }
  return { count, total };
}

export function getAgendamentoValor(agendamento: any): number {
  let valor = Number(agendamento.valor_total || agendamento.preco || agendamento.total || 0);

  if (!valor && Array.isArray(agendamento.servicos)) {
    valor = agendamento.servicos.reduce((sum: number, s: any) => sum + Number(s.preco || 0), 0);
  } else if (!valor && agendamento.servicos?.preco) {
    valor = Number(agendamento.servicos.preco);
  }
  return valor;
}

export function parseAgendamento(ag: any) {
  return {
    ...ag,
    valor: getAgendamentoValor(ag),
    servicoNome: ag.servicos?.nome || 'Serviço não definido'
  };
}
