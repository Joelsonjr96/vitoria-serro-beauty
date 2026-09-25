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

    // Chama a função RPC atômica
    const { data, error } = await supabase.rpc('book_appointment', {
      p_servico_id: body.servico_id,
      p_horario_id: body.horario_id,
      p_nome_cliente: body.nome_cliente,
      p_telefone_cliente: body.telefone_cliente,
      p_anamnese: body.anamnese || {},
      p_duracao_minutos: body.duracao_minutos || 30
    });

    if (error) {
      console.error('Erro na RPC book_appointment:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Agendamento realizado com sucesso!' }, { status: 201 });
  } catch (err) {
    console.error('Erro detalhado no agendamento:', err);
    return NextResponse.json({ error: 'Erro interno ao processar agendamento' }, { status: 500 });
  }
}
