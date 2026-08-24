import { Product, Article, SiteSettings, Language } from '../types';
import { getProductUrl, getArticleUrl } from './router';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock';
  ratingValue?: number;
  reviewCount?: number;
  brand?: string;
  category?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * Met à jour dynamiquement ou crée une balise meta
 */
function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Met à jour le lien canonique
 */
function setCanonicalUrl(url: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * Injecte ou met à jour les données structurées JSON-LD (Schema.org)
 */
function setJsonLd(id: string, data: object) {
  if (typeof document === 'undefined') return;
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

/**
 * Supprime un script JSON-LD par son ID s'il n'est plus pertinent
 */
function removeJsonLd(id: string) {
  if (typeof document === 'undefined') return;
  const script = document.getElementById(id);
  if (script && script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

/**
 * Met à jour l'ensemble des balises SEO pour la page active
 */
export function updateSEO(data: SEOData) {
  if (typeof document === 'undefined') return;

  const currentUrl = data.url || (typeof window !== 'undefined' ? window.location.href : 'https://ndolo-rituals.com');
  const siteName = 'Ndolo Rituals';
  const defaultImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwCbWmWoXE74klOtwIQUnPMNLkGYreJ-ztS8FJiNnCCUsxn0agfBVH4MH1Rfx8oBpvjLOHrl5kMK0I7tm4fD_b6YvmWPsXSHWdIKppxjgVjAJR7J8vGKKpybh5I1XvQfX4hRW84SlX8EFMJIabfTsa3I3FbZTuojSDSJrCi0z39yNoRZ4OtPm0WZqUIudhfNXU5NBBFxOqOQTUWPu9FXMztN7ph1aT1d2Vrdsyrl3szRbrKhRORn3-';
  const ogImage = data.image || defaultImage;

  // 1. Titre du document
  document.title = data.title;

  // 2. Balises meta standard
  setMetaTag('name', 'description', data.description);
  if (data.keywords) {
    setMetaTag('name', 'keywords', data.keywords);
  }
  setMetaTag('name', 'author', data.author || siteName);
  setMetaTag('name', 'robots', 'index, follow, max-image-preview:large');

  // 3. Lien canonique
  setCanonicalUrl(currentUrl);

  // 4. OpenGraph (Facebook, WhatsApp, LinkedIn, Discord)
  setMetaTag('property', 'og:title', data.title);
  setMetaTag('property', 'og:description', data.description);
  setMetaTag('property', 'og:url', currentUrl);
  setMetaTag('property', 'og:image', ogImage);
  setMetaTag('property', 'og:type', data.type || 'website');
  setMetaTag('property', 'og:site_name', siteName);
  setMetaTag('property', 'og:locale', 'fr_FR');

  // 5. Twitter Cards
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', data.title);
  setMetaTag('name', 'twitter:description', data.description);
  setMetaTag('name', 'twitter:image', ogImage);
  setMetaTag('name', 'twitter:site', '@NdoloRituals');

  // 6. JSON-LD Schemas

  // Schema: Organization & WebSite (Toujours présent)
  setJsonLd('seo-schema-organization', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ndolo Rituals',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://ndolo-rituals.com',
    logo: ogImage,
    description: 'Savons artisanaux saponifiés à froid et huiles botaniques d’exception.',
    sameAs: [
      'https://instagram.com/ndolo.rituals',
      'https://facebook.com/NdoloRituals'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@ndolo-rituals.fr'
    }
  });

  // Schema spécifique Produit
  if (data.type === 'product' && data.price !== undefined) {
    setJsonLd('seo-schema-product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.title,
      image: ogImage,
      description: data.description,
      brand: {
        '@type': 'Brand',
        name: data.brand || 'Ndolo Rituals'
      },
      category: data.category || 'Soins du corps',
      offers: {
        '@type': 'Offer',
        url: currentUrl,
        priceCurrency: data.currency || 'EUR',
        price: data.price,
        availability: data.availability === 'OutOfStock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      },
      aggregateRating: data.ratingValue ? {
        '@type': 'AggregateRating',
        ratingValue: data.ratingValue,
        reviewCount: data.reviewCount || 1,
        bestRating: 5,
        worstRating: 1
      } : undefined
    });
    removeJsonLd('seo-schema-article');
  } else if (data.type === 'article') {
    // Schema spécifique Article de Blog
    setJsonLd('seo-schema-article', {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl
      },
      headline: data.title,
      description: data.description,
      image: ogImage,
      author: {
        '@type': 'Person',
        name: data.author || 'Ndolo Rituals'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Ndolo Rituals',
        logo: {
          '@type': 'ImageObject',
          url: ogImage
        }
      },
      datePublished: data.publishedTime || new Date().toISOString(),
      dateModified: data.modifiedTime || data.publishedTime || new Date().toISOString()
    });
    removeJsonLd('seo-schema-product');
  } else {
    removeJsonLd('seo-schema-product');
    removeJsonLd('seo-schema-article');
  }

  // Schema Breadcrumbs
  if (data.breadcrumbs && data.breadcrumbs.length > 0) {
    setJsonLd('seo-schema-breadcrumbs', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.breadcrumbs.map((bc, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: bc.name,
        item: bc.url
      }))
    });
  } else {
    removeJsonLd('seo-schema-breadcrumbs');
  }
}

/**
 * Helpers pour construire le SEO selon l'écran et les données
 */
export function buildProductSEO(product: Product, settings?: SiteSettings, lang: Language = 'fr'): SEOData {
  const name = lang === 'en' && product.nameEn ? product.nameEn : product.name;
  const tagline = lang === 'en' && product.taglineEn ? product.taglineEn : product.tagline;
  const description = lang === 'en' && product.descriptionEn ? product.descriptionEn : product.description;
  const image = product.images && product.images[0] ? product.images[0] : undefined;
  const url = getProductUrl(product);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ndolo-rituals.com';

  return {
    title: `${name} — Savon Artisanal 100% Naturel | Ndolo Rituals`,
    description: `${tagline}. ${description}`.slice(0, 160),
    keywords: `savon artisanal, savon saponifie a froid, ${product.name}, cosmetique naturelle, ${product.tags?.join(', ')}`,
    image,
    url,
    type: 'product',
    price: product.price,
    currency: settings?.currency || 'EUR',
    availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
    ratingValue: product.rating || 5,
    reviewCount: product.reviewCount || 1,
    brand: 'Ndolo Rituals',
    category: product.category,
    breadcrumbs: [
      { name: 'Accueil', url: `${origin}/` },
      { name: 'Boutique', url: `${origin}/shop` },
      { name: name, url }
    ]
  };
}

export function buildArticleSEO(article: Article, settings?: SiteSettings, lang: Language = 'fr'): SEOData {
  const title = lang === 'en' && article.titleEn ? article.titleEn : article.title;
  const excerpt = lang === 'en' && article.excerptEn ? article.excerptEn : article.excerpt;
  const url = getArticleUrl(article);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ndolo-rituals.com';

  return {
    title: `${title} | Journal & Rituels Ndolo`,
    description: excerpt.slice(0, 160),
    keywords: `rituels beaute, soins naturels, ${article.categoryLabel}, ${article.tags?.join(', ')}`,
    image: article.image,
    url,
    type: 'article',
    author: article.author,
    publishedTime: article.publishedAt,
    breadcrumbs: [
      { name: 'Accueil', url: `${origin}/` },
      { name: 'Journal', url: `${origin}/articles` },
      { name: title, url }
    ]
  };
}
