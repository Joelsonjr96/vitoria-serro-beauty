'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Agendamento, HorarioDisponivel } from '@/types';
import { formatarDataBrasileira } from '@/lib/utils';

interface RemanejarModalProps {
  agendamento: Agendamento;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RemanejarModal({ agendamento, onClose, onSuccess }: RemanejarModalProps) {
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<HorarioDisponivel[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHorarioId, setSelectedHorarioId] = useState('');

  // Busca slots disponíveis quando a data muda
  const fetchAvailableSlots = async (date: string) => {
    const { data } = await supabase
      .from('horarios_disponiveis')
      .select('*')
      .eq('data', date)
      .eq('status', 'livre')
      .order('hora_inicio');

    if (data) {
      setAvailableSlots(data as HorarioDisponivel[]);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedHorarioId('');
    fetchAvailableSlots(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHorarioId) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('move_appointment', {
        p_agendamento_id: agendamento.id,
        p_new_horario_id: selectedHorarioId
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      alert('Agendamento remanejado com sucesso!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Erro ao remanejar agendamento: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl border border-accent-lavender">
        <div className="space-y-1">
          <h3 className="font-serif text-2xl text-text-main">Remanejar Horário</h3>
          <p className="text-xs text-text-muted uppercase tracking-widest font-bold">
            {agendamento.nome_cliente} • {agendamento.servicos?.nome}
          </p>
        </div>

        <div className="p-4 bg-bg-lavender-soft/30 rounded-2xl border border-accent-lavender/30 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Horário Atual:</p>
          <p className="text-sm font-medium">
            {formatarDataBrasileira(agendamento.horarios_disponiveis?.data || '').split(',')[0]} às {agendamento.horarios_disponiveis?.hora_inicio.slice(0, 5)}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted ml-1">Nova Data</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={e => handleDateChange(e.target.value)}
              className="w-full p-4 bg-white border border-accent-lavender rounded-2xl text-sm outline-none focus:border-button-bg transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted ml-1">Novo Horário</label>
            <select
              required
              value={selectedHorarioId}
              onChange={e => setSelectedHorarioId(e.target.value)}
              className="w-full p-4 bg-white border border-accent-lavender rounded-2xl text-sm outline-none focus:border-button-bg transition-colors disabled:opacity-50"
              disabled={!selectedDate || availableSlots.length === 0}
            >
              <option value="">
                {!selectedDate
                  ? "Selecione uma data primeiro"
                  : availableSlots.length > 0
                    ? "Selecione a hora"
                    : "Nenhum horário disponível"}
              </option>
              {availableSlots.map(h => (
                <option key={h.id} value={h.id}>{h.hora_inicio.slice(0, 5)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !selectedHorarioId}
            className="flex-[2] bg-button-bg text-white py-4 rounded-2xl font-bold text-sm hover:bg-button-hover transition-all disabled:opacity-50 shadow-lg shadow-button-bg/20"
          >
            {loading ? 'Processando...' : 'Confirmar Mudança'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-accent-lavender text-text-muted py-4 rounded-2xl font-bold text-sm hover:bg-bg-primary transition-all"
          >
            Sair
          </button>
        </div>
      </form>
    </div>
  );
}
