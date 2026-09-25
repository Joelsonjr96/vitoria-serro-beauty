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

    // Atualiza o status do horário para ocupado
    const { error: updateError } = await supabase
      .from('horarios_disponiveis')
      .update({ status: 'ocupado' })
      .eq('id', body.horario_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Agendamento realizado com sucesso!', data: agendamento }, { status: 201 });
  } catch {
    console.error('Erro no agendamento:');
    return NextResponse.json({ error: 'Erro interno ao processar agendamento' }, { status: 500 });
  }
}
