import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate, cartCount }) => {
  return (
    <nav
      id="Ndolo-bottom-nav"
      className="md:hidden fixed bottom-0 w-full z-50 bg-[#f9f9f9]/95 backdrop-blur-md shadow-[0_-4px_25px_rgba(79,97,78,0.08)] border-t border-[#c4c8c0]/30"
    >
      <div className="flex justify-around items-center h-20 pb-safe px-4 max-w-md mx-auto">
        {/* Home Tab */}
        <button
          id="nav-tab-home"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center px-3 py-1 text-xs tracking-wider transition-all duration-200 ${currentScreen === 'home'
            ? 'text-[#1a191c] font-bold bg-[#d4e8d0]/40 rounded-xl'
            : 'text-[#434842] hover:text-[#1a191c] active:scale-95'
            }`}
        >
          <span
            className="material-symbols-outlined mb-1 text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span>Home</span>
        </button>

        {/* Shop Tab */}
        <button
          id="nav-tab-shop"
          onClick={() => onNavigate('shop')}
          className={`flex flex-col items-center justify-center px-3 py-1 text-xs tracking-wider transition-all duration-200 ${currentScreen === 'shop' || currentScreen === 'product-detail'
            ? 'text-[#1a191c] font-bold bg-[#d4e8d0]/40 rounded-xl'
            : 'text-[#434842] hover:text-[#1a191c] active:scale-95'
            }`}
        >
          <span
            className="material-symbols-outlined mb-1 text-[22px]"
            style={{
              fontVariationSettings:
                currentScreen === 'shop' || currentScreen === 'product-detail'
                  ? "'FILL' 1"
                  : "'FILL' 0",
            }}
          >
            spa
          </span>
          <span>Shop</span>
        </button>

        {/* Rituals Tab */}
        <button
          id="nav-tab-rituals"
          onClick={() => onNavigate('rituals')}
          className={`flex flex-col items-center justify-center px-3 py-1 text-xs tracking-wider transition-all duration-200 ${currentScreen === 'rituals'
            ? 'text-[#1a191c] font-bold bg-[#d4e8d0]/40 rounded-xl'
            : 'text-[#434842] hover:text-[#1a191c] active:scale-95'
            }`}
        >
          <span
            className="material-symbols-outlined mb-1 text-[22px]"
            style={{
              fontVariationSettings: currentScreen === 'rituals' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            auto_stories
          </span>
          <span>Rituals</span>
        </button>

        {/* Cart Tab */}
        <button
          id="nav-tab-cart"
          onClick={() => onNavigate('cart')}
          className={`flex flex-col items-center justify-center px-3 py-1 text-xs tracking-wider transition-all duration-200 relative ${currentScreen === 'cart'
            ? 'text-[#1a191c] font-bold bg-[#d4e8d0]/40 rounded-xl'
            : 'text-[#434842] hover:text-[#1a191c] active:scale-95'
            }`}
        >
          <span
            className="material-symbols-outlined mb-1 text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'cart' ? "'FILL' 1" : "'FILL' 0" }}
          >
            shopping_basket
          </span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-[#824f39] rounded-full animate-ping"></span>
          )}
          <span>Cart</span>
        </button>
      </div>
    </nav>
  );
};
