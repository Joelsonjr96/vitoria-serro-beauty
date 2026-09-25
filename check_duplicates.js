import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkDuplicates() {
  const { data, error } = await supabase
    .from('horarios_disponiveis')
    .select('data, hora_inicio');

  if (error) {
    console.error(error);
    return;
  }

  const map = new Map();
  const duplicates = [];
  data.forEach(item => {
    const key = `${item.data}-${item.hora_inicio}`;
    if (map.has(key)) {
      duplicates.push(key);
    } else {
      map.set(key, true);
    }
  });

  console.log('Duplicates:', duplicates);
}

checkDuplicates();
