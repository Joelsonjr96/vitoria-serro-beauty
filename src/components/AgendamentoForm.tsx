'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgendamentoForm({ servico, horario }: { servico: any, horario: any }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/agendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        servico_id: servico.id,
        horario_id: horario.id,
        nome_cliente: nome,
        telefone_cliente: telefone,
      }),
    });

    if (res.ok) {
      router.push(`/agendado/${horario.id}`);
    } else {
      alert('Erro ao agendar.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm border border-zinc-200">
      <div className="mb-4">
        <p className="font-semibold text-zinc-900">{horario.data}</p>
        <p className="text-zinc-600">{horario.hora_inicio} - {horario.hora_fim}</p>
      </div>
      <input
        type="text"
        placeholder="Seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
        required
      />
      <input
        type="tel"
        placeholder="Seu telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-zinc-900 text-white py-2 rounded disabled:bg-zinc-500"
      >
        {loading ? 'Agendando...' : 'Confirmar Agendamento'}
      </button>
    </form>
  );
}
