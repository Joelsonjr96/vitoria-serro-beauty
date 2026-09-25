'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { formatarTelefone, formatarDataBrasileira } from '@/lib/utils';
import { Agendamento } from '@/types/allTypes';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  observacoes: string | null;
}

export default function CRMManager({ agendamentos }: { agendamentos: Agendamento[] }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  async function fetchClientes() {
    const { data } = await supabase.from('clientes').select('*').order('nome');
    setClientes(data || []);
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  const clientData = useMemo(() => {
    if (!selectedClient) return null;

    const history = agendamentos
      .filter(a => a.telefone_cliente === selectedClient.telefone)
      .sort((a, b) => new Date(b.horarios_disponiveis?.data || '').getTime() - new Date(a.horarios_disponiveis?.data || '').getTime());

    const concluded = history.filter(a => a.status === 'concluido');
    const totalSpent = concluded.reduce((acc, a) => acc + Number(a.servicos?.preco || 0), 0);

    const lastAppt = history[0];
    const nextAppt = history.find(a => a.status === 'confirmado' && new Date(a.horarios_disponiveis?.data || '') >= new Date());

    return { history, totalSpent, lastAppt, nextAppt };
  }, [selectedClient, agendamentos]);

  const getProximaAcao = () => {
    if (!clientData || !clientData.lastAppt) return null;

    if (clientData.nextAppt) return { label: '🟢 Cliente recorrente: Próximo atendimento agendado.', color: 'text-emerald-600' };

    const lastDate = new Date(clientData.lastAppt.horarios_disponiveis?.data || '');
    const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 45) return { label: '🟡 Hora de reativar: Último atendimento há mais de 45 dias.', color: 'text-amber-600' };
    if (diffDays > 25) return { label: '🔵 Manutenção prevista: Normalmente retorna a cada ~25 dias.', color: 'text-blue-600' };
    return null;
  };

  const proximaAcao = getProximaAcao();

  return (
    <div className="space-y-6">
      {!selectedClient ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-4 border border-accent-lavender bg-white rounded-2xl text-sm outline-none"
          />
          <div className="grid gap-3">
            {filteredClientes.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c)}
                className="p-5 bg-white border border-accent-lavender rounded-2xl shadow-sm text-left hover:border-button-bg transition-colors"
              >
                <p className="font-bold">{c.nome}</p>
                <p className="text-[10px] text-text-muted">{formatarTelefone(c.telefone)}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setSelectedClient(null)} className="text-xs font-bold text-text-muted hover:text-text-main">← Voltar à lista</button>

          <div className="bg-white p-6 rounded-2xl border border-accent-lavender space-y-6">
            <div>
              <h3 className="text-2xl font-bold">{selectedClient.nome}</h3>
              <p className="text-sm text-text-muted flex items-center gap-2">📱 {formatarTelefone(selectedClient.telefone)}</p>
            </div>

            {proximaAcao && (
              <div className={`p-4 rounded-xl bg-bg-lavender-soft/50 border border-current ${proximaAcao.color}`}>
                <p className="text-xs font-bold uppercase tracking-widest">Próxima Ação</p>
                <p className="text-sm font-medium">{proximaAcao.label}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-bg-primary/20 rounded-xl">
                <p className="text-[10px] text-text-muted uppercase">Total Atend.</p>
                <p className="font-bold">{clientData?.history.length || 0}</p>
              </div>
              <div className="p-3 bg-bg-primary/20 rounded-xl">
                <p className="text-[10px] text-text-muted uppercase">Total Gasto</p>
                <p className="font-bold">R$ {clientData?.totalSpent.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-sm">Histórico</h4>
              <div className="space-y-1">
                {clientData?.history.map(a => (
                  <div key={a.id} className="grid grid-cols-3 text-[10px] p-2 border-b border-accent-lavender/30">
                    <span>{formatarDataBrasileira(a.horarios_disponiveis?.data || '').split(',')[0]}</span>
                    <span>{a.servicos?.nome}</span>
                    <span className="font-bold">{a.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-bold text-sm">Informações</h4>
                <div className="p-4 bg-bg-primary/20 rounded-xl text-xs space-y-1">
                    {clientData?.history[0]?.anamnese?.usoUnhasGel && <p>💅 Usa Unhas de Gel</p>}
                    {clientData?.history[0]?.anamnese?.alergias && <p>⚠️ Alergias: {clientData.history[0].anamnese.alergias}</p>}
                    <p className="text-text-muted italic">{selectedClient.observacoes || 'Sem observações adicionais.'}</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
