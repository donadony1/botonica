import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Product, Article, SiteSettings, Review } from '../types';
import {
  fetchProducts,
  createProduct,
  updateProductAPI,
  deleteProductAPI,
  fetchArticles,
  createArticle,
  updateArticleAPI,
  deleteArticleAPI,
  fetchSiteSettings,
  saveSiteSettingsAPI,
} from '../lib/api';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Ndolo Rituals',
  tagline: 'Rituels de beauté naturels & artisanaux',
  logoUrl: '',
  primaryColor: '#bb0a4a',
  secondaryColor: '#824f39',
  accentColor: '#d4e8d0',
  freeShippingThreshold: 50,
  currency: 'EUR',
  contactEmail: 'contact@ndolo-rituals.fr',
  address: 'Atelier Provençal, France',
  instagram: '@ndolo.rituals',
  facebook: 'NdoloRituals',
  metaTitle: 'Ndolo Rituals — Savons & Huiles Naturels Artisanaux',
  metaDescription: 'Découvrez notre collection de savons saponifiés à froid, huiles précieuses et rituels de beauté 100% naturels fabriqués à la main en Provence.',
};

const STORAGE_KEY_PRODUCTS = 'ndolo_admin_products';
const STORAGE_KEY_ARTICLES = 'ndolo_admin_articles';
const STORAGE_KEY_SETTINGS = 'ndolo_admin_settings';
const STORAGE_KEY_REVIEWS  = 'ndolo_admin_reviews';

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Product[];
      }
    }
  } catch { /* ignore */ }
  return [];
}

function loadArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Article[];
      }
    }
  } catch { /* ignore */ }
  return [];
}

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        currency: (parsed.currency || 'EUR').trim().toUpperCase() || 'EUR',
      } as SiteSettings;
    }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function loadReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (raw) return JSON.parse(raw) as Review[];
  } catch { /* ignore */ }
  return [];
}

interface AdminContextValue {
  products: Product[];
  articles: Article[];
  isLoadingProducts: boolean;
  isLoadingArticles: boolean;
  dataSource: 'api';
  siteSettings: SiteSettings;
  reviews: Review[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'status' | 'date'>) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'rejected') => void;
  deleteReview: (id: string) => void;
  reduceStock: (items: { productId: string; quantity: number }[]) => void;
  refreshProducts: () => Promise<void>;
  refreshArticles: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts]           = useState<Product[]>(loadProducts);
  const [articles, setArticles]           = useState<Article[]>(loadArticles);
  const [isLoadingProducts, setLoading]   = useState<boolean>(true);
  const [isLoadingArticles, setLoadingArt] = useState<boolean>(true);
  const [siteSettings, setSiteSettings]   = useState<SiteSettings>(loadSettings);
  const [reviews, setReviews]             = useState<Review[]>(loadReviews);

  const refreshSettings = useCallback(async () => {
    try {
      const apiSettings = await fetchSiteSettings();
      if (apiSettings) {
        const merged: SiteSettings = {
          ...DEFAULT_SETTINGS,
          ...apiSettings,
          currency: (apiSettings.currency || 'EUR').trim().toUpperCase() || 'EUR',
        };
        setSiteSettings(merged);
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(merged));
      }
    } catch {
      // Garder les settings locaux
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const apiProducts = await fetchProducts();
      if (apiProducts !== null) {
        setProducts(apiProducts);
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(apiProducts));
      }
    } catch (err) {
      console.error('[API] Erreur lors du chargement des produits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshArticles = useCallback(async () => {
    setLoadingArt(true);
    try {
      const apiArticles = await fetchArticles();
      if (apiArticles !== null) {
        setArticles(apiArticles);
        localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(apiArticles));
      }
    } catch (err) {
      console.error('[API] Erreur lors du chargement des articles:', err);
    } finally {
      setLoadingArt(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshArticles();
    refreshSettings();
  }, [refreshProducts, refreshArticles, refreshSettings]);

  // Synchronisation dynamique des variables CSS et du titre du document
  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', siteSettings.primaryColor);
      }
      if (siteSettings.secondaryColor) {
        document.documentElement.style.setProperty('--color-secondary', siteSettings.secondaryColor);
      }
      if (siteSettings.accentColor) {
        document.documentElement.style.setProperty('--color-accent', siteSettings.accentColor);
      }
      if (siteSettings.siteName && !document.title.includes('—')) {
        document.title = siteSettings.metaTitle || `${siteSettings.siteName} — ${siteSettings.tagline}`;
      }
    }
  }, [siteSettings]);

  const addProduct = useCallback(async (product: Product) => {
    const result = await createProduct(product);
    await refreshProducts();
    if (!result.success) {
      throw new Error(result.error || 'Échec de création du produit dans la base de données');
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (product: Product) => {
    const result = await updateProductAPI(product);
    await refreshProducts();
    if (!result.success) {
      throw new Error(result.error || 'Échec de modification du produit dans la base de données');
    }
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const result = await deleteProductAPI(id);
    await refreshProducts();
    if (!result.success) {
      throw new Error(result.error || 'Échec de suppression du produit dans la base de données');
    }
  }, [refreshProducts]);

  const addArticle = useCallback(async (article: Article) => {
    const result = await createArticle(article);
    await refreshArticles();
    if (!result.success) {
      throw new Error(result.error || 'Échec de création de l\'article dans la base de données');
    }
  }, [refreshArticles]);

  const updateArticle = useCallback(async (article: Article) => {
    const result = await updateArticleAPI(article);
    await refreshArticles();
    if (!result.success) {
      throw new Error(result.error || 'Échec de modification de l\'article dans la base de données');
    }
  }, [refreshArticles]);

  const deleteArticle = useCallback(async (id: string) => {
    const result = await deleteArticleAPI(id);
    await refreshArticles();
    if (!result.success) {
      throw new Error(result.error || 'Échec de suppression de l\'article dans la base de données');
    }
  }, [refreshArticles]);

  const updateSettings = useCallback(async (settings: SiteSettings) => {
    const cleanSettings: SiteSettings = {
      ...settings,
      currency: (settings.currency || 'EUR').trim().toUpperCase() || 'EUR',
    };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(cleanSettings));
    setSiteSettings(cleanSettings);
    try {
      await saveSiteSettingsAPI(cleanSettings);
    } catch (err) {
      console.warn('[Settings] Sauvegarde locale active, échec sync backend:', err);
    }
  }, []);

  const addReview = useCallback((newRev: Omit<Review, 'id' | 'status' | 'date'>) => {
    const createdReview: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      status: 'pending',
      date: 'À l\'instant',
    };
    setReviews((prev) => {
      const updated = [createdReview, ...prev];
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateReviewStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status } : r));
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const reduceStock = useCallback((items: { productId: string; quantity: number }[]) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        const matching = items.find((it) => it.productId === p.id);
        if (matching) {
          const newStock = Math.max(0, p.stock - matching.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      });
      return updated;
    });
  }, []);

  return (
    <AdminContext.Provider
      value={{
        products,
        articles,
        isLoadingProducts,
        isLoadingArticles,
        dataSource: 'api',
        siteSettings,
        reviews,
        addProduct,
        updateProduct,
        deleteProduct,
        addArticle,
        updateArticle,
        deleteArticle,
        updateSettings,
        addReview,
        updateReviewStatus,
        deleteReview,
        reduceStock,
        refreshProducts,
        refreshArticles,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
