import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

export const TRANSLATIONS = {
  fr: {
    // Navigation & Header
    nav_home: 'Accueil',
    nav_shop: 'Boutique',
    nav_rituals: 'Le Rituel',
    nav_admin: 'Admin',
    nav_cart: 'Panier',
    search_placeholder: 'Rechercher un savon, un rituel...',
    
    // Home Screen
    hero_badge: '100% Naturel & Saponifié à Froid',
    hero_title: 'L\'art du soin botanique & ancestral',
    hero_subtitle: 'Des savons surgras artisanaux, formulés à partir d\'ingrédients biologiques purs pour nourrir votre peau et éveiller vos sens.',
    hero_cta: 'Découvrir la collection',
    hero_secondary: 'Notre Rituel Signature',
    
    // Features / Value Props
    feature_natural_title: 'Ingrédients 100% Purs',
    feature_natural_desc: 'Huiles vierges pressées à froid, beurres bruts et extraits botaniques.',
    feature_cold_title: 'Saponification à Froid',
    feature_cold_desc: 'Préserve naturellement la glycérine végétale et les vertus des huiles.',
    feature_eco_title: 'Éco-conception & Zéro Plastique',
    feature_eco_desc: 'Emballages compostables ou recyclables, respectueux de l\'environnement.',
    feature_delivery_title: 'Expédition Éco-responsable',
    feature_delivery_desc: 'Neutre en carbone, offerte dès 50€ d\'achats en France et UE.',
    
    // Shop & Filters
    shop_title: 'Nos Soins Botaniques',
    shop_subtitle: 'Découvrez notre gamme de savons artisanaux, huiles et rituels purs.',
    filter_all: 'Tous les produits',
    filter_soaps: 'Savons surgras',
    filter_oils: 'Huiles précieuses',
    filter_rituals: 'Coffrets & Rituels',
    filter_accessories: 'Accessoires',
    sort_by: 'Trier par',
    sort_featured: 'En vedette',
    sort_price_asc: 'Prix : croissant',
    sort_price_desc: 'Prix : décroissant',
    sort_rating: 'Meilleures notes',
    
    // Product Card & Stock Status
    stock_in_stock: 'En stock',
    stock_low: 'Stock limité : plus que {count} ex. !',
    stock_out: 'Rupture de stock',
    add_to_cart: 'Ajouter au panier',
    view_product: 'Découvrir',
    surgras_badge: 'Surgras {percent}',
    
    // Product Detail Screen & GPSR
    breadcrumb_home: 'Accueil',
    breadcrumb_shop: 'Boutique',
    key_ingredients_title: 'Ingrédients Clés',
    key_ingredients_badge: '100% Naturels',
    usage_tips_title: 'Conseils d\'utilisation',
    shipping_returns_title: 'Livraison & Retours',
    gpsr_title: 'Informations Réglementaires & INCI (GPSR)',
    gpsr_origin: 'Origine de fabrication',
    gpsr_inci: 'Liste INCI complète',
    gpsr_responsible: 'Personne responsable UE',
    gpsr_pao: 'Période Après Ouverture (PAO)',
    gpsr_batch: 'Numéro de lot',
    gpsr_pao_desc: 'À consommer de préférence dans les {pao} après première utilisation.',
    suggested_rituals_title: 'Complétez Votre Rituel',
    suggested_rituals_subtitle: 'Découvrez aussi',
    
    // Reviews
    reviews_title: 'Avis Clients Vérifiés',
    reviews_average: 'sur 5 basé sur {count} avis',
    reviews_leave_review: 'Laisser un avis',
    reviews_form_author: 'Votre Nom',
    reviews_form_email: 'Votre Email (ne sera pas publié)',
    reviews_form_rating: 'Votre Note',
    reviews_form_comment: 'Votre Avis',
    reviews_form_submit: 'Publier mon avis',
    reviews_moderation_note: 'Tous les avis sont modérés conformément à la réglementation avant leur mise en ligne.',
    reviews_success_toast: 'Merci ! Votre avis a été soumis et sera publié après validation.',
    
    // Cart & Summary
    cart_title: 'Votre Panier',
    cart_subtitle: 'Vérifiez les soins sélectionnés pour votre rituel.',
    cart_empty_title: 'Votre panier est vide',
    cart_empty_subtitle: 'Découvrez nos créations botaniques pures et commencez à composer votre rituel de bain.',
    cart_empty_cta: 'Explorer la boutique',
    cart_summary_title: 'Récapitulatif',
    cart_subtotal: 'Sous-total',
    cart_shipping_method: 'Mode de livraison',
    cart_shipping_standard: 'Standard (3-5 jours)',
    cart_shipping_express: 'Express (24-48h)',
    cart_shipping_free: 'Gratuit',
    cart_discount_label: 'Code Promo',
    cart_discount_placeholder: 'Entrez un code (ex: BIENVENUE10)',
    cart_discount_apply: 'Appliquer',
    cart_discount_applied: 'Remise code promo',
    cart_total: 'Total TTC',
    cart_checkout_btn: 'Passer la commande',
    cart_carbon_neutral: 'Livraison neutre en carbone',
    
    // Tunnel de commande 3 Étapes (Phase 3)
    tunnel_step1: '1. Panier',
    tunnel_step2: '2. Livraison',
    tunnel_step3: '3. Paiement',
    tunnel_customer_info: 'Informations de livraison',
    tunnel_full_name: 'Nom & Prénom',
    tunnel_email: 'Adresse Email',
    tunnel_phone: 'Numéro de téléphone (pour le suivi transporteur)',
    tunnel_address: 'Adresse de livraison',
    tunnel_postal_code: 'Code Postal',
    tunnel_city: 'Ville',
    tunnel_country: 'Pays de destination',
    tunnel_select_country: 'Sélectionner un pays',
    tunnel_shipping_options: 'Options d\'expédition disponibles',
    tunnel_payment_selection: 'Moyen de paiement sécurisé',
    tunnel_payment_stripe: 'Carte Bancaire (Stripe — CB, Visa, Mastercard, Apple Pay)',
    tunnel_payment_paypal: 'PayPal Express Checkout',
    tunnel_payment_om: 'Orange Money API (Afrique / International)',
    tunnel_payment_momo: 'MTN Mobile Money API',
    tunnel_payment_transfer: 'Virement bancaire sécurisé',
    tunnel_tax_breakdown: 'Détail fiscal certifié (Régime OSS)',
    tunnel_amount_ht: 'Sous-total Hors Taxes (HT)',
    tunnel_vat: 'TVA applicable ({rate}%)',
    tunnel_vat_exempt: 'Exonération TVA à l\'export (0%)',
    tunnel_shipping_cost: 'Frais de port',
    tunnel_confirm_btn: 'Confirmer et Régler la commande',
    tunnel_back_btn: 'Étape précédente',
    tunnel_next_btn: 'Continuer vers la livraison',
    tunnel_proceed_payment: 'Continuer vers le paiement',
    tunnel_order_confirmed: 'Commande Confirmée !',
    tunnel_order_success_desc: 'Votre rituel est en préparation dans notre atelier provençal. Un récapitulatif détaillé a été transmis par email.',
    
    // Footer
    footer_story: 'Notre Histoire',
    footer_ingredients: 'Ingrédients',
    footer_sustainability: 'Engagements RSE',
    footer_shipping: 'Livraison & Suivi',
    footer_contact: 'Contact',
    footer_legal: 'Mentions Légales',
    footer_cgv: 'CGV',
    footer_privacy: 'Politique de Confidentialité',
    footer_tagline: 'Savonnerie artisanale de tradition botanique. Ingrédients 100% naturels, saponification à froid, emballages éco-conçus sans plastique.',
    footer_rights: '© 2026 NDOLO RITUALS. TOUS DROITS RÉSERVÉS.',
  },
  en: {
    // Navigation & Header
    nav_home: 'Home',
    nav_shop: 'Shop',
    nav_rituals: 'The Ritual',
    nav_admin: 'Admin',
    nav_cart: 'Cart',
    search_placeholder: 'Search soap, ritual...',
    
    // Home Screen
    hero_badge: '100% Natural & Cold Processed',
    hero_title: 'The Art of Botanical & Ancestral Care',
    hero_subtitle: 'Artisanal superfatted soaps formulated with pure organic ingredients to deeply nourish your skin and awaken your senses.',
    hero_cta: 'Discover the Collection',
    hero_secondary: 'Our Signature Ritual',
    
    // Features / Value Props
    feature_natural_title: '100% Pure Ingredients',
    feature_natural_desc: 'Cold-pressed virgin oils, raw butters, and wild botanical extracts.',
    feature_cold_title: 'Cold Saponification',
    feature_cold_desc: 'Naturally preserves plant glycerin and the active virtues of precious oils.',
    feature_eco_title: 'Eco-Designed & Zero Plastic',
    feature_eco_desc: 'Fully compostable or recyclable packaging, gentle on our planet.',
    feature_delivery_title: 'Eco-Friendly Shipping',
    feature_delivery_desc: 'Carbon neutral, complimentary from 50€ across France & EU.',
    
    // Shop & Filters
    shop_title: 'Botanical Skincare',
    shop_subtitle: 'Explore our collection of artisanal soaps, precious oils, and pure bath rituals.',
    filter_all: 'All Products',
    filter_soaps: 'Cold Process Soaps',
    filter_oils: 'Precious Oils',
    filter_rituals: 'Sets & Rituals',
    filter_accessories: 'Accessories',
    sort_by: 'Sort by',
    sort_featured: 'Featured',
    sort_price_asc: 'Price: Low to High',
    sort_price_desc: 'Price: High to Low',
    sort_rating: 'Highest Rated',
    
    // Product Card & Stock Status
    stock_in_stock: 'In stock',
    stock_low: 'Limited stock: only {count} left!',
    stock_out: 'Out of stock',
    add_to_cart: 'Add to Cart',
    view_product: 'View Details',
    surgras_badge: '{percent} Superfatted',
    
    // Product Detail Screen & GPSR
    breadcrumb_home: 'Home',
    breadcrumb_shop: 'Shop',
    key_ingredients_title: 'Key Ingredients',
    key_ingredients_badge: '100% Natural',
    usage_tips_title: 'How to Use',
    shipping_returns_title: 'Shipping & Returns',
    gpsr_title: 'Regulatory Information & INCI (GPSR)',
    gpsr_origin: 'Country of Origin',
    gpsr_inci: 'Full INCI Ingredients',
    gpsr_responsible: 'EU Responsible Person',
    gpsr_pao: 'Period After Opening (PAO)',
    gpsr_batch: 'Batch Number',
    gpsr_pao_desc: 'Best used within {pao} after first use.',
    suggested_rituals_title: 'Complete Your Ritual',
    suggested_rituals_subtitle: 'You May Also Like',
    
    // Reviews
    reviews_title: 'Verified Customer Reviews',
    reviews_average: 'out of 5 based on {count} reviews',
    reviews_leave_review: 'Write a Review',
    reviews_form_author: 'Your Name',
    reviews_form_email: 'Your Email (kept private)',
    reviews_form_rating: 'Your Rating',
    reviews_form_comment: 'Your Review',
    reviews_form_submit: 'Submit Review',
    reviews_moderation_note: 'All reviews are verified and moderated prior to publication in compliance with regulations.',
    reviews_success_toast: 'Thank you! Your review has been submitted and will be published after verification.',
    
    // Cart & Summary
    cart_title: 'Your Cart',
    cart_subtitle: 'Review the botanical creations curated for your ritual.',
    cart_empty_title: 'Your cart is currently empty',
    cart_empty_subtitle: 'Discover our pure botanical creations and start composing your self-care ritual.',
    cart_empty_cta: 'Explore Shop',
    cart_summary_title: 'Summary',
    cart_subtotal: 'Subtotal',
    cart_shipping_method: 'Shipping Method',
    cart_shipping_standard: 'Standard (3-5 days)',
    cart_shipping_express: 'Express (24-48h)',
    cart_shipping_free: 'Free',
    cart_discount_label: 'Discount Code',
    cart_discount_placeholder: 'Enter code (e.g. BIENVENUE10)',
    cart_discount_apply: 'Apply',
    cart_discount_applied: 'Discount Applied',
    cart_total: 'Total (incl. VAT)',
    cart_checkout_btn: 'Proceed to Checkout',
    cart_carbon_neutral: 'Carbon neutral delivery',
    
    // 3-Step Checkout Funnel (Phase 3)
    tunnel_step1: '1. Cart',
    tunnel_step2: '2. Shipping',
    tunnel_step3: '3. Payment',
    tunnel_customer_info: 'Shipping Information',
    tunnel_full_name: 'Full Name',
    tunnel_email: 'Email Address',
    tunnel_phone: 'Phone Number (for carrier tracking)',
    tunnel_address: 'Street Address',
    tunnel_postal_code: 'Postal Code / ZIP',
    tunnel_city: 'City',
    tunnel_country: 'Destination Country',
    tunnel_select_country: 'Select Country',
    tunnel_shipping_options: 'Available Carrier Methods',
    tunnel_payment_selection: 'Secure Payment Method',
    tunnel_payment_stripe: 'Credit Card (Stripe — Visa, Mastercard, Apple Pay)',
    tunnel_payment_paypal: 'PayPal Express Checkout',
    tunnel_payment_om: 'Orange Money API',
    tunnel_payment_momo: 'MTN Mobile Money API',
    tunnel_payment_transfer: 'Direct Bank Wire Transfer',
    tunnel_tax_breakdown: 'Certified Tax Breakdown (OSS Regime)',
    tunnel_amount_ht: 'Subtotal Net of Taxes (HT)',
    tunnel_vat: 'Applicable VAT ({rate}%)',
    tunnel_vat_exempt: 'VAT Export Exemption (0%)',
    tunnel_shipping_cost: 'Shipping Fee',
    tunnel_confirm_btn: 'Confirm & Place Order',
    tunnel_back_btn: 'Previous Step',
    tunnel_next_btn: 'Continue to Shipping',
    tunnel_proceed_payment: 'Proceed to Payment',
    tunnel_order_confirmed: 'Order Confirmed!',
    tunnel_order_success_desc: 'Your botanical ritual is now being prepared in our French atelier. Tracking details have been sent to your email.',
    
    // Footer
    footer_story: 'Our Story',
    footer_ingredients: 'Ingredients',
    footer_sustainability: 'Sustainability',
    footer_shipping: 'Shipping & Tracking',
    footer_contact: 'Contact Us',
    footer_legal: 'Legal Notice',
    footer_cgv: 'Terms & Conditions',
    footer_privacy: 'Privacy Policy',
    footer_tagline: 'Artisanal cold process botanical soapmaking. 100% natural ingredients, zero plastic, eco-designed packaging.',
    footer_rights: '© 2026 NDOLO RITUALS. ALL RIGHTS RESERVED.',
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS.fr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY_LANG = 'ndolo_language_pref';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'fr' || saved === 'en') return saved;
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('en')) return 'en';
    } catch {
      // ignore
    }
    return 'fr';
  });

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // ignore
    }
    setLanguageState(lang);
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.fr;
    let str = dict[key] || TRANSLATIONS.fr[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
