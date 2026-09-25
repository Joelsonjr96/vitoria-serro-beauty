'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatarTelefone } from '@/lib/utils';

import { Agendamento } from '@/types';

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
    const { data, error } = await supabase.from('clientes').select('*').order('nome');
    if (error) {
      console.error('Erro ao buscar clientes:', error);
    } else {
      console.log('Clientes carregados:', data);
      setClientes(data || []);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchClientes();
    })();
  }, []);

  async function updateObservacoes(id: string, observacoes: string) {
    await supabase.from('clientes').update({ observacoes }).eq('id', id);
    fetchClientes();
  }

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  const getHistorico = (telefone: string) => {
    return agendamentos.filter(a => a.telefone_cliente === telefone);
  };


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
            {filteredClientes.length > 0 ? (
              filteredClientes.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  className="p-5 bg-white border border-accent-lavender rounded-2xl shadow-sm text-left"
                >
                  <p className="font-bold">{c.nome}</p>
                  <p className="text-[10px] text-text-muted">{formatarTelefone(c.telefone)}</p>
                </button>
              ))
            ) : (
              <p className="text-center text-text-muted py-4 italic">Nenhum cliente cadastrado no momento. Os clientes serão adicionados automaticamente à medida que realizarem novos agendamentos.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setSelectedClient(null)} className="text-xs font-bold text-text-muted">← Voltar</button>
          <div className="bg-white p-6 rounded-2xl border border-accent-lavender">
            <h3 className="text-xl font-bold">{selectedClient.nome}</h3>
            <p className="text-sm text-text-muted">{formatarTelefone(selectedClient.telefone)}</p>

            <textarea
              className="w-full mt-4 p-4 border border-accent-lavender rounded-xl text-sm"
              defaultValue={selectedClient.observacoes || ''}
              onBlur={(e) => updateObservacoes(selectedClient.id, e.target.value)}
              placeholder="Adicionar observações..."
            />

            <div className="mt-6">
              <h4 className="font-bold text-sm mb-3">Histórico</h4>
              <div className="space-y-2">
                {getHistorico(selectedClient.telefone).map(a => (
                  <div key={a.id} className="text-xs p-3 bg-bg-lavender-soft rounded-lg">
                    {a.horarios_disponiveis?.data} - {a.servicos?.nome} ({a.status})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
