export type Language = 'fr' | 'en';

export interface ProductIngredient {
  name: string;
  description: string;
  icon: string;
  bgClass: string;
  iconClass: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  tagline: string;
  taglineEn?: string;
  category: 'soaps' | 'oils' | 'rituals' | 'accessories';
  price: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  descriptionEn?: string;
  longDescription?: string;
  longDescriptionEn?: string;
  images: string[];
  aspectRatio?: 'square' | 'portrait' | 'tall';
  ingredients: ProductIngredient[];
  usageTips?: string;
  usageTipsEn?: string;
  shippingInfo?: string;
  shippingInfoEn?: string;
  surgrasPercentage?: string;
  scentProfile?: string;
  scentProfileEn?: string;
  weight?: string;
  featured?: boolean;

  // Stocks & Alertes (Phase 2)
  stock: number;
  lowStockThreshold?: number;

  // Mentions Légales & Conformité GPSR / Cosmétique UE (Phase 2 / Phase 5)
  inci?: string;
  originCountry?: string;
  responsiblePerson?: string;
  batchNumber?: string;
  pao?: string;
  gpsrManufacturer?: string;
  gpsrBatchCode?: string;
  gpsrSafetyWarning?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ScreenType = 'home' | 'shop' | 'rituals' | 'articles' | 'article-detail' | 'cart' | 'product-detail' | 'admin' | 'privacy-terms';

export interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  category: 'rituals' | 'ingredients' | 'skin-health' | 'culture';
  categoryLabel: string;
  categoryLabelEn?: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: string;
  readTimeEn?: string;
  image: string;
  tags: string[];
  featured?: boolean;
  relatedProductIds?: string[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  freeShippingThreshold: number;
  currency: string;
  contactEmail: string;
  address: string;
  instagram: string;
  facebook: string;
  metaTitle: string;
  metaDescription: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  authorEmail?: string;
  rating: number;
  comment: string;
  date?: string;
  productName?: string;
  status: 'pending' | 'approved' | 'rejected';
  verifiedPurchase?: boolean;
}

export type UserRole = 'admin' | 'gerant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  createdBy?: string | null;
  createdByName?: string | null;
}

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  lastLoginAt?: string;
}

