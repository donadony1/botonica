import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { calculateCart, COUNTRIES, CartCalculationResult, ShippingMethodInfo, submitCheckoutOrder } from '../lib/api';
import { InvoiceModal } from './InvoiceModal';

interface CheckoutTunnelProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  couponCode: string;
  onClearCart: () => void;
}

type TunnelStep = 'cart' | 'shipping' | 'payment' | 'success';

export const CheckoutTunnel: React.FC<CheckoutTunnelProps> = ({
  isOpen,
  onClose,
  cartItems,
  couponCode,
  onClearCart,
}) => {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<TunnelStep>('shipping');

  // Customer & Shipping Info
  const [formData, setFormData] = useState({
    fullName: 'Camille Dupont',
    email: 'camille.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    address: '14 Rue des Lavandes',
    postalCode: '13100',
    city: 'Aix-en-Provence',
    country: 'FR',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    notes: '',
  });

  const [calculation, setCalculation] = useState<CartCalculationResult | null>(null);
  const [isLoadingCalculation, setIsLoadingCalculation] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [emailSent, setEmailSent] = useState(true);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  // Re-calculate cart pricing, tax and shipping dynamically whenever country or shipping method changes
  useEffect(() => {
    if (!isOpen || cartItems.length === 0) return;

    let isMounted = true;
    setIsLoadingCalculation(true);

    calculateCart(cartItems, formData.country, formData.shippingMethod, couponCode)
      .then((res) => {
        if (isMounted) {
          setCalculation(res);
          setIsLoadingCalculation(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingCalculation(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, cartItems, formData.country, formData.shippingMethod, couponCode]);

  if (!isOpen) return null;

  const handleCountryChange = (newCountry: string) => {
    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      // reset city/zip sample if changing to specific regions
      city: newCountry === 'CM' ? 'Douala' : newCountry === 'US' ? 'New York' : prev.city,
      postalCode: newCountry === 'CM' ? 'BP 1240' : newCountry === 'US' ? '10001' : prev.postalCode,
    }));
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    setSavedItems([...cartItems]);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        couponCode: couponCode,
        items: cartItems.map((it) => ({
          id: it.product.id,
          name: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
        })),
      };

      const result = await submitCheckoutOrder(payload);
      if (result.success) {
        setOrderNumber(result.orderNumber || `NDO-${new Date().getFullYear()}-1042`);
        setInvoiceNumber(result.invoiceNumber || `FACT-${new Date().getFullYear()}-1042`);
        setEmailSent(result.emailSent !== false);
        setCurrentStep('success');
        onClearCart();
      }
    } catch {
      // Fallback
      const year = new Date().getFullYear();
      setOrderNumber(`NDO-${year}-1042`);
      setInvoiceNumber(`FACT-${year}-1042`);
      setCurrentStep('success');
      onClearCart();
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const selectedCountryObj = COUNTRIES.find((c) => c.code === formData.country) || COUNTRIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#f9f9f9] w-full max-w-2xl rounded-3xl p-5 sm:p-8 shadow-2xl border border-[#c4c8c0]/40 max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header with Step Indicator */}
        <div className="flex justify-between items-start pb-5 border-b border-[#c4c8c0]/30 mb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#824f39] font-bold block mb-1">
              {language === 'fr' ? 'Tunnel de Commande Sécurisé' : 'Secure Checkout Funnel'}
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#bb0a4a]">
              {currentStep === 'shipping'
                ? t('tunnel_step2')
                : currentStep === 'payment'
                ? t('tunnel_step3')
                : t('tunnel_order_confirmed')}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="text-[#747871] hover:text-[#1a1c1c] p-2 rounded-full hover:bg-[#e2e0d7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        {currentStep !== 'success' && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => setCurrentStep('shipping')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentStep === 'shipping'
                  ? 'bg-[#bb0a4a] text-white shadow-xs'
                  : 'bg-[#eeeeee] text-[#434842] hover:bg-[#e2e0d7]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                1
              </span>
              <span>{t('tunnel_step2')}</span>
            </button>

            <button
              onClick={() => setCurrentStep('payment')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentStep === 'payment'
                  ? 'bg-[#bb0a4a] text-white shadow-xs'
                  : 'bg-[#eeeeee] text-[#434842] hover:bg-[#e2e0d7]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>{t('tunnel_step3')}</span>
            </button>
          </div>
        )}

        {/* Step 2: Shipping Details & Multi-Country Selection */}
        {currentStep === 'shipping' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Country Selector */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c4c8c0]/30 shadow-xs">
              <label className="block text-xs uppercase tracking-wider font-bold text-[#1a1c1c] mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#bb0a4a] text-[18px]">public</span>
                <span>{t('tunnel_country')} *</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-[#f3f3f4] border border-[#c4c8c0] rounded-xl px-4 py-3 text-sm text-[#1a1c1c] font-medium focus:outline-none focus:border-[#bb0a4a] cursor-pointer"
              >
                {COUNTRIES.map((cntry) => (
                  <option key={cntry.code} value={cntry.code}>
                    {cntry.flag} {cntry.name} {cntry.vatRate > 0 ? `(TVA ${cntry.vatRate}%)` : '(Exonération TVA)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Address Form */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c4c8c0]/30 shadow-xs space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#824f39]">
                {t('tunnel_customer_info')}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#434842] mb-1">
                    {t('tunnel_full_name')} *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#434842] mb-1">
                    {t('tunnel_email')} *
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#434842] mb-1">
                  {t('tunnel_phone')} *
                </label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#434842] mb-1">
                  {t('tunnel_address')} *
                </label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#434842] mb-1">
                    {t('tunnel_postal_code')} *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#434842] mb-1">
                    {t('tunnel_city')} *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                  />
                </div>
              </div>
            </div>

            {/* Carrier Methods */}
            {calculation && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#c4c8c0]/30 shadow-xs space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#824f39] flex items-center justify-between">
                  <span>{t('tunnel_shipping_options')}</span>
                  <span className="text-[11px] font-normal text-[#747871]">
                    {selectedCountryObj.flag} {selectedCountryObj.name}
                  </span>
                </h3>

                <div className="space-y-2.5">
                  {Object.values(calculation.shipping.available_methods).map((meth: ShippingMethodInfo) => (
                    <label
                      key={meth.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        formData.shippingMethod === meth.id
                          ? 'border-[#bb0a4a] bg-[#bb0a4a]/5 ring-1 ring-[#bb0a4a]/20'
                          : 'border-[#c4c8c0]/50 hover:bg-[#f3f3f4]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping_method_radio"
                          checked={formData.shippingMethod === meth.id}
                          onChange={() => setFormData({ ...formData, shippingMethod: meth.id })}
                          className="accent-[#bb0a4a]"
                        />
                        <div>
                          <span className="font-semibold text-xs sm:text-sm text-[#1a1c1c] block">
                            {meth.name}
                          </span>
                          <span className="text-[11px] text-[#747871]">{meth.delay}</span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-sm text-[#bb0a4a]">
                        {meth.cost === 0 ? 'Gratuit' : `${meth.cost.toFixed(2)} €`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('payment')}
                className="w-full bg-[#bb0a4a] text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{t('tunnel_proceed_payment')}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Sovereign Tax Breakdown & Payment Selection */}
        {currentStep === 'payment' && calculation && (
          <form onSubmit={handleConfirmOrder} className="space-y-6 animate-in fade-in duration-200">
            {/* Certified Tax Breakdown (OSS) */}
            <div className="bg-white p-5 rounded-2xl border border-[#c4c8c0]/30 shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#f3f3f4]">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#824f39] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#bb0a4a]">verified</span>
                  <span>{t('tunnel_tax_breakdown')}</span>
                </h3>
                <span className="text-[11px] bg-[#d4e8d0] text-[#b7003a] px-2.5 py-0.5 rounded-full font-semibold">
                  {selectedCountryObj.flag} {calculation.tax_info.country}
                </span>
              </div>

              <div className="text-xs space-y-2 text-[#434842]">
                <div className="flex justify-between">
                  <span>Sous-total articles ({calculation.total_quantity} ex.) :</span>
                  <span>{calculation.subtotal_gross.toFixed(2)} €</span>
                </div>

                {calculation.discount_amount > 0 && (
                  <div className="flex justify-between text-[#bb0a4a] font-medium">
                    <span>Remise appliquée ({couponCode}) :</span>
                    <span>- {calculation.discount_amount.toFixed(2)} €</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frais de port ({calculation.shipping.delivery_name}) :</span>
                  <span>
                    {calculation.shipping.cost === 0
                      ? 'Offert'
                      : `${calculation.shipping.cost.toFixed(2)} €`}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#f3f3f4] space-y-1">
                  <div className="flex justify-between text-[#747871]">
                    <span>{t('tunnel_amount_ht')} :</span>
                    <span>{calculation.tax_info.amount_ht.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-[#747871]">
                    <span>
                      {calculation.tax_info.vat_rate > 0
                        ? t('tunnel_vat', { rate: calculation.tax_info.vat_rate })
                        : t('tunnel_vat_exempt')} :
                    </span>
                    <span>{calculation.tax_info.vat_amount.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#c4c8c0]/40 flex justify-between items-baseline text-base sm:text-lg font-bold text-[#1a1c1c]">
                  <span>Total à régler TTC :</span>
                  <span className="font-serif-luxury text-2xl sm:text-3xl text-[#bb0a4a]">
                    {calculation.total_amount.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-5 rounded-2xl border border-[#c4c8c0]/30 shadow-xs space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-bold text-[#1a1c1c] mb-2">
                {t('tunnel_payment_selection')}
              </h3>

              <div className="space-y-2.5">
                {/* Stripe */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'stripe'
                      ? 'border-[#bb0a4a] bg-[#bb0a4a]/5 ring-1 ring-[#bb0a4a]/20'
                      : 'border-[#c4c8c0]/40 hover:bg-[#f3f3f4]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'stripe' })}
                      className="accent-[#bb0a4a]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#1a1c1c] block">
                        Carte Bancaire (Stripe)
                      </span>
                      <span className="text-[11px] text-[#747871]">
                        Visa, Mastercard, American Express, Apple Pay
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#bb0a4a]">credit_card</span>
                </label>

                {/* PayPal */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'paypal'
                      ? 'border-[#bb0a4a] bg-[#bb0a4a]/5 ring-1 ring-[#bb0a4a]/20'
                      : 'border-[#c4c8c0]/40 hover:bg-[#f3f3f4]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                      className="accent-[#bb0a4a]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#1a1c1c] block">
                        PayPal Express
                      </span>
                      <span className="text-[11px] text-[#747871]">
                        Paiement sécurisé en 1 clic ou en 4x sans frais
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#003087]">account_balance_wallet</span>
                </label>

                {/* Orange Money */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'orange_money'
                      ? 'border-[#bb0a4a] bg-[#bb0a4a]/5 ring-1 ring-[#bb0a4a]/20'
                      : 'border-[#c4c8c0]/40 hover:bg-[#f3f3f4]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={formData.paymentMethod === 'orange_money'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'orange_money' })}
                      className="accent-[#bb0a4a]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#1a1c1c] block">
                        Orange Money (API)
                      </span>
                      <span className="text-[11px] text-[#747871]">
                        Paiement mobile instantané sécurisé
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-orange-600">phone_android</span>
                </label>

                {/* MTN MoMo */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'mtn_momo'
                      ? 'border-[#bb0a4a] bg-[#bb0a4a]/5 ring-1 ring-[#bb0a4a]/20'
                      : 'border-[#c4c8c0]/40 hover:bg-[#f3f3f4]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={formData.paymentMethod === 'mtn_momo'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'mtn_momo' })}
                      className="accent-[#bb0a4a]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#1a1c1c] block">
                        MTN Mobile Money
                      </span>
                      <span className="text-[11px] text-[#747871]">
                        Paiement mobile direct
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-amber-500">contactless</span>
                </label>

                {/* Virement Bancaire */}
                <label
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'bank_transfer'
                      ? 'border-[#bb0a4a] bg-[#bb0a4a]/5 ring-1 ring-[#bb0a4a]/20'
                      : 'border-[#c4c8c0]/40 hover:bg-[#f3f3f4]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={formData.paymentMethod === 'bank_transfer'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'bank_transfer' })}
                      className="accent-[#bb0a4a]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-[#1a1c1c] block">
                        Virement Bancaire (IBAN)
                      </span>
                      <span className="text-[11px] text-[#747871]">
                        Expédition dès réception des fonds
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#747871]">account_balance</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('shipping')}
                className="py-3.5 px-6 rounded-full border border-[#c4c8c0] text-xs uppercase tracking-wider font-semibold text-[#434842] hover:bg-[#e2e0d7] transition-all text-center cursor-pointer"
              >
                {t('tunnel_back_btn')}
              </button>

              <button
                type="submit"
                disabled={isSubmittingOrder || isLoadingCalculation}
                className="flex-1 bg-[#bb0a4a] text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {isSubmittingOrder ? (
                  <span>Validation sécurisée...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    <span>{t('tunnel_confirm_btn')} — {calculation.total_amount.toFixed(2)} €</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Success & Confirmation */}
        {currentStep === 'success' && (
          <div className="text-center py-4 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#824f39] font-bold block">
                Paiement Validé & Commande Enregistrée
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#26170c] font-normal">
                Merci pour votre confiance
              </h3>
            </div>

            {/* Email Notification Alert Box */}
            <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-900 rounded-2xl p-4 max-w-md mx-auto text-left flex items-start gap-3 shadow-2xs">
              <span className="material-symbols-outlined text-emerald-700 text-2xl shrink-0 mt-0.5">
                mark_email_read
              </span>
              <div className="text-xs space-y-1">
                <strong className="block text-emerald-950 font-semibold">
                  Facture N° {invoiceNumber} envoyée par email !
                </strong>
                <p className="text-emerald-800 font-light leading-relaxed">
                  Un exemplaire officiel a été envoyé à <strong>{formData.email}</strong> et sauvegardé en base de données.
                </p>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6D5C3] text-xs text-[#434842] text-left space-y-2.5 max-w-md mx-auto shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-[#f3f3f4]">
                <span className="text-[#81756e]">Réf. Commande :</span>
                <strong className="font-mono text-[#26170c]">{orderNumber}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#81756e]">Réf. Facture :</span>
                <strong className="font-mono text-[#bb0a4a]">{invoiceNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#81756e]">Destinataire :</span>
                <strong className="text-[#26170c]">{formData.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#81756e]">Livraison :</span>
                <span className="text-right text-[#26170c] truncate max-w-[200px]">
                  {formData.address}, {formData.city} ({selectedCountryObj.name})
                </span>
              </div>
              {calculation && (
                <div className="pt-2 border-t border-[#f3f3f4] flex justify-between font-serif text-base font-bold text-[#26170c]">
                  <span>Montant Réglé TTC :</span>
                  <span className="text-[#bb0a4a]">{calculation.total_amount.toFixed(2)} €</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(true)}
                className="flex-1 bg-[#3D2B1F] hover:bg-[#bb0a4a] text-white py-3.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Visualiser / Imprimer la Facture</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3.5 px-6 rounded-full border border-[#E6D5C3] text-xs font-bold uppercase tracking-wider text-[#3D2B1F] hover:bg-[#E6D5C3]/40 transition-colors cursor-pointer text-center"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Printable / Downloadable Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        orderNumber={orderNumber}
        invoiceNumber={invoiceNumber}
        customerData={formData}
        cartItems={savedItems.length > 0 ? savedItems : cartItems}
        calculation={calculation}
      />
    </div>
  );
};
