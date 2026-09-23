import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { servico_id, horario_id, nome_cliente, telefone_cliente } = await request.json();

    if (!servico_id || !horario_id || !nome_cliente || !telefone_cliente) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    // Insere o agendamento
    const { data, error } = await supabase
      .from('agendamentos')
      .insert([
        {
          servico_id,
          horario_id,
          nome_cliente,
          telefone_cliente,
          status: 'confirmado',
          criado_em: new Date().toISOString(),
        },
      ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Atualiza o status do horário para ocupado
    const { error: updateError } = await supabase
      .from('horarios_disponiveis')
      .update({ status: 'ocupado' })
      .eq('id', horario_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Agendamento realizado com sucesso!', data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno ao processar agendamento' }, { status: 500 });
  }
}
