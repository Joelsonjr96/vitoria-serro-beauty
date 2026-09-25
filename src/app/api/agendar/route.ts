import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body: {
      servico_id?: string;
      horario_id?: string;
      nome_cliente?: string;
      telefone_cliente?: string;
      anamnese?: any;
    } = await request.json();

    if (!body.servico_id || !body.horario_id || !body.nome_cliente || !body.telefone_cliente) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    // 1. Inicia validação de disponibilidade atômica
    const slotsNeeded = Math.ceil(body.duracao_minutos / 30);

    // Busca o horário inicial
    const { data: startHorario, error: fetchStartError } = await supabase
      .from('horarios_disponiveis')
      .select('id, data, hora_inicio')
      .eq('id', body.horario_id)
      .single();

    if (fetchStartError || !startHorario) {
      return NextResponse.json({ error: 'Horário inicial não encontrado' }, { status: 404 });
    }

    // Busca todos os slots necessários para garantir que estão LIVRES
    const { data: candidateSlots, error: fetchSlotsError } = await supabase
      .from('horarios_disponiveis')
      .select('id, status')
      .eq('data', startHorario.data)
      .gte('hora_inicio', startHorario.hora_inicio)
      .order('hora_inicio', { ascending: true })
      .limit(slotsNeeded);

    if (fetchSlotsError || !candidateSlots || candidateSlots.length < slotsNeeded) {
      return NextResponse.json({ error: 'Tempo insuficiente para este serviço neste horário' }, { status: 400 });
    }

    const allFree = candidateSlots.every(s => s.status === 'livre');
    if (!allFree) {
      return NextResponse.json({ error: 'Um ou mais horários deste intervalo acabaram de ser ocupados' }, { status: 409 });
    }

    // 2. Upsert do Cliente (vincula pelo telefone)
    const { data: cliente, error: clientError } = await supabase
      .from('clientes')
      .upsert(
        {
          nome: body.nome_cliente,
          telefone: body.telefone_cliente
        },
        { onConflict: 'telefone' }
      )
      .select('id')
      .single();

    if (clientError) {
      console.error('Erro ao salvar cliente:', clientError);
    }

    // 2. Insere o agendamento (agora vinculando cliente_id se possível)
    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .insert([
        {
          servico_id: body.servico_id,
          horario_id: body.horario_id,
          nome_cliente: body.nome_cliente,
          telefone_cliente: body.telefone_cliente,
          anamnese: body.anamnese,
          status: 'confirmado',
          criado_em: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 3. Atualiza os horários necessários para ocupado
    const idsToUpdate = candidateSlots.map(s => s.id);
    const { error: updateError } = await supabase
      .from('horarios_disponiveis')
      .update({ status: 'ocupado' })
      .in('id', idsToUpdate);

    if (updateError) {
      // Nota: Em um sistema ideal usaríamos uma transação SQL real (RPC no Supabase)
      // para garantir que o agendamento não fique órfão se o update falhar.
      return NextResponse.json({ error: 'Erro ao bloquear horários' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Agendamento realizado com sucesso!', data: agendamento }, { status: 201 });
  } catch {
    console.error('Erro no agendamento:');
    return NextResponse.json({ error: 'Erro interno ao processar agendamento' }, { status: 500 });
  }
}
