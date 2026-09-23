require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function populate() {
  console.log('Populando dados...');

  // 1. Inserir Serviços
  const { data: servicos, error: servicoError } = await supabase
    .from('servicos')
    .insert([
      { nome: 'Extensão de Cílios Volume Brasileiro', duracao_minutos: 120, preco: 150.00 },
      { nome: 'Lash Lifting', duracao_minutos: 60, preco: 100.00 },
      { nome: 'Manutenção de Cílios', duracao_minutos: 90, preco: 120.00 },
    ])
    .select();

  if (servicoError) console.error('Erro serviços:', servicoError);
  else console.log('Serviços inseridos:', servicos);

  // 2. Inserir Horários (próximos 3 dias)
  const horarios = [];
  const hoje = new Date();
  for (let i = 1; i <= 3; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    const dataStr = data.toISOString().split('T')[0];

    horarios.push(
      { data: dataStr, hora_inicio: '09:00:00', hora_fim: '10:00:00', status: 'livre' },
      { data: dataStr, hora_inicio: '10:00:00', hora_fim: '11:00:00', status: 'livre' },
      { data: dataStr, hora_inicio: '14:00:00', hora_fim: '15:00:00', status: 'livre' }
    );
  }

  const { data: horariosRes, error: horarioError } = await supabase
    .from('horarios_disponiveis')
    .insert(horarios)
    .select();

  if (horarioError) console.error('Erro horários:', horarioError);
  else console.log('Horários inseridos:', horariosRes);
}

populate();
