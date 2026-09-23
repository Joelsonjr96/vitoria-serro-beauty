export interface Agendamento {
  id: string;
  servico_id: string;
  horario_id: string;
  nome_cliente: string;
  telefone_cliente: string;
  status: 'confirmado' | 'cancelado';
  criado_em: string;
}
