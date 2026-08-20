import React from 'react';
import { Product, ScreenType } from '../types';

interface HomeScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onNavigate,
}) => {
  const eucalyptus = products.find((p) => p.id === 'eucalyptus-clay') || products[1];
  const wildOrange = products.find((p) => p.id === 'wild-orange-cedar') || products[2];
  const oatMilk = products.find((p) => p.id === 'oat-milk-honey') || products[3];

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="Ndolo Hero Image"
            className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrgCV7TNRmoM256IPC0HLS--65-VqXkjHcN0FtpCoa6yN_c9_VejaiVe0fiLcQ7EwKOEhuaV3tqmScY4jNywR6vhdQb_coyOCurMDDtd9jCF6czlSgRMjjIBmf6nW5SQAQauU8JbDpUbr_u_Om1GvPKJgJyLrSc7If1pb9PPg_QSg8QSD8jkgDn4i6yJtr3ghQEtXRNmFwSf87DNgAK6rcEGuRfNSpcDnPcsl45CwrmF9izFOTfaSi"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9f9] via-transparent to-black/20"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto mt-16 md:mt-20">
          <span className="text-xs uppercase tracking-[0.25em] text-[#1a191c] font-semibold bg-[#f9f9f9]/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 ambient-shadow-sm">
            Maison de Savonnerie Botanique
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#1a191c] mb-6 drop-shadow-sm leading-[1.15] tracking-tight">
            L'art du Bain Naturel
          </h1>
          <p className="text-base sm:text-lg text-[#434842] mb-10 max-w-xl leading-relaxed font-light">
            Découvrez le luxe discret des rituels Ndolol. Confectionnés artisanalement avec
            l'intention de transformer votre purification quotidienne en une expérience sensorielle régénératrice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              id="hero-discover-btn"
              onClick={() => {
                const element = document.getElementById('signature-collection');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  onNavigate('shop');
                }
              }}
              className="bg-[#1a191c] text-white px-9 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all duration-300 ambient-shadow hover:scale-105 active:scale-95 cursor-pointer"
            >
              Découvrir
            </button>
            <button
              onClick={() => onNavigate('rituals')}
              className="bg-[#f9f9f9]/90 text-[#1a191c] border border-[#1a191c]/30 px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#e2e0d7] transition-all duration-300 ambient-shadow-sm"
            >
              Le Savon Signature
            </button>
          </div>
        </div>
      </section>

      {/* Notre Vision Section */}
      <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1 relative h-[420px] md:h-[500px] rounded-3xl overflow-hidden ambient-shadow group">
            <img
              src="https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/706020754_122172378194893728_3880789243033241386_n.jpg?stp=dst-jpg_tt6&cstp=mx896x1190&ctp=s896x1190&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEPm3h6-YoYGgzjukGx-q79pkJYkDFg0XGmQliQMWDRcTbEabnzs7vPBo7vU-CO2dWdS8ElVoy8ktzu7rGlk1S_&_nc_ohc=6Zrk21YuNPEQ7kNvwGuBlvJ&_nc_oc=AdoTPLQ1Ki-RmZp2VTsmRsjyrUBR_PM_1vgQe_b5eDghDY-3F1vMkXT5cDsk0WRGPoI&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=BRWWCIOp7ZgEjOXddLWk9w&_nc_ss=7b2a8&oh=00_AQGaNVC75WolKyZydaAi9i_CHdznJO0J2P4Dalf1CDkvtw&oe=6A8CC997"
              alt="Artisanal soap bar with water droplets"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#f9f9f9]/90 backdrop-blur-md rounded-2xl p-4 border border-[#c4c8c0]/30 flex justify-between items-center text-xs text-[#434842]">
              <span className="font-serif italic text-sm text-[#1a191c]">
                Saponifié à froid — Cure de 6 semaines
              </span>
              <span className="font-semibold text-[#824f39]">100% Végétal</span>
            </div>
          </div>

          <div className="order-1 md:order-2 flex flex-col items-start">
            <span className="text-[#824f39] text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Notre Vision
            </span>
            <h2 className="font-serif-luxury text-3xl md:text-5xl text-[#1a191c] mb-6 leading-tight">
              Pureté à chaque service
            </h2>
            <p className="text-[#434842] text-base md:text-lg mb-8 text-left leading-relaxed font-light">
              Nous croyons que les soins de la peau doivent être un rituel simple, ancré dans la nature.
              Nos formules sont épurées de tout superflu et ne conservent que des Ndolols sauvages,
              des argiles nourrissantes et des huiles essentielles pures.
              Il en résulte une expérience tactile et authentique qui vous reconnecte au monde physique tout en purifiant délicatement votre corps.
            </p>
            <ul className="space-y-4 text-base text-[#1a1c1c] w-full">
              <li className="flex items-center gap-3.5 bg-white/70 p-3 rounded-2xl border border-[#e2e2e2]">
                <span className="material-symbols-outlined text-[#1a191c] bg-[#d4e8d0]/50 p-2 rounded-xl text-[20px]">
                  eco
                </span>
                <span className="font-medium text-sm md:text-base">Ingrédients 100% naturels</span>
              </li>
              <li className="flex items-center gap-3.5 bg-white/70 p-3 rounded-2xl border border-[#e2e2e2]">
                <span className="material-symbols-outlined text-[#1a191c] bg-[#d4e8d0]/50 p-2 rounded-xl text-[20px]">
                  water_drop
                </span>
                <span className="font-medium text-sm md:text-base">Saponifié à froid pour préserver la puissance</span>
              </li>
              <li className="flex items-center gap-3.5 bg-white/70 p-3 rounded-2xl border border-[#e2e2e2]">
                <span className="material-symbols-outlined text-[#1a191c] bg-[#d4e8d0]/50 p-2 rounded-xl text-[20px]">
                  recycling
                </span>
                <span className="font-medium text-sm md:text-base">Emballage sans plastique</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Signature Collection */}
      <section id="signature-collection" className="py-24 bg-[#f3f3f4] w-full transition-colors">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="text-[#824f39] text-xs font-bold uppercase tracking-[0.2em] block mb-2">
              Collection Botanique
            </span>
            <h2 className="font-serif-luxury text-3xl md:text-5xl text-[#1a191c] mb-4">
              La Collection Signature
            </h2>
            <p className="text-sm md:text-base text-[#434842] font-light">
              Des créations pures et sensorielles élaborées pour transformer le geste quotidien en
              moment de bien-être profond.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Product Card 1: Eucalyptus & French Clay */}
            {eucalyptus && (
              <div className="bg-white p-6 rounded-3xl ambient-shadow flex flex-col items-center border border-[#c4c8c0]/30 group hover:-translate-y-1.5 transition-all duration-300">
                <div
                  onClick={() => onSelectProduct(eucalyptus)}
                  className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative cursor-pointer bg-[#eeeeee]"
                >
                  <img
                    src={eucalyptus.images[0]}
                    alt={eucalyptus.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#d4e8d0]/90 text-[#b7003a] text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full backdrop-blur-xs">
                    Purifiant
                  </span>
                </div>
                <h3
                  onClick={() => onSelectProduct(eucalyptus)}
                  className="font-serif-luxury text-2xl text-[#1a191c] mb-2 cursor-pointer hover:underline"
                >
                  {eucalyptus.name}
                </h3>
                <p className="text-sm text-[#434842] text-center mb-4 font-light">
                  {eucalyptus.tagline}
                </p>
                <div className="text-lg font-serif text-[#1a1c1c] font-semibold mb-6">
                  {eucalyptus.price.toFixed(2)} €
                </div>
                <div className="mt-auto w-full flex flex-col gap-2.5">
                  <button
                    onClick={() => onSelectProduct(eucalyptus)}
                    className="w-full py-2.5 border border-[#1a191c] text-[#1a191c] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#e2e0d7] transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onAddToCart(eucalyptus, 1)}
                    className="w-full py-2.5 bg-[#1a191c] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#b7003a] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    Ajouter au Panier
                  </button>
                </div>
              </div>
            )}

            {/* Product Card 2: Wild Orange & Cedar (Featured/Taller slight offset) */}
            {wildOrange && (
              <div className="bg-white p-6 rounded-3xl ambient-shadow flex flex-col items-center border border-[#c4c8c0]/40 md:-mt-6 md:mb-6 group hover:-translate-y-1.5 transition-all duration-300 relative ring-1 ring-[#824f39]/20">
                <span className="absolute -top-3.5 bg-[#824f39] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-sm">
                  Coup de Cœur
                </span>
                <div
                  onClick={() => onSelectProduct(wildOrange)}
                  className="w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 relative cursor-pointer bg-[#eeeeee]"
                >
                  <img
                    src={wildOrange.images[0]}
                    alt={wildOrange.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#ffdbce]/90 text-[#693a26] text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full backdrop-blur-xs">
                    Énergisant
                  </span>
                </div>
                <h3
                  onClick={() => onSelectProduct(wildOrange)}
                  className="font-serif-luxury text-2xl text-[#1a191c] mb-2 cursor-pointer hover:underline"
                >
                  {wildOrange.name}
                </h3>
                <p className="text-sm text-[#434842] text-center mb-4 font-light">
                  {wildOrange.tagline}
                </p>
                <div className="text-lg font-serif text-[#1a1c1c] font-semibold mb-6">
                  {wildOrange.price.toFixed(2)} €
                </div>
                <div className="mt-auto w-full flex flex-col gap-2.5">
                  <button
                    onClick={() => onSelectProduct(wildOrange)}
                    className="w-full py-2.5 border border-[#1a191c] text-[#1a191c] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#e2e0d7] transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onAddToCart(wildOrange, 1)}
                    className="w-full py-2.5 bg-[#1a191c] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#b7003a] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    Ajouter au Panier
                  </button>
                </div>
              </div>
            )}

            {/* Product Card 3: Oat Milk & Honey */}
            {oatMilk && (
              <div className="bg-white p-6 rounded-3xl ambient-shadow flex flex-col items-center border border-[#c4c8c0]/30 group hover:-translate-y-1.5 transition-all duration-300">
                <div
                  onClick={() => onSelectProduct(oatMilk)}
                  className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative cursor-pointer bg-[#eeeeee]"
                >
                  <img
                    src={oatMilk.images[0]}
                    alt={oatMilk.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#e5e2da]/90 text-[#474741] text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full backdrop-blur-xs">
                    Peaux Sensibles
                  </span>
                </div>
                <h3
                  onClick={() => onSelectProduct(oatMilk)}
                  className="font-serif-luxury text-2xl text-[#1a191c] mb-2 cursor-pointer hover:underline"
                >
                  {oatMilk.name}
                </h3>
                <p className="text-sm text-[#434842] text-center mb-4 font-light">
                  {oatMilk.tagline}
                </p>
                <div className="text-lg font-serif text-[#1a1c1c] font-semibold mb-6">
                  {oatMilk.price.toFixed(2)} €
                </div>
                <div className="mt-auto w-full flex flex-col gap-2.5">
                  <button
                    onClick={() => onSelectProduct(oatMilk)}
                    className="w-full py-2.5 border border-[#1a191c] text-[#1a191c] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#e2e0d7] transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onAddToCart(oatMilk, 1)}
                    className="w-full py-2.5 bg-[#1a191c] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#b7003a] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    Ajouter au Panier
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Full Catalog CTA */}
          <div className="mt-16">
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-[#1a191c] font-semibold hover:gap-3 transition-all border-b-2 border-[#1a191c]/40 pb-1"
            >
              Explorer Tous Les Soins Botaniques
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Scent & Atmosphere Banner */}
      <section className="py-20 px-6 md:px-16 max-w-[1280px] mx-auto w-full">
        <div className="bg-[#d4e8d0]/30 rounded-3xl p-8 md:p-14 border border-[#1a191c]/15 flex flex-col md:flex-row items-center justify-between gap-8 ambient-shadow-sm">
          <div className="max-w-xl">
            <span className="text-[#824f39] text-xs font-bold uppercase tracking-[0.2em] block mb-2">
              L'Expérience Sensorielle
            </span>
            <h3 className="font-serif-luxury text-3xl md:text-4xl text-[#1a191c] mb-4">
              L'équilibre d'une formule surgrasse
            </h3>
            <p className="text-[#434842] text-sm md:text-base leading-relaxed font-light">
              Chaque pain de savon conserve 100% de sa glycérine naturelle issue d'une saponification
              lente à froid de 6 semaines. Votre peau retrouve douceur, confort et souplesse dès la
              première utilisation.
            </p>
          </div>
          <button
            onClick={() => onNavigate('rituals')}
            className="whitespace-nowrap bg-[#1a191c] text-white px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-colors ambient-shadow shrink-0"
          >
            Découvrir le Rituel
          </button>
        </div>
      </section>
    </div>
  );
};
