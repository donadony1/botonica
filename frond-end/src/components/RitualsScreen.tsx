import React from 'react';
import { Product, ScreenType } from '../types';
import { REVIEWS } from '../data/products';

interface RitualsScreenProps {
  signatureProduct: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const RitualsScreen: React.FC<RitualsScreenProps> = ({
  signatureProduct,
  onAddToCart,
  onSelectProduct,
  onNavigate,
}) => {
  return (
    <div className="w-full flex-grow pt-8 pb-20 px-5 md:px-12 max-w-[1280px] mx-auto">
      {/* Hero Section: Transformez votre douche en rituel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-24 md:mb-32">
        <div className="order-2 md:order-1 flex flex-col justify-center">
          <span className="text-xs font-bold text-[#824f39] uppercase tracking-[0.2em] mb-4 inline-block">
            Le Savon Signature
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#1a1c1c] mb-6 leading-[1.15]">
            Transformez votre douche en rituel
          </h1>
          <p className="text-base sm:text-lg text-[#434842] mb-8 max-w-lg leading-relaxed font-light">
            Découvrez l'art du soin au naturel. Notre savon signature allie des ingrédients bruts
            d'exception pour une expérience sensorielle inégalée, nettoyant en douceur tout en
            respectant l'équilibre de votre peau.
          </p>

          <ul className="space-y-3.5 mb-10">
            <li className="flex items-center text-sm md:text-base text-[#434842] font-normal">
              <span className="material-symbols-outlined text-[#bb0a4a] mr-3 text-[22px]">
                eco
              </span>
              100% Naturel & Fait Main
            </li>
            <li className="flex items-center text-sm md:text-base text-[#434842] font-normal">
              <span className="material-symbols-outlined text-[#bb0a4a] mr-3 text-[22px]">
                water_drop
              </span>
              Hydratation Intense (Surgras 8%)
            </li>
            <li className="flex items-center text-sm md:text-base text-[#434842] font-normal">
              <span className="material-symbols-outlined text-[#bb0a4a] mr-3 text-[22px]">
                local_florist
              </span>
              Parfum Subtil Floral & Boisé
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              id="rituals-buy-signature-btn"
              onClick={() => onAddToCart(signatureProduct, 1)}
              className="bg-[#bb0a4a] text-white text-xs font-semibold uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:bg-[#b7003a] transition-all shadow-md active:scale-95 text-center cursor-pointer"
            >
              Acheter maintenant - {signatureProduct.price.toFixed(2)}€
            </button>
            <button
              onClick={() => onSelectProduct(signatureProduct)}
              className="border border-[#c4c8c0] text-[#1a1c1c] text-xs font-semibold uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:bg-[#e2e0d7] transition-all text-center cursor-pointer"
            >
              En savoir plus
            </button>
          </div>
        </div>

        <div className="order-1 md:order-2 w-full h-[380px] sm:h-[480px] md:h-[580px] rounded-3xl overflow-hidden ambient-shadow ring-1 ring-[#bb0a4a]/10 group">
          <img
            alt="Le Savon Signature Ndolo"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/706020754_122172378194893728_3880789243033241386_n.jpg?stp=dst-jpg_tt6&cstp=mx896x1190&ctp=s896x1190&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEPm3h6-YoYGgzjukGx-q79pkJYkDFg0XGmQliQMWDRcTbEabnzs7vPBo7vU-CO2dWdS8ElVoy8ktzu7rGlk1S_&_nc_ohc=6Zrk21YuNPEQ7kNvwGuBlvJ&_nc_oc=AdoTPLQ1Ki-RmZp2VTsmRsjyrUBR_PM_1vgQe_b5eDghDY-3F1vMkXT5cDsk0WRGPoI&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=BRWWCIOp7ZgEjOXddLWk9w&_nc_ss=7b2a8&oh=00_AQGaNVC75WolKyZydaAi9i_CHdznJO0J2P4Dalf1CDkvtw&oe=6A8CC997"
          />
        </div>
      </section>

      {/* Bento Grid Benefits: L'Équilibre Parfait */}
      <section className="mb-28 md:mb-36">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#824f39] uppercase tracking-[0.2em] block mb-2">
            La Méthode Ndolo
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#1a1c1c]">
            L'Équilibre Parfait
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Benefit 1 */}
          <div className="bg-white p-8 rounded-3xl border border-[#e2e2e2] ambient-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-[#d4e8d0]/40 flex items-center justify-center mb-6 text-[#bb0a4a]">
                <span className="material-symbols-outlined text-[24px]">spa</span>
              </div>
              <h3 className="font-serif-luxury text-2xl text-[#1a1c1c] mb-4">Pureté Végétale</h3>
              <p className="text-sm md:text-base text-[#434842] leading-relaxed font-light">
                Formulé sans huiles de palme ni conservateurs synthétiques. Uniquement des huiles
                végétales nobles pressées à froid pour préserver intactes leurs vertus thérapeutiques.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[#e2e2e2] text-xs text-[#824f39] uppercase font-semibold tracking-wider">
              Zéro additif chimique
            </div>
          </div>

          {/* Benefit 2 (Image Highlight with background) */}
          <div className="bg-[#e2e0d7] p-8 md:p-10 rounded-3xl md:col-span-2 ambient-shadow flex flex-col md:flex-row gap-8 items-center overflow-hidden relative border border-[#c4c8c0]/40">
            <div className="md:w-3/5 z-10">
              <span className="text-xs font-bold text-[#824f39] uppercase tracking-[0.2em] mb-2 inline-block">
                Saponification à froid
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1a1c1c] mb-4">
                Gorgé de Glycérine
              </h3>
              <p className="text-sm md:text-base text-[#434842] mb-6 leading-relaxed font-light">
                Notre processus artisanal lent permet de conserver naturellement la glycérine
                hydratante. Le résultat ? Une mousse onctueuse qui ne tiraille jamais la peau après
                la douche.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <span className="bg-white/70 backdrop-blur-xs px-4 py-2 rounded-full text-xs font-medium text-[#1a1c1c] border border-white/50">
                  Huile d'Olive Vierge
                </span>
                <span className="bg-white/70 backdrop-blur-xs px-4 py-2 rounded-full text-xs font-medium text-[#1a1c1c] border border-white/50">
                  Beurre de Karité Brut
                </span>
                <span className="bg-white/70 backdrop-blur-xs px-4 py-2 rounded-full text-xs font-medium text-[#1a1c1c] border border-white/50">
                  Lavande Fine
                </span>
              </div>
            </div>

            <div className="md:w-2/5 w-full h-48 md:h-64 rounded-2xl overflow-hidden relative shadow-md">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEWX-NPbhrLD42jhYEUi_9it2sEvI8zPCa_PwAgrMYjkjp3wOq9b9C0QdYQR2sEfQeigfbL6ySk46prAPMHNGe7X9CC7RLVYz5ctxe52ln5eXPjVy8i-QaQgb7zG_Xe38zQ7DVhh12aXOTkdiwRQDxviGqiF23jNFHBCXjTrFIVDXLUANccf5hKlyT6Cdbz-60IAdphBHELNxX75Fq8s1gvFEeC35GiiYBhfQB6tfpu1ElD2Hwd9Qt"
                alt="Ingrédients bruts naturels"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials: Ce qu'elles en disent */}
      <section className="mb-28 md:mb-36 bg-[#d4e8d0]/25 -mx-5 md:-mx-12 px-6 md:px-12 py-20 md:py-24 rounded-3xl border border-[#bb0a4a]/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#824f39] uppercase tracking-[0.2em] block mb-2">
            Avis Vérifiés
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#1a1c1c]">
            Ce qu'elles en disent
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1280px] mx-auto">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-2xl border border-[#e2e2e2] ambient-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex text-[#824f39] mb-4 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {i < Math.floor(review.rating) ? 'star' : 'star_half'}
                    </span>
                  ))}
                </div>
                <p className="text-sm md:text-base text-[#434842] italic mb-6 leading-relaxed font-light">
                  "{review.comment}"
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-[#f3f3f4] pt-4">
                <p className="text-xs uppercase tracking-widest text-[#1a1c1c] font-semibold">
                  — {review.author}
                </p>
                {review.productName && (
                  <span className="text-[11px] text-[#bb0a4a] font-serif">
                    {review.productName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA: Prête à changer votre routine ? */}
      <section className="flex flex-col items-center justify-center text-center py-12 md:py-20 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#824f39] uppercase tracking-[0.2em] block mb-3">
          Passer au Rituel Botanique
        </span>
        <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#1a1c1c] mb-6">
          Prête à changer votre routine ?
        </h2>
        <p className="text-base sm:text-lg text-[#434842] mb-10 leading-relaxed font-light">
          Rejoignez des milliers de femmes qui ont fait le choix d'un soin respectueux de leur peau
          et de l'environnement.
        </p>
        <button
          id="rituals-cta-add-to-cart-btn"
          onClick={() => onAddToCart(signatureProduct, 1)}
          className="bg-[#bb0a4a] text-white text-xs font-semibold uppercase tracking-[0.2em] py-4 px-12 rounded-full hover:bg-[#b7003a] transition-all shadow-md hover:-translate-y-0.5 active:scale-95 duration-300 cursor-pointer"
        >
          Ajouter au Panier - {signatureProduct.price.toFixed(2)}€
        </button>
        <p className="text-xs text-[#434842] mt-6 opacity-80 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-[#bb0a4a]">
            local_shipping
          </span>
          Livraison offerte dès 50€ d'achat • Expédition sous 24h
        </p>
      </section>
    </div>
  );
};
