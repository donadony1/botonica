export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'soaps' | 'oils' | 'rituals' | 'accessories';
  price: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  longDescription: string;
  images: string[];
  aspectRatio?: 'square' | 'portrait' | 'tall';
  ingredients: {
    name: string;
    description: string;
    icon: string;
    bgClass: string;
    iconClass: string;
  }[];
  usageTips?: string;
  shippingInfo?: string;
  surgrasPercentage?: string;
  scentProfile?: string;
  weight?: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ScreenType = 'home' | 'shop' | 'rituals' | 'cart' | 'product-detail' | 'admin';

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
  author: string;
  rating: number;
  comment: string;
  date?: string;
  productName?: string;
}
