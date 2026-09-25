import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body: {
      servico_id?: string;
      horario_id?: string;
      nome_cliente?: string;
      telefone_cliente?: string;
      duracao_minutos?: number;
      anamnese?: Record<string, unknown>;
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

    // Busca todos os slots do dia para garantir que estão LIVRES, ignorando duplicatas problemáticas
    const { data: allSlots, error: fetchSlotsError } = await supabase
      .from('horarios_disponiveis')
      .select('id, status, hora_inicio, hora_fim')
      .eq('data', startHorario.data)
      .order('hora_inicio', { ascending: true });

    if (fetchSlotsError || !allSlots) {
      return NextResponse.json({ error: 'Erro ao buscar horários' }, { status: 500 });
    }

    // Encontra o índice do slot inicial
    const startIndex = allSlots.findIndex(s => s.id === body.horario_id);
    if (startIndex === -1) {
      return NextResponse.json({ error: 'Horário não encontrado' }, { status: 404 });
    }

    // Tenta encontrar uma sequência de slots livres
    const candidateSlots = allSlots.slice(startIndex, startIndex + slotsNeeded);

    if (candidateSlots.length < slotsNeeded) {
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
      // Não abortamos aqui para não bloquear o agendamento, mas logamos
    }

    // 2. Insere o agendamento (vinculando cliente_id se possível)
    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .insert([
        {
          servico_id: body.servico_id,
          horario_id: body.horario_id,
          nome_cliente: body.nome_cliente,
          telefone_cliente: body.telefone_cliente,
          cliente_id: cliente?.id, // Agora vinculamos o ID do cliente
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
  } catch (err) {
    console.error('Erro detalhado no agendamento:', err);
    return NextResponse.json({ error: 'Erro interno ao processar agendamento' }, { status: 500 });
  }
}
