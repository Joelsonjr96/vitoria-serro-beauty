export interface HorarioDisponivel {
  id: string;
  data: string; // ISO date string YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fim: string; // HH:mm
  status: 'livre' | 'ocupado';
}
