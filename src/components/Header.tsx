import React, { useState } from 'react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, cartCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        id="botanica-header"
        className="fixed top-0 w-full z-40 bg-[#f9f9f9]/85 backdrop-blur-md border-b border-[#4f614e]/10 transition-all duration-300"
      >
        <div className="flex items-center justify-between px-5 md:px-12 h-16 w-full max-w-[1280px] mx-auto">
          {/* Menu button on mobile / Desktop nav */}
          <div className="flex items-center gap-6">
            <button
              id="header-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Ouvrir le menu"
              className="text-[#434842] hover:text-[#4f614e] transition-colors p-1 rounded-full active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => onNavigate('home')}
                className={`text-sm uppercase tracking-widest transition-colors ${
                  currentScreen === 'home'
                    ? 'text-[#4f614e] font-semibold border-b-2 border-[#4f614e] pb-1'
                    : 'text-[#434842] hover:text-[#4f614e]'
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className={`text-sm uppercase tracking-widest transition-colors ${
                  currentScreen === 'shop' || currentScreen === 'product-detail'
                    ? 'text-[#4f614e] font-semibold border-b-2 border-[#4f614e] pb-1'
                    : 'text-[#434842] hover:text-[#4f614e]'
                }`}
              >
                Boutique
              </button>
              <button
                onClick={() => onNavigate('rituals')}
                className={`text-sm uppercase tracking-widest transition-colors ${
                  currentScreen === 'rituals'
                    ? 'text-[#4f614e] font-semibold border-b-2 border-[#4f614e] pb-1'
                    : 'text-[#434842] hover:text-[#4f614e]'
                }`}
              >
                Le Rituel
              </button>
            </nav>
          </div>

          {/* Logo Center */}
          <button
            id="header-logo-btn"
            onClick={() => onNavigate('home')}
            className="font-serif-luxury text-2xl md:text-3xl tracking-[0.25em] text-[#4f614e] font-semibold select-none hover:opacity-85 transition-opacity"
          >
            BOTANICA
          </button>

          {/* Cart button with count badge */}
          <div className="flex items-center gap-3">
            <button
              id="header-cart-btn"
              onClick={() => onNavigate('cart')}
              aria-label="Panier d'achats"
              className="relative p-2 text-[#434842] hover:text-[#4f614e] transition-colors rounded-full active:scale-95 duration-200"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#824f39] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#f9f9f9] border-b border-[#c4c8c0]/40 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl ${
                currentScreen === 'home' ? 'text-[#4f614e] font-semibold' : 'text-[#1a1c1c]'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl ${
                currentScreen === 'shop' || currentScreen === 'product-detail'
                  ? 'text-[#4f614e] font-semibold'
                  : 'text-[#1a1c1c]'
              }`}
            >
              Boutique & Soins
            </button>
            <button
              onClick={() => {
                onNavigate('rituals');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl ${
                currentScreen === 'rituals' ? 'text-[#4f614e] font-semibold' : 'text-[#1a1c1c]'
              }`}
            >
              Le Rituel Signature
            </button>
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl ${
                currentScreen === 'cart' ? 'text-[#4f614e] font-semibold' : 'text-[#1a1c1c]'
              }`}
            >
              Mon Panier ({cartCount})
            </button>
          </div>
        )}
      </header>
    </>
  );
};
