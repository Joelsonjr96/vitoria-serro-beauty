'use client';

import { Agendamento } from '@/types/allTypes';
import { formatarDataBrasileira, formatarTelefone } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import ConcluirAtendimentoModal from '@/components/ConcluirAtendimentoModal';

export default function AgendamentoCard({ agendamento }: { agendamento: Agendamento }) {
  const [status, setStatus] = useState(agendamento.status);
  const [loading, setLoading] = useState(false);
  const [showConcluirModal, setShowConcluirModal] = useState(false);

  const updateStatus = async (newStatus: 'confirmado' | 'cancelado' | 'pendente' | 'concluido' | 'em_atendimento' | 'nao_compareceu') => {
    if (newStatus === 'cancelado' && !confirm('Tem certeza que deseja cancelar este agendamento? O horário será liberado.')) return;

    setLoading(true);

    try {
      console.log('Tentando atualizar status para:', newStatus);
      const { data, error } = await supabase
        .from('agendamentos')
        .update({ status: newStatus })
        .eq('id', agendamento.id);

      if (error) {
        console.error('Erro detalhado do Supabase:', error);
        throw error;
      }

      setStatus(newStatus);
      // Recarrega a página para atualizar métricas
      window.location.reload();
      return;
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'confirmado': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pendente': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'em_atendimento': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'concluido': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'cancelado': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'nao_compareceu': return 'bg-gray-50 text-gray-700 border-gray-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'confirmado': return 'Confirmado';
      case 'pendente': return 'Pendente';
      case 'em_atendimento': return 'Em Atendimento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      case 'nao_compareceu': return 'Não Compareceu';
      default: return s;
    }
  };

  // Force rebuild comment
  const whatsappMsg = `Olá ${agendamento.nome_cliente.split(' ')[0]}, aqui é a Vitória. Tudo bem? Confirmamos seu horário de ${agendamento.servicos?.nome} para ${formatarDataBrasileira(agendamento.horarios_disponiveis?.data || '').split(',')[0]} às ${agendamento.horarios_disponiveis?.hora_inicio.slice(0, 5)}?`;

  return (
    <div className={`bg-bg-card p-6 rounded-[20px] border border-accent-lavender shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-bg-lavender-soft rounded-full flex items-center justify-center text-button-bg font-serif text-2xl border border-accent-lavender/50 shrink-0">
          {agendamento.nome_cliente.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-bold text-xl text-text-main leading-tight">{agendamento.nome_cliente}</p>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border ${getStatusStyle(status)}`}>
              {getStatusLabel(status)}
            </span>
          </div>
          <p className="text-sm text-button-bg font-medium uppercase tracking-wider">{agendamento.servicos?.nome}</p>

          {/* Dados de Anamnese se existirem */}
          {agendamento.anamnese && (
            <div className="mt-3 p-3 bg-bg-lavender-soft/40 rounded-xl border border-accent-lavender/30 text-[11px] space-y-1">
              <p className="font-bold text-text-muted uppercase tracking-tighter mb-1">📋 Ficha Rápida:</p>
              {agendamento.anamnese.alergias && <p><strong>Alergias:</strong> {agendamento.anamnese.alergias}</p>}
              {agendamento.anamnese.alergiaCosmeticos && <p><strong>Alergia Cosméticos:</strong> {agendamento.anamnese.alergiaCosmeticos}</p>}
              {agendamento.anamnese.usoUnhasGel && <p className="text-purple-600 font-bold">💅 Usa Unhas de Gel</p>}
              {agendamento.anamnese.sensibilidade && <p className="text-rose-600 font-bold">⚠️ Olhos Sensíveis</p>}
              {agendamento.anamnese.gravidez && <p className="text-blue-600 font-bold">🤰 Gestante</p>}
              {!agendamento.anamnese.alergias && !agendamento.anamnese.alergiaCosmeticos && !agendamento.anamnese.usoUnhasGel && !agendamento.anamnese.sensibilidade && !agendamento.anamnese.gravidez && (
                <p className="italic text-text-muted/60">Sem restrições informadas.</p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-mono font-bold text-text-main bg-bg-primary px-3 py-1.5 rounded-lg border border-accent-lavender/50">
              {formatarTelefone(agendamento.telefone_cliente)}
            </span>
            <a
              href={`https://wa.me/55${agendamento.telefone_cliente.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all flex items-center gap-2 shadow-sm btn-hover-effect"
            >
              <span>WhatsApp</span>
              <span className="text-sm">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-col items-center md:items-end gap-3 md:gap-4 border-t md:border-t-0 md:border-l border-accent-lavender/40 pt-4 md:pt-0 md:pl-6">
        <div className="flex flex-row md:flex-col items-center md:items-end gap-1 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-text-muted order-2 md:order-1">
            {agendamento.horarios_disponiveis ? formatarDataBrasileira(agendamento.horarios_disponiveis.data).split(',')[0] : '---'}
          </p>
          <p className="text-2xl font-bold text-text-main font-mono order-1 md:order-2">
            {agendamento.horarios_disponiveis?.hora_inicio.slice(0, 5)}
          </p>
        </div>

        {/* Ações Rápidas */}
        <div className="flex gap-2">
          {status === 'pendente' && (
            <>
              <button onClick={() => updateStatus('confirmado')} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg border border-emerald-100 transition-colors text-xs font-bold uppercase tracking-widest">✓ Confirmar</button>
              <button onClick={() => updateStatus('cancelado')} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-100 transition-colors text-xs font-bold uppercase tracking-widest">✕ Cancelar</button>
            </>
          )}
          {status === 'confirmado' && (
            <>
              <button onClick={() => updateStatus('em_atendimento')} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg border border-purple-100 transition-colors text-xs font-bold uppercase tracking-widest">▶ Iniciar</button>
              <button onClick={() => updateStatus('nao_compareceu')} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors text-xs font-bold uppercase tracking-widest">! Não Compareceu</button>
              <button onClick={() => updateStatus('cancelado')} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-100 transition-colors text-xs font-bold uppercase tracking-widest">✕ Cancelar</button>
            </>
          )}
          {status === 'em_atendimento' && (
            <button onClick={() => setShowConcluirModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors text-xs font-bold uppercase tracking-widest">✓ Concluir</button>
          )}
        </div>

        {showConcluirModal && (
          <ConcluirAtendimentoModal
            agendamento={agendamento}
            onClose={() => setShowConcluirModal(false)}
            onSuccess={() => window.location.reload()}
          />
        )}
      </div>
    </div>
  );
}
