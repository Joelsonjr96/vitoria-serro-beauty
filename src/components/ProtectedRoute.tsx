'use client';

import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const auth = localStorage.getItem('vitoria_auth');
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_PROFESSIONAL_PASSWORD) {
      localStorage.setItem('vitoria_auth', 'true');
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta.');
    }
  };

  // Evita Hydration Mismatch: garante que o servidor e o cliente rendam o mesmo estado inicial (null)
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
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted/60 ml-1">Senha de Acesso</label>
              <input
                type="password"
                name="password"
                data-testid="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-accent-lavender bg-bg-primary/30 rounded-[12px] focus:border-button-bg outline-none transition-all placeholder:text-text-muted/30 font-mono"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              data-testid="login-button"
              className="w-full bg-button-bg text-white py-4 rounded-[12px] font-bold text-lg hover:bg-button-hover transition-all active:scale-[0.98] shadow-lg shadow-button-bg/10 mt-2 btn-hover-effect"
            >
              Entrar no Painel
            </button>
          </div>

          <p className="text-[10px] text-center text-text-muted/40 uppercase tracking-widest mt-8">
            Vitória Serro Beauty © {new Date().getFullYear()}
          </p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
