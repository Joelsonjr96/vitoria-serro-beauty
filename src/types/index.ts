export type Servico = {
  id: string;
  nome: string;
  duracao_minutos: number;
  preco: number;
};

export type HorarioDisponivel = {
  id: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  status: 'livre' | 'ocupado';
};

export type Agendamento = {
  id: string;
  servico_id: string;
  horario_id: string;
  nome_cliente: string;
  telefone_cliente: string;
  anamnese?: {
    alergias?: string;
    sensibilidade?: boolean;
    gravidez?: boolean;
    observacoes?: string;
  };
  status: 'confirmado' | 'cancelado' | 'pendente' | 'concluido';
  criado_em: string;
  servicos?: Servico;
  horarios_disponiveis?: HorarioDisponivel;
};
