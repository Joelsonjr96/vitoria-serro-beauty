'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatarTelefone } from '@/lib/utils';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  observacoes: string | null;
}

export default function CRMManager() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    const { data } = await supabase.from('clientes').select('*').order('nome');
    if (data) setClientes(data);
  }

  async function updateObservacoes(id: string, observacoes: string) {
    await supabase.from('clientes').update({ observacoes }).eq('id', id);
    fetchClientes();
  }

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

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
                className="p-5 bg-white border border-accent-lavender rounded-2xl shadow-sm text-left"
              >
                <p className="font-bold">{c.nome}</p>
                <p className="text-[10px] text-text-muted">{formatarTelefone(c.telefone)}</p>
              </button>
            ))}
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
          </div>
        </div>
      )}
    </div>
  );
}
