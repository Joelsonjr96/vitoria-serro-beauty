const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function popularHorarios() {
  console.log('Iniciando povoamento de horários...');

  const hoje = new Date();
  const horariosParaInserir = [];

  // Próximos 7 dias
  for (let i = 1; i <= 7; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    const dataString = data.toISOString().split('T')[0];

    // Horários padrão: 09:00, 10:30, 13:00, 14:30, 16:00
    const slots = ['09:00', '10:30', '13:00', '14:30', '16:00'];

    slots.forEach(hora => {
      horariosParaInserir.push({
        data: dataString,
        hora_inicio: hora,
        hora_fim: somarMinutos(hora, 90),
        status: 'livre'
      });
    });
  }

  const { data, error } = await supabase
    .from('horarios_disponiveis')
    .insert(horariosParaInserir)
    .select();

  if (error) {
    console.error('Erro ao inserir horários:', error);
  } else {
    console.log(`Sucesso! ${data.length} horários criados para os próximos 7 dias.`);
  }
}

function somarMinutos(hora, minutos) {
  const [h, m] = hora.split(':').map(Number);
  const data = new Date();
  data.setHours(h, m + minutos, 0);
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

popularHorarios();
