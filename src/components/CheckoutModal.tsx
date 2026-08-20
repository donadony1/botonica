import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  shippingCost,
  discountAmount,
  total,
  onClearCart,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    fullName: 'Camille Dupont',
    email: 'camille.dupont@example.com',
    address: '14 Rue des Lavandes',
    city: 'Aix-en-Provence',
    postalCode: '13100',
    cardNumber: '•••• •••• •••• 4242',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#f9f9f9] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#c4c8c0]/40 max-h-[90vh] overflow-y-auto">
        {step === 'form' ? (
          <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#c4c8c0]/30">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#824f39] font-bold block">
                  Finaliser la commande
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#1a191c]">
                  Paiement Sécurisé
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#747871] hover:text-[#1a1c1c] p-1.5 rounded-full hover:bg-[#e2e0d7]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Cart summary preview */}
            <div className="bg-[#eeeeee] p-4 rounded-2xl mb-6 text-sm text-[#434842]">
              <div className="flex justify-between font-medium text-[#1a1c1c] mb-2">
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles sélectionnés</span>
                <span className="font-serif text-base">{total.toFixed(2)} €</span>
              </div>
              <p className="text-xs text-[#747871]">
                Livraison neutre en carbone et emballage éco-responsable inclus.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                  Nom Complet
                </label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1a191c]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                  Adresse Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1a191c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                    Adresse de livraison
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1a191c]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                    Ville & Code Postal
                  </label>
                  <input
                    required
                    type="text"
                    value={`${formData.city} (${formData.postalCode})`}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1a191c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5 flex justify-between items-center">
                  <span>Carte Bancaire (Simulé)</span>
                  <span className="material-symbols-outlined text-[18px] text-[#1a191c]">lock</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full bg-white border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1a191c]"
                />
              </div>

              <div className="pt-4 border-t border-[#c4c8c0]/30 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1a191c] text-white py-4 rounded-full text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Traitement sécurisé en cours...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      Confirmer le paiement — {total.toFixed(2)} €
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 text-xs uppercase tracking-wider text-[#747871] hover:text-[#1a1c1c]"
                >
                  Annuler et retourner au panier
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#d4e8d0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1a191c]">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#824f39] font-bold block mb-2">
              Commande Confirmée #BOT-2024
            </span>
            <h3 className="font-serif-luxury text-3xl text-[#1a191c] mb-4">
              Merci pour votre commande
            </h3>
            <p className="text-[#434842] text-sm leading-relaxed mb-6 font-light">
              Votre rituel de soin est en cours de préparation dans notre atelier. Un email de
              suivi a été envoyé à <strong>{formData.email}</strong>.
            </p>
            <div className="bg-white p-4 rounded-2xl border border-[#c4c8c0]/30 text-xs text-[#434842] mb-8 space-y-1 text-left">
              <div className="flex justify-between">
                <span>Destinataire :</span>
                <strong>{formData.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Adresse :</span>
                <span>{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between font-serif text-sm pt-2 border-t border-[#f3f3f4] text-[#1a191c]">
                <span>Total réglé :</span>
                <strong>{total.toFixed(2)} €</strong>
              </div>
            </div>
            <button
              onClick={() => {
                setStep('form');
                onClose();
              }}
              className="w-full bg-[#1a191c] text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#b7003a] transition-colors"
            >
              Continuer les découvertes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
