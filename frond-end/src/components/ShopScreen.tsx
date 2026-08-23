import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ShopScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t('filter_all') },
    { id: 'soaps', label: t('filter_soaps') },
    { id: 'oils', label: t('filter_oils') },
    { id: 'rituals', label: t('filter_rituals') },
    { id: 'accessories', label: t('filter_accessories') },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCat = selectedCategory === 'all' ? true : product.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full flex-grow pt-8 pb-24 px-4 sm:px-6 md:px-12 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#824f39] uppercase tracking-[0.2em] block mb-2">
          {t('shop_title')}
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#1a1c1c] mb-3">
          {language === 'fr' ? 'La Boutique des Rituels' : 'The Rituals Collection'}
        </h1>
        <p className="text-[#434842] text-sm md:text-base font-light">
          {t('shop_subtitle')}
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#bb0a4a] text-white shadow-xs'
                  : 'bg-white text-[#434842] hover:bg-[#e2e0d7] border border-[#c4c8c0]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#c4c8c0]/60 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1a1c1c] placeholder:text-[#747871] focus:outline-none focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] transition-all shadow-xs"
          />
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-[#747871]">
            search
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#747871] hover:text-[#1a1c1c] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#c4c8c0]/30 p-8 max-w-lg mx-auto">
          <span className="material-symbols-outlined text-4xl text-[#747871] mb-3">spa</span>
          <h3 className="font-serif text-2xl text-[#1a1c1c] mb-2">
            {language === 'fr' ? 'Aucun soin trouvé' : 'No products found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#434842] mb-6">
            {language === 'fr'
              ? "Essayez d'ajuster vos filtres ou réinitialisez la recherche."
              : 'Try adjusting your search criteria or resetting filters.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#bb0a4a] text-white rounded-full text-xs uppercase font-semibold tracking-wider hover:bg-[#b7003a] cursor-pointer"
          >
            {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
            const isOutOfStock = product.stock <= 0;
            const displayName = language === 'en' && product.nameEn ? product.nameEn : product.name;
            const displayTagline = language === 'en' && product.taglineEn ? product.taglineEn : product.tagline;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-[#c4c8c0]/30 flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-md transition-all duration-300 relative"
              >
                {product.featured && (
                  <span className="absolute top-4 left-4 bg-[#824f39] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-xs">
                    Signature
                  </span>
                )}

                <div>
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="w-full aspect-square rounded-2xl overflow-hidden mb-5 relative cursor-pointer bg-[#eeeeee]"
                  >
                    <img
                      src={product.images[0]}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Stock Alert Badge */}
                    <div className="absolute top-3 right-3">
                      {isOutOfStock ? (
                        <span className="bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                          {t('stock_out')}
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-600/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                          {t('stock_low', { count: product.stock })}
                        </span>
                      ) : null}
                    </div>

                    {product.surgrasPercentage && (
                      <span className="absolute bottom-3 right-3 bg-[#f9f9f9]/90 text-[#bb0a4a] text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs">
                        {t('surgras_badge', { percent: product.surgrasPercentage })}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {product.tags.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-[#f3f3f4] text-[#434842]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-serif-luxury text-2xl text-[#1a1c1c] mb-1 hover:text-[#bb0a4a] transition-colors cursor-pointer"
                  >
                    {displayName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#434842] mb-4 line-clamp-2 font-light">
                    {displayTagline || product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#f3f3f4]">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-serif-luxury text-2xl text-[#bb0a4a] font-bold">
                      {product.price.toFixed(2)} €
                    </span>
                    <span className="text-xs text-[#747871]">{product.weight || '120g'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="py-2.5 px-3 border border-[#bb0a4a] text-[#bb0a4a] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#e2e0d7] transition-colors text-center cursor-pointer"
                    >
                      {t('view_product')}
                    </button>
                    <button
                      onClick={() => onAddToCart(product, 1)}
                      disabled={isOutOfStock}
                      className={`py-2.5 px-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        isOutOfStock
                          ? 'bg-[#c4c8c0] text-[#747871] cursor-not-allowed'
                          : 'bg-[#bb0a4a] text-white hover:bg-[#b7003a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isOutOfStock ? 'block' : 'shopping_bag'}
                      </span>
                      {isOutOfStock ? t('stock_out') : t('add_to_cart')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
