
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateClientes() {
  console.log('Migrando clientes da tabela agendamentos para clientes...');

  // 1. Pega todos os agendamentos distintos por telefone
  const { data: agendamentos, error } = await supabase
    .from('agendamentos')
    .select('nome_cliente, telefone_cliente');

  if (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return;
  }

  // 2. Cria mapa de clientes únicos por telefone
  const clientesMap = new Map();
  agendamentos?.forEach(a => {
    if (a.telefone_cliente && !clientesMap.has(a.telefone_cliente)) {
      clientesMap.set(a.telefone_cliente, a.nome_cliente);
    }
  });

  // 3. Insere no CRM
  const clientesParaInserir = Array.from(clientesMap).map(([telefone, nome]) => ({
    nome,
    telefone
  }));

  const { error: insertError } = await supabase
    .from('clientes')
    .upsert(clientesParaInserir, { onConflict: 'telefone' });

  if (insertError) {
    console.error('Erro ao inserir clientes:', insertError);
  } else {
    console.log(`Migração concluída! ${clientesParaInserir.length} clientes registrados.`);
  }
}

migrateClientes();
