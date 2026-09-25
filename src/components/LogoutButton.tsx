'use client';

import { supabase } from '@/lib/supabase';

export default function LogoutButton() {
  const handleLogout = async () => {
    // 1. Remove a sessão do Supabase (para o RLS e auth saberem que saiu)
    await supabase.auth.signOut();

    // 2. Limpa o vestígio antigo do localStorage (se ainda houver)
    localStorage.removeItem('vitoria_auth');

    // 3. Recarrega a página para voltar à tela de login
    window.location.href = '/prof';
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[10px] uppercase tracking-widest text-text-muted hover:text-button-bg font-bold ml-4 border-l border-accent-lavender pl-4"
    >
      Encerrar Sessão
    </button>
  );
}
