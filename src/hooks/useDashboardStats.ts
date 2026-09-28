import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Agendamento, Servico, HorarioDisponivel } from '@/types';

export function useDashboardStats() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [horarios, setHorarios] = useState<HorarioDisponivel[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [agendamentosRes, horariosRes, servicosRes] = await Promise.all([
      supabase
        .from('agendamentos')
        .select('*, servicos(nome, preco), horarios_disponiveis(data, hora_inicio)')
        .neq('status', 'cancelado'),
      supabase
        .from('horarios_disponiveis')
        .select('*')
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true }),
      supabase
        .from('servicos')
        .select('*')
        .order('nome', { ascending: true }),
    ]);

    const rawList = (agendamentosRes.data as Agendamento[]) || [];

    // Sort logic
    const sortedAgendamentos = rawList.sort((a, b) => {
      const dataA = a.horarios_disponiveis?.data || '';
      const dataB = b.horarios_disponiveis?.data || '';
      if (dataA !== dataB) return dataA.localeCompare(dataB);
      return (a.horarios_disponiveis?.hora_inicio || '').localeCompare(b.horarios_disponiveis?.hora_inicio || '');
    });

    setAgendamentos(sortedAgendamentos);
    setHorarios(horariosRes.data || []);
    setServicos((servicosRes.data as Servico[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agendamentos' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { agendamentos, horarios, servicos, loading, refetch: fetchData };
}
