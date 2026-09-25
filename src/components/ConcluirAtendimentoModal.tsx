'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Agendamento } from '@/types/allTypes';

interface Props {
  agendamento: Agendamento;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ConcluirAtendimentoModal({ agendamento, onClose, onSuccess }: Props) {
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConcluir = async () => {
    setLoading(true);
    try {
      // 1. Atualiza status
      const { error } = await supabase
        .from('agendamentos')
        .update({
            status: 'concluido',
            anamnese: {
                ...agendamento.anamnese,
                observacoes: observacao
            }
        })
        .eq('id', agendamento.id);

      if (error) throw error;
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Erro ao concluir atendimento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl max-w-sm w-full space-y-6 shadow-xl border border-accent-lavender">
        <h2 className="text-xl font-bold">Atendimento Concluído</h2>

        <div className="space-y-3 text-sm">
          <p><span className="text-text-muted">Serviço:</span> <span className="font-bold">{agendamento.servicos?.nome}</span></p>
          <p><span className="text-text-muted">Valor:</span> <span className="font-bold">R$ {agendamento.servicos?.preco.toFixed(2)}</span></p>

          <div className="space-y-1">
            <label className="text-text-muted text-xs">Observação:</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full p-3 border border-accent-lavender rounded-xl text-sm outline-none"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-accent-lavender text-text-muted font-bold">Voltar</button>
          <button onClick={handleConcluir} disabled={loading} className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50">
            {loading ? 'Salvando...' : 'Salvar atendimento'}
          </button>
        </div>
      </div>
    </div>
  );
}
