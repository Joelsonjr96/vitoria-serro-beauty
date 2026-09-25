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
