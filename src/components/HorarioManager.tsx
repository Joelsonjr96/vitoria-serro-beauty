'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function HorarioManager({ horario }: { horario: any }) {
  const [status, setStatus] = useState(horario.status);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = status === 'livre' ? 'ocupado' : 'livre';

    const { error } = await supabase
      .from('horarios_disponiveis')
      .update({ status: newStatus })
      .eq('id', horario.id);

    if (!error) {
      setStatus(newStatus);
    } else {
      alert('Erro ao atualizar status.');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span>{horario.data} - {horario.hora_inicio}</span>
      <button
        onClick={toggleStatus}
        disabled={loading}
        className={`px-3 py-1 rounded text-sm ${
          status === 'livre' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {loading ? '...' : status === 'livre' ? 'Livre' : 'Bloqueado'}
      </button>
    </div>
  );
}
