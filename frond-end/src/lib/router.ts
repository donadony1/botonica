import { ScreenType, Product, Article } from '../types';

export interface RouteState {
  screen: ScreenType;
  productId?: string;
  articleSlug?: string;
}

/**
 * Normalise un texte pour en faire un slug d'URL propre
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/[^a-z0-9]+/g, '-')     // remplace les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '');        // supprime les tirets début/fin
}

/**
 * Génère le chemin d'accès relatif pour un produit
 */
export function getProductPath(product: { id: string; name?: string }): string {
  return `/product/${encodeURIComponent(product.id)}`;
}

/**
 * Génère l'URL absolue complète et partageable d'un produit
 */
export function getProductUrl(product: { id: string; name?: string }): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ndolo-rituals.com';
  return `${origin}${getProductPath(product)}`;
}

/**
 * Génère le chemin d'accès relatif pour un article
 */
export function getArticlePath(article: { slug?: string; id: string; title?: string }): string {
  const identifier = article.slug || slugify(article.title || article.id);
  return `/article/${encodeURIComponent(identifier)}`;
}

/**
 * Génère l'URL absolue complète et partageable d'un article
 */
export function getArticleUrl(article: { slug?: string; id: string; title?: string }): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ndolo-rituals.com';
  return `${origin}${getArticlePath(article)}`;
}

/**
 * Analyse l'URL courante du navigateur pour déterminer l'écran et l'ID/slug
 */
export function parseCurrentUrl(): RouteState {
  if (typeof window === 'undefined') {
    return { screen: 'home' };
  }

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#\/?/, '');

  // 1. Support des query params (?product=id, ?article=slug, ?screen=...)
  if (searchParams.has('product')) {
    return { screen: 'product-detail', productId: searchParams.get('product') || undefined };
  }
  if (searchParams.has('article')) {
    return { screen: 'article-detail', articleSlug: searchParams.get('article') || undefined };
  }
  if (searchParams.has('screen')) {
    const qScreen = searchParams.get('screen') as ScreenType;
    return { screen: qScreen || 'home' };
  }

  // 2. Support des routes de type Hash (#/product/id, #/article/slug)
  if (hash) {
    const hashParts = hash.split('/').filter(Boolean);
    if (hashParts[0] === 'product' || hashParts[0] === 'produit') {
      return { screen: 'product-detail', productId: decodeURIComponent(hashParts[1] || '') };
    }
    if (hashParts[0] === 'article' || hashParts[0] === 'journal' || hashParts[0] === 'blog') {
      return { screen: 'article-detail', articleSlug: decodeURIComponent(hashParts[1] || '') };
    }
    if (['home', 'shop', 'rituals', 'articles', 'cart', 'admin', 'privacy-terms'].includes(hashParts[0])) {
      return { screen: hashParts[0] as ScreenType };
    }
  }

  // 3. Support des routes Pathname propres (/product/id, /article/slug, /shop, etc.)
  const pathParts = pathname.split('/').filter(Boolean);

  if (pathParts.length === 0) {
    return { screen: 'home' };
  }

  const firstSegment = pathParts[0].toLowerCase();

  if (firstSegment === 'product' || firstSegment === 'produit') {
    return {
      screen: 'product-detail',
      productId: decodeURIComponent(pathParts[1] || ''),
    };
  }

  if (firstSegment === 'article' || firstSegment === 'journal' || firstSegment === 'blog') {
    return {
      screen: 'article-detail',
      articleSlug: decodeURIComponent(pathParts[1] || ''),
    };
  }

  if (firstSegment === 'shop' || firstSegment === 'boutique') {
    return { screen: 'shop' };
  }

  if (firstSegment === 'rituals' || firstSegment === 'rituels') {
    return { screen: 'rituals' };
  }

  if (firstSegment === 'articles' || firstSegment === 'blog') {
    return { screen: 'articles' };
  }

  if (firstSegment === 'cart' || firstSegment === 'panier') {
    return { screen: 'cart' };
  }

  if (firstSegment === 'privacy-terms' || firstSegment === 'mentions-legales' || firstSegment === 'cgv') {
    return { screen: 'privacy-terms' };
  }

  if (firstSegment === 'admin') {
    return { screen: 'admin' };
  }

  return { screen: 'home' };
}

/**
 * Met à jour l'URL dans la barre d'adresse du navigateur sans recharger la page
 */
export function pushRoute(state: RouteState, replace = false) {
  if (typeof window === 'undefined') return;

  let targetPath = '/';

  switch (state.screen) {
    case 'home':
      targetPath = '/';
      break;
    case 'shop':
      targetPath = '/shop';
      break;
    case 'rituals':
      targetPath = '/rituals';
      break;
    case 'articles':
      targetPath = '/articles';
      break;
    case 'cart':
      targetPath = '/cart';
      break;
    case 'privacy-terms':
      targetPath = '/privacy-terms';
      break;
    case 'admin':
      targetPath = '/admin';
      break;
    case 'product-detail':
      targetPath = state.productId ? `/product/${encodeURIComponent(state.productId)}` : '/shop';
      break;
    case 'article-detail':
      targetPath = state.articleSlug ? `/article/${encodeURIComponent(state.articleSlug)}` : '/articles';
      break;
  }

  const currentPath = window.location.pathname;
  if (currentPath !== targetPath || window.location.search || window.location.hash) {
    if (replace) {
      window.history.replaceState(state, '', targetPath);
    } else {
      window.history.pushState(state, '', targetPath);
    }
  }
}
