import { HorarioDisponivel } from '../types/horario';

export const horarios: HorarioDisponivel[] = [
  { id: 'h1', data: '2026-09-23', hora_inicio: '09:00', hora_fim: '10:00', status: 'livre' },
  { id: 'h2', data: '2026-09-23', hora_inicio: '10:00', hora_fim: '11:00', status: 'livre' },
  { id: 'h3', data: '2026-09-23', hora_inicio: '11:00', hora_fim: '12:00', status: 'ocupado' },
  { id: 'h4', data: '2026-09-23', hora_inicio: '14:00', hora_fim: '15:00', status: 'livre' },
];
