import React from 'react';
import { ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { normalizeImageUrl } from '../lib/api';

interface FooterProps {
  onNavigate: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { siteSettings } = useAdmin();

  const currentYear = new Date().getFullYear();
  const cleanInsta = (siteSettings.instagram || '').replace('@', '').trim();
  const instaUrl = cleanInsta ? `https://instagram.com/${cleanInsta}` : 'https://instagram.com';
  const fbUrl = siteSettings.facebook ? `https://facebook.com/${siteSettings.facebook.trim()}` : null;

  return (
    <footer
      id="Ndolo-footer"
      className="bg-[#e2e0d7] w-full py-16 mb-20 md:mb-0 flex flex-col items-center gap-8 px-6 text-center border-t border-[#c4c8c0]/40 transition-colors"
    >
      {/* Logo ou Nom de Marque */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center justify-center hover:opacity-85 transition-opacity cursor-pointer"
        title={siteSettings.siteName || 'Ndolo Rituals'}
      >
        {siteSettings.logoUrl ? (
          <img
            src={normalizeImageUrl(siteSettings.logoUrl)}
            alt={siteSettings.siteName || 'Ndolo'}
            className="max-h-12 md:max-h-14 w-auto object-contain"
          />
        ) : (
          <span className="font-serif-luxury text-3xl md:text-4xl tracking-[0.2em] text-[#bb0a4a] font-semibold">
            {siteSettings.siteName?.toUpperCase() || 'NDOLO'}
          </span>
        )}
      </button>

      {/* Liens de navigation */}
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
          {language === 'fr' ? 'Journal & Conseils' : 'Journal & Advice'}
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
        {siteSettings.contactEmail && (
          <a
            href={`mailto:${siteSettings.contactEmail}`}
            className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer"
          >
            {t('footer_contact')}
          </a>
        )}
        <button
          id="footer-admin-btn"
          onClick={() => onNavigate('admin')}
          className="hover:text-[#bb0a4a] hover:underline decoration-[#bb0a4a]/30 underline-offset-4 transition-all cursor-pointer inline-flex items-center gap-1 opacity-80 hover:opacity-100"
          title="Accès Espace Administration & Gérance"
        >
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span>{t('nav_admin')}</span>
        </button>
      </nav>

      {/* Slogan & Atelier */}
      <div className="max-w-md text-xs text-[#64635c]/90 leading-relaxed font-light space-y-1">
        <p>{siteSettings.tagline || t('footer_tagline')}</p>
        {siteSettings.address && (
          <p className="text-[11px] text-[#64635c]/75 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[13px]">location_on</span>
            {siteSettings.address}
          </p>
        )}
      </div>

      {/* Réseaux sociaux */}
      {(cleanInsta || fbUrl) && (
        <div className="flex items-center gap-4 text-[#64635c]">
          {cleanInsta && (
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#bb0a4a] transition-colors text-xs font-semibold flex items-center gap-1"
              title={`Instagram ${siteSettings.instagram}`}
            >
              <span>Instagram</span>
              <span className="text-[11px] opacity-75">@{cleanInsta}</span>
            </a>
          )}
          {cleanInsta && fbUrl && <span className="opacity-30">•</span>}
          {fbUrl && (
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#bb0a4a] transition-colors text-xs font-semibold flex items-center gap-1"
              title={`Facebook ${siteSettings.facebook}`}
            >
              <span>Facebook</span>
            </a>
          )}
        </div>
      )}

      {/* Droits d'auteur */}
      <p className="text-[#64635c] text-[11px] tracking-wider opacity-80 mt-1 font-mono">
        © {currentYear} {siteSettings.siteName || 'Ndolo Rituals'}. {t('footer_rights')}
      </p>
    </footer>
  );
};

