'use client';

import { useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_PROFESSIONAL_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Senha incorreta.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 p-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-sm border border-zinc-200">
          <h2 className="mb-4 text-xl font-bold">Acesso Profissional</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="Digite a senha"
          />
          <button type="submit" className="w-full bg-zinc-900 text-white py-2 rounded">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
