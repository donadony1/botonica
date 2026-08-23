import React from 'react';
import { Product, Article, ScreenType } from '../types';
import { ARTICLES } from '../data/articles';
import { useLanguage } from '../context/LanguageContext';

interface HomeScreenProps {
  products: Product[];
  articles?: Article[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectArticle?: (article: Article) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  articles = [],
  onSelectProduct,
  onAddToCart,
  onSelectArticle,
  onNavigate,
}) => {
  const { language, t } = useLanguage();

  // Find signature product and featured products
  const signatureProduct =
    products.find((p) => p.id === 'savon-signature') ||
    products.find((p) => p.featured) ||
    products[0];

  const featuredProducts = products.filter((p) => p.id !== signatureProduct?.id).slice(0, 3);
  const activeArticleList = articles.length > 0 ? articles : ARTICLES;
  const latestArticles = activeArticleList.slice(0, 3);

  return (
    <div className="w-full flex flex-col bg-[#fdf9f5] text-[#1c1c19] overflow-hidden">
      {/* ─── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 md:px-12 pt-8 md:pt-14 pb-16 md:pb-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14">
        <div className="w-full md:w-1/2 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6D5C3]/60 border border-[#D7B49E]/40 w-fit text-[#3D2B1F] text-xs font-semibold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[16px] text-[#824f39]">spa</span>
            <span>{language === 'fr' ? 'Saponification Ancestrale & Éthique' : 'Ancestral & Ethical Soapmaking'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#26170c] leading-[1.15] font-normal tracking-tight">
            {language === 'fr' ? (
              <>
                Ndolo : Le Rituel de Soin Ancestral pour une <span className="italic font-serif text-[#3D2B1F]">Peau Éclatante</span>
              </>
            ) : (
              <>
                Ndolo: The Ancestral Care Ritual for <span className="italic font-serif text-[#3D2B1F]">Radiant Skin</span>
              </>
            )}
          </h1>

          <p className="text-base md:text-lg text-[#4f453f] leading-relaxed font-light">
            {language === 'fr'
              ? "Une synergie pure d'ingrédients naturels sourcés éthiquement au Cameroun et au Ghana. Redécouvrez la sagesse de la terre pour une peau apaisée, purifiée et lumineuse."
              : 'A pure synergy of natural ingredients ethically sourced in Cameroon and Ghana. Rediscover earth wisdom for deeply soothed, purified, and glowing skin.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-[#3D2B1F] hover:bg-[#26170c] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'fr' ? 'Découvrir la Boutique' : 'Explore the Shop'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <button
              onClick={() => onNavigate('rituals')}
              className="bg-white/80 hover:bg-[#E6D5C3]/40 text-[#3D2B1F] border border-[#D7B49E]/60 px-7 py-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>{language === 'fr' ? 'Le Rituel Signature' : 'The Signature Ritual'}</span>
            </button>
          </div>

          {/* Quick micro-badges */}
          <div className="pt-4 border-t border-[#E6D5C3]/60 grid grid-cols-3 gap-3 text-center sm:text-left">
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#3D2B1F]">100%</span>
              <span className="text-[11px] text-[#4f453f] uppercase tracking-wider">{language === 'fr' ? 'Naturel' : 'Natural'}</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#3D2B1F]">0%</span>
              <span className="text-[11px] text-[#4f453f] uppercase tracking-wider">{language === 'fr' ? 'Plastique' : 'Plastic Free'}</span>
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#3D2B1F]">14 Jours</span>
              <span className="text-[11px] text-[#4f453f] uppercase tracking-wider">{language === 'fr' ? 'Résultats Visibles' : 'Visible Glow'}</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="w-full md:w-1/2 relative rounded-3xl overflow-hidden shadow-xl border border-[#E6D5C3]/70 h-[380px] sm:h-[460px] md:h-[540px] group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgzYo9pIi0DtyG0IpLMPOPOLdTTp_IFTvNQo7KE4UZEwFnQQTEfHxYs9-XxrAl0hsEXc45_wE5WAysIaboHJax-ynjGqiru30UDHJFqOUEb2oV3mwFwpXy3n2ZDcaNEWH0parFyb_3mhdZ93-86LYH-dwbRFsWikxCdkUpJfjtNp_Fscqa8RabYwGJTXoYQlCqTxhgPzblaDZCMZ-HPvex8HCJzVlBViESpi0dfY7HUVnv8jxp8Fk4JsuKycAzQ8rh-A"
            alt="Ndolo African Black Soap Editorial Art"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#26170c]/50 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3D2B1F] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <span className="text-xs font-bold text-[#26170c] block">Savon Noir Brut Artisanal</span>
                <span className="text-[11px] text-[#4f453f]">Karité brut, cacao & cendres végétales</span>
              </div>
            </div>
            <button
              onClick={() => onSelectProduct(signatureProduct)}
              className="bg-[#3D2B1F] hover:bg-[#bb0a4a] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Découvrir
            </button>
          </div>
        </div>
      </section>

      {/* ─── 2. FULL-WIDTH VIDEO BANNER ────────────────────────────── */}
      <section className="px-5 sm:px-8 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto w-full">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E6D5C3]/60 bg-[#1c1c19] flex flex-col md:flex-row items-center justify-between">
          {/* Video Container (Responsive 16:9 / Facebook Reel) */}
          <div className="w-full md:w-3/5 relative aspect-video sm:min-h-[380px] md:min-h-[460px] bg-black flex items-center justify-center overflow-hidden">
            <iframe
              src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F978393698492172%2F&show_text=false&width=560&t=0"
              title="Ndolo Rituals - Fabrication & Savoir-Faire"
              className="w-full h-full object-cover"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>

          {/* Video Description & Story Box */}
          <div className="w-full md:w-2/5 p-6 sm:p-10 md:p-12 text-white space-y-4 bg-gradient-to-b from-[#26170c] to-[#1c1c19]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6D5C3]/15 text-[#D7B49E] text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>{language === 'fr' ? 'Vidéo Démonstration' : 'Live Demo'}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white leading-tight font-normal">
              {language === 'fr' ? "L'authenticité d'un savoir-faire en action" : 'Authentic Craftsmanship in Action'}
            </h3>

            <p className="text-xs sm:text-sm text-[#fdf9f5]/80 font-light leading-relaxed">
              {language === 'fr'
                ? "Découvrez en vidéo la texture onctueuse, la mousse généreuse et la pureté brute de notre savon noir ancestral Ndolo."
                : "Watch the creamy lather, rich texture, and raw purity of our ancestral Ndolo Black Soap in action."}
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-[#D7B49E] hover:bg-white text-[#26170c] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{language === 'fr' ? 'Commander maintenant' : 'Order now'}</span>
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HERITAGE SECTION ("L'Héritage de l'Amour") ───────────── */}
      <section className="bg-[#E6D5C3]/25 py-16 md:py-24 px-5 sm:px-8 md:px-12 border-y border-[#E6D5C3]/40">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-[#E6D5C3] flex items-center justify-center text-[#3D2B1F] shadow-xs">
            <span className="material-symbols-outlined text-[28px]">favorite</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#824f39]">
            {language === 'fr' ? 'Notre Histoire & Philosophie' : 'Our Story & Philosophy'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#26170c] leading-tight font-normal">
            {language === 'fr' ? "L'Héritage de l'Amour" : 'The Heritage of Love'}
          </h2>

          <p className="text-base sm:text-lg text-[#4f453f] leading-relaxed font-light max-w-3xl">
            {language === 'fr'
              ? 'En langue Duala, "Ndolo" signifie amour. C\'est avec cet amour profond pour notre héritage que nous formulons nos soins botaniques. Chaque bloc est le fruit d\'un savoir-faire artisanal transmis de génération en génération, soutenu par des coopératives de femmes dévouées qui perpétuent cette tradition de pureté et d\'excellence.'
              : 'In the Duala language, "Ndolo" means love. It is with this profound love for our ancestral roots that we formulate our soaps. Each bar is the fruit of generational craftsmanship, sustained by devoted women cooperatives who preserve this tradition of uncompromised purity.'}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('rituals')}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#3D2B1F] hover:text-[#bb0a4a] transition-colors border-b-2 border-[#3D2B1F] hover:border-[#bb0a4a] pb-1 cursor-pointer"
            >
              <span>{language === 'fr' ? 'En savoir plus sur nos engagements' : 'Discover our commitments'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── 4. THE INGREDIENTS ("La Pureté de la Terre") ────────────── */}
      <section className="py-16 md:py-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#824f39] block mb-2">
            {language === 'fr' ? 'Ingrédients 100% Bruts & Purs' : '100% Raw & Pure Ingredients'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#26170c] mb-4 font-normal">
            {language === 'fr' ? 'La Pureté de la Terre' : 'Earth Purity'}
          </h2>
          <p className="text-sm md:text-base text-[#4f453f] max-w-xl mx-auto font-light">
            {language === 'fr'
              ? 'Trois piliers fondamentaux issus de la botanique africaine pour une efficacité cutanée inégalée.'
              : 'Three fundamental pillars from African botanicals for unmatched skin efficacy.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Ingredient 1 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E6D5C3]/60 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#D7B49E]/30 flex items-center justify-center text-[#3D2B1F] mb-1">
              <span className="material-symbols-outlined text-[32px]">spa</span>
            </div>
            <h3 className="font-serif text-2xl text-[#26170c] font-normal">
              {language === 'fr' ? 'Cacao Brut Bio' : 'Raw Organic Cocoa'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4f453f] leading-relaxed font-light">
              {language === 'fr'
                ? 'Riche en antioxydants et polyphénols, il aide à réparer la barrière cutanée, lutte contre les radicaux libres et favorise un teint uniforme.'
                : 'Rich in antioxidants and polyphenols, it deeply repairs the skin barrier, fights oxidative stress, and reveals an even complexion.'}
            </p>
          </div>

          {/* Ingredient 2 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E6D5C3]/60 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#E6D5C3]/70 flex items-center justify-center text-[#3D2B1F] mb-1">
              <span className="material-symbols-outlined text-[32px]">grass</span>
            </div>
            <h3 className="font-serif text-2xl text-[#26170c] font-normal">
              {language === 'fr' ? 'Beurre de Karité Brut' : 'Unrefined Shea Butter'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4f453f] leading-relaxed font-light">
              {language === 'fr'
                ? 'Hydratation profonde et apaisement intense. Non raffiné, il scelle durablement l’humidité dans l’épiderme sans obstruer les pores.'
                : 'Deep hydration and intense soothing. Unrefined and nutrient-dense, it locks moisture in without clogging pores.'}
            </p>
          </div>

          {/* Ingredient 3 */}
          <div className="bg-white p-8 rounded-3xl border border-[#E6D5C3]/60 flex flex-col items-center text-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#A3C1AD]/30 flex items-center justify-center text-[#496454] mb-1">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <h3 className="font-serif text-2xl text-[#26170c] font-normal">
              {language === 'fr' ? 'Cendres de Banane Plantain' : 'Plantain Skin Ash'}
            </h3>
            <p className="text-xs sm:text-sm text-[#4f453f] leading-relaxed font-light">
              {language === 'fr'
                ? 'Le secret ancestral de la saponification douce. Source naturelle de potassium, offrant une micro-exfoliation enzymatique et un nettoyage en profondeur.'
                : 'The ancestral secret of gentle saponification. Rich in natural potassium and vitamins, providing gentle micro-exfoliation.'}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. TARGETED SOLUTIONS SECTION ──────────────────────────── */}
      <section className="bg-white py-16 md:py-24 px-5 sm:px-8 md:px-12 border-y border-[#E6D5C3]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#824f39] block">
              {language === 'fr' ? 'Dermatologiquement Testé' : 'Dermatologically Tested'}
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#26170c] leading-tight font-normal">
              {language === 'fr' ? 'Solutions Ciblées, Résultats Visibles' : 'Targeted Solutions, Visible Results'}
            </h2>

            <p className="text-base text-[#4f453f] font-light leading-relaxed">
              {language === 'fr'
                ? 'Notre formule brute est reconnue pour soulager et améliorer durablement l’apparence des affections cutanées courantes grâce à ses propriétés purifiantes, régulatrices et anti-inflammatoires.'
                : 'Our authentic raw formula is recognized to visibly soothe and improve common skin concerns through natural purifying and balancing properties.'}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#fdf9f5] border border-[#E6D5C3]/50">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#496454] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">water_drop</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#26170c] mb-1">
                    {language === 'fr' ? 'Acné & Imperfections' : 'Acne & Blemishes'}
                  </h4>
                  <p className="text-xs text-[#4f453f] font-light">
                    {language === 'fr'
                      ? 'Purifie les pores en profondeur et régule naturellement l’excès de sébum sans agresser la peau.'
                      : 'Deeply cleanses pores and balances excess sebum without stripping the skin.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#fdf9f5] border border-[#E6D5C3]/50">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#824f39] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">healing</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#26170c] mb-1">
                    {language === 'fr' ? 'Eczéma & Irritations' : 'Eczema & Sensitivity'}
                  </h4>
                  <p className="text-xs text-[#4f453f] font-light">
                    {language === 'fr'
                      ? 'Apaise instantanément les tiraillements, calme les rougeurs et renforce le film hydrolipidique.'
                      : 'Instantly calms irritation, soothes redness, and reinforces the moisture barrier.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#fdf9f5] border border-[#E6D5C3]/50">
                <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#bb0a4a] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">brightness_high</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#26170c] mb-1">
                    {language === 'fr' ? 'Taches & Hyperpigmentation' : 'Dark Spots & Hyperpigmentation'}
                  </h4>
                  <p className="text-xs text-[#4f453f] font-light">
                    {language === 'fr'
                      ? 'Exfolie délicatement les cellules mortes pour révéler un teint lumineux, net et parfaitement unifié.'
                      : 'Gently exfoliates dead skin cells to reveal an even, illuminated complexion.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Image */}
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-0 bg-[#E6D5C3]/40 rounded-3xl transform translate-x-3 translate-y-3"></div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuABRhmuuGic8OWruUtIrsv0wBxFwRR5T_o53BkSPP2R9mc0yrg2WfSD1bzBrjnTId91Oqky77HS9_faq9WiGO_qubjx280VvLumBXwmeovrKoEu-77t6jPviLlbLaGwIL7urIBVat9VS_HgWSt43cZZmHenKzTcsc9AEYTNys2X-aDqrPxMlIURbhlrXy27wTH7j3hLWf3Wz9MTYK746jDtsvmVMhQRZqeAazZQWwYURfYEFu1QAIrvCn73MPDbgzpQQQ"
              alt="Ndolo Black Soap Minimalist Ritual"
              className="relative z-10 rounded-3xl w-full h-[380px] sm:h-[460px] object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ─── 6. SIGNATURE PRODUCT SHOWCASE ──────────────────────────── */}
      <section className="py-16 md:py-24 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E6D5C3]/70 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Image */}
          <div
            onClick={() => onSelectProduct(signatureProduct)}
            className="w-full md:w-1/2 flex justify-center cursor-pointer group"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-md bg-[#fdf9f5]">
              <img
                src={signatureProduct.images[0]}
                alt={signatureProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#3D2B1F] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                {language === 'fr' ? 'Best-seller' : 'Best Seller'}
              </span>
            </div>
          </div>

          {/* Details & CTA */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-center md:text-left">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#824f39] font-bold">
              {signatureProduct.tagline}
            </span>

            <h2
              onClick={() => onSelectProduct(signatureProduct)}
              className="font-serif text-3xl sm:text-4xl text-[#26170c] font-normal hover:text-[#bb0a4a] transition-colors cursor-pointer"
            >
              {language === 'en' && signatureProduct.nameEn ? signatureProduct.nameEn : signatureProduct.name}
            </h2>

            {/* Stars */}
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-amber-500">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#4f453f] ml-2 font-medium">
                ({signatureProduct.reviewCount || 124} {language === 'fr' ? 'avis vérifiés' : 'verified reviews'})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#4f453f] leading-relaxed font-light">
              {language === 'en' && signatureProduct.descriptionEn
                ? signatureProduct.descriptionEn
                : signatureProduct.description}
            </p>

            {/* Stock status indicator */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
              {signatureProduct.stock > 5 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#d4e8d0] text-[#2b4c2b]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  {t('stock_in_stock')}
                </span>
              ) : signatureProduct.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  {t('stock_low', { count: signatureProduct.stock })}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-900">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  {t('stock_out')}
                </span>
              )}
              <span className="text-xs text-[#747871]">· {signatureProduct.weight || '150g'}</span>
            </div>

            <div className="font-serif text-3xl text-[#3D2B1F] font-bold mt-1">
              {signatureProduct.price.toFixed(2)} €
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onAddToCart(signatureProduct, 1)}
                disabled={signatureProduct.stock <= 0}
                className="bg-[#3D2B1F] hover:bg-[#26170c] disabled:opacity-40 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>{t('add_to_cart')}</span>
              </button>

              <button
                onClick={() => onSelectProduct(signatureProduct)}
                className="bg-[#fdf9f5] hover:bg-[#E6D5C3]/40 text-[#3D2B1F] border border-[#D7B49E] px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {t('view_product')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FEATURED COLLECTION SECTION ─────────────────────────── */}
      <section className="py-16 md:py-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto w-full border-t border-[#E6D5C3]/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#824f39] block mb-2">
              {language === 'fr' ? 'Collection Botanique' : 'Botanical Collection'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#26170c] font-normal">
              {language === 'fr' ? 'Nos Rituels & Savons Précieux' : 'Our Precious Soaps & Rituals'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3D2B1F] hover:text-[#bb0a4a] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>{language === 'fr' ? 'Voir toute la collection' : 'View full catalog'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((prod) => {
            const displayName = language === 'en' && prod.nameEn ? prod.nameEn : prod.name;
            const displayTagline = language === 'en' && prod.taglineEn ? prod.taglineEn : prod.tagline;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-[#E6D5C3]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div
                  onClick={() => onSelectProduct(prod)}
                  className="relative aspect-square bg-[#fdf9f5] overflow-hidden cursor-pointer"
                >
                  <img
                    src={prod.images[0]}
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.surgrasPercentage && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#3D2B1F] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      Surgras {prod.surgrasPercentage}
                    </span>
                  )}
                </div>

                {/* Info & Add to Cart */}
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-[#824f39] uppercase tracking-wider font-semibold block mb-1">
                      {displayTagline}
                    </span>
                    <h3
                      onClick={() => onSelectProduct(prod)}
                      className="font-serif text-xl sm:text-2xl text-[#26170c] font-normal group-hover:text-[#bb0a4a] transition-colors cursor-pointer mb-2"
                    >
                      {displayName}
                    </h3>
                    <p className="text-xs text-[#4f453f] line-clamp-2 font-light">
                      {prod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#f1ede9]">
                    <span className="font-serif text-2xl font-bold text-[#3D2B1F]">
                      {prod.price.toFixed(2)} €
                    </span>

                    <button
                      onClick={() => onAddToCart(prod, 1)}
                      disabled={prod.stock <= 0}
                      className="bg-[#3D2B1F] hover:bg-[#bb0a4a] disabled:opacity-30 text-white p-3 rounded-full transition-colors shadow-xs active:scale-95 cursor-pointer"
                      title={t('add_to_cart')}
                    >
                      <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. LATEST 3 ARTICLES (LE JOURNAL BOTANIQUE) ────────────── */}
      <section className="py-16 md:py-24 px-5 sm:px-8 md:px-12 max-w-7xl mx-auto w-full border-t border-[#E6D5C3]/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#824f39] block mb-2">
              {language === 'fr' ? 'Le Journal & Conseils d’Experts' : 'The Journal & Expert Guides'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#26170c] font-normal">
              {language === 'fr' ? 'Rituels de Soin & Secrets Botaniques' : 'Care Rituals & Botanical Secrets'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('articles')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3D2B1F] hover:text-[#bb0a4a] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>{language === 'fr' ? 'Découvrir tous les articles' : 'Discover all articles'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {latestArticles.map((article) => {
            const articleTitle = language === 'en' && article.titleEn ? article.titleEn : article.title;
            const articleExcerpt = language === 'en' && article.excerptEn ? article.excerptEn : article.excerpt;
            const articleCat = language === 'en' && article.categoryLabelEn ? article.categoryLabelEn : article.categoryLabel;
            const articleRead = language === 'en' && article.readTimeEn ? article.readTimeEn : article.readTime;

            return (
              <article
                key={article.id}
                onClick={() => onSelectArticle ? onSelectArticle(article) : onNavigate('articles')}
                className="bg-white rounded-3xl border border-[#E6D5C3]/60 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#26170c]">
                    <img
                      src={article.image}
                      alt={articleTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[#3D2B1F] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      {articleCat}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#824f39] font-medium">
                      <span>{article.publishedAt}</span>
                      <span>·</span>
                      <span>{articleRead}</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#26170c] font-normal leading-snug group-hover:text-[#bb0a4a] transition-colors line-clamp-2">
                      {articleTitle}
                    </h3>

                    <p className="text-xs text-[#4f453f] line-clamp-3 font-light leading-relaxed">
                      {articleExcerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Author & Read Link */}
                <div className="px-6 pb-6 pt-3 border-t border-[#f1ede9] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={article.authorAvatar}
                      alt={article.author}
                      className="w-7 h-7 rounded-full object-cover border border-[#E6D5C3]"
                    />
                    <span className="text-xs font-semibold text-[#26170c]">{article.author}</span>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-[#3D2B1F] group-hover:text-[#bb0a4a] flex items-center gap-1">
                    <span>{language === 'fr' ? 'Lire' : 'Read'}</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

