import React, { useState } from 'react';
import { Product, ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { getProductUrl } from '../lib/router';
import { formatPrice } from '../lib/currency';

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
  const { language, t } = useLanguage();
  const { reviews, addReview, siteSettings } = useAdmin();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);
  const [longDescAccordionOpen, setLongDescAccordionOpen] = useState(true);
  const [usageAccordionOpen, setUsageAccordionOpen] = useState(false);
  const [shippingAccordionOpen, setShippingAccordionOpen] = useState(false);
  const [gpsrAccordionOpen, setGpsrAccordionOpen] = useState(true);

  // Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState<string | null>(null);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://lh3.googleusercontent.com/aida-public/AB6AXuAwCbWmWoXE74klOtwIQUnPMNLkGYreJ-ztS8FJiNnCCUsxn0agfBVH4MH1Rfx8oBpvjLOHrl5kMK0I7tm4fD_b6YvmWPsXSHWdIKppxjgVjAJR7J8vGKKpybh5I1XvQfX4hRW84SlX8EFMJIabfTsa3I3FbZTuojSDSJrCi0z39yNoRZ4OtPm0WZqUIudhfNXU5NBBFxOqOQTUWPu9FXMztN7ph1aT1d2Vrdsyrl3szRbrKhRORn3-'];

  const otherProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  // Filter approved reviews for this product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'approved'
  );

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const isOutOfStock = product.stock <= 0;

  // Localized texts
  const displayName = language === 'en' && product.nameEn ? product.nameEn : product.name;
  const displayTagline = language === 'en' && product.taglineEn ? product.taglineEn : product.tagline;
  const displayDesc = language === 'en' && product.descriptionEn ? product.descriptionEn : product.description;
  const displayLongDesc = language === 'en' && product.longDescriptionEn ? product.longDescriptionEn : product.longDescription;
  const displayUsage = language === 'en' && product.usageTipsEn ? product.usageTipsEn : product.usageTips;
  const displayShipping = language === 'en' && product.shippingInfoEn ? product.shippingInfoEn : product.shippingInfo;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name,
      author: reviewAuthor.trim(),
      authorEmail: reviewEmail.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: false,
    });

    setReviewAuthor('');
    setReviewEmail('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccessMessage(t('reviews_success_toast'));

    setTimeout(() => {
      setReviewSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="w-full flex-grow pt-6 pb-20 px-4 sm:px-6 md:px-12 max-w-[1280px] mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Fil d'ariane" className="mb-6 hidden md:block">
        <ol className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#434842]">
          <li>
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#bb0a4a] transition-colors cursor-pointer"
            >
              {t('breadcrumb_home')}
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
              className="hover:text-[#bb0a4a] transition-colors cursor-pointer"
            >
              {t('breadcrumb_shop')}
            </button>
          </li>
          <li>
            <span className="material-symbols-outlined text-[16px] text-[#747871]">
              chevron_right
            </span>
          </li>
          <li className="text-[#bb0a4a] font-semibold">{displayName}</li>
        </ol>
      </nav>

      {/* Main Product Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Product Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-white shadow-xl border border-[#c4c8c0]/30 relative group">
            <img
              key={selectedImageIndex}
              src={images[selectedImageIndex] || images[0]}
              alt={displayName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.surgrasPercentage && (
                <span className="bg-[#f9f9f9]/90 backdrop-blur-md text-[#bb0a4a] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#bb0a4a]/20 shadow-xs">
                  {t('surgras_badge', { percent: product.surgrasPercentage })}
                </span>
              )}
            </div>

            {/* Stock status badge overlay */}
            <div className="absolute top-4 right-4">
              {isOutOfStock ? (
                <span className="bg-red-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  {t('stock_out')}
                </span>
              ) : isLowStock ? (
                <span className="bg-amber-600/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  {t('stock_low', { count: product.stock })}
                </span>
              ) : (
                <span className="bg-emerald-700/90 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                  {t('stock_in_stock')}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-2 border-[#bb0a4a] opacity-100 ring-2 ring-[#bb0a4a]/30 scale-102'
                      : 'border border-[#bb0a4a]/10 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${displayName} view ${idx + 1}`}
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
          <div className="flex flex-wrap gap-2 mb-3">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold ${
                  idx % 2 === 0
                    ? 'bg-[#d4e8d0]/60 text-[#b7003a]'
                    : 'bg-[#ffdbce]/60 text-[#693a26]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-[#1a1c1c] mb-2 leading-tight">
            {displayName}
          </h1>

          <p className="text-[#824f39] text-sm md:text-base mb-4 font-medium italic">
            {displayTagline}
          </p>

          <p className="text-[#434842] text-base mb-6 leading-relaxed font-light">
            {displayDesc}
          </p>

          {/* Rating Summary Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-amber-500 text-base">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </div>
            <span className="text-xs text-[#747871] font-medium">
              {product.rating.toFixed(1)} / 5 ({productReviews.length + product.reviewCount} avis)
            </span>
          </div>

          {/* Price & Stock info */}
          <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-[#c4c8c0]/30">
            <div className="font-serif-luxury text-3xl sm:text-4xl text-[#bb0a4a] font-bold">
              {formatPrice(product.price, siteSettings.currency)}
            </div>
            <span className="text-xs text-[#747871]">TTC — {product.weight || '120g'}</span>
          </div>

          {/* Stock banner alert */}
          {isLowStock && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-6 flex items-center gap-3 text-xs">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">
                local_fire_department
              </span>
              <span>
                <strong>{t('stock_low', { count: product.stock })}</strong> Commandez dès maintenant pour garantir votre expédition sous 24h.
              </span>
            </div>
          )}

          {/* Purchase Action: Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between border border-[#c4c8c0] rounded-full px-5 py-2 w-full sm:w-36 h-14 bg-white shadow-xs">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                aria-label="Diminuer quantité"
                disabled={isOutOfStock}
                className="text-[#434842] hover:text-[#bb0a4a] transition-colors p-1 disabled:opacity-30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-medium text-base text-[#1a1c1c]">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                aria-label="Augmenter quantité"
                disabled={isOutOfStock || quantity >= product.stock}
                className="text-[#434842] hover:text-[#bb0a4a] transition-colors p-1 disabled:opacity-30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              id="product-add-to-cart-btn"
              onClick={() => onAddToCart(product, quantity)}
              disabled={isOutOfStock}
              className={`flex-1 rounded-full h-14 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer ${
                isOutOfStock
                  ? 'bg-[#c4c8c0] text-[#747871] cursor-not-allowed shadow-none'
                  : 'bg-[#bb0a4a] text-white hover:bg-[#b7003a] shadow-[#bb0a4a]/20'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isOutOfStock ? 'block' : 'shopping_bag'}
              </span>
              {isOutOfStock
                ? t('stock_out')
                : `${t('add_to_cart')} — ${formatPrice(product.price * quantity, siteSettings.currency)}`}
            </button>
          </div>

          {/* Share & Direct Link Action */}
          <div className="flex items-center justify-between bg-[#f4ebe1]/60 border border-[#e6d5c3] rounded-2xl px-5 py-3.5 mb-8">
            <div className="flex items-center gap-2 text-xs text-[#5c4d44]">
              <span className="material-symbols-outlined text-[18px] text-[#bb0a4a]">link</span>
              <span className="font-medium">
                {language === 'fr' ? 'Lien direct du produit :' : 'Direct product link:'}
              </span>
              <code className="hidden sm:inline-block bg-white/80 px-2 py-0.5 rounded text-[11px] text-[#824f39] border border-[#e6d5c3]/80 truncate max-w-[200px]">
                /product/{product.id}
              </code>
            </div>
            <button
              onClick={() => {
                const url = getProductUrl(product);
                if (navigator.share) {
                  navigator.share({
                    title: `${displayName} — Ndolo Rituals`,
                    text: displayTagline,
                    url: url,
                  }).catch(() => {});
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(url);
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 3000);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#bb0a4a] text-[#3D2B1F] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs border border-[#e6d5c3] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {shareCopied ? 'check' : 'share'}
              </span>
              <span>
                {shareCopied
                  ? (language === 'fr' ? 'Lien copié !' : 'Link copied!')
                  : (language === 'fr' ? 'Partager' : 'Share')}
              </span>
            </button>
          </div>

          {/* Key Ingredients Bento */}
          <div className="mb-8">
            <h3 className="font-serif-luxury text-2xl text-[#1a1c1c] mb-5 border-b border-[#c4c8c0]/40 pb-3 flex items-center justify-between">
              <span>{t('key_ingredients_title')}</span>
              <span className="text-xs uppercase tracking-widest font-sans text-[#824f39] font-bold">
                {t('key_ingredients_badge')}
              </span>
            </h3>
            <ul className="space-y-4">
              {product.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-full ${ing.bgClass} flex items-center justify-center ${ing.iconClass} shrink-0 shadow-xs`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{ing.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#1a1c1c] mb-0.5">
                      {ing.name}
                    </h4>
                    <p className="text-[#434842] text-xs sm:text-sm leading-relaxed font-light">
                      {ing.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Accordions: Description Détaillée / GPSR / Usage / Shipping */}
          <div className="border-t border-[#c4c8c0]/40 divide-y divide-[#c4c8c0]/40">
            {/* Detailed Description Accordion (CKEditor Rich Content) */}
            {displayLongDesc && (
              <div className="py-4">
                <button
                  onClick={() => setLongDescAccordionOpen(!longDescAccordionOpen)}
                  className="w-full flex justify-between items-center text-xs uppercase tracking-[0.15em] font-semibold text-[#1a1c1c] text-left hover:text-[#bb0a4a] transition-colors py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#824f39]">description</span>
                    <span>{language === 'fr' ? 'Description Détaillée & Vertus' : 'Detailed Description & Benefits'}</span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[#bb0a4a] transition-transform duration-300 ${
                      longDescAccordionOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {longDescAccordionOpen && (
                  <div className="mt-3 text-sm text-[#434842] leading-relaxed pl-1 animate-in fade-in-50 duration-200">
                    {/<[a-z][\s\S]*>/i.test(displayLongDesc) ? (
                      <div
                        className="prose prose-stone max-w-none text-[#434842] leading-relaxed text-sm space-y-3
                          [&>p]:leading-relaxed [&>p]:mb-3
                          [&>h2]:font-serif [&>h2]:text-xl [&>h2]:text-[#1a1c1c] [&>h2]:mt-4 [&>h2]:mb-2
                          [&>h3]:font-serif [&>h3]:text-base [&>h3]:text-[#1a1c1c] [&>h3]:mt-3 [&>h3]:mb-1.5
                          [&>ul]:space-y-1.5 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:text-[#434842]
                          [&>ol]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:text-[#434842]
                          [&>blockquote]:p-3 [&>blockquote]:bg-[#eeeeee]/60 [&>blockquote]:border-l-4 [&>blockquote]:border-[#bb0a4a] [&>blockquote]:rounded-r-xl [&>blockquote]:italic"
                        dangerouslySetInnerHTML={{ __html: displayLongDesc }}
                      />
                    ) : (
                      <div className="space-y-2 whitespace-pre-line font-light">
                        {displayLongDesc}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* GPSR & INCI Accordion (Mandatory European Standard) */}
            <div className="py-4">
              <button
                onClick={() => setGpsrAccordionOpen(!gpsrAccordionOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-[0.15em] font-bold text-[#bb0a4a] text-left hover:opacity-85 transition-opacity py-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>{t('gpsr_title')}</span>
                </div>
                <span
                  className={`material-symbols-outlined text-[#bb0a4a] transition-transform duration-300 ${
                    gpsrAccordionOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {gpsrAccordionOpen && (
                <div className="bg-[#eeeeee]/60 rounded-2xl p-4 mt-2 text-xs space-y-3 text-[#434842] leading-relaxed animate-in fade-in-50 duration-200 border border-[#c4c8c0]/30">
                  <div>
                    <strong className="text-[#1a1c1c] block mb-1">
                      🌿 {t('gpsr_inci')} :
                    </strong>
                    <p className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-[#c4c8c0]/40 text-[#303830]">
                      {product.inci || 'Composition 100% naturelle saponifiée à froid.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#c4c8c0]/30">
                    <div>
                      <strong className="text-[#1a1c1c] block">{t('gpsr_origin')} :</strong>
                      <span>{product.originCountry || 'France / Provence'}</span>
                    </div>
                    <div>
                      <strong className="text-[#1a1c1c] block">{t('gpsr_pao')} :</strong>
                      <span>{t('gpsr_pao_desc', { pao: product.pao || '18M' })}</span>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-[#c4c8c0]/30 text-[11px]">
                    <strong className="text-[#1a1c1c] block">{t('gpsr_responsible')} :</strong>
                    <span className="text-[#747871]">
                      {product.responsiblePerson || 'Ndolo Rituals SARL — 13100 Aix-en-Provence, France'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Usage Accordion */}
            <div className="py-4">
              <button
                onClick={() => setUsageAccordionOpen(!usageAccordionOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-[0.15em] font-semibold text-[#1a1c1c] text-left hover:text-[#bb0a4a] transition-colors py-2 cursor-pointer"
              >
                <span>{t('usage_tips_title')}</span>
                <span
                  className={`material-symbols-outlined text-[#bb0a4a] transition-transform duration-300 ${
                    usageAccordionOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {usageAccordionOpen && (
                <div className="text-[#434842] text-sm mt-3 leading-relaxed font-light pl-1 animate-in fade-in-50 duration-200">
                  {displayUsage ||
                    'Faites mousser entre vos mains sous l\'eau tiède, massez délicatement sur le corps en effectuant des mouvements circulaires, puis rincez abondamment.'}
                </div>
              )}
            </div>

            {/* Shipping Accordion */}
            <div className="py-4">
              <button
                onClick={() => setShippingAccordionOpen(!shippingAccordionOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-[0.15em] font-semibold text-[#1a1c1c] text-left hover:text-[#bb0a4a] transition-colors py-2 cursor-pointer"
              >
                <span>{t('shipping_returns_title')}</span>
                <span
                  className={`material-symbols-outlined text-[#bb0a4a] transition-transform duration-300 ${
                    shippingAccordionOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {shippingAccordionOpen && (
                <div className="text-[#434842] text-sm mt-3 leading-relaxed font-light pl-1 animate-in fade-in-50 duration-200">
                  {displayShipping ||
                    'Livraison standard (3-5 jours ouvrés) gratuite à partir de 50€ d\'achat. Retours acceptés dans un délai de 14 jours si le produit n\'a pas été utilisé et est dans son emballage d\'origine.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section with Moderated Submission Form */}
      <section className="mt-20 pt-12 border-t border-[#c4c8c0]/40">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#824f39] text-xs font-bold uppercase tracking-[0.2em] block mb-1">
                Expériences & Retours
              </span>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl text-[#bb0a4a]">
                {t('reviews_title')}
              </h3>
            </div>
            <div className="text-sm text-[#434842]">
              <span className="text-amber-500 text-lg mr-1">★★★★★</span>
              <strong>{product.rating.toFixed(1)}</strong> {t('reviews_average', { count: productReviews.length + product.reviewCount })}
            </div>
          </div>

          {/* List of existing approved reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {productReviews.length > 0 ? (
              productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-3xl border border-[#c4c8c0]/30 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-sm text-[#1a1c1c]">{rev.author}</span>
                      <span className="text-amber-500 text-sm">
                        {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#434842] leading-relaxed font-light italic">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#f3f3f4] flex justify-between items-center text-[11px] text-[#747871]">
                    <span>{rev.date || 'Récemment'}</span>
                    <span className="text-emerald-700 flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Achat vérifié
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-[#c4c8c0]/30 text-center text-[#747871] text-sm">
                Soyez le premier à partager votre rituel avec ce soin d'exception !
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c4c8c0]/30 shadow-md">
            <h4 className="font-serif-luxury text-2xl text-[#1a1c1c] mb-2">
              {t('reviews_leave_review')}
            </h4>
            <p className="text-xs text-[#747871] mb-6">
              {t('reviews_moderation_note')}
            </p>

            {reviewSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-4 rounded-2xl mb-6 flex items-center gap-2 animate-in fade-in duration-200">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                  check_circle
                </span>
                <span>{reviewSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                    {t('reviews_form_author')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="Ex: Camille D."
                    className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-xs text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                    {t('reviews_form_email')}
                  </label>
                  <input
                    type="email"
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                    placeholder="camille@example.com"
                    className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-xs text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                  {t('reviews_form_rating')}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                        star <= reviewRating ? 'text-amber-500' : 'text-[#c4c8c0]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs text-[#747871] ml-2 font-medium">
                    {reviewRating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#434842] mb-1.5">
                  {t('reviews_form_comment')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Partagez vos impressions sur la texture, le parfum et les bienfaits sur votre peau..."
                  className="w-full bg-[#f9f9f9] border border-[#c4c8c0] rounded-xl px-4 py-2.5 text-xs text-[#1a1c1c] focus:outline-none focus:border-[#bb0a4a]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#bb0a4a] text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#b7003a] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {t('reviews_form_submit')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Suggested Other Rituals */}
      {otherProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[#c4c8c0]/40">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[#824f39] text-xs font-bold uppercase tracking-[0.2em] block mb-1">
                {t('suggested_rituals_title')}
              </span>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#bb0a4a]">
                {t('suggested_rituals_subtitle')}
              </h3>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs uppercase tracking-widest text-[#bb0a4a] font-semibold hover:underline cursor-pointer"
            >
              {language === 'fr' ? 'Voir Tout' : 'View All'}
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
                className="bg-white p-5 rounded-3xl shadow-xs border border-[#c4c8c0]/30 cursor-pointer group hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-[#eeeeee] relative">
                  <img
                    src={p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {p.stock <= (p.lowStockThreshold || 5) && p.stock > 0 && (
                    <span className="absolute bottom-2 left-2 bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Plus que {p.stock} ex.
                    </span>
                  )}
                </div>
                <h4 className="font-serif-luxury text-lg text-[#bb0a4a] group-hover:underline">
                  {language === 'en' && p.nameEn ? p.nameEn : p.name}
                </h4>
                <p className="text-xs text-[#434842] mt-1 mb-3 line-clamp-1">
                  {language === 'en' && p.taglineEn ? p.taglineEn : p.tagline}
                </p>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="font-serif font-bold text-[#1a1c1c]">{formatPrice(p.price, siteSettings.currency)}</span>
                  <span className="text-xs text-[#824f39] font-semibold uppercase">
                    {t('view_product')} →
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
