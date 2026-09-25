'use client';

import { useState } from 'react';
import { Servico } from '@/types';
import { supabase } from '@/lib/supabase';

export default function ServicosManager({ initialServicos }: { initialServicos: Servico[] }) {
  const [servicos, setServicos] = useState<Servico[]>(initialServicos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados para o formulário (novo ou editando)
  const [formData, setFormData] = useState<Partial<Servico>>({
    nome: '',
    preco: 0,
    duracao_minutos: 30
  });

  const handleEdit = (s: Servico) => {
    setEditingId(s.id);
    setFormData(s);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ nome: '', preco: 0, duracao_minutos: 30 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('servicos')
          .update({
            nome: formData.nome,
            preco: formData.preco,
            duracao_minutos: formData.duracao_minutos
          })
          .eq('id', editingId);

        if (error) throw error;
        setServicos(prev => prev.map(s => s.id === editingId ? (formData as Servico) : s));
      } else {
        // Insert
        const { data, error } = await supabase
          .from('servicos')
          .insert([{
            nome: formData.nome,
            preco: formData.preco,
            duracao_minutos: formData.duracao_minutos
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) setServicos(prev => [...prev, data]);
      }
      handleCancel();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar serviço.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setServicos(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir serviço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-bg-lavender-soft/30 p-6 rounded-2xl border border-accent-lavender space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-button-bg mb-4">
          {editingId ? 'Editar Serviço' : 'Novo Serviço'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              className="w-full p-3 border border-accent-lavender bg-white rounded-xl text-sm outline-none focus:border-button-bg"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Preço (R$)</label>
            <input
              type="number"
              value={formData.preco}
              onChange={e => setFormData({...formData, preco: Number(e.target.value)})}
              className="w-full p-3 border border-accent-lavender bg-white rounded-xl text-sm outline-none focus:border-button-bg"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-text-muted">Duração (min)</label>
            <select
              value={formData.duracao_minutos}
              onChange={e => setFormData({...formData, duracao_minutos: Number(e.target.value)})}
              className="w-full p-3 border border-accent-lavender bg-white rounded-xl text-sm outline-none focus:border-button-bg"
            >
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
              <option value={120}>120 min</option>
              <option value={150}>150 min</option>
              <option value={180}>180 min</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-button-bg text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-button-hover transition-all disabled:opacity-50"
          >
            {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="border border-accent-lavender text-text-muted px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-all"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de Serviços */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">Serviços Atuais</h3>
        <div className="grid gap-3">
          {servicos.map(s => (
            <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-accent-lavender rounded-xl shadow-sm">
              <div>
                <p className="font-bold text-text-main">{s.nome}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest">
                  {s.duracao_minutos} min • R$ {Number(s.preco).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="p-2 text-button-bg hover:bg-bg-lavender-soft rounded-lg transition-colors"
                  title="Editar"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
