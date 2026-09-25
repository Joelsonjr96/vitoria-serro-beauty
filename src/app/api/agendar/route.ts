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

    // Insere o agendamento
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

    // Atualiza os horários necessários para ocupado
    const slotsNeeded = Math.ceil(body.duracao_minutos / 30);

    // Busca o horário inicial para encontrar os subsequentes
    const { data: startHorario } = await supabase
      .from('horarios_disponiveis')
      .select('data, hora_inicio')
      .eq('id', body.horario_id)
      .single();

    if (startHorario) {
      // Busca todos os horários do mesmo dia a partir do horário de início
      const { data: candidateSlots } = await supabase
        .from('horarios_disponiveis')
        .select('id, hora_inicio')
        .eq('data', startHorario.data)
        .gte('hora_inicio', startHorario.hora_inicio)
        .order('hora_inicio', { ascending: true })
        .limit(slotsNeeded);

      if (candidateSlots && candidateSlots.length > 0) {
        const idsToUpdate = candidateSlots.map(s => s.id);

        const { error: updateError } = await supabase
          .from('horarios_disponiveis')
          .update({ status: 'ocupado' })
          .in('id', idsToUpdate);

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ message: 'Agendamento realizado com sucesso!', data: agendamento }, { status: 201 });
  } catch {
    console.error('Erro no agendamento:');
    return NextResponse.json({ error: 'Erro interno ao processar agendamento' }, { status: 500 });
  }
}
