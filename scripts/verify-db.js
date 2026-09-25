
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyDb() {
  console.log('Verificando estado do banco de dados...');

  const tables = ['configuracoes', 'servicos', 'horarios_disponiveis'];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(5);

    if (error) {
      console.error(`Erro ao verificar tabela ${table}:`, error.message);
    } else {
      console.log(`Tabela ${table} (limit 5):`, JSON.stringify(data, null, 2));
    }
  }
}

verifyDb();
