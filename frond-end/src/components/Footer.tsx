import React from 'react';
import { ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <footer
      id="Ndolo-footer"
      className="bg-[#e2e0d7] w-full py-16 mb-20 md:mb-0 flex flex-col items-center gap-8 px-6 text-center border-t border-[#c4c8c0]/40 transition-colors"
    >
      <div className="font-serif-luxury text-3xl md:text-4xl tracking-[0.2em] text-[#bb0a4a] font-semibold">
        NDOLO
      </div>

      <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-[#64635c] text-xs sm:text-sm font-medium uppercase tracking-wider">
        <button
          onClick={() => onNavigate('rituals')}
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
        >
          {t('footer_story')}
        </button>
        <button
          onClick={() => onNavigate('articles')}
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
        >
          Journal & Conseils
        </button>
        <button
          onClick={() => onNavigate('shop')}
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
        >
          {t('footer_ingredients')}
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
        >
          {t('footer_sustainability')}
        </button>
        <button
          onClick={() => onNavigate('cart')}
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
        >
          {t('footer_shipping')}
        </button>
        <button
          onClick={() => onNavigate('privacy-terms')}
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
        >
          {language === 'fr' ? 'CGV & Confidentialité' : 'Terms & Privacy'}
        </button>
        <a
          href="mailto:contact@ndolo-rituals.fr"
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
        >
          {t('footer_contact')}
        </a>
      </nav>

      <div className="max-w-md text-xs text-[#64635c]/90 leading-relaxed font-light">
        {t('footer_tagline')}
      </div>

      <p className="text-[#64635c] text-[11px] tracking-wider opacity-80 mt-1 font-mono">
        {t('footer_rights')}
      </p>
    </footer>
  );
};
