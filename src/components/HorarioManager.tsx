'use client';

import { HorarioDisponivel } from '@/types/allTypes';
import { useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { formatarDataCurta } from '@/lib/utils';

export default function HorarioManager({ initialHorarios }: { initialHorarios: HorarioDisponivel[] }) {
  const [horarios, setHorarios] = useState(initialHorarios);
  const [selectedDate, setSelectedDate] = useState<string>(
    initialHorarios.length > 0 ? initialHorarios[0].data : ''
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [massLoading, setMassLoading] = useState(false);

  const dates = useMemo(() => {
    const d = Array.from(new Set(horarios.map(h => h.data))).sort();
    return d;
  }, [horarios]);

  const filteredHorarios = useMemo(() => {
    return horarios.filter(h => h.data === selectedDate);
  }, [horarios, selectedDate]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    setLoadingId(id);
    const newStatus = currentStatus === 'livre' ? 'ocupado' : 'livre';

    const { error } = await supabase
      .from('horarios_disponiveis')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setHorarios(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
    } else {
      alert('Erro ao atualizar status.');
    }
    setLoadingId(null);
  };

  const isDayFullyBlocked = useMemo(() => {
    return filteredHorarios.length > 0 && filteredHorarios.every(h => h.status === 'ocupado');
  }, [filteredHorarios]);

  const toggleDayStatus = async () => {
    const action = isDayFullyBlocked ? 'desbloquear' : 'bloquear';
    const newStatus = isDayFullyBlocked ? 'livre' : 'ocupado';

    if (!confirm(`Deseja ${action} TODOS os horários do dia ${formatarDataCurta(selectedDate)}?`)) return;

    setMassLoading(true);
    // Para bloquear, pegamos apenas os livres. Para desbloquear, pegamos apenas os ocupados.
    const idsToUpdate = filteredHorarios
      .filter(h => h.status !== newStatus)
      .map(h => h.id);

    if (idsToUpdate.length === 0) {
      setMassLoading(false);
      return;
    }

    const { error } = await supabase
      .from('horarios_disponiveis')
      .update({ status: newStatus })
      .in('id', idsToUpdate);

    if (!error) {
      setHorarios(prev => prev.map(h => h.data === selectedDate ? { ...h, status: newStatus } : h));
    } else {
      alert(`Erro ao ${action} horários.`);
    }
    setMassLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted/60 ml-1">Selecionar Dia</label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 border border-accent-lavender bg-bg-primary/30 rounded-[12px] text-sm font-medium outline-none focus:border-button-bg transition-all"
        >
          {dates.map(date => (
            <option key={date} value={date}>{formatarDataCurta(date)}</option>
          ))}
        </select>
      </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {filteredHorarios.map((h) => (
          <button
            key={h.id}
            onClick={() => toggleStatus(h.id, h.status)}
            disabled={loadingId === h.id}
            className={`py-4 px-3 text-xs font-bold rounded-[12px] transition-all border shadow-sm ${
              h.status === 'livre'
                ? 'bg-white text-text-main border-accent-lavender hover:border-button-bg'
                : 'bg-accent-soft/40 text-text-main border-accent-soft/60 hover:bg-accent-soft/60'
            } ${loadingId === h.id ? 'animate-pulse opacity-50' : ''}`}
          >
            <div className="flex flex-col">
              <span className="text-[9px] opacity-60 uppercase tracking-tighter mb-1">
                {h.status === 'livre' ? 'Livre' : 'Ocupado'}
              </span>
              <span className="text-sm font-mono">{h.hora_inicio.slice(0, 5)}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={toggleDayStatus}
        disabled={massLoading || filteredHorarios.length === 0}
        className={`w-full py-4 border-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-[14px] transition-all disabled:opacity-30 flex items-center justify-center gap-2 shadow-sm btn-hover-effect ${
          isDayFullyBlocked
            ? 'border-emerald-500/40 text-emerald-600 bg-white hover:bg-emerald-500 hover:text-white'
            : 'border-button-bg/40 text-button-bg bg-white hover:bg-button-bg hover:text-white'
        }`}
      >
        {massLoading ? 'Processando...' : isDayFullyBlocked ? '🔓 Desbloquear Dia Inteiro' : '🔒 Bloquear Dia Inteiro'}
      </button>
    </div>
  );
}
