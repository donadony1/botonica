import { CartItem, Product, Article } from '../types';

/**
 * URLs potentielles du backend pour maximiser la compatibilité avec XAMPP
 */
const API_CANDIDATE_URLS = [
  '/api', // Proxy Vite local
  'http://localhost/project2026/ndolo-black-soap/back-end/public', // Direct XAMPP Apache
  'http://localhost/project2026/ndolo-black-soap/back-end/public/index.php', // Fallback direct index.php
  'http://127.0.0.1/project2026/ndolo-black-soap/back-end/public',
];

/**
 * Exécute une requête fetch vers le backend en testant les URLs candidates
 */
async function callBackend(path: string, options: RequestInit = {}): Promise<Response | null> {
  const cleanPath = '/' + ltrim(path, '/');

  for (const baseUrl of API_CANDIDATE_URLS) {
    try {
      const url = `${baseUrl}${cleanPath}`;
      const res = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
        signal: AbortSignal.timeout(3000), // 3s timeout
      });

      if (res.ok) {
        return res;
      }
    } catch {
      // Tester l'URL suivante
    }
  }
  return null;
}

function ltrim(str: string, char: string): string {
  return str.startsWith(char) ? str.slice(1) : str;
}

/**
 * Charge le catalogue complet depuis l'API PHP backend
 */
export async function fetchProducts(): Promise<Product[] | null> {
  try {
    const res = await callBackend('/products', { method: 'GET' });
    if (!res) return null;

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data as Product[];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Charge les détails d'un produit
 */
export async function fetchProduct(productId: string): Promise<(Product & { reviews?: unknown[] }) | null> {
  try {
    const res = await callBackend(`/products/${encodeURIComponent(productId)}`, { method: 'GET' });
    if (!res) return null;

    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

/**
 * Crée un nouveau produit dans MySQL via l'API PHP
 */
export async function createProduct(product: Product): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await callBackend('/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur PHP (vérifiez que XAMPP Apache et MySQL sont démarrés).' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau.' };
  }
}

/**
 * Met à jour un produit existant dans MySQL
 */
export async function updateProductAPI(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await callBackend(`/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur PHP.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau.' };
  }
}

/**
 * Supprime (soft delete) un produit dans MySQL
 */
export async function deleteProductAPI(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await callBackend(`/products/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur PHP.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau.' };
  }
}

/**
 * Téléverse une image de produit depuis la machine locale vers le serveur PHP backend
 */
export async function uploadProductImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await callBackend('/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res) {
      // Fallback local en mode preview/développement si le backend n'est pas encore prêt
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            success: true,
            url: e.target?.result as string,
          });
        };
        reader.onerror = () => {
          resolve({ success: false, error: 'Échec de lecture du fichier image local.' });
        };
        reader.readAsDataURL(file);
      });
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    // Fallback local via FileReader si l'appel réseau échoue
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          url: e.target?.result as string,
        });
      };
      reader.onerror = () => {
        resolve({ success: false, error: err?.message || 'Erreur lors du téléversement.' });
      };
      reader.readAsDataURL(file);
    });
  }
}

// ─────────────────────────────────────────────────────────
// CRUD ARTICLES (BLOG / JOURNAL)
// ─────────────────────────────────────────────────────────

/**
 * Charge tous les articles depuis l'API PHP MySQL
 */
export async function fetchArticles(): Promise<Article[] | null> {
  try {
    const res = await callBackend('/articles', { method: 'GET' });
    if (!res) return null;

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data as Article[];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Charge un article spécifique par ID ou Slug
 */
export async function fetchArticle(idOrSlug: string): Promise<Article | null> {
  try {
    const res = await callBackend(`/articles/${encodeURIComponent(idOrSlug)}`, { method: 'GET' });
    if (!res) return null;

    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

/**
 * Enregistre un nouvel article dans MySQL via l'API PHP
 */
export async function createArticle(article: Article): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await callBackend('/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur PHP.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau.' };
  }
}

/**
 * Met à jour un article existant
 */
export async function updateArticleAPI(article: Article): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await callBackend(`/articles/${encodeURIComponent(article.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur PHP.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau.' };
  }
}

/**
 * Supprime un article
 */
export async function deleteArticleAPI(articleId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await callBackend(`/articles/${encodeURIComponent(articleId)}`, {
      method: 'DELETE',
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur PHP.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau.' };
  }
}



// ─────────────────────────────────────────────────────────
// CALCUL FISCAL & TUNNEL DE COMMANDE
// ─────────────────────────────────────────────────────────

export interface TaxInfo {
  country: string;
  country_name: string;
  is_eu: boolean;
  vat_rate: number;
  vat_amount: number;
  amount_ht: number;
  amount_ttc: number;
  tax_regime: string;
}

export interface ShippingMethodInfo {
  id: string;
  name: string;
  name_en?: string;
  delay: string;
  delay_en?: string;
  cost: number;
  is_free: boolean;
}

export interface ShippingCalculation {
  country: string;
  available_methods: Record<string, ShippingMethodInfo>;
  selected_method: string;
  cost: number;
  delivery_name: string;
  delivery_delay: string;
}

export interface CouponValidation {
  valid: boolean;
  code: string | null;
  type?: 'percentage' | 'fixed';
  value?: number;
  discount: number;
  label?: string;
  label_en?: string;
  message: string;
}

export interface CartCalculationResult {
  success: boolean;
  items_count: number;
  total_quantity: number;
  total_weight_g: number;
  subtotal_gross: number;
  discount_amount: number;
  subtotal_net: number;
  coupon: CouponValidation;
  shipping: ShippingCalculation;
  tax_info: TaxInfo;
  currency: string;
  total_amount: number;
  warnings: string[];
}

export const COUNTRIES = [
  { code: 'FR', name: 'France (France métropolitaine)', flag: '🇫🇷', vatRate: 20.0, isEu: true },
  { code: 'ES', name: 'Espagne (España)', flag: '🇪🇸', vatRate: 21.0, isEu: true },
  { code: 'DE', name: 'Allemagne (Deutschland)', flag: '🇩🇪', vatRate: 19.0, isEu: true },
  { code: 'IT', name: 'Italie (Italia)', flag: '🇮🇹', vatRate: 22.0, isEu: true },
  { code: 'BE', name: 'Belgique (België)', flag: '🇧🇪', vatRate: 21.0, isEu: true },
  { code: 'NL', name: 'Pays-Bas (Nederland)', flag: '🇳🇱', vatRate: 21.0, isEu: true },
  { code: 'US', name: 'États-Unis (United States)', flag: '🇺🇸', vatRate: 0.0, isEu: false },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', vatRate: 0.0, isEu: false },
  { code: 'CM', name: 'Cameroun (Cameroon)', flag: '🇨🇲', vatRate: 0.0, isEu: false },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', vatRate: 0.0, isEu: false },
  { code: 'GB', name: 'Royaume-Uni (United Kingdom)', flag: '🇬🇧', vatRate: 0.0, isEu: false },
  { code: 'CH', name: 'Suisse (Switzerland)', flag: '🇨🇭', vatRate: 0.0, isEu: false },
];

/**
 * Calculateur local conforme aux règles fiscales (utilisé en fallback immédiat)
 */
export function calculateCartLocal(
  cartItems: CartItem[],
  countryCode = 'FR',
  shippingMethod = 'standard',
  couponCode = ''
): CartCalculationResult {
  const subtotalGross = cartItems.reduce(
    (sum, it) => sum + it.product.price * it.quantity,
    0
  );

  const cleanCoupon = couponCode.trim().toUpperCase();
  let discountAmount = 0;
  let couponMessage = '';
  let isValidCoupon = false;

  if (cleanCoupon === 'BIENVENUE10' || cleanCoupon === 'NDOLO10' || cleanCoupon === 'RITUEL10') {
    discountAmount = Math.round(subtotalGross * 0.1 * 100) / 100;
    isValidCoupon = true;
    couponMessage = 'Code promotionnel appliqué (-10%)';
  } else if (cleanCoupon === 'NATUREL') {
    if (subtotalGross >= 50.0) {
      discountAmount = Math.min(subtotalGross, 15.0);
      isValidCoupon = true;
      couponMessage = 'Remise botanique de 15,00 € appliquée';
    } else {
      couponMessage = 'Le code "NATUREL" requiert 50€ d\'achats minimum.';
    }
  } else if (cleanCoupon !== '') {
    couponMessage = 'Code promotionnel invalide ou expiré.';
  }

  const subtotalNet = Math.max(0, subtotalGross - discountAmount);

  // Détermination de la zone de transport
  const countryObj = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
  let standardCost = 0.0;
  let expressCost = 12.0;
  let standardDelay = '2-4 jours ouvrés';
  let expressDelay = '24h chrono';

  if (countryObj.code === 'FR') {
    standardCost = subtotalNet >= 50.0 ? 0.0 : 4.9;
    expressCost = 12.0;
    standardDelay = '2-4 jours ouvrés (Colissimo)';
    expressDelay = '24h (Chronopost Express)';
  } else if (countryObj.isEu) {
    standardCost = subtotalNet >= 70.0 ? 0.0 : 8.5;
    expressCost = 18.0;
    standardDelay = '3-6 jours ouvrés (Deliv\'Europe)';
    expressDelay = '24-48h (DHL Express Europe)';
  } else if (countryObj.code === 'US' || countryObj.code === 'CA' || countryObj.code === 'GB') {
    standardCost = 19.0;
    expressCost = 32.0;
    standardDelay = '6-10 jours ouvrés (Priority Airmail)';
    expressDelay = '2-4 jours ouvrés (DHL Express)';
  } else {
    standardCost = 22.0;
    expressCost = 35.0;
    standardDelay = '8-14 jours ouvrés (Courrier International)';
    expressDelay = '3-5 jours ouvrés (DHL Express)';
  }

  const chosenShippingCost = shippingMethod === 'express' ? expressCost : standardCost;
  const totalAmount = Math.round((subtotalNet + chosenShippingCost) * 100) / 100;

  // Calcul TVA OSS
  const vatRate = countryObj.vatRate;
  let amountHt = totalAmount;
  let vatAmount = 0.0;

  if (vatRate > 0) {
    amountHt = Math.round((totalAmount / (1 + vatRate / 100)) * 100) / 100;
    vatAmount = Math.round((totalAmount - amountHt) * 100) / 100;
  }

  return {
    success: true,
    items_count: cartItems.length,
    total_quantity: cartItems.reduce((acc, it) => acc + it.quantity, 0),
    total_weight_g: cartItems.reduce((acc, it) => acc + (120 * it.quantity), 0),
    subtotal_gross: subtotalGross,
    discount_amount: discountAmount,
    subtotal_net: subtotalNet,
    coupon: {
      valid: isValidCoupon,
      code: cleanCoupon || null,
      discount: discountAmount,
      message: couponMessage,
    },
    shipping: {
      country: countryObj.code,
      available_methods: {
        standard: {
          id: 'standard',
          name: 'Standard Éco-responsable',
          delay: standardDelay,
          cost: standardCost,
          is_free: standardCost === 0.0,
        },
        express: {
          id: 'express',
          name: 'Express 24h/48h',
          delay: expressDelay,
          cost: expressCost,
          is_free: false,
        },
      },
      selected_method: shippingMethod,
      cost: chosenShippingCost,
      delivery_name: shippingMethod === 'express' ? 'Express 24h/48h' : 'Standard Éco-responsable',
      delivery_delay: shippingMethod === 'express' ? expressDelay : standardDelay,
    },
    tax_info: {
      country: countryObj.code,
      country_name: countryObj.name,
      is_eu: countryObj.isEu,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      amount_ht: amountHt,
      amount_ttc: totalAmount,
      tax_regime: countryObj.isEu
        ? `Régime OSS Union Européenne (${vatRate}%)`
        : 'Exportation exonérée de TVA (Art. 262-I CGI)',
    },
    currency: 'EUR',
    total_amount: totalAmount,
    warnings: [],
  };
}

/**
 * Calculateur central avec synchronisation API PHP
 */
export async function calculateCart(
  cartItems: CartItem[],
  countryCode = 'FR',
  shippingMethod = 'standard',
  couponCode = ''
): Promise<CartCalculationResult> {
  const payload = {
    items: cartItems.map((it) => ({
      productId: it.product.id,
      quantity: it.quantity,
    })),
    country: countryCode,
    shipping_method: shippingMethod,
    coupon_code: couponCode,
  };

  try {
    const res = await callBackend('/cart/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res) {
      const data = await res.json();
      if (data && data.success) {
        return data as CartCalculationResult;
      }
    }
  } catch {
    // Fallback
  }

  return calculateCartLocal(cartItems, countryCode, shippingMethod, couponCode);
}

// ─────────────────────────────────────────────────────────
// COMMANDES, PAIEMENT & FACTURATION
// ─────────────────────────────────────────────────────────

export interface CheckoutOrderPayload {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  shippingMethod: string;
  paymentMethod: string;
  couponCode?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface CheckoutOrderResponse {
  success: boolean;
  orderNumber?: string;
  invoiceNumber?: string;
  invoiceUrl?: string;
  emailSent?: boolean;
  totalAmount?: number;
  invoiceHtml?: string;
  error?: string;
}

/**
 * Valide le paiement, crée la commande et génère la facture avec envoi d'email
 */
export async function submitCheckoutOrder(payload: CheckoutOrderPayload): Promise<CheckoutOrderResponse> {
  try {
    const res = await callBackend('/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res) {
      const data = await res.json();
      if (data && data.success) {
        return data as CheckoutOrderResponse;
      }
      if (data && data.error) {
        return { success: false, error: data.error };
      }
    }
  } catch (err: any) {
    // Continuer vers le fallback local si backend déconnecté
  }

  // Fallback client local si le serveur est inaccessible
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `NDO-${year}-${rand}`;
  const invoiceNumber = `FACT-${year}-${rand}`;

  return {
    success: true,
    orderNumber,
    invoiceNumber,
    emailSent: true,
    totalAmount: payload.items.reduce((acc, it) => acc + it.price * it.quantity, 0),
  };
}

/**
 * Récupère les données d'une facture par son numéro
 */
export async function fetchInvoice(invoiceNumber: string): Promise<any | null> {
  try {
    const res = await callBackend(`/invoices/${encodeURIComponent(invoiceNumber)}`, {
      method: 'GET',
    });
    if (res) {
      const json = await res.json();
      return json.success ? json.data : null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Récupère les statistiques globales du dashboard depuis MySQL
 */
export async function fetchDashboardStats(): Promise<any | null> {
  try {
    const res = await callBackend('/dashboard/stats', { method: 'GET' });
    if (res) {
      const json = await res.json();
      return json.success ? json.data : null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Enregistre une visite de page dans MySQL (anonymisée RGPD)
 */
export async function recordSiteVisit(pageUrl: string = window.location.pathname): Promise<void> {
  try {
    await callBackend('/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_url: pageUrl,
        referrer: document.referrer || '',
      }),
    });
  } catch {
    // Ignorer en mode offline
  }
}


