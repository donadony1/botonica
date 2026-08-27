import React, { useState } from 'react';
import { CartItem, Product, ScreenType } from '../types';
import { CheckoutTunnel } from './CheckoutTunnel';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../lib/currency';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectProduct,
  onNavigate,
}) => {
  const { language, t } = useLanguage();
  const { siteSettings } = useAdmin();
  const freeThreshold = siteSettings.freeShippingThreshold || 50;
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState<string>('');
  const [isTunnelOpen, setIsTunnelOpen] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost = shippingMethod === 'express' ? 12.0 : (subtotal >= freeThreshold ? 0.0 : 4.90);
  const total = Math.max(0, subtotal - discountApplied + shippingCost);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = discountCode.trim().toUpperCase();
    if (cleanCode === 'NDOLO10' || cleanCode === 'BIENVENUE10' || cleanCode === 'RITUEL10') {
      const discount = subtotal * 0.1;
      setDiscountApplied(discount);
      setDiscountMessage(language === 'fr' ? 'Code promo appliqué : -10%' : 'Promo code applied: -10%');
    } else if (cleanCode === 'NATUREL') {
      if (subtotal >= freeThreshold) {
        const discount = Math.min(subtotal, 15.0);
        setDiscountApplied(discount);
        setDiscountMessage(language === 'fr' ? `Code promo appliqué : -${formatPrice(15, siteSettings.currency)}` : `Promo code applied: -${formatPrice(15, siteSettings.currency)}`);
      } else {
        setDiscountApplied(0);
        setDiscountMessage(language === 'fr' ? `Le code NATUREL requiert ${formatPrice(freeThreshold, siteSettings.currency)} d'achat minimum` : `NATUREL code requires ${formatPrice(freeThreshold, siteSettings.currency)} min order`);
      }
    } else if (cleanCode === '') {
      setDiscountApplied(0);
      setDiscountMessage('');
    } else {
      setDiscountApplied(0);
      setDiscountMessage(
        language === 'fr'
          ? 'Code invalide. Essayez "BIENVENUE10" ou "NDOLO10"'
          : 'Invalid code. Try "BIENVENUE10" or "NDOLO10"'
      );
    }
  };

  return (
    <div className="w-full flex-grow pt-6 md:pt-10 pb-24 px-4 sm:px-6 md:px-12 max-w-[1280px] mx-auto">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#1a1c1c] mb-2">
          {t('cart_title')}
        </h1>
        <p className="text-sm md:text-base text-[#434842] font-light">
          {t('cart_subtitle')}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#c4c8c0]/30 shadow-sm max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-[#d4e8d0]/50 flex items-center justify-center mx-auto mb-6 text-[#bb0a4a]">
            <span className="material-symbols-outlined text-3xl">shopping_basket</span>
          </div>
          <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#1a1c1c] mb-3">
            {t('cart_empty_title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#434842] mb-8 font-light leading-relaxed">
            {t('cart_empty_subtitle')}
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#bb0a4a] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {t('cart_empty_cta')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
            {cartItems.map(({ product, quantity }) => {
              const displayName = language === 'en' && product.nameEn ? product.nameEn : product.name;
              const displayTagline = language === 'en' && product.taglineEn ? product.taglineEn : product.tagline;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#c4c8c0]/30 shadow-xs p-5 sm:p-6 flex flex-col sm:flex-row gap-5 relative group transition-all duration-300 hover:border-[#bb0a4a]/30"
                >
                  {/* Product Thumbnail */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="w-full sm:w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shrink-0 cursor-pointer bg-[#eeeeee]"
                  >
                    <img
                      src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80'}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3
                          onClick={() => onSelectProduct(product)}
                          className="font-serif-luxury text-xl sm:text-2xl text-[#1a1c1c] mb-1 group-hover:text-[#bb0a4a] transition-colors cursor-pointer"
                        >
                          {displayName}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#434842] mb-3 font-light">
                          {displayTagline || product.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {product.tags.slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 bg-[#d4e8d0]/40 text-[#b7003a] rounded-full text-[11px] font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Retirer ${displayName}`}
                        className="text-[#747871] hover:text-[#ba1a1a] transition-colors p-1.5 rounded-full hover:bg-[#f3f3f4] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex justify-between items-end border-t border-[#f3f3f4] pt-4 mt-auto">
                      <div className="flex items-center gap-3 bg-[#f3f3f4] rounded-full px-3 py-1">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label="Diminuer"
                          className="w-6 h-6 flex items-center justify-center text-[#434842] hover:text-[#bb0a4a] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="text-sm text-[#1a1c1c] font-semibold w-4 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          disabled={quantity >= product.stock}
                          aria-label="Augmenter"
                          className="w-6 h-6 flex items-center justify-center text-[#434842] hover:text-[#bb0a4a] transition-colors disabled:opacity-30 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      <div className="font-serif-luxury text-2xl text-[#1a1c1c] font-bold">
                        {formatPrice(product.price * quantity, siteSettings.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#c4c8c0]/40 shadow-lg p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1a1c1c] mb-6 border-b border-[#c4c8c0]/30 pb-4">
                  {t('cart_summary_title')}
                </h2>

                <div className="flex flex-col gap-4 text-sm text-[#434842]">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span>{t('cart_subtotal')}</span>
                    <span className="font-serif text-lg text-[#1a1c1c] font-bold">
                      {formatPrice(subtotal, siteSettings.currency)}
                    </span>
                  </div>

                  {/* Shipping preview */}
                  <div className="flex justify-between items-center text-xs">
                    <span>Livraison estimée :</span>
                    <span className="font-semibold text-[#1a1c1c]">
                      {shippingCost === 0 ? `Offerte (dès ${formatPrice(freeThreshold, siteSettings.currency)})` : formatPrice(shippingCost, siteSettings.currency)}
                    </span>
                  </div>

                  {/* Discount Code Form */}
                  <form onSubmit={handleApplyDiscount} className="mt-1">
                    <label
                      htmlFor="discount-input"
                      className="block text-[11px] uppercase tracking-wider font-bold text-[#434842] mb-2"
                    >
                      {t('cart_discount_label')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="discount-input"
                        type="text"
                        placeholder={t('cart_discount_placeholder')}
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="w-full bg-[#f3f3f4] border border-transparent rounded-xl px-4 py-2.5 text-xs text-[#1a1c1c] focus:ring-1 focus:ring-[#bb0a4a] focus:bg-white transition-colors"
                      />
                      <button
                        type="submit"
                        className="bg-[#e2e0d7] text-[#434842] px-4 py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-[#c4c8c0] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {t('cart_discount_apply')}
                      </button>
                    </div>
                    {discountMessage && (
                      <p
                        className={`text-xs mt-2 ${
                          discountApplied > 0 ? 'text-[#bb0a4a] font-medium' : 'text-[#824f39]'
                        }`}
                      >
                        {discountMessage}
                      </p>
                    )}
                  </form>

                  {discountApplied > 0 && (
                    <div className="flex justify-between text-xs text-[#bb0a4a] font-semibold pt-1">
                      <span>{t('cart_discount_applied')}</span>
                      <span>- {formatPrice(discountApplied, siteSettings.currency)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Checkout Button */}
              <div className="border-t border-[#c4c8c0]/30 pt-6">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base font-semibold text-[#1a1c1c]">{t('cart_total')}</span>
                  <span className="font-serif-luxury text-3xl sm:text-4xl text-[#1a1c1c] font-bold">
                    {formatPrice(total, siteSettings.currency)}
                  </span>
                </div>

                <button
                  id="checkout-btn"
                  onClick={() => setIsTunnelOpen(true)}
                  className="w-full bg-[#bb0a4a] text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 hover:bg-[#b7003a] transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  {t('cart_checkout_btn')}
                </button>

                <p className="text-center text-xs text-[#434842] mt-4 flex items-center justify-center gap-1.5 opacity-80">
                  <span className="material-symbols-outlined text-[16px] text-[#bb0a4a]">eco</span>
                  {t('cart_carbon_neutral')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Checkout Funnel Modal */}
      <CheckoutTunnel
        isOpen={isTunnelOpen}
        onClose={() => setIsTunnelOpen(false)}
        cartItems={cartItems}
        couponCode={discountCode}
        onClearCart={onClearCart}
      />
    </div>
  );
};
