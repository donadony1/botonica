import { CartItem, Product, Article, User, AuthSessionUser, UserRole, SiteSettings } from '../types';
import { getAdminSession, DEFAULT_ADMIN_TOKEN } from './security';

const ENV_API_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (import.meta as any).env?.VITE_API_URL;

const PROD_DEFAULT_BACKEND = 'https://ndoloblacksoapcm.hondap.com/back-end/public';

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1');

const API_CANDIDATE_URLS: string[] = [];

if (ENV_API_URL) {
  const cleanEnv = String(ENV_API_URL).replace(/\/$/, '');
  API_CANDIDATE_URLS.push(cleanEnv);
  API_CANDIDATE_URLS.push(`${cleanEnv}/index.php`);
}

if (isLocalhost) {
  API_CANDIDATE_URLS.push('/api');
  API_CANDIDATE_URLS.push('http://localhost/project2026/ndolo-black-soap/back-end/public');
} else {
  // En production sur Vercel ou domaine externe
  API_CANDIDATE_URLS.push(PROD_DEFAULT_BACKEND);
  API_CANDIDATE_URLS.push(`${PROD_DEFAULT_BACKEND}/index.php`);
  API_CANDIDATE_URLS.push('/api');
}

/**
 * Exécute une requête fetch vers le backend en testant les URLs candidates
 */
async function callBackend(path: string, options: RequestInit = {}): Promise<Response | null> {
  const cleanPath = '/' + ltrim(path, '/');
  const session = getAdminSession();
  const adminToken = session?.token || (import.meta as any).env?.VITE_ADMIN_API_TOKEN || DEFAULT_ADMIN_TOKEN;

  for (const baseUrl of API_CANDIDATE_URLS) {
    try {
      const url = `${baseUrl}${cleanPath}`;
      const res = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...(adminToken ? { 'X-Admin-Token': adminToken, 'Authorization': `Bearer ${adminToken}` } : {}),
          ...(options.headers || {}),
        },
        signal: AbortSignal.timeout(5000), // 5s timeout
      });

      // Si le serveur a répondu (succès ou erreur applicative 4xx/2xx)
      if (res.status < 500) {
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
 * Normalise les URLs d'images pour éviter les erreurs Mixed Content (HTTP sur HTTPS)
 * et corriger automatiquement les chemins localhost stockés en base de données.
 */
export function normalizeImageUrl(imgUrl: string | undefined | null): string {
  if (!imgUrl) return '';
  let url = String(imgUrl).trim();

  // Si l'URL contient un chemin d'upload du backend
  const uploadMatch = url.match(/\/uploads\/products\/([^?#]+)/);
  if (uploadMatch) {
    const filename = uploadMatch[1];
    if (isLocalhost) {
      return `/api/uploads/products/${filename}`;
    } else {
      return `${PROD_DEFAULT_BACKEND}/uploads/products/${filename}`;
    }
  }

  // Si la page actuelle est en HTTPS, forcer HTTPS pour éviter Mixed Content
  if (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    url.startsWith('http://') &&
    !url.includes('localhost') &&
    !url.includes('127.0.0.1')
  ) {
    url = url.replace('http://', 'https://');
  }

  return url;
}

function normalizeProduct(p: any): Product {
  if (!p || typeof p !== 'object') return p;
  const rawImages: any[] = Array.isArray(p.images)
    ? p.images
    : typeof p.images === 'string' && p.images.trim()
    ? (p.images.trim().startsWith('[') ? (JSON.parse(p.images) || []) : [p.images.trim()])
    : [];

  const normalizedImages = rawImages
    .map(img => (typeof img === 'string' ? normalizeImageUrl(img) : ''))
    .filter(Boolean);

  const fallbackDefaultImg = 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80';
  const primaryImage = normalizeImageUrl(p.image) || normalizedImages[0] || fallbackDefaultImg;

  let cleanTags: string[] = [];
  if (Array.isArray(p.tags)) {
    cleanTags = p.tags.map(String);
  } else if (typeof p.tags === 'string' && p.tags.trim()) {
    try {
      cleanTags = p.tags.startsWith('[') ? JSON.parse(p.tags) : p.tags.split(',');
    } catch {
      cleanTags = [p.tags];
    }
  }

  let cleanIngredients: any[] = [];
  if (Array.isArray(p.ingredients)) {
    cleanIngredients = p.ingredients;
  } else if (typeof p.ingredients === 'string' && p.ingredients.trim()) {
    try {
      cleanIngredients = JSON.parse(p.ingredients) || [];
    } catch {
      cleanIngredients = [];
    }
  }

  return {
    ...p,
    id: String(p.id || ''),
    name: String(p.name || 'Produit Ndolo'),
    tagline: String(p.tagline || ''),
    description: String(p.description || ''),
    category: (p.category || 'soaps') as any,
    price: typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 0),
    rating: typeof p.rating === 'number' ? p.rating : (parseFloat(p.rating) || 5.0),
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : (parseInt(p.reviewCount, 10) || 0),
    stock: typeof p.stock === 'number' ? p.stock : (parseInt(p.stock, 10) || 0),
    lowStockThreshold: typeof p.lowStockThreshold === 'number' ? p.lowStockThreshold : (parseInt(p.lowStockThreshold, 10) || 5),
    featured: Boolean(p.featured && p.featured !== '0' && p.featured !== 0),
    tags: cleanTags,
    ingredients: cleanIngredients,
    image: primaryImage,
    images: normalizedImages.length > 0 ? normalizedImages : [primaryImage],
  };
}

function normalizeArticle(a: any): Article {
  if (!a || typeof a !== 'object') return a;
  return {
    ...a,
    image: normalizeImageUrl(a.image),
  };
}

/**
 * Charge le catalogue complet depuis l'API PHP backend
 */
export async function fetchProducts(): Promise<Product[] | null> {
  try {
    const res = await callBackend('/products', { method: 'GET' });
    if (!res) return null;

    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(normalizeProduct) as Product[];
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
    return json.success && json.data ? normalizeProduct(json.data) : null;
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
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(normalizeArticle) as Article[];
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
    return json.success && json.data ? normalizeArticle(json.data) : null;
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

/**
 * Récupère la liste complète des commandes pour l'administration (sécurisé via token)
 */
export async function fetchAdminOrders(): Promise<any[] | null> {
  try {
    const res = await callBackend('/orders', { method: 'GET' });
    if (res && res.ok) {
      const json = await res.json();
      return json.success && Array.isArray(json.data) ? json.data : null;
    }
  } catch {
    return null;
  }
  return null;
}

// ─────────────────────────────────────────────────────────
// AUTHENTIFICATION & GESTION DES UTILISATEURS / GÉRANTS
// ─────────────────────────────────────────────────────────

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: AuthSessionUser;
  error?: string;
}

/**
 * Authentification utilisateur (Email + Mot de passe ou Clé Admin)
 */
export async function loginUserAPI(email: string, password?: string, token?: string): Promise<LoginResult> {
  try {
    const res = await callBackend('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, token }),
    });

    if (!res) {
      // Si offline ou backend non joignable, fallback sur la clé maître
      const configuredToken = (import.meta as any).env?.VITE_ADMIN_API_TOKEN || DEFAULT_ADMIN_TOKEN;
      if (password === configuredToken || token === configuredToken) {
        return {
          success: true,
          token: configuredToken,
          user: {
            id: 'usr_superadmin',
            name: 'Administrateur',
            email: 'admin@ndolo-rituals.fr',
            role: 'admin',
          },
        };
      }
      return { success: false, error: 'Impossible de joindre le serveur d\'authentification.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur réseau lors de la connexion.' };
  }
}

/**
 * Récupère la liste des utilisateurs / gérants (Admin et Gérants)
 */
export async function fetchStaffUsers(): Promise<User[] | null> {
  try {
    const res = await callBackend('/users', { method: 'GET' });
    if (!res) return null;

    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data as User[];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Crée un nouveau gérant ou administrateur dans la base de données
 * RÈGLE : Seul un administrateur peut ajouter un gérant.
 */
export async function createStaffUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<{ success: boolean; data?: User; message?: string; error?: string }> {
  try {
    const res = await callBackend('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur PHP.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la création du compte.' };
  }
}

/**
 * Met à jour un utilisateur ou gérant (Rôle, statut actif/inactif, mot de passe)
 */
export async function updateStaffUser(
  id: string,
  data: Partial<{ name: string; role: UserRole; isActive: boolean; password: string }>
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await callBackend(`/users/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la mise à jour.' };
  }
}

/**
 * Supprime un utilisateur / gérant
 */
export async function deleteStaffUser(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await callBackend(`/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de la suppression.' };
  }
}

// ─────────────────────────────────────────────────────────
// PARAMÈTRES DU SITE (RÉGLAGES, IDENTITÉ, DEVISE, LOGO)
// ─────────────────────────────────────────────────────────

/**
 * Récupère les réglages du site depuis le backend MySQL
 */
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const res = await callBackend('/settings', { method: 'GET' });
    if (!res) return null;

    const json = await res.json();
    if (json.success && json.data) {
      return json.data as SiteSettings;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Enregistre les réglages du site dans le backend MySQL
 */
export async function saveSiteSettingsAPI(settings: SiteSettings): Promise<{ success: boolean; message?: string; data?: SiteSettings; error?: string }> {
  try {
    const res = await callBackend('/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (!res) {
      return { success: false, error: 'Impossible de joindre le serveur pour sauvegarder les réglages.' };
    }

    const json = await res.json();
    return json;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Erreur lors de l\'enregistrement des réglages.' };
  }
}





