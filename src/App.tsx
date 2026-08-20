/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, CartItem, ScreenType } from './types';
import { PRODUCTS, INITIAL_CART } from './data/products';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { ShopScreen } from './components/ShopScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { RitualsScreen } from './components/RitualsScreen';
import { CartScreen } from './components/CartScreen';
import { Toast } from './components/Toast';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]); // default to Lavande & Olive
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize cart with sample items as shown in design mockups
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return INITIAL_CART.map((init) => {
      const p = PRODUCTS.find((prod) => prod.id === init.productId) || PRODUCTS[0];
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

  const signatureProduct = PRODUCTS.find((p) => p.id === 'savon-signature') || PRODUCTS[0];

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
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'shop' && (
          <ShopScreen
            products={PRODUCTS}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentScreen === 'product-detail' && (
          <ProductDetailScreen
            product={selectedProduct}
            allProducts={PRODUCTS}
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
