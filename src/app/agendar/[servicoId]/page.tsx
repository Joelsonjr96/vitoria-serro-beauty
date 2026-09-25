import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import BookingWizard from '@/components/BookingWizard';
import Link from 'next/link';

export default async function AgendarPage({
  params,
}: {
  params: Promise<{ servicoId: string }>;
}) {
  const { servicoId } = await params;

  // Busca o serviço
  const { data: servico, error: servicoError } = await supabase
    .from('servicos')
    .select('*')
    .eq('id', servicoId)
    .single();

  if (servicoError || !servico) {
    notFound();
  }

  // Busca horários livres
  const { data: horariosDisponiveis } = await supabase
    .from('horarios_disponiveis')
    .select('*')
    .eq('status', 'livre')
    .order('data', { ascending: true })
    .order('hora_inicio', { ascending: true });

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center text-xs uppercase tracking-widest text-text-muted hover:text-button-bg transition-colors mb-8 group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Voltar para serviços
        </Link>

        <header className="mb-12 border-b border-accent-lavender pb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-button-bg font-bold mb-2 block">Agendamento Online</span>
          <h1 className="text-4xl md:text-5xl font-serif text-text-main">{servico.nome}</h1>
          <p className="text-text-muted mt-3 text-lg font-medium">
            Personalize seu atendimento escolhendo o melhor momento.
          </p>
        </header>

        <main>
          <BookingWizard
            servico={servico}
            horarios={horariosDisponiveis || []}
          />
        </main>
      </div>
    </div>
  );
}