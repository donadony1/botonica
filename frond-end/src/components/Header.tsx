import React, { useState, useEffect } from 'react';
import { ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, cartCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Fermeture automatique du menu avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        id="Ndolo-header"
        className="fixed top-0 w-full z-40 bg-[#fdf9f5]/90 backdrop-blur-md border-b border-[#E6D5C3]/60 transition-all duration-300 shadow-xs"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 h-16 w-full max-w-[1280px] mx-auto">
          {/* Left section: Hamburger on MOBILE only, Navigation links on DESKTOP only */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Hamburger Button (VISIBLE ON MOBILE ONLY - HIDDEN ON DESKTOP) */}
            <button
              id="header-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={language === 'fr' ? 'Ouvrir le menu' : 'Open menu'}
              className="md:hidden text-[#3D2B1F] hover:text-[#bb0a4a] transition-colors p-1.5 rounded-full active:scale-95 duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Desktop Navigation (VISIBLE ON DESKTOP ONLY) */}
            <nav className="hidden md:flex items-center gap-7">
              <button
                onClick={() => onNavigate('home')}
                className={`text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                  currentScreen === 'home'
                    ? 'text-[#3D2B1F] font-bold border-b-2 border-[#3D2B1F] pb-1'
                    : 'text-[#4f453f] hover:text-[#3D2B1F]'
                }`}
              >
                {t('nav_home')}
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className={`text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                  currentScreen === 'shop' || currentScreen === 'product-detail'
                    ? 'text-[#3D2B1F] font-bold border-b-2 border-[#3D2B1F] pb-1'
                    : 'text-[#4f453f] hover:text-[#3D2B1F]'
                }`}
              >
                {t('nav_shop')}
              </button>
              <button
                onClick={() => onNavigate('rituals')}
                className={`text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                  currentScreen === 'rituals'
                    ? 'text-[#3D2B1F] font-bold border-b-2 border-[#3D2B1F] pb-1'
                    : 'text-[#4f453f] hover:text-[#3D2B1F]'
                }`}
              >
                {t('nav_rituals')}
              </button>
              <button
                onClick={() => onNavigate('articles')}
                className={`text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                  currentScreen === 'articles' || currentScreen === 'article-detail'
                    ? 'text-[#3D2B1F] font-bold border-b-2 border-[#3D2B1F] pb-1'
                    : 'text-[#4f453f] hover:text-[#3D2B1F]'
                }`}
              >
                {language === 'fr' ? 'Journal' : 'Journal'}
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className={`text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                  currentScreen === 'admin'
                    ? 'text-[#3D2B1F] font-bold border-b-2 border-[#3D2B1F] pb-1'
                    : 'text-[#4f453f] hover:text-[#3D2B1F]'
                }`}
                title="Administration"
              >
                {t('nav_admin')}
              </button>
            </nav>
          </div>

          {/* Logo Center */}
          <button
            id="header-logo-btn"
            onClick={() => onNavigate('home')}
            className="font-serif text-2xl md:text-3xl tracking-[0.25em] text-[#26170c] font-semibold select-none hover:opacity-85 transition-opacity cursor-pointer"
          >
            NDOLO
          </button>

          {/* Right actions: Language toggle + Cart button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher Pill */}
            <div className="flex items-center bg-[#E6D5C3]/40 p-1 rounded-full text-xs font-semibold border border-[#D7B49E]/40">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-[#3D2B1F] text-white shadow-xs'
                    : 'text-[#4f453f] hover:text-[#1c1c19]'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#3D2B1F] text-white shadow-xs'
                    : 'text-[#4f453f] hover:text-[#1c1c19]'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Cart button with count badge */}
            <button
              id="header-cart-btn"
              onClick={() => onNavigate('cart')}
              aria-label={t('nav_cart')}
              className="relative p-2 text-[#3D2B1F] hover:text-[#bb0a4a] transition-colors rounded-full active:scale-95 duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#bb0a4a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#fdf9f5] border-b border-[#E6D5C3]/60 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl cursor-pointer ${
                currentScreen === 'home' ? 'text-[#3D2B1F] font-semibold' : 'text-[#4f453f]'
              }`}
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => {
                onNavigate('shop');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl cursor-pointer ${
                currentScreen === 'shop' || currentScreen === 'product-detail'
                  ? 'text-[#3D2B1F] font-semibold'
                  : 'text-[#4f453f]'
              }`}
            >
              {t('nav_shop')}
            </button>
            <button
              onClick={() => {
                onNavigate('rituals');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl cursor-pointer ${
                currentScreen === 'rituals' ? 'text-[#3D2B1F] font-semibold' : 'text-[#4f453f]'
              }`}
            >
              {t('nav_rituals')}
            </button>
            <button
              onClick={() => {
                onNavigate('articles');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl cursor-pointer ${
                currentScreen === 'articles' || currentScreen === 'article-detail' ? 'text-[#3D2B1F] font-semibold' : 'text-[#4f453f]'
              }`}
            >
              {language === 'fr' ? 'Journal & Articles' : 'Journal & Articles'}
            </button>
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl cursor-pointer ${
                currentScreen === 'admin' ? 'text-[#3D2B1F] font-semibold' : 'text-[#4f453f]'
              }`}
            >
              ⚙ {t('nav_admin')}
            </button>
            <button
              onClick={() => {
                onNavigate('cart');
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-serif text-xl cursor-pointer ${
                currentScreen === 'cart' ? 'text-[#3D2B1F] font-semibold' : 'text-[#4f453f]'
              }`}
            >
              {t('nav_cart')} ({cartCount})
            </button>
          </div>
        )}
      </header>

      {/* Backdrop sombre interactif sur mobile pour refermer au clic sur l'écran */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-xs animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}
    </>
  );
};
