import React, { useState } from 'react';
import { CartItem, Product, ScreenType } from '../types';
import { CheckoutModal } from './CheckoutModal';

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
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost = shippingMethod === 'express' ? 15.0 : 0.0;
  const total = Math.max(0, subtotal - discountApplied + shippingCost);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = discountCode.trim().toUpperCase();
    if (cleanCode === 'Ndolo10' || cleanCode === 'RITUEL10') {
      const discount = subtotal * 0.1;
      setDiscountApplied(discount);
      setDiscountMessage('Code promo appliqué : -10%');
    } else if (cleanCode === 'NATUREL') {
      setDiscountApplied(15.0);
      setDiscountMessage('Code promo appliqué : -15,00 €');
    } else if (cleanCode === '') {
      setDiscountApplied(0);
      setDiscountMessage('');
    } else {
      setDiscountApplied(0);
      setDiscountMessage('Code invalide. Essayez "Ndolo10" ou "NATUREL"');
    }
  };

  return (
    <div className="w-full flex-grow pt-6 md:pt-10 pb-24 px-5 md:px-12 max-w-[1280px] mx-auto">
      {/* Title Header */}
      <div className="mb-10">
        <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl text-[#1a1c1c] mb-3">
          Your Rituals
        </h1>
        <p className="text-sm md:text-base text-[#434842] font-light">
          Review the items curated for your space.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#c4c8c0]/30 ambient-shadow max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-[#d4e8d0]/40 flex items-center justify-center mx-auto mb-6 text-[#1a191c]">
            <span className="material-symbols-outlined text-3xl">shopping_basket</span>
          </div>
          <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#1a1c1c] mb-3">
            Votre panier est vide
          </h2>
          <p className="text-sm text-[#434842] mb-8 font-light leading-relaxed">
            Découvrez nos créations botaniques pures et commencez à composer votre rituel de bain.
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-[#1a191c] text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all ambient-shadow active:scale-95"
          >
            Explorer la boutique
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#c4c8c0]/30 ambient-shadow p-5 sm:p-6 flex flex-col sm:flex-row gap-5 relative group transition-all duration-300 hover:border-[#1a191c]/30"
              >
                {/* Product Thumbnail */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="w-full sm:w-32 h-32 md:w-36 md:h-36 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-[#eeeeee]"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-serif-luxury text-xl sm:text-2xl text-[#1a1c1c] mb-1 group-hover:text-[#1a191c] transition-colors cursor-pointer"
                      >
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#434842] mb-3 font-light">
                        {product.tagline || product.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-[#d4e8d0]/30 text-[#b7003a] rounded-full text-[11px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      aria-label={`Retirer ${product.name}`}
                      className="text-[#747871] hover:text-[#ba1a1a] transition-colors p-1.5 rounded-full hover:bg-[#f3f3f4] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex justify-between items-end border-t border-[#f3f3f4] pt-4 mt-auto">
                    <div className="flex items-center gap-3 bg-[#f3f3f4] rounded-lg px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        aria-label="Diminuer"
                        className="w-7 h-7 flex items-center justify-center text-[#434842] hover:text-[#1a191c] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="text-sm text-[#1a1c1c] font-medium w-4 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        aria-label="Augmenter"
                        className="w-7 h-7 flex items-center justify-center text-[#434842] hover:text-[#1a191c] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>

                    <div className="font-serif-luxury text-2xl text-[#1a1c1c] font-semibold">
                      {(product.price * quantity).toFixed(2)} €
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-white/90 backdrop-blur-xl rounded-2xl border border-[#c4c8c0]/40 ambient-shadow p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1a1c1c] mb-6 border-b border-[#c4c8c0]/30 pb-4">
                  Summary
                </h2>

                <div className="flex flex-col gap-4 text-sm text-[#434842]">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="font-serif text-lg text-[#1a1c1c] font-semibold">
                      {subtotal.toFixed(2)} €
                    </span>
                  </div>

                  {/* Shipping Options */}
                  <div className="flex flex-col gap-3 py-2 border-y border-[#f3f3f4]">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#1a1c1c]">
                      Mode de Livraison
                    </span>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="mt-1 accent-[#1a191c]"
                      />
                      <div className="flex-grow flex justify-between">
                        <span className="text-[#434842] group-hover:text-[#1a1c1c] transition-colors">
                          Standard (3-5 days)
                        </span>
                        <span className="text-[#1a191c] font-semibold">Free</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="mt-1 accent-[#1a191c]"
                      />
                      <div className="flex-grow flex justify-between">
                        <span className="text-[#434842] group-hover:text-[#1a1c1c] transition-colors">
                          Express (1-2 days)
                        </span>
                        <span className="font-medium text-[#1a1c1c]">15.00 €</span>
                      </div>
                    </label>
                  </div>

                  {/* Discount Code Form */}
                  <form onSubmit={handleApplyDiscount} className="mt-2">
                    <label
                      htmlFor="discount-input"
                      className="block text-[11px] uppercase tracking-wider font-bold text-[#434842] mb-2"
                    >
                      Discount Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="discount-input"
                        type="text"
                        placeholder="Enter code (ex: Ndolo10)"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="w-full bg-[#f3f3f4] border border-transparent rounded-xl px-4 py-2.5 text-xs text-[#1a1c1c] focus:ring-1 focus:ring-[#1a191c] focus:bg-white transition-colors"
                      />
                      <button
                        type="submit"
                        className="bg-[#e2e0d7] text-[#434842] px-4 py-2.5 rounded-xl text-xs font-semibold uppercase hover:bg-[#c4c8c0] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {discountMessage && (
                      <p
                        className={`text-xs mt-2 ${discountApplied > 0 ? 'text-[#1a191c]' : 'text-[#824f39]'
                          }`}
                      >
                        {discountMessage}
                      </p>
                    )}
                  </form>

                  {discountApplied > 0 && (
                    <div className="flex justify-between text-xs text-[#1a191c] font-medium pt-1">
                      <span>Remise code promo</span>
                      <span>- {discountApplied.toFixed(2)} €</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Checkout Button */}
              <div className="border-t border-[#c4c8c0]/30 pt-6">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base font-medium text-[#1a1c1c]">Total</span>
                  <span className="font-serif-luxury text-3xl sm:text-4xl text-[#1a1c1c] font-semibold">
                    {total.toFixed(2)} €
                  </span>
                </div>

                <button
                  id="checkout-btn"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-[#1a191c] text-white py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 hover:bg-[#b7003a] transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Paiement Sécurisé
                </button>

                <p className="text-center text-xs text-[#434842] mt-4 flex items-center justify-center gap-1.5 opacity-80">
                  <span className="material-symbols-outlined text-[16px] text-[#1a191c]">eco</span>
                  Climate neutral shipping
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={subtotal}
        shippingCost={shippingCost}
        discountAmount={discountApplied}
        total={total}
        onClearCart={onClearCart}
      />
    </div>
  );
};
