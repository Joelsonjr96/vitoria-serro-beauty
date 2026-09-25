import Link from "next/link";
import SafeImage from "./SafeImage";

export default function Footer() {
  return (
    <footer className="border-t border-brand-purple-dark bg-brand-purple-dark py-16 mt-20 text-white">
      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-8">
          <SafeImage
            src="/images/logo-fundo-preto.png"
            alt="Vitória Serro Beauty Logo Branca"
            className="h-16 w-auto object-contain"
            width={300}
            height={150}
          />
          <div>
            <h4 className="text-white/40 mb-3 uppercase tracking-widest text-[10px] font-bold">Localização</h4>
            <p className="text-white font-medium leading-relaxed text-sm">
              Av. Braz de Pina 1720<br />
              Vista Alegre, Rio de Janeiro - RJ
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-white/60 mb-3 uppercase tracking-widest text-[10px] font-bold">Dúvidas?</h4>
          <a
            href="https://wa.me/message/4AZMRHQMWHZTO1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-bold hover:text-button-bg transition-colors group"
          >
            <span>Falar no WhatsApp</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        <div>
          <h4 className="text-white/60 mb-3 uppercase tracking-widest text-[10px] font-bold">Social</h4>
          <a
            href="https://instagram.com/vitoriaserrobeauty"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-bold hover:text-button-bg transition-colors group"
          >
            <span>@vitoriaserrobeauty</span>
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/40 uppercase tracking-widest font-medium">
        <p>&copy; 2026 Vitória Serro Beauty. Todos os direitos reservados.</p>
        <Link
          href="/prof"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <span>Painel Profissional</span>
          <span className="text-[12px]">🔒</span>
        </Link>
      </div>
    </footer>
  );
}
