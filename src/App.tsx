import React, { useState } from 'react';
import { Product, CartItem, ScreenType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { ShopScreen } from './components/ShopScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { RitualsScreen } from './components/RitualsScreen';
import { CartScreen } from './components/CartScreen';
import { Toast } from './components/Toast';
import AdminScreen from './components/admin/AdminScreen';
import { AdminProvider, useAdmin } from './context/AdminContext';

export default function App() {
  return (
    <AdminProvider>
      <AppInner />
    </AdminProvider>
  );
}

function AppInner() {
  const { products } = useAdmin();
  const INITIAL_CART_IDS = [
    { productId: 'eucalyptus-clay', quantity: 2 },
    { productId: 'cedar-vetiver-oil', quantity: 1 },
  ];

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize cart
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return INITIAL_CART_IDS.map((init) => {
      const p = products.find((prod) => prod.id === init.productId) || products[0];
      return { product: p, quantity: init.quantity };
    });
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setToastMessage(`${quantity}x ${product.name} ajouté(s) au panier`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const signatureProduct = products.find((p) => p.id === 'savon-signature') || products[0];

  // Admin screen gets its own full-page layout
  if (currentScreen === 'admin') {
    return <AdminScreen onNavigate={navigateTo} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] text-[#1a1c1c] font-sans antialiased selection:bg-[#d4e8d0] selection:text-[#0f1f10]">
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
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
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
