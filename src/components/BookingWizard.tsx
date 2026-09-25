'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Servico, HorarioDisponivel } from '@/types';
import { formatarDataBrasileira, formatarDataCurta } from '@/lib/utils';

export default function BookingWizard({
  servico,
  horarios
}: {
  servico: Servico;
  horarios: HorarioDisponivel[];
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    horarios.length > 0 ? horarios[0].data : null
  );
  const [selectedHorario, setSelectedHorario] = useState<HorarioDisponivel | null>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [anamnese, setAnamnese] = useState({
    alergias: '',
    sensibilidade: false,
    gravidez: false,
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);

  // Agrupar horários por data
  const horariosPorData = useMemo(() => {
    const groups: Record<string, HorarioDisponivel[]> = {};
    horarios.forEach((h) => {
      if (!groups[h.data]) groups[h.data] = [];
      groups[h.data].push(h);
    });
    return groups;
  }, [horarios]);

  const datasDisponiveis = useMemo(() => Object.keys(horariosPorData).sort(), [horariosPorData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHorario) return;

    setLoading(true);
    try {
      const response = await fetch('/api/agendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servico_id: servico.id,
          horario_id: selectedHorario.id,
          nome_cliente: nome,
          telefone_cliente: telefone,
          anamnese: anamnese, // Enviando os dados da anamnese
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redireciona usando o ID do agendamento se disponível, senão usa o ID do horário como fallback
        const redirectId = result.data?.id || selectedHorario.id;
        router.push(`/agendado/${redirectId}`);
      } else {
        alert('Erro ao realizar o agendamento. Por favor, tente novamente.');
      }
    } catch {
      alert('Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  if (horarios.length === 0) {
    return (
      <div className="text-center py-12 bg-bg-card border border-accent-soft">
        <p className="text-text-muted italic">Nenhum horário disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Passo 1: Seleção de Data */}
      <section className="mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">1. Escolha a Data</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {datasDisponiveis.map((data) => (
            <button
              key={data}
              onClick={() => setSelectedDate(data)}
              className={`flex-shrink-0 px-6 py-4 border transition-all duration-200 ${
                selectedDate === data
                  ? 'bg-button-bg text-white border-button-bg shadow-md'
                  : 'bg-bg-card text-text-main border-accent-lavender hover:border-button-bg/50'
              } rounded-[12px] text-center min-w-[120px]`}
            >
              <span className="block text-sm font-bold uppercase tracking-tighter">
                {formatarDataCurta(data).split(',')[0]}
              </span>
              <span className="block text-lg font-serif">
                {formatarDataCurta(data).split(',')[1]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Passo 2: Seleção de Horário */}
      {selectedDate && (
        <section className="mb-10 animate-slide-up">
          <h2 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
            2. Horários para {formatarDataBrasileira(selectedDate)}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {horariosPorData[selectedDate].map((h) => (
              <button
                key={h.id}
                onClick={() => setSelectedHorario(h)}
                className="py-4 border border-accent-lavender bg-bg-card text-text-main hover:bg-bg-lavender-soft hover:border-button-bg transition-all rounded-[8px] font-mono text-sm font-bold"
              >
                {h.hora_inicio.slice(0, 5)}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Modal de Confirmação */}
      {selectedHorario && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm animate-in">
          <div className="bg-bg-card w-full max-w-lg shadow-2xl rounded-[20px] overflow-hidden animate-zoom-in">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-serif text-text-main">Resumo do Agendamento</h3>
                <button
                  onClick={() => setSelectedHorario(null)}
                  className="text-text-muted hover:text-text-main p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-8 bg-bg-lavender-soft/30 p-6 rounded-[12px] border border-accent-lavender">
                <div className="flex justify-between items-center pb-3 border-b border-accent-lavender/30">
                  <span className="text-sm text-text-muted font-medium">🌸 Serviço</span>
                  <span className="font-semibold text-text-main">{servico.nome}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-accent-lavender/30">
                  <span className="text-sm text-text-muted font-medium">📅 Data</span>
                  <span className="font-semibold text-text-main">{formatarDataBrasileira(selectedHorario.data)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-accent-lavender/30">
                  <span className="text-sm text-text-muted font-medium">⏱️ Horário</span>
                  <span className="font-semibold text-text-main">{selectedHorario.hora_inicio.slice(0, 5)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-muted font-medium">💰 Valor</span>
                  <span className="font-bold text-text-main text-lg">R$ {Number(servico.preco).toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Seus Dados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome Completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-4 border border-accent-lavender bg-bg-primary/30 rounded-[8px] focus:border-button-bg outline-none transition-all placeholder:text-text-muted/40"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp (com DDD)"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full p-4 border border-accent-lavender bg-bg-primary/30 rounded-[8px] focus:border-button-bg outline-none transition-all placeholder:text-text-muted/40"
                    required
                  />
                </div>

                {/* Seção de Anamnese */}
                <div className="mt-6 pt-6 border-t border-accent-lavender/30">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                    📋 Ficha de Saúde (Rápida)
                  </h4>

                  <div className="space-y-4 bg-bg-primary/20 p-4 rounded-xl border border-accent-lavender/20">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-text-muted">Possui alguma alergia? (ex: esmalte, látex, colas)</label>
                      <input
                        type="text"
                        placeholder="Se sim, descreva aqui..."
                        value={anamnese.alergias}
                        onChange={(e) => setAnamnese({...anamnese, alergias: e.target.value})}
                        className="w-full p-3 text-sm border border-accent-lavender/50 bg-white rounded-[8px] focus:border-button-bg outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 cursor-pointer p-3 border border-accent-lavender/50 bg-white rounded-lg hover:border-button-bg transition-all">
                        <input
                          type="checkbox"
                          checked={anamnese.sensibilidade}
                          onChange={(e) => setAnamnese({...anamnese, sensibilidade: e.target.checked})}
                          className="w-4 h-4 accent-button-bg"
                        />
                        <span className="text-xs font-medium text-text-muted">Olhos Sensíveis?</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer p-3 border border-accent-lavender/50 bg-white rounded-lg hover:border-button-bg transition-all">
                        <input
                          type="checkbox"
                          checked={anamnese.gravidez}
                          onChange={(e) => setAnamnese({...anamnese, gravidez: e.target.checked})}
                          className="w-4 h-4 accent-button-bg"
                        />
                        <span className="text-xs font-medium text-text-muted">Gestante?</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-button-bg text-white py-5 rounded-[12px] font-bold text-lg hover:bg-button-hover transition-all active:scale-[0.98] mt-6 shadow-lg shadow-button-bg/20 btn-hover-effect"
                >
                  {loading ? 'Processando...' : 'Confirmar Agendamento'}
                </button>
                <p className="text-[10px] text-center text-text-muted uppercase tracking-widest mt-4">
                  Pagamento realizado no local
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
