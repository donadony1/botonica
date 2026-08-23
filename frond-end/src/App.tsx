import React, { useState } from 'react';
import { Product, Article, CartItem, ScreenType } from './types';
import { ARTICLES } from './data/articles';
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
  const { products, articles } = useAdmin();
  const { language } = useLanguage();

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [selectedArticle, setSelectedArticle] = useState<Article>(() => articles[0] || ARTICLES[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronise selectedArticle si les articles de la base de données changent
  React.useEffect(() => {
    if (articles.length > 0 && (!selectedArticle || !articles.some(a => a.id === selectedArticle.id))) {
      setSelectedArticle(articles[0]);
    }
  }, [articles]);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    recordSiteVisit('/' + screen);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentScreen('article-detail');
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

  const signatureProduct = products.find((p) => p.id === 'savon-signature') || products[0];

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
          <ProductDetailScreen
            product={selectedProduct}
            allProducts={products}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigateTo}
          />
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
          <ArticleDetailScreen
            article={selectedArticle}
            allProducts={products}
            allArticles={articles}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onSelectArticle={handleSelectArticle}
            onNavigate={navigateTo}
          />
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
