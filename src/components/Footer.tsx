import React from 'react';
import { ScreenType } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      id="Ndolo-footer"
      className="bg-[#e2e0d7] w-full py-16 mb-20 md:mb-0 flex flex-col items-center gap-8 px-6 text-center border-t border-[#c4c8c0]/40 transition-colors"
    >
      <div className="font-serif-luxury text-3xl md:text-4xl tracking-[0.2em] text-[#1a191c]">
        Ndolo
      </div>

      <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-[#64635c] text-sm md:text-base font-normal">
        <button
          onClick={() => onNavigate('rituals')}
          className="hover:text-[#1a191c] hover:underline decoration-[#1a191c]/30 underline-offset-4 transition-all"
        >
          Our Story
        </button>
        <button
          onClick={() => onNavigate('shop')}
          className="hover:text-[#1a191c] hover:underline decoration-[#1a191c]/30 underline-offset-4 transition-all"
        >
          Ingredients
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-[#1a191c] hover:underline decoration-[#1a191c]/30 underline-offset-4 transition-all"
        >
          Sustainability
        </button>
        <button
          onClick={() => onNavigate('cart')}
          className="hover:text-[#1a191c] hover:underline decoration-[#1a191c]/30 underline-offset-4 transition-all"
        >
          Shipping
        </button>
        <a
          href="mailto:contact@Ndolorituals.com"
          className="hover:text-[#1a191c] hover:underline decoration-[#1a191c]/30 underline-offset-4 transition-all"
        >
          Contact
        </a>
      </nav>

      <div className="max-w-md text-xs text-[#64635c]/80 leading-relaxed font-light">
        Savonnerie artisanale de tradition botanique. Ingrédients 100% naturels, saponification à froid, emballages recyclables sans plastique.
      </div>

      <p className="text-[#64635c] text-xs tracking-wider opacity-80 mt-2">
        © 2024 Ndolo RITUALS. TOUS DROITS RÉSERVÉS.
      </p>
    </footer>
  );
};
