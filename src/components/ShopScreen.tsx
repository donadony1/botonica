import React, { useState } from 'react';
import { Product } from '../types';

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
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tags = [
    { id: 'all', label: 'Tous les Soins' },
    { id: 'soaps', label: 'Savons Saponifiés à Froid' },
    { id: 'oils', label: 'Huiles Botaniques' },
    { id: 'Apaisant', label: 'Apaisant' },
    { id: 'Nourrissant', label: 'Nourrissant' },
    { id: 'Purifiant', label: 'Purifiant' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesTag =
      selectedTag === 'all'
        ? true
        : selectedTag === 'soaps'
          ? product.category === 'soaps'
          : selectedTag === 'oils'
            ? product.category === 'oils'
            : product.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));

    const matchesSearch =
      searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTag && matchesSearch;
  });

  return (
    <div className="w-full flex-grow pt-8 pb-20 px-5 md:px-12 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-[#824f39] uppercase tracking-[0.2em] block mb-2">
          Catalogue Botanique
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl text-[#1a1c1c] mb-4">
          La Boutique des Rituels
        </h1>
        <p className="text-[#434842] text-sm md:text-base font-light">
          Tous nos soins sont confectionnés à la main, saponifiés à froid et formulés avec des
          actifs 100% végétaux et biologiques.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${selectedTag === tag.id
                ? 'bg-[#bb0a4a] text-white shadow-sm'
                : 'bg-white text-[#434842] hover:bg-[#e2e0d7] border border-[#c4c8c0]/40'
                }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Rechercher un soin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#c4c8c0]/60 rounded-full pl-10 pr-4 py-2.5 text-sm text-[#1a1c1c] placeholder:text-[#747871] focus:outline-none focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] transition-all"
          />
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-[18px] text-[#747871]">
            search
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[#747871] hover:text-[#1a1c1c]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#c4c8c0]/30 p-8">
          <span className="material-symbols-outlined text-4xl text-[#747871] mb-3">spa</span>
          <h3 className="font-serif text-2xl text-[#1a1c1c] mb-2">Aucun soin trouvé</h3>
          <p className="text-sm text-[#434842] mb-6">
            Essayez d'ajuster vos filtres de recherche ou parcourez toute notre collection.
          </p>
          <button
            onClick={() => {
              setSelectedTag('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#bb0a4a] text-white rounded-full text-xs uppercase font-semibold tracking-wider"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl p-6 ambient-shadow border border-[#c4c8c0]/30 flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 relative"
            >
              {product.featured && (
                <span className="absolute top-4 left-4 bg-[#824f39] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full z-10">
                  Signature
                </span>
              )}

              <div>
                <div
                  onClick={() => onSelectProduct(product)}
                  className="w-full aspect-square rounded-2xl overflow-hidden mb-6 relative cursor-pointer bg-[#eeeeee]"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.surgrasPercentage && (
                    <span className="absolute bottom-3 right-3 bg-[#f9f9f9]/90 text-[#bb0a4a] text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                      Surgras {product.surgrasPercentage}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
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
                  className="font-serif-luxury text-2xl text-[#1a1c1c] mb-2 hover:text-[#bb0a4a] transition-colors cursor-pointer"
                >
                  {product.name}
                </h3>
                <p className="text-sm text-[#434842] mb-4 line-clamp-2 font-light">
                  {product.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#f3f3f4]">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="font-serif-luxury text-2xl text-[#bb0a4a] font-semibold">
                    {product.price.toFixed(2)} €
                  </span>
                  <span className="text-xs text-[#747871]">{product.weight || '120g'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="py-2.5 px-3 border border-[#bb0a4a] text-[#bb0a4a] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#e2e0d7] transition-colors text-center cursor-pointer"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => onAddToCart(product, 1)}
                    className="py-2.5 px-3 bg-[#bb0a4a] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#b7003a] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
