import { Servico } from './servico';
import { HorarioDisponivel } from './horario';

export interface Agendamento {
  id: string;
  servico_id: string;
  horario_id: string;
  nome_cliente: string;
  telefone_cliente: string;
  anamnese?: {
    alergias?: string;
    alergiaCosmeticos?: string;
    usoUnhasGel?: boolean;
    sensibilidade?: boolean;
    gravidez?: boolean;
    observacoes?: string;
  };
  status: 'confirmado' | 'cancelado' | 'pendente' | 'concluido' | 'em_atendimento' | 'nao_compareceu';
  criado_em: string;
  servicos?: Servico;
  horarios_disponiveis?: HorarioDisponivel;
}
