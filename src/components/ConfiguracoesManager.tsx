'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Configuracao {
  id: string;
  key: string;
  value: string;
}

export default function ConfiguracoesManager({ initialConfig }: { initialConfig: Configuracao[] }) {
  const [config, setConfig] = useState<Configuracao[]>(initialConfig);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (id: string, value: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({ value })
        .eq('id', id);

      if (error) throw error;
      setConfig(prev => prev.map(c => c.id === id ? { ...c, value } : c));
      alert('Configuração atualizada!');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar configuração.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Dados do Negócio</h3>
      <div className="grid gap-4">
        {config.map(c => (
          <div key={c.id} className="space-y-1">
            <label htmlFor={c.id} className="text-[10px] font-bold uppercase text-text-muted">{c.key}</label>
            <input
              id={c.id}
              type="text"
              defaultValue={c.value}
              onBlur={(e) => handleUpdate(c.id, e.target.value)}
              className="w-full p-3 border border-accent-lavender bg-white rounded-xl text-sm outline-none focus:border-button-bg"
              disabled={loading}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
