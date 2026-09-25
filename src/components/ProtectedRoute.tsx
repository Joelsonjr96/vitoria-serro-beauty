'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Verifica se já existe uma sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Erro ao autenticar: ' + error.message);
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  };

  if (!isMounted || isAuthenticated === null) {
    return <div className="min-h-screen bg-bg-primary" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-bg-primary p-6">
        <form onSubmit={handleSubmit} className="bg-bg-card p-8 md:p-12 rounded-[24px] shadow-sm border border-accent-lavender max-w-sm w-full animate-in">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted font-bold mb-2 block">Área Restrita</span>
            <h2 className="text-3xl font-serif text-text-main">Acesso Profissional</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted/60 ml-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-accent-lavender bg-bg-primary/30 rounded-[12px] focus:border-button-bg outline-none transition-all placeholder:text-text-muted/30"
                placeholder="vitoria@studio.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted/60 ml-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="password-input"
                className="w-full p-4 border border-accent-lavender bg-bg-primary/30 rounded-[12px] focus:border-button-bg outline-none transition-all placeholder:text-text-muted/30 font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              data-testid="login-button"
              disabled={loading}
              className="w-full bg-button-bg text-white py-4 rounded-[12px] font-bold text-lg hover:bg-button-hover transition-all active:scale-[0.98] shadow-lg shadow-button-bg/10 mt-2 btn-hover-effect"
            >
              {loading ? 'Entrando...' : 'Entrar no Painel'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}