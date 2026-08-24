import React, { useState } from 'react';
import { Product, Article, CartItem, ScreenType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { ShopScreen } from './components/ShopScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { RitualsScreen } from './components/RitualsScreen';
import { ArticlesScreen } from './components/ArticlesScreen';
import { ArticleDetailScreen } from './components/ArticleDetailScreen';
import { PrivacyTermsScreen } from './components/PrivacyTermsScreen';
import { CartScreen } from './components/CartScreen';
import { Toast } from './components/Toast';
import AdminScreen from './components/admin/AdminScreen';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { recordSiteVisit } from './lib/api';
import { parseCurrentUrl, pushRoute } from './lib/router';
import { updateSEO, buildProductSEO, buildArticleSEO } from './lib/seo';

export default function App() {
  return (
    <LanguageProvider>
      <AdminProvider>
        <AppInner />
      </AdminProvider>
    </LanguageProvider>
  );
}

function AppInner() {
  const { products, articles, siteSettings } = useAdmin();
  const { language } = useLanguage();

  // Initialisation de la route depuis l'URL courante du navigateur
  const initialRoute = parseCurrentUrl();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(initialRoute.screen);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(() => {
    if (initialRoute.productId && products.length > 0) {
      return products.find((p) => p.id === initialRoute.productId) || products[0];
    }
    return products[0];
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | undefined>(() => {
    if (initialRoute.articleSlug && articles.length > 0) {
      return articles.find((a) => a.slug === initialRoute.articleSlug || a.id === initialRoute.articleSlug) || articles[0];
    }
    return articles[0];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronise le produit ou l'article si l'URL contenait un ID/slug et que les listes chargent depuis l'API
  React.useEffect(() => {
    if (products.length > 0) {
      const route = parseCurrentUrl();
      if (route.screen === 'product-detail' && route.productId) {
        const matched = products.find((p) => p.id === route.productId);
        if (matched) {
          setSelectedProduct(matched);
          return;
        }
      }
      if (!selectedProduct || !products.some((p) => p.id === selectedProduct.id)) {
        setSelectedProduct(products[0]);
      }
    }
  }, [products]);

  React.useEffect(() => {
    if (articles.length > 0) {
      const route = parseCurrentUrl();
      if (route.screen === 'article-detail' && route.articleSlug) {
        const matched = articles.find(
          (a) => a.slug === route.articleSlug || a.id === route.articleSlug
        );
        if (matched) {
          setSelectedArticle(matched);
          return;
        }
      }
      if (!selectedArticle || !articles.some((a) => a.id === selectedArticle.id)) {
        setSelectedArticle(articles[0]);
      }
    }
  }, [articles]);

  // Écouteur de navigation historique (Boutons Précédent / Suivant du navigateur)
  React.useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentUrl();
      setCurrentScreen(route.screen);
      if (route.screen === 'product-detail' && route.productId && products.length > 0) {
        const found = products.find((p) => p.id === route.productId);
        if (found) setSelectedProduct(found);
      } else if (route.screen === 'article-detail' && route.articleSlug && articles.length > 0) {
        const found = articles.find((a) => a.slug === route.articleSlug || a.id === route.articleSlug);
        if (found) setSelectedArticle(found);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, articles]);

  // Enregistrement des visites du site en temps réel dans MySQL (RGPD anonymisé)
  React.useEffect(() => {
    if (currentScreen !== 'admin') {
      recordSiteVisit(window.location.pathname || `/${currentScreen}`);
    }
  }, [currentScreen]);

  // Gestion dynamique du Référencement (SEO & Meta Tags)
  React.useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ndolo-rituals.com';

    switch (currentScreen) {
      case 'home':
        updateSEO({
          title: language === 'fr'
            ? 'Ndolo Rituals — Savons Artisanaux Saponifiés à Froid & Soins Botaniques'
            : 'Ndolo Rituals — Artisanal Cold Process Soaps & Botanical Skincare',
          description: language === 'fr'
            ? 'Découvrez nos savons artisanaux 100% naturels saponifiés à froid, huiles végétales pures et rituels de beauté ancestraux faits à la main.'
            : 'Discover our 100% natural handmade cold-process soaps, pure botanical oils, and ancestral beauty rituals.',
          keywords: 'savon saponifie a froid, savon artisanal, cosmetique naturelle, savon noir, soin bio, provence, karite',
          url: `${origin}/`,
          type: 'website'
        });
        break;
      case 'shop':
        updateSEO({
          title: language === 'fr' ? 'Boutique & Savons Naturels | Ndolo Rituals' : 'Shop & Natural Soaps | Ndolo Rituals',
          description: language === 'fr'
            ? 'Explorez notre gamme complète de savons saponifiés à froid, huiles précieuses et coffrets cadeaux bien-être.'
            : 'Explore our complete collection of handmade cold process soaps, precious oils and wellness gift sets.',
          keywords: 'acheter savon naturel, savonnerie artisanale, huile vegetale, coffret cadeau bain',
          url: `${origin}/shop`,
          type: 'website'
        });
        break;
      case 'rituals':
        updateSEO({
          title: language === 'fr' ? 'Nos Rituels de Soin & Bien-être | Ndolo Rituals' : 'Our Wellness & Bath Rituals | Ndolo Rituals',
          description: language === 'fr'
            ? 'Initiez-vous à nos rituels de bain et de relaxation holistiques pour une peau douce, nourrie et apaisée.'
            : 'Experience our holistic bath and relaxation rituals for deeply nourished and radiant skin.',
          keywords: 'rituel bain, soin visage corps, relaxation, bien-etre naturel',
          url: `${origin}/rituals`,
          type: 'website'
        });
        break;
      case 'articles':
        updateSEO({
          title: language === 'fr' ? 'Le Journal & Conseils Beauté Naturelle | Ndolo Rituals' : 'The Journal & Natural Skincare | Ndolo Rituals',
          description: language === 'fr'
            ? 'Découvrez nos guides d’experts sur la saponification à froid, les bienfaits du beurre de karité et la cosmétique saine.'
            : 'Discover expert guides on cold saponification, shea butter benefits, and clean natural cosmetics.',
          keywords: 'blog beaute naturelle, conseils peau, saponification a froid guide, huile vegetale bienfaits',
          url: `${origin}/articles`,
          type: 'website'
        });
        break;
      case 'product-detail':
        if (selectedProduct) {
          updateSEO(buildProductSEO(selectedProduct, siteSettings, language));
        }
        break;
      case 'article-detail':
        if (selectedArticle) {
          updateSEO(buildArticleSEO(selectedArticle, siteSettings, language));
        }
        break;
      case 'cart':
        updateSEO({
          title: language === 'fr' ? 'Votre Panier | Ndolo Rituals' : 'Your Shopping Cart | Ndolo Rituals',
          description: 'Consultez et finalisez vos commandes de savons et soins naturels Ndolo Rituals.',
          url: `${origin}/cart`,
          type: 'website'
        });
        break;
      case 'privacy-terms':
        updateSEO({
          title: language === 'fr' ? 'Mentions Légales & CGV | Ndolo Rituals' : 'Legal Terms & Privacy | Ndolo Rituals',
          description: 'Consultez nos mentions légales, politique de confidentialité et conditions générales de vente.',
          url: `${origin}/privacy-terms`,
          type: 'website'
        });
        break;
      case 'admin':
        updateSEO({
          title: 'Administration | Ndolo Rituals',
          description: 'Panneau de gestion du catalogue, commandes et stocks.',
          url: `${origin}/admin`,
          type: 'website'
        });
        break;
    }
  }, [currentScreen, selectedProduct, selectedArticle, language, siteSettings]);

  // Initialisation du panier : vide par défaut (ou restauré depuis la session client)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ndolo_cart_items');
      if (saved) {
        return JSON.parse(saved) as CartItem[];
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sauvegarde automatique du panier dans localStorage
  const updateCartState = (newCart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setCartItems((prev) => {
      const resolved = typeof newCart === 'function' ? newCart(prev) : newCart;
      try {
        localStorage.setItem('ndolo_cart_items', JSON.stringify(resolved));
      } catch {
        // ignore
      }
      return resolved;
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Enregistrement de la visite initiale
  React.useEffect(() => {
    recordSiteVisit(window.location.pathname || '/');
  }, []);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    pushRoute({ screen });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    recordSiteVisit('/' + screen);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
    pushRoute({ screen: 'product-detail', productId: product.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentScreen('article-detail');
    pushRoute({ screen: 'article-detail', articleSlug: article.slug || article.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      setToastMessage(
        language === 'fr'
          ? `Désolé, ${product.name} est actuellement en rupture de stock.`
          : `Sorry, ${product.name} is currently out of stock.`
      );
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    updateCartState((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: nextQty }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });

    const productName = language === 'en' && product.nameEn ? product.nameEn : product.name;
    setToastMessage(
      language === 'fr'
        ? `${quantity}x ${productName} ajouté(s) au panier`
        : `${quantity}x ${productName} added to cart`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    const maxStock = targetProduct?.stock ?? 999;

    updateCartState((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(maxStock, nextQty) };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    updateCartState((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    updateCartState([]);
  };

  const signatureProduct = products.find((p) => p.featured) || products[0];

  // Admin screen gets its own full-page layout
  if (currentScreen === 'admin') {
    return <AdminScreen onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f5] text-[#1c1c19] font-sans antialiased selection:bg-[#d4e8d0] selection:text-[#0f1f10]">
      {/* Top App Bar Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        cartCount={cartCount}
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-16">
        {currentScreen === 'home' && (
          <HomeScreen
            products={products}
            articles={articles}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onSelectArticle={handleSelectArticle}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'shop' && (
          <ShopScreen
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentScreen === 'product-detail' && (
          selectedProduct ? (
            <ProductDetailScreen
              product={selectedProduct}
              allProducts={products}
              onAddToCart={handleAddToCart}
              onSelectProduct={handleSelectProduct}
              onNavigate={navigateTo}
            />
          ) : (
            <div className="w-full flex-grow py-24 text-center">
              <span className="material-symbols-outlined text-4xl text-[#bb0a4a] animate-spin mb-3">
                progress_activity
              </span>
              <p className="text-sm text-[#824f39]">
                {language === 'fr' ? 'Chargement du produit...' : 'Loading product...'}
              </p>
            </div>
          )
        )}

        {currentScreen === 'rituals' && (
          <RitualsScreen
            signatureProduct={signatureProduct}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'articles' && (
          <ArticlesScreen
            articles={articles}
            onSelectArticle={handleSelectArticle}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'article-detail' && (
          selectedArticle ? (
            <ArticleDetailScreen
              article={selectedArticle}
              allProducts={products}
              allArticles={articles}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              onSelectArticle={handleSelectArticle}
              onNavigate={navigateTo}
            />
          ) : (
            <div className="w-full flex-grow py-24 text-center">
              <span className="material-symbols-outlined text-4xl text-[#bb0a4a] animate-spin mb-3">
                progress_activity
              </span>
              <p className="text-sm text-[#824f39]">
                {language === 'fr' ? "Chargement de l'article..." : 'Loading article...'}
              </p>
            </div>
          )
        )}

        {currentScreen === 'privacy-terms' && (
          <PrivacyTermsScreen onNavigate={navigateTo} />
        )}

        {currentScreen === 'cart' && (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onNavigateToCart={() => {
          setToastMessage(null);
          navigateTo('cart');
        }}
        onClose={() => setToastMessage(null)}
      />

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        cartCount={cartCount}
      />
    </div>
  );
}
