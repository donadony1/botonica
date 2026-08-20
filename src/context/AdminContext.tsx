import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, SiteSettings } from '../types';
import { PRODUCTS } from '../data/products';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Ndolo Rituals',
  tagline: 'Rituels de beauté naturels & artisanaux',
  logoUrl: '',
  primaryColor: '#1a191c',
  secondaryColor: '#824f39',
  accentColor: '#d4e8d0',
  freeShippingThreshold: 50,
  currency: 'EUR',
  contactEmail: 'contact@Ndolo-rituals.fr',
  address: 'Atelier Provençal, France',
  instagram: '@Ndolo.rituals',
  facebook: 'NdoloRituals',
  metaTitle: 'Ndolo Rituals — Savons & Huiles Naturels Artisanaux',
  metaDescription: 'Découvrez notre collection de savons saponifiés à froid, huiles précieuses et rituels de beauté 100% naturels fabriqués à la main en Provence.',
};

const STORAGE_KEY_PRODUCTS = 'Ndolo_admin_products';
const STORAGE_KEY_SETTINGS = 'Ndolo_admin_settings';

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) return JSON.parse(raw) as Product[];
  } catch { /* ignore */ }
  return PRODUCTS;
}

function loadSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as SiteSettings;
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

interface AdminContextValue {
  products: Product[];
  siteSettings: SiteSettings;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (settings: SiteSettings) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(loadSettings);

  const persist = useCallback((updated: Product[]) => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
    setProducts(updated);
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const updated = [...prev, product];
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === product.id ? product : p);
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateSettings = useCallback((settings: SiteSettings) => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    setSiteSettings(settings);
  }, []);

  // suppress unused warning for persist
  void persist;

  return (
    <AdminContext.Provider value={{ products, siteSettings, addProduct, updateProduct, deleteProduct, updateSettings }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
