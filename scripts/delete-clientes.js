import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deleteClientes() {
  console.log('Deletando todos os clientes...');
  const { error } = await supabase.from('clientes').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all

  if (error) {
    console.error('Erro ao deletar clientes:', error);
  } else {
    console.log('Todos os clientes deletados.');
  }
}

deleteClientes();
