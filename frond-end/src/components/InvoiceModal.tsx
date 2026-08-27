import React from 'react';
import { CartItem } from '../types';
import { CartCalculationResult } from '../lib/api';
import { useAdmin } from '../context/AdminContext';
import { formatPrice } from '../lib/currency';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  invoiceNumber: string;
  customerData: {
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    paymentMethod: string;
  };
  cartItems: CartItem[];
  calculation: CartCalculationResult | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  invoiceNumber,
  customerData,
  cartItems,
  calculation,
}) => {
  const { siteSettings } = useAdmin();
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const subtotal = calculation?.subtotal_net ?? cartItems.reduce((acc, it) => acc + it.product.price * it.quantity, 0);
  const discount = calculation?.discount_amount ?? 0;
  const shipping = calculation?.shipping.cost ?? 0;
  const vat = calculation?.tax_info.amount ?? Math.round(subtotal * 0.2 * 100) / 100;
  const total = calculation?.total_amount ?? (subtotal - discount + shipping);

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'orange_money':
        return 'Orange Money Cameroun / Afrique';
      case 'mtn_momo':
        return 'MTN Mobile Money';
      case 'paypal':
        return 'PayPal Express';
      case 'bank_transfer':
        return 'Virement Bancaire (IBAN)';
      default:
        return 'Carte Bancaire Sécurisée (Stripe)';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E6D5C3] my-8 print:border-none print:shadow-none print:m-0 print:p-4 text-[#26170c]">
        {/* Top Action Bar (hidden when printing) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E6D5C3] print:hidden">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#824f39] font-bold">
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Facture Officielle Client</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#3D2B1F] hover:bg-[#bb0a4a] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#81756e] hover:text-[#26170c] hover:bg-[#fdf9f5] rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b-2 border-[#3D2B1F]">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-widest text-[#bb0a4a]">
                NDOLO RITUALS
              </h1>
              <p className="text-xs uppercase tracking-wider text-[#824f39] mt-1 font-semibold">
                Saponification Ancestrale & Cosmétiques Botaniques
              </p>
              <div className="text-xs text-[#64635c] mt-3 space-y-0.5 leading-relaxed font-light">
                <p>Ndolo Rituals SARL • Capital 25 000 €</p>
                <p>14 Rue des Lavandes, 13100 Aix-en-Provence, France</p>
                <p>SIRET : 894 302 119 00024 • TVA : FR 48 894302119</p>
                <p>Email : contact@ndolo-rituals.fr</p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="bg-[#fdf9f5] border border-[#E6D5C3] p-3.5 rounded-2xl inline-block sm:text-right space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#824f39] block">
                  FACTURE D'ACQUITTEMENT
                </span>
                <p className="font-serif text-lg font-bold text-[#26170c]">{invoiceNumber}</p>
                <p className="text-xs text-[#64635c]">
                  Date : <strong>{today}</strong>
                </p>
                <p className="text-xs text-[#64635c]">
                  Commande : <strong>{orderNumber}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Client & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#fdf9f5]/50 p-4 rounded-2xl border border-[#E6D5C3]/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#824f39] block mb-1">
                Facturé & Livré à :
              </span>
              <p className="font-bold text-sm text-[#26170c]">{customerData.fullName}</p>
              <p className="text-xs text-[#434842] leading-relaxed">
                {customerData.address}
                <br />
                {customerData.postalCode} {customerData.city}
                <br />
                Pays : {customerData.country}
              </p>
              <p className="text-xs text-[#64635c] pt-1">
                Email : <strong>{customerData.email}</strong>
              </p>
            </div>

            <div className="bg-[#fdf9f5]/50 p-4 rounded-2xl border border-[#E6D5C3]/60 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#824f39] block mb-1">
                Règlement & Transaction :
              </span>
              <p className="text-xs text-[#26170c]">
                Mode de paiement : <strong>{getPaymentLabel(customerData.paymentMethod)}</strong>
              </p>
              <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Statut : Payé & Acquitté le {today}</span>
              </p>
              <p className="text-[11px] text-[#81756e]">
                Validation bancaire sécurisée avec certificat SSL 256-bit.
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[#E6D5C3] rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#3D2B1F] text-white">
                  <th className="p-3.5 font-semibold uppercase tracking-wider">Désignation du soin</th>
                  <th className="p-3.5 text-center font-semibold uppercase tracking-wider">Qté</th>
                  <th className="p-3.5 text-right font-semibold uppercase tracking-wider">Prix Unit. TTC</th>
                  <th className="p-3.5 text-right font-semibold uppercase tracking-wider">Total TTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6D5C3]/60 bg-white">
                {cartItems.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <tr key={item.product.id} className="hover:bg-[#fdf9f5]/40 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-[#26170c] block">{item.product.name}</span>
                        <span className="text-[11px] text-[#81756e] block mt-0.5">
                          Saponification artisanale • Beurre de karité brut
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-medium">{item.quantity}</td>
                      <td className="p-3.5 text-right">{formatPrice(item.product.price, siteSettings.currency)}</td>
                      <td className="p-3.5 text-right font-bold text-[#26170c]">
                        {formatPrice(lineTotal, siteSettings.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="text-[11px] text-[#81756e] space-y-1 leading-relaxed bg-[#fdf9f5] p-4 rounded-2xl border border-[#E6D5C3]/60">
              <strong className="text-[#26170c] block">Conformité Cosmétique & GPSR :</strong>
              <p>Produits conformes au Règlement Européen (CE) N° 1223/2009.</p>
              <p>Conservation optimale : conserver au sec sur un porte-savon aéré.</p>
              <p>Période après ouverture (PAO) : 18 Mois.</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#64635c]">
                <span>Sous-total articles :</span>
                <span className="font-medium text-[#26170c]">{formatPrice(subtotal, siteSettings.currency)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#bb0a4a] font-semibold">
                  <span>Remise code promo :</span>
                  <span>-{formatPrice(discount, siteSettings.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#64635c]">
                <span>Frais de port :</span>
                <span className="font-medium text-[#26170c]">{formatPrice(shipping, siteSettings.currency)}</span>
              </div>
              <div className="flex justify-between text-[#81756e] text-[11px]">
                <span>Dont TVA (20.00%) :</span>
                <span>{formatPrice(vat, siteSettings.currency)}</span>
              </div>
              <div className="pt-2 border-t-2 border-[#3D2B1F] flex justify-between font-serif text-base sm:text-lg font-bold text-[#26170c]">
                <span>TOTAL PAYÉ TTC :</span>
                <span className="text-[#bb0a4a]">{formatPrice(total, siteSettings.currency)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-6 border-t border-[#E6D5C3] text-[11px] text-[#81756e] space-y-1">
            <p className="font-serif italic text-xs text-[#3D2B1F]">
              « Ndolo » signifie l'Amour en langue Duala. Merci de soutenir l'artisanat éthique.
            </p>
            <p>Pour tout renseignement ou suivi de colis : <strong>contact@ndolo-rituals.fr</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
