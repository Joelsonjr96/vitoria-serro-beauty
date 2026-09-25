'use client';

export default function LogoutButton() {
  return (
    <button
      onClick={() => {
        localStorage.removeItem('vitoria_auth');
        window.location.href = '/prof';
      }}
      className="text-[10px] uppercase tracking-widest text-text-muted hover:text-red-500 font-bold ml-4"
    >
      Sair
    </button>
  );
}
