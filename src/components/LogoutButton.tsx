'use client';

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem('vitoria_auth');
        window.location.href = '/prof';
      }}
      className="text-[10px] uppercase tracking-widest text-text-muted hover:text-button-bg font-bold ml-4 border-l border-accent-lavender pl-4"
    >
      Encerrar Sessão
    </button>
  );
}
