import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import { formatarDataBrasileira } from '@/lib/utils';
import Link from 'next/link';

export default async function AgendadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ horarioId: string }>;
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { horarioId } = await params;
  const { cancelled } = await searchParams;

  // Se o parâmetro cancelled estiver presente, mostra a tela de confirmação de cancelamento imediatamente
  if (cancelled === 'true') {
    return (
      <div className="p-6 md:p-12 text-text-main flex items-center justify-center min-h-[70vh]">
        <div className="bg-bg-card p-8 md:p-12 rounded-none shadow-sm border border-accent-soft text-center max-w-lg w-full">
          <div className="mb-6 flex justify-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-xl font-serif">✕</div>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-text-main mb-3">Agendamento Cancelado</h1>
          <p className="text-text-muted mb-8 italic">
            Seu agendamento foi cancelado com sucesso e o horário foi liberado.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="w-full bg-button-bg text-white py-5 rounded-[12px] font-bold text-sm hover:bg-button-hover transition-all active:scale-[0.98] btn-hover-effect"
            >
              Escolher Novo Horário
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Busca o agendamento completo pelo ID do agendamento OU pelo ID do horário
  const { data: agendamento, error } = await supabase
    .from('agendamentos')
    .select('*, servicos(nome, preco), horarios_disponiveis(data, hora_inicio)')
    .or(`id.eq.${horarioId},horario_id.eq.${horarioId}`)
    .order('criado_em', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !agendamento || !agendamento.servicos || !agendamento.horarios_disponiveis) {
    console.error('Erro ou Agendamento não encontrado:', { error, id: horarioId, agendamento });
    notFound();
  }

  if (agendamento.status === 'cancelado') {
    return (
      <div className="p-6 md:p-12 text-text-main flex items-center justify-center min-h-[70vh]">
        <div className="bg-bg-card p-8 md:p-12 rounded-none shadow-sm border border-accent-soft text-center max-w-lg w-full">
          <div className="mb-6 flex justify-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-xl font-serif">✕</div>
          </div>
          <h1 className="text-3xl font-serif font-semibold text-text-main mb-3">Agendamento Cancelado</h1>
          <p className="text-text-muted mb-8 italic">
            Este agendamento não está mais ativo em nosso sistema.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="w-full bg-button-bg text-white py-5 rounded-[12px] font-bold text-sm hover:bg-button-hover transition-all active:scale-[0.98] btn-hover-effect"
            >
              Escolher Novo Horário
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { servicos, horarios_disponiveis, nome_cliente, servico_id, id: appointmentId } = agendamento;

  async function handleCancelAction() {
    'use server';

    // 1. Atualiza o status do agendamento para cancelado
    await supabase
      .from('agendamentos')
      .update({ status: 'cancelado' })
      .eq('id', appointmentId);

    // 2. Libera o horário
    if (agendamento?.horario_id) {
      await supabase
        .from('horarios_disponiveis')
        .update({ status: 'livre' })
        .eq('id', agendamento.horario_id);
    }

    // 3. Redireciona para a mesma página com parâmetro de cancelamento
    redirect(`/agendado/${horarioId}?cancelled=true`);
  }

  // Dicas de PRÉ-atendimento
  const preAtendimentoDicas = [
    'Vir sem maquiagem ou rímel nos olhos.',
    'Chegar com 5 a 10 minutos de antecedência (tolerância de atraso: 10 min).',
    'Evitar consumir café ou energéticos antes do procedimento (para evitar tremores nos olhos).',
  ];

  const vitoriaWhatsappNumber = '21974084500';
  const dataFormatada = formatarDataBrasileira(horarios_disponiveis.data);
  const diaSemana = dataFormatada.split(',')[0];
  const dataExtenso = dataFormatada.split(',')[1];

  const whatsappConfirmMsg = encodeURIComponent(
    `Oi Vitória! Sou ${nome_cliente}, agendei ${servicos.nome} para ${diaSemana} (${dataExtenso}) às ${horarios_disponiveis.hora_inicio.slice(0, 5)}. Aqui está meu comprovante!`
  );

  return (
    <div className="p-6 md:p-12 text-text-main flex items-center justify-center min-h-[70vh]">
      <div className="bg-bg-card p-8 md:p-12 rounded-none shadow-sm border border-accent-soft text-center max-w-lg w-full">
        <div className="mb-6 flex justify-center">
           <div className="w-12 h-12 bg-bg-lavender-soft text-button-bg rounded-full flex items-center justify-center text-xl font-serif">✓</div>
        </div>
        <h1 className="text-3xl font-serif font-semibold text-text-main mb-3">Agendamento confirmado!</h1>
        <p className="text-text-muted mb-8 italic">
          Seu horário está reservado para o dia <strong className="text-text-main not-italic">{dataFormatada}</strong> às <strong className="text-text-main not-italic">{horarios_disponiveis.hora_inicio.slice(0, 5)}</strong>.
        </p>

        {/* Resumo do Agendamento */}
        <div className="bg-bg-primary p-6 rounded-none text-sm text-text-muted text-left border border-accent-soft mb-6">
          <p className="font-serif text-lg text-text-main mb-3 border-b border-accent-soft pb-2 uppercase tracking-widest text-[10px] font-bold">Resumo:</p>
          <div className="space-y-2">
            <p className="flex justify-between"><span>Serviço:</span> <strong className="text-text-main">{servicos.nome}</strong></p>
            <p className="flex justify-between"><span>Profissional:</span> <strong className="text-text-main">Vitória Serro</strong></p>
            <p className="flex justify-between"><span>Valor:</span> <strong className="text-text-main">R$ {Number(servicos.preco).toFixed(2)}</strong></p>
            <p className="flex justify-between"><span>Local:</span> <strong className="text-text-main">Av. Braz de Pina 1720 - Vista Alegre</strong></p>
          </div>
        </div>

        {/* Orientações PRÉ-Atendimento */}
        <div className="bg-bg-primary p-6 rounded-none text-sm text-text-muted text-left border border-accent-soft">
          <p className="font-serif text-lg text-text-main mb-3 border-b border-accent-soft pb-2 uppercase tracking-widest text-[10px] font-bold">Como se preparar:</p>
          <ul className="space-y-3">
            {preAtendimentoDicas.map((dica, i) => (
              <li key={i} className="flex gap-3"><span className="text-text-main">▪</span> {dica}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href={`https://wa.me/55${vitoriaWhatsappNumber}?text=${whatsappConfirmMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 text-white py-5 rounded-[12px] font-bold text-sm hover:bg-emerald-600 transition-all active:scale-[0.98] btn-hover-effect flex items-center justify-center gap-2"
          >
            <span>Enviar Comprovante no WhatsApp</span>
          </a>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 bg-button-bg text-white py-4 rounded-[12px] font-bold text-sm hover:bg-button-hover transition-all active:scale-[0.98] btn-hover-effect"
            >
              Voltar para o Início
            </Link>
            <form action={handleCancelAction} className="flex-1">
              <button
                type="submit"
                className="w-full border border-accent-lavender text-text-muted py-4 rounded-[12px] font-bold text-sm hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-[0.98] btn-hover-effect"
              >
                Cancelar Agendamento
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
