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

const DEFAULT_DB_PRODUCTS: Product[] = [
  {
    id: 'ndolo-black-soap-2-8873d6',
    name: 'Ndolo Black Soap 2',
    tagline: 'Nettoyant Purifiant Ancestral',
    category: 'soaps',
    price: 7.00,
    rating: 5.0,
    reviewCount: 128,
    tags: ['Savon Noir', 'Ancestral', 'Purifiant', 'Surgras'],
    description: "Un savon noir artisanal d'exception fabriqué selon les méthodes ancestrales africaines. Formule surgrasse riche en antioxydants.",
    images: [
      'https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/706020754_122172378194893728_3880789243033241386_n.jpg?stp=dst-jpg_tt6&cstp=mx896x1190&ctp=s896x1190&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEPm3h6-YoYGgzjukGx-q79pkJYkDFg0XGmQliQMWDRcTbEabnzs7vPBo7vU-CO2dWdS8ElVoy8ktzu7rGlk1S_&_nc_ohc=6Zrk21YuNPEQ7kNvwGuBlvJ&_nc_oc=AdoTPLQ1Ki-RmZp2VTsmRsjyrUBR_PM_1vgQe_b5eDghDY-3F1vMkXT5cDsk0WRGPoI&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=BRWWCIOp7ZgEjOXddLWk9w&_nc_ss=7b2a8&oh=00_AQGaNVC75WolKyZydaAi9i_CHdznJO0J2P4Dalf1CDkvtw&oe=6A8CC997'
    ],
    aspectRatio: 'square',
    ingredients: [
      { name: 'Beurre de Karité Brut', description: 'Nourrit intensément et répare la peau.', icon: 'spa', bgClass: 'bg-[#d4e8d0]', iconClass: 'text-[#bb0a4a]' },
      { name: 'Cendres de Cabosses de Cacao', description: 'Potasse végétale ancestrale antibactérienne.', icon: 'eco', bgClass: 'bg-[#ffdbce]', iconClass: 'text-[#824f39]' },
      { name: 'Huile de Palme Rouge Durable', description: 'Riche en vitamine A et E antioxydantes.', icon: 'local_florist', bgClass: 'bg-[#e5e2da]', iconClass: 'text-[#5f5f58]' }
    ],
    usageTips: "Faites mousser entre vos mains humides, appliquez délicatement sur le visage ou le corps, puis rincez abondamment à l'eau tiède.",
    shippingInfo: "Livraison standard (3-5 jours ouvrés). Gratuite à partir de 50€ d'achat.",
    surgrasPercentage: '8%',
    scentProfile: 'Boisé délicat, terreux chaleureux, végétal pur',
    weight: '150g',
    featured: true,
    stock: 41,
    lowStockThreshold: 5,
    gpsrManufacturer: 'Ndolo Rituals Atelier Botanique',
    gpsrBatchCode: 'LOT-ND-2026-08',
    gpsrSafetyWarning: 'Usage externe uniquement. Éviter le contact direct avec les yeux.'
  },
  {
    id: 'nnnnnnnnnn-1cf978',
    name: 'Savon Ndolo black soap.',
    tagline: 'Régénérant & Détoxifiant',
    category: 'soaps',
    price: 21.80,
    rating: 4.9,
    reviewCount: 86,
    tags: ['Savon Noir', 'Régénérant', 'Détoxifiant'],
    description: 'Un savon noir purifiant formulé pour révéler la clarté naturelle de votre peau sans la dessécher.',
    images: [
      'https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/706020754_122172378194893728_3880789243033241386_n.jpg?stp=dst-jpg_tt6&cstp=mx896x1190&ctp=s896x1190&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEPm3h6-YoYGgzjukGx-q79pkJYkDFg0XGmQliQMWDRcTbEabnzs7vPBo7vU-CO2dWdS8ElVoy8ktzu7rGlk1S_&_nc_ohc=6Zrk21YuNPEQ7kNvwGuBlvJ&_nc_oc=AdoTPLQ1Ki-RmZp2VTsmRsjyrUBR_PM_1vgQe_b5eDghDY-3F1vMkXT5cDsk0WRGPoI&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=BRWWCIOp7ZgEjOXddLWk9w&_nc_ss=7b2a8&oh=00_AQGaNVC75WolKyZydaAi9i_CHdznJO0J2P4Dalf1CDkvtw&oe=6A8CC997'
    ],
    aspectRatio: 'square',
    ingredients: [
      { name: 'Beurre de Karité Non Raffiné', description: 'Adoucit et hydrate en profondeur.', icon: 'spa', bgClass: 'bg-[#d4e8d0]', iconClass: 'text-[#bb0a4a]' },
      { name: 'Huile de Coco Vierge', description: 'Mousse onctueuse et nettoyage doux.', icon: 'eco', bgClass: 'bg-[#ffdbce]', iconClass: 'text-[#824f39]' }
    ],
    usageTips: "Utiliser quotidiennement sous la douche sur peau mouillée. Conserver sur un porte-savon égouttoir.",
    shippingInfo: "Expédié sous 24-48h.",
    surgrasPercentage: '7%',
    scentProfile: 'Neutre, authentique et naturel',
    weight: '150g',
    featured: false,
    stock: 19,
    lowStockThreshold: 5
  },
  {
    id: 'savon-noir-africain-snail-bamboo-charcoal-6bb1b4',
    name: 'Savon Noir Africain - Snail & Bamboo Charcoal',
    tagline: "Bave d'Escargot & Charbon Actif de Bambou",
    category: 'soaps',
    price: 12.00,
    rating: 4.8,
    reviewCount: 42,
    tags: ['Charbon de Bambou', "Bave d'Escargot", 'Anti-Imperfections'],
    description: "Un savon noir haut de gamme combinant les vertus réparatrices de la bave d'escargot et les propriétés purifiantes du charbon de bambou.",
    images: [
      'https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/706020754_122172378194893728_3880789243033241386_n.jpg?stp=dst-jpg_tt6&cstp=mx896x1190&ctp=s896x1190&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEPm3h6-YoYGgzjukGx-q79pkJYkDFg0XGmQliQMWDRcTbEabnzs7vPBo7vU-CO2dWdS8ElVoy8ktzu7rGlk1S_&_nc_ohc=6Zrk21YuNPEQ7kNvwGuBlvJ&_nc_oc=AdoTPLQ1Ki-RmZp2VTsmRsjyrUBR_PM_1vgQe_b5eDghDY-3F1vMkXT5cDsk0WRGPoI&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=BRWWCIOp7ZgEjOXddLWk9w&_nc_ss=7b2a8&oh=00_AQGaNVC75WolKyZydaAi9i_CHdznJO0J2P4Dalf1CDkvtw&oe=6A8CC997'
    ],
    aspectRatio: 'square',
    ingredients: [
      { name: 'Charbon Actif de Bambou', description: 'Absorbe les impuretés et détoxifie les pores.', icon: 'eco', bgClass: 'bg-[#e5e2da]', iconClass: 'text-[#5f5f58]' },
      { name: "Extrait de Bave d'Escargot", description: 'Favorise le renouvellement cellulaire et lisse le grain de peau.', icon: 'spa', bgClass: 'bg-[#d4e8d0]', iconClass: 'text-[#bb0a4a]' }
    ],
    usageTips: "Masser délicatement en mouvements circulaires. Laisser poser 1 minute pour un effet masque purifiant.",
    shippingInfo: "Livraison standard 3-5 jours ouvrés.",
    surgrasPercentage: '6%',
    scentProfile: 'Minéral, frais et pur',
    weight: '140g',
    featured: false,
    stock: 20,
    lowStockThreshold: 5
  },
  {
    id: 'savon-de-beauty-naturel-02340c',
    name: 'Savon de beauty naturel',
    tagline: 'Éclat & Pureté Botanique',
    category: 'soaps',
    price: 10.00,
    rating: 4.7,
    reviewCount: 35,
    tags: ['Éclat', 'Botanique', 'Doux'],
    description: 'Soin lavant naturel pour un teint lumineux et une peau soyeuse au quotidien.',
    images: [
      'https://scontent.fkbi1-1.fna.fbcdn.net/v/t39.30808-6/706020754_122172378194893728_3880789243033241386_n.jpg?stp=dst-jpg_tt6&cstp=mx896x1190&ctp=s896x1190&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEPm3h6-YoYGgzjukGx-q79pkJYkDFg0XGmQliQMWDRcTbEabnzs7vPBo7vU-CO2dWdS8ElVoy8ktzu7rGlk1S_&_nc_ohc=6Zrk21YuNPEQ7kNvwGuBlvJ&_nc_oc=AdoTPLQ1Ki-RmZp2VTsmRsjyrUBR_PM_1vgQe_b5eDghDY-3F1vMkXT5cDsk0WRGPoI&_nc_zt=23&_nc_ht=scontent.fkbi1-1.fna&_nc_gid=BRWWCIOp7ZgEjOXddLWk9w&_nc_ss=7b2a8&oh=00_AQGaNVC75WolKyZydaAi9i_CHdznJO0J2P4Dalf1CDkvtw&oe=6A8CC997'
    ],
    aspectRatio: 'square',
    ingredients: [
      { name: 'Huiles Végétales Nobles', description: 'Nourrissent sans obstruer les pores.', icon: 'local_florist', bgClass: 'bg-[#ffdbce]', iconClass: 'text-[#824f39]' }
    ],
    usageTips: "Utilisation quotidienne corps et visage.",
    shippingInfo: "Expédition standard.",
    surgrasPercentage: '7%',
    scentProfile: 'Doux et enveloppant',
    weight: '120g',
    featured: false,
    stock: 19,
    lowStockThreshold: 5
  }
];

const DEFAULT_DB_ARTICLES: Article[] = [
  {
    id: 'secrets-savon-noir-africain',
    slug: 'secrets-savon-noir-africain',
    title: "Les Secrets Ancestraux du Savon Noir Africain : Origines, Bienfaits et Rituel d'Utilisation",
    titleEn: 'Ancestral Secrets of African Black Soap: Origins, Benefits, and Daily Ritual',
    excerpt: "Découvrez l'histoire fascinante du véritable savon noir artisanal, sa composition 100% brute et la méthode idéale pour révéler l'éclat naturel de votre peau sans la dessécher.",
    excerptEn: 'Discover the fascinating story of authentic raw black soap, its 100% natural ingredients, and the optimal ritual to reveal glowing skin.',
    content: `<p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">Depuis des siècles en Afrique de l'Ouest et Centrale, les femmes élaborent à la main un soin purifiant d'une puissance végétale inégalée : le véritable Savon Noir. Loin des formules industrielles chargées de tensioactifs de synthèse, le savon noir Ndolo perpétue un rituel sacré où chaque ingrédient est cueilli avec respect et transformé avec patience.</p><h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4 font-normal">Une Saponification 100% Végétale et Naturelle</h2><p class="mb-4 leading-relaxed">Le secret réside dans l'alchimie entre les cendres végétales de cabosses de cacao et de régimes de bananes plantains brûlés selon un savoir-faire millénaire, et les beurres purs de karité non raffiné. Cette potasse végétale naturelle saponifie délicatement les acides gras sans nécessiter le moindre additif chimique.</p><blockquote class="my-6 p-4 border-l-4 border-[#bb0a4a] bg-[#E6D5C3]/30 rounded-r-xl italic text-[#3D2B1F] font-serif">« Le savon noir n'est pas un simple nettoyant : c'est une offrande purificatrice de la Terre pour restaurer l'harmonie de la peau. »</blockquote>`,
    category: 'culture',
    categoryLabel: 'Culture & Savoir-Faire',
    categoryLabelEn: 'Culture & Craft',
    author: 'Karene Bella',
    authorRole: 'Fondatrice & Formulatrice Botanique',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    publishedAt: '24 août 2026',
    readTime: '4 min de lecture',
    readTimeEn: '4 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgzYo9pIi0DtyG0IpLMPOPOLdTTp_IFTvNQo7KE4UZEwFnQQTEfHxYs9-XxrAl0hsEXc45_wE5WAysIaboHJax-ynjGqiru30UDHJFqOUEb2oV3mwFwpXy3n2ZDcaNEWH0parFyb_3mhdZ93-86LYH-dwbRFsWikxCdkUpJfjtNp_Fscqa8RabYwGJTXoYQlCqTxhgPzblaDZCMZ-HPvex8HCJzVlBViESpi0dfY7HUVnv8jxp8Fk4JsuKycAzQ8rh-A',
    tags: ['Savon Noir', 'Rituel Ancestral', 'Saponification'],
    featured: true,
    relatedProductIds: ['ndolo-black-soap-2-8873d6']
  },
  {
    id: 'vaincre-acne-hyper-pigmentation',
    slug: 'vaincre-acne-hyper-pigmentation',
    title: "Acné & Taches Pigmentaires : Comment Restaurer la Barrière Cutanée Sans Agresser",
    titleEn: 'Acne & Hyperpigmentation: Restoring Your Skin Barrier Gently',
    excerpt: "Comprendre l'origine des imperfections et comment la richesse en antioxydants du savon noir surgras rééquilibre le microbiome sans créer d'effet rebond.",
    excerptEn: 'Understand the root causes of breakouts and how nutrient-rich raw black soap balances your skin microbiome without stripping moisture.',
    content: `<p class="lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6">Lorsque la peau produit un excès de sébum ou réagit à des agressions extérieures, le premier réflexe est souvent d'utiliser des gels nettoyants décapants. Une erreur majeure qui altère la barrière lipidique et provoque un effet rebond redoutable.</p><h2 class="font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4 font-normal">Pourquoi le Savon Noir est si Efficace contre l'Acné ?</h2><p class="mb-4 leading-relaxed">Riche en polyphénols et en acides gras essentiels issus du karité non raffiné, le savon noir purifie en profondeur les pores tout en déposant un micro-film nourrissant protecteur.</p>`,
    category: 'skin-health',
    categoryLabel: 'Santé de la Peau',
    categoryLabelEn: 'Skin Health',
    author: 'Dr. Amina Diallo',
    authorRole: 'Dermatologue & Consultante Botanique',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    publishedAt: '19 Août 2026',
    readTime: '5 min de lecture',
    readTimeEn: '5 min read',
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e6a09028?w=800&auto=format&fit=crop&q=80',
    tags: ['Acné', 'Hyperpigmentation', 'Dermatologie', 'Peau Nette'],
    featured: false,
    relatedProductIds: ['ndolo-black-soap-2-8873d6', 'savon-noir-africain-snail-bamboo-charcoal-6bb1b4']
  }
];

function loadProductsLocal(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw) as Product[];
      const valid = parsed.filter((p) => p && p.id && !KNOWN_MOCK_PRODUCT_IDS.has(p.id));
      if (valid.length > 0) return valid;
    }
  } catch { /* ignore */ }
  return DEFAULT_DB_PRODUCTS;
}

function loadArticlesLocal(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (raw) {
      const parsed = JSON.parse(raw) as Article[];
      const valid = parsed.filter((a) => a && (a.id || a.slug) && !KNOWN_MOCK_ARTICLE_IDS.has(a.id) && !KNOWN_MOCK_ARTICLE_IDS.has(a.slug));
      if (valid.length > 0) return valid;
    }
  } catch { /* ignore */ }
  return DEFAULT_DB_ARTICLES;
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
