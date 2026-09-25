'use client';

import { useState, useMemo } from 'react';
import { Agendamento } from '@/types';
import { formatarTelefone, formatarDataBrasileira } from '@/lib/utils';

export default function CRMManager({ agendamentos }: { agendamentos: Agendamento[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  // Agrupar agendamentos por cliente (usando telefone como chave única)
  const clientes = useMemo(() => {
    const map = new Map<string, {
      nome: string;
      telefone: string;
      atendimentos: Agendamento[];
      totalGasto: number;
      ultimaVisita: string;
    }>();

    agendamentos.forEach(ag => {
      const tel = ag.telefone_cliente.replace(/\D/g, '');
      if (!tel) return;

      const current = map.get(tel) || {
        nome: ag.nome_cliente,
        telefone: ag.telefone_cliente,
        atendimentos: [],
        totalGasto: 0,
        ultimaVisita: ''
      };

      current.atendimentos.push(ag);
      if (ag.status === 'concluido' || ag.status === 'confirmado') {
        current.totalGasto += Number(ag.servicos?.preco || 0);
      }

      const dataAg = ag.horarios_disponiveis?.data || '';
      if (!current.ultimaVisita || dataAg > current.ultimaVisita) {
        current.ultimaVisita = dataAg;
      }

      map.set(tel, current);
    });

    return Array.from(map.values()).sort((a, b) => b.totalGasto - a.totalGasto);
  }, [agendamentos]);

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm)
  );

  const clientDetails = useMemo(() => {
    if (!selectedClient) return null;
    return clientes.find(c => c.telefone.replace(/\D/g, '') === selectedClient);
  }, [selectedClient, clientes]);

  return (
    <div className="space-y-6">
      {/* Busca e Lista */}
      {!selectedClient ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cliente por nome ou telefone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 border border-accent-lavender bg-white rounded-2xl text-sm outline-none focus:border-button-bg transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>

          <div className="grid gap-3">
            {filteredClientes.map(c => (
              <button
                key={c.telefone}
                onClick={() => setSelectedClient(c.telefone.replace(/\D/g, ''))}
                className="flex items-center justify-between p-5 bg-white border border-accent-lavender rounded-2xl shadow-sm hover:shadow-md hover:border-button-bg/30 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg-lavender-soft rounded-full flex items-center justify-center text-button-bg font-serif text-xl border border-accent-lavender/50">
                    {c.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-text-main group-hover:text-button-bg transition-colors">{c.nome}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest">
                      {c.atendimentos.length} atendimentos • {formatarTelefone(c.telefone)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-700">R$ {c.totalGasto.toFixed(2)}</p>
                  <p className="text-[9px] text-text-muted uppercase tracking-tighter">Total Investido</p>
                </div>
              </button>
            ))}
            {filteredClientes.length === 0 && (
              <p className="text-center py-10 text-text-muted italic">Nenhuma cliente encontrada.</p>
            )}
          </div>
        </div>
      ) : (
        /* Detalhes da Cliente */
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <button
            onClick={() => setSelectedClient(null)}
            className="mb-6 text-xs uppercase tracking-widest text-text-muted hover:text-button-bg flex items-center gap-2 font-bold"
          >
            ← Voltar para lista
          </button>

          {clientDetails && (
            <div className="space-y-8">
              {/* Header Cliente */}
              <div className="bg-brand-purple-dark p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-serif border border-white/20">
                      {clientDetails.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif mb-1">{clientDetails.nome}</h3>
                      <p className="text-white/60 text-xs uppercase tracking-[0.2em]">{formatarTelefone(clientDetails.telefone)}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Visitas</p>
                      <p className="text-xl font-serif">{clientDetails.atendimentos.length}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Total</p>
                      <p className="text-xl font-serif text-emerald-400">R$ {clientDetails.totalGasto.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Histórico */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted px-2 flex items-center gap-2">
                   📅 Histórico de Atendimentos
                </h4>
                <div className="grid gap-3">
                  {clientDetails.atendimentos
                    .sort((a, b) => (b.horarios_disponiveis?.data || '').localeCompare(a.horarios_disponiveis?.data || ''))
                    .map(ag => (
                      <div key={ag.id} className="bg-white p-4 rounded-2xl border border-accent-lavender flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${ag.status === 'concluido' ? 'bg-emerald-500' : 'bg-button-bg'}`}></div>
                          <div>
                            <p className="text-sm font-bold text-text-main">{ag.servicos?.nome}</p>
                            <p className="text-[10px] text-text-muted uppercase">
                              {ag.horarios_disponiveis ? formatarDataBrasileira(ag.horarios_disponiveis.data) : '---'} às {ag.horarios_disponiveis?.hora_inicio.slice(0, 5)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-text-main">R$ {Number(ag.servicos?.preco || 0).toFixed(2)}</p>
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            ag.status === 'concluido' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {ag.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* CRM / Notas Rápidas */}
              <div className="bg-bg-lavender-soft/30 p-6 rounded-[28px] border border-accent-lavender">
                <h4 className="text-xs font-bold uppercase tracking-widest text-button-bg mb-4 flex items-center gap-2">
                   📝 Observações da Cliente
                </h4>
                <textarea
                  placeholder="Ex: Prefere cílios modelo gatinho, olhos sensíveis à luz, última manutenção demorou mais..."
                  className="w-full min-h-[100px] p-4 bg-white border border-accent-lavender rounded-xl text-sm outline-none focus:border-button-bg transition-all resize-none"
                  defaultValue={clientDetails.atendimentos.find(ag => ag.anamnese)?.anamnese?.alergias || ''}
                />
                <p className="text-[9px] text-text-muted mt-3 uppercase tracking-widest text-center italic">
                  As observações ajudam a personalizar o atendimento da Vitória.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
