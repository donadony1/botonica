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

const KNOWN_MOCK_PRODUCT_IDS = new Set([
  'savon-signature', 'huile-precieuse', 'baume-botanique', 'coffret-rituel',
  'savon-karite-miel', 'savon-charbon-arbre-the', 'huile-precieuse-baobab', 'coffret-rituel-complet'
]);

const KNOWN_MOCK_ARTICLE_IDS = new Set([
  'art-saponification-froid', 'secret-beurre-karite-grand-cru',
  'rituel-bain-ancestral-apaisant', 'vaincre-acne-hyper-pigmentation'
]);

function loadProductsLocal(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      return parsed.filter((p) => p && p.id && !KNOWN_MOCK_PRODUCT_IDS.has(p.id));
    }
  } catch { /* ignore */ }
  return [];
}

function loadArticlesLocal(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (raw) {
      const parsed = JSON.parse(raw) as Article[];
      return parsed.filter((a) => a && (a.id || a.slug) && !KNOWN_MOCK_ARTICLE_IDS.has(a.id) && !KNOWN_MOCK_ARTICLE_IDS.has(a.slug));
    }
  } catch { /* ignore */ }
  return [];
}

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as SiteSettings;
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
  dataSource: 'api' | 'local';
  siteSettings: SiteSettings;
  reviews: Review[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (article: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  updateSettings: (settings: SiteSettings) => void;
  addReview: (review: Omit<Review, 'id' | 'status' | 'date'>) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'rejected') => void;
  deleteReview: (id: string) => void;
  reduceStock: (items: { productId: string; quantity: number }[]) => void;
  refreshProducts: () => Promise<void>;
  refreshArticles: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts]           = useState<Product[]>(loadProductsLocal);
  const [articles, setArticles]           = useState<Article[]>(loadArticlesLocal);
  const [isLoadingProducts, setLoading]   = useState<boolean>(false);
  const [isLoadingArticles, setLoadingArt] = useState<boolean>(false);
  const [dataSource, setDataSource]       = useState<'api' | 'local'>('local');
  const [siteSettings, setSiteSettings]   = useState<SiteSettings>(loadSettings);
  const [reviews, setReviews]             = useState<Review[]>(loadReviews);

  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const apiProducts = await fetchProducts();
      if (apiProducts !== null) {
        // Ne garder que les produits provenant de la base de données (sans les mock data)
        const realProducts = apiProducts.filter((p) => !KNOWN_MOCK_PRODUCT_IDS.has(p.id));
        setProducts(realProducts);
        setDataSource('api');
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(realProducts));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshArticles = useCallback(async () => {
    setLoadingArt(true);
    try {
      const apiArticles = await fetchArticles();
      if (apiArticles !== null) {
        // Ne garder que les articles provenant de la base de données
        const realArticles = apiArticles.filter((a) => !KNOWN_MOCK_ARTICLE_IDS.has(a.id) && !KNOWN_MOCK_ARTICLE_IDS.has(a.slug));
        setArticles(realArticles);
        localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(realArticles));
      }
    } catch {
      // ignore
    } finally {
      setLoadingArt(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshArticles();
  }, [refreshProducts, refreshArticles]);

  const addProduct = useCallback(async (product: Product) => {
    setProducts((prev) => {
      const updated = [...prev, product];
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    const result = await createProduct(product);
    if (result.success) {
      await refreshProducts();
    }
  }, [refreshProducts]);

  const updateProduct = useCallback(async (product: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === product.id ? product : p));
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    await updateProductAPI(product);
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
    await deleteProductAPI(id);
  }, []);

  const addArticle = useCallback(async (article: Article) => {
    setArticles((prev) => {
      const updated = [article, ...prev];
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(updated));
      return updated;
    });
    const result = await createArticle(article);
    if (result.success) {
      await refreshArticles();
    }
  }, [refreshArticles]);

  const updateArticle = useCallback(async (article: Article) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === article.id ? article : a));
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(updated));
      return updated;
    });
    await updateArticleAPI(article);
  }, []);

  const deleteArticle = useCallback(async (id: string) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(updated));
      return updated;
    });
    await deleteArticleAPI(id);
  }, []);

  const updateSettings = useCallback((settings: SiteSettings) => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    setSiteSettings(settings);
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
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
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
        dataSource,
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
