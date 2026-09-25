'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Servico } from '@/types/allTypes';

export default function NovoAgendamento({ servicos }: { servicos: Servico[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico_id: servicos[0]?.id || '',
    data: '',
    hora: ''
  });

  // Busca slots disponíveis quando a data muda
  const fetchAvailableSlots = async (date: string) => {
    const { data } = await supabase
      .from('horarios_disponiveis')
      .select('hora_inicio')
      .eq('data', date)
      .eq('status', 'livre')
      .order('hora_inicio');

    if (data) {
      setAvailableSlots(data.map(h => h.hora_inicio.slice(0, 5)));
    } else {
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (date: string) => {
    setFormData({...formData, data: date, hora: ''});
    fetchAvailableSlots(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Busca o ID do horário baseado na data e hora
      // O banco armazena hora_inicio como 'HH:MM:SS', input time retorna 'HH:MM'
      const formattedHora = formData.hora.length === 5 ? `${formData.hora}:00` : formData.hora;

      const { data: horario, error: hError } = await supabase
        .from('horarios_disponiveis')
        .select('id')
        .eq('data', formData.data)
        .eq('hora_inicio', formattedHora)
        .single();

      if (hError || !horario) {
        console.error('Erro na busca do horário:', hError, 'Procurando por:', formData.data, formattedHora);
        throw new Error(`Horário não encontrado: ${formData.data} às ${formattedHora}`);
      }

      // 2. Chama a API de agendamento (reutilizando a lógica robusta que já temos)
      const res = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servico_id: formData.servico_id,
          horario_id: horario.id,
          nome_cliente: formData.nome,
          telefone_cliente: formData.telefone,
          duracao_minutos: servicos.find(s => s.id === formData.servico_id)?.duracao_minutos
        }),
      });

      if (!res.ok) throw new Error('Erro ao agendar');

      alert('Agendamento criado com sucesso!');
      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao criar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-button-bg text-white py-4 rounded-2xl font-bold text-sm hover:bg-button-hover transition-all"
      >
        + Novo Agendamento
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="font-serif text-xl">Novo Agendamento</h3>
            <input type="text" placeholder="Nome" required onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full p-3 border rounded-xl" />
            <input type="tel" placeholder="Telefone" required onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full p-3 border rounded-xl" />
            <select onChange={e => setFormData({...formData, servico_id: e.target.value})} className="w-full p-3 border rounded-xl">
              {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
            <input type="date" required onChange={e => handleDateChange(e.target.value)} className="w-full p-3 border rounded-xl" />

            <select
              required
              value={formData.hora}
              onChange={e => setFormData({...formData, hora: e.target.value})}
              className="w-full p-3 border rounded-xl"
              disabled={!formData.data || availableSlots.length === 0}
            >
              <option value="">{availableSlots.length > 0 ? "Selecione a hora" : "Nenhum horário disponível"}</option>
              {availableSlots.map(h => <option key={h} value={h}>{h}</option>)}
            </select>

            <div className="flex gap-2 pt-4">
              <button type="submit" disabled={loading} className="flex-1 bg-button-bg text-white py-3 rounded-xl font-bold">
                {loading ? '...' : 'Confirmar'}
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="flex-1 border py-3 rounded-xl">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
