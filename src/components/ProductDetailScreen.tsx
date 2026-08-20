import React, { useState } from 'react';
import { Product, ScreenType } from '../types';

interface ProductDetailScreenProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  allProducts,
  onAddToCart,
  onSelectProduct,
  onNavigate,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [usageAccordionOpen, setUsageAccordionOpen] = useState(false);
  const [shippingAccordionOpen, setShippingAccordionOpen] = useState(false);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://lh3.googleusercontent.com/aida-public/AB6AXuAwCbWmWoXE74klOtwIQUnPMNLkGYreJ-ztS8FJiNnCCUsxn0agfBVH4MH1Rfx8oBpvjLOHrl5kMK0I7tm4fD_b6YvmWPsXSHWdIKppxjgVjAJR7J8vGKKpybh5I1XvQfX4hRW84SlX8EFMJIabfTsa3I3FbZTuojSDSJrCi0z39yNoRZ4OtPm0WZqUIudhfNXU5NBBFxOqOQTUWPu9FXMztN7ph1aT1d2Vrdsyrl3szRbrKhRORn3-'];

  const otherProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="w-full flex-grow pt-8 pb-20 px-5 md:px-12 max-w-[1280px] mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Fil d'ariane" className="mb-8 hidden md:block">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#434842]">
          <li>
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#1a191c] transition-colors cursor-pointer"
            >
              Accueil
            </button>
          </li>
          <li>
            <span className="material-symbols-outlined text-[16px] text-[#747871]">
              chevron_right
            </span>
          </li>
          <li>
            <button
              onClick={() => onNavigate('shop')}
              className="hover:text-[#1a191c] transition-colors cursor-pointer"
            >
              Boutique
            </button>
          </li>
          <li>
            <span className="material-symbols-outlined text-[16px] text-[#747871]">
              chevron_right
            </span>
          </li>
          <li className="text-[#1a191c] font-semibold">{product.name}</li>
        </ol>
      </nav>

      {/* Main Product Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-[0_20px_50px_rgba(81,99,80,0.08)] border border-[#1a191c]/10 relative group">
            <img
              key={selectedImageIndex}
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.surgrasPercentage && (
              <span className="absolute top-4 right-4 bg-[#f9f9f9]/90 backdrop-blur-md text-[#1a191c] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#1a191c]/20">
                Surgras {product.surgrasPercentage}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${selectedImageIndex === idx
                    ? 'border-2 border-[#1a191c] opacity-100 ring-2 ring-[#1a191c]/30 scale-102'
                    : 'border border-[#1a191c]/10 opacity-60 hover:opacity-90'
                    }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-start">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold ${idx % 2 === 0
                  ? 'bg-[#d4e8d0]/50 text-[#b7003a]'
                  : 'bg-[#ffdbce]/60 text-[#693a26]'
                  }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#1a1c1c] mb-3 leading-tight">
            {product.name}
          </h1>

          <p className="text-[#434842] text-base md:text-lg mb-6 leading-relaxed font-light">
            {product.description}
          </p>

          <div className="font-serif-luxury text-3xl text-[#1a191c] font-semibold mb-8">
            {product.price.toFixed(2)} €
          </div>

          {/* Purchase Action: Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-[#c4c8c0] rounded-full px-5 py-2 w-full sm:w-36 h-14 bg-white">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="Diminuer quantité"
                className="text-[#434842] hover:text-[#1a191c] transition-colors p-1"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-medium text-base text-[#1a1c1c]">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                aria-label="Augmenter quantité"
                className="text-[#434842] hover:text-[#1a191c] transition-colors p-1"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              id="product-add-to-cart-btn"
              onClick={() => onAddToCart(product, quantity)}
              className="flex-1 bg-[#1a191c] text-white rounded-full h-14 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all shadow-lg shadow-[#1a191c]/20 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              Ajouter au Panier — {(product.price * quantity).toFixed(2)} €
            </button>
          </div>

          {/* Key Ingredients Bento */}
          <div className="mb-10">
            <h3 className="font-serif-luxury text-2xl text-[#1a1c1c] mb-6 border-b border-[#c4c8c0]/40 pb-4 flex items-center justify-between">
              <span>Ingrédients Clés</span>
              <span className="text-xs uppercase tracking-widest font-sans text-[#824f39]">
                100% Naturels
              </span>
            </h3>
            <ul className="space-y-5">
              {product.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${ing.bgClass} flex items-center justify-center ${ing.iconClass} shrink-0`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{ing.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1c] mb-1">
                      {ing.name}
                    </h4>
                    <p className="text-[#434842] text-sm leading-relaxed font-light">
                      {ing.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Accordions: Usage Tips & Shipping */}
          <div className="border-t border-[#c4c8c0]/40 divide-y divide-[#c4c8c0]/40">
            {/* Usage Accordion */}
            <div className="py-4">
              <button
                onClick={() => setUsageAccordionOpen(!usageAccordionOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-[0.15em] font-semibold text-[#1a1c1c] text-left hover:text-[#1a191c] transition-colors py-2 cursor-pointer"
              >
                <span>Conseils d'utilisation</span>
                <span
                  className={`material-symbols-outlined text-[#1a191c] transition-transform duration-300 ${usageAccordionOpen ? 'rotate-180' : ''
                    }`}
                >
                  expand_more
                </span>
              </button>
              {usageAccordionOpen && (
                <div className="text-[#434842] text-sm mt-3 leading-relaxed font-light pl-1 animate-in fade-in-50 duration-200">
                  {product.usageTips ||
                    'Faites mousser entre vos mains sous l\'eau tiède, massez délicatement sur le corps en effectuant des mouvements circulaires, puis rincez abondamment. Pour prolonger la durée de vie de votre savon, conservez-le sur un porte-savon ajouré à l\'abri de l\'eau stagnante.'}
                </div>
              )}
            </div>

            {/* Shipping Accordion */}
            <div className="py-4">
              <button
                onClick={() => setShippingAccordionOpen(!shippingAccordionOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-[0.15em] font-semibold text-[#1a1c1c] text-left hover:text-[#1a191c] transition-colors py-2 cursor-pointer"
              >
                <span>Livraison & Retours</span>
                <span
                  className={`material-symbols-outlined text-[#1a191c] transition-transform duration-300 ${shippingAccordionOpen ? 'rotate-180' : ''
                    }`}
                >
                  expand_more
                </span>
              </button>
              {shippingAccordionOpen && (
                <div className="text-[#434842] text-sm mt-3 leading-relaxed font-light pl-1 animate-in fade-in-50 duration-200">
                  {product.shippingInfo ||
                    'Livraison standard (3-5 jours ouvrés) gratuite à partir de 50€ d\'achat. Retours acceptés dans un délai de 14 jours si le produit n\'a pas été utilisé et est dans son emballage d\'origine.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Other Rituals */}
      {otherProducts.length > 0 && (
        <section className="mt-24 pt-16 border-t border-[#c4c8c0]/40">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[#824f39] text-xs font-bold uppercase tracking-[0.2em] block mb-1">
                Complétez Votre Rituel
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1a191c]">
                Découvrez Aussi
              </h3>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs uppercase tracking-widest text-[#1a191c] font-semibold hover:underline"
            >
              Voir Tout
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {otherProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white p-5 rounded-2xl ambient-shadow-sm border border-[#c4c8c0]/30 cursor-pointer group hover:-translate-y-1 transition-all"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#eeeeee]">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-serif-luxury text-xl text-[#1a191c] group-hover:underline">
                  {p.name}
                </h4>
                <p className="text-xs text-[#434842] mt-1 mb-3">{p.tagline}</p>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>{p.price.toFixed(2)} €</span>
                  <span className="text-xs text-[#824f39] font-semibold uppercase">
                    Découvrir →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
