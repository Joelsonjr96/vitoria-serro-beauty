import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import SafeImage from '@/components/SafeImage';

// Mapa de descrições e caminhos de imagem
const servicosInfo: Record<string, { desc: string, img: string }> = {
  "Extensão de Cílios Volume Brasileiro": {
    desc: "Fios tecnológicos em formato Y. Proporcionam um preenchimento marcante, com leveza e retenção prolongada.",
    img: "/images/volume brasileiro.png"
  },
  "Volume Egípcio": {
    desc: "Técnica com fios em formato W, proporcionando volume com aspecto natural e fios ultra leves.",
    img: "/images/volume egípcio.png"
  },
  "Volume Lasting": {
    desc: "Técnica exclusiva focada em máxima retenção e durabilidade, ideal para quem tem rotina agitada.",
    img: "/images/volume lasting.png"
  },
  "Lash Lifting": {
    desc: "Curvatura e hidratação dos seus cílios naturais, proporcionando um olhar aberto e radiante por semanas.",
    img: "/images/placeholder.jpg"
  },
  "Manutenção de Cílios": {
    desc: "Reposição dos fios para manter o olhar sempre impecável e a saúde dos cílios naturais.",
    img: "/images/placeholder.jpg"
  },
};

export default async function Home() {
  const { data: servicosRaw, error } = await supabase.from('servicos').select('*');

  if (error) {
    console.error('Error fetching services:', error);
    return <div className="p-6 text-red-600">Erro ao carregar serviços.</div>;
  }

  // Filtrar apenas serviços que possuem imagem definida (não placeholder)
  const servicos = servicosRaw?.filter(s =>
    servicosInfo[s.nome] &&
    servicosInfo[s.nome].img !== "/images/placeholder.jpg"
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section - Cenário de Alto Valor */}
      <header className="relative text-center py-32 md:py-44 px-6 overflow-hidden bg-brand-purple-dark">
        {/* Fundo: Foto em close-up dos cílios (trabalho da Vitória) */}
        <div className="absolute inset-0 z-0">
           <SafeImage
             src="/images/vitoria serro.jpg"
             alt="Close-up Lash Design"
             className="w-full h-full object-cover"
           />
        </div>

        {/* Overlay (Filtro de Escurecimento) em tom roxo escuro da marca */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(180deg, rgba(42, 22, 59, 0.75) 0%, rgba(15, 5, 23, 0.85) 100%)'
          }}
        ></div>

        <div className="max-w-4xl mx-auto relative z-20 animate-in fade-in zoom-in duration-1000">
          {/* Aplicação da Logo: Logo Ouro centralizada */}
          <div className="mb-10 flex justify-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <SafeImage
              src="/images/LOGO DOURADA.png"
              alt="Vitória Serro Beauty Ouro"
              className="h-40 md:h-56 w-auto object-contain"
            />
          </div>

          {/* Texto Branco centralizado */}
          <div className="space-y-6">
            <div className="h-px w-16 bg-[#E8D8CE] mx-auto mb-6 opacity-50"></div>
            <p className="text-white text-xl md:text-3xl font-light tracking-[0.2em] max-w-2xl mx-auto uppercase font-serif">
              Técnica, Leveza e Precisão
            </p>
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.4em] font-bold">
              A excelência no seu olhar
            </p>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="bg-bg-lavender-soft border border-accent-lavender p-10 md:p-12 my-20 max-w-4xl mx-auto rounded-[16px] shadow-sm">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
           <div className="h-80 rounded-[8px] overflow-hidden border border-accent-lavender bg-bg-lavender-soft/30">
              <SafeImage
                src="/images/vitoria serro.jpg"
                alt="Vitória Serro trabalhando"
                className="w-full h-full object-cover"
                objectPosition="top"
              />
           </div>
           <div>
              <h2 className="text-2xl font-serif text-text-main mb-4">Sobre a Vitória</h2>
              <p className="text-text-muted font-medium">Especialista em olhar, trazendo técnicas de alta retenção e biossegurança para valorizar sua beleza natural.</p>
           </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-serif text-text-main mb-12 text-center">Nossos Serviços</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicos && servicos.length > 0 ? (
            servicos.map((servico, index) => (
              <div key={servico.id} className="bg-bg-card border border-accent-lavender shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-[16px] flex flex-col group transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden card-hover-effect">
                <div className="relative h-[200px] w-full overflow-hidden bg-bg-lavender-soft/30">
                  <SafeImage
                    src={servicosInfo[servico.nome]?.img || "/images/placeholder.jpg"}
                    alt={servico.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                    <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm border border-accent-lavender/30 w-fit">
                      <SafeImage
                        src="/images/LOGO PRETA.png"
                        alt="VS Monograma"
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                    {index === 0 && (
                      <span className="bg-bg-lavender-soft text-button-bg text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-accent-lavender rounded-full shadow-sm">
                        Mais Pedido
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-medium text-text-main mb-3 font-serif">{servico.nome}</h3>
                  <p className="text-text-muted text-sm mb-6 flex-1 font-medium">{servicosInfo[servico.nome]?.desc || "Serviço especializado de alta qualidade."}</p>

                  <div className="flex justify-between items-center text-sm text-text-main mb-6 font-mono border-t border-accent-lavender pt-4">
                    <span className="text-text-muted flex items-center gap-1">
                      <span className="text-button-bg">⏱️</span> {servico.duracao_minutos} min
                    </span>
                    <span className="font-bold flex items-center gap-1">
                      <span className="text-button-bg">🏷️</span> R$ {Number(servico.preco).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`/agendar/${servico.id}`}
                    className="block w-full bg-button-bg text-white py-4 text-center font-medium rounded-[8px] hover:bg-button-hover transition-all duration-200 active:scale-[0.98] btn-hover-effect"
                  >
                    Agendar Agora
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-muted text-center col-span-full">Nenhum serviço disponível no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}
