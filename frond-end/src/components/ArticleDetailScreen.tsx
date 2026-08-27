import React, { useState } from 'react';
import { Article, Product, ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { getArticleUrl } from '../lib/router';
import { formatPrice } from '../lib/currency';

interface ArticleDetailScreenProps {
  article: Article;
  allProducts: Product[];
  allArticles?: Article[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectArticle: (article: Article) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({
  article,
  allProducts,
  allArticles = [],
  onSelectProduct,
  onAddToCart,
  onSelectArticle,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const { siteSettings } = useAdmin();
  const [copied, setCopied] = useState(false);

  const title = language === 'en' && article.titleEn ? article.titleEn : article.title;
  const content = language === 'en' && article.contentEn ? article.contentEn : article.content;
  const categoryLabel = language === 'en' && article.categoryLabelEn ? article.categoryLabelEn : article.categoryLabel;
  const readTime = language === 'en' && article.readTimeEn ? article.readTimeEn : article.readTime;

  // Related products from product catalog
  const relatedProducts = allProducts.filter((p) =>
    article.relatedProductIds?.includes(p.id)
  );

  // Other suggested articles (excluding current) from dynamic database list
  const suggestedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 3);

  const handleShare = () => {
    const url = getArticleUrl(article);
    if (navigator.share) {
      navigator.share({
        title: `${title} — Ndolo Rituals`,
        text: article.excerpt,
        url: url,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#fdf9f5] text-[#1c1c19] min-h-screen pb-24">
      {/* Breadcrumb & Top Bar */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xs text-[#81756e]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#3D2B1F] transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'Accueil' : 'Home'}
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('articles')}
            className="hover:text-[#3D2B1F] transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'Journal' : 'Journal'}
          </button>
          <span>/</span>
          <span className="text-[#3D2B1F] font-medium truncate max-w-[200px] sm:max-w-xs">{title}</span>
        </div>
      </div>

      {/* Article Header */}
      <header className="px-5 sm:px-8 md:px-12 pt-4 pb-8 max-w-4xl mx-auto w-full text-center sm:text-left space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6D5C3]/60 text-[#3D2B1F] text-xs font-semibold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">menu_book</span>
          <span>{categoryLabel}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#26170c] font-normal leading-tight tracking-tight">
          {title}
        </h1>

        {/* Author & Meta row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-y border-[#E6D5C3]/60 py-4">
          <div className="flex items-center gap-3">
            <img
              src={article.authorAvatar}
              alt={article.author}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#E6D5C3]"
            />
            <div className="text-left">
              <span className="text-sm font-bold text-[#26170c] block">{article.author}</span>
              <span className="text-xs text-[#81756e]">{article.authorRole}</span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3 text-xs text-[#81756e]">
            <span>{article.publishedAt}</span>
            <span>·</span>
            <span>{readTime}</span>
            <span>·</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-[#3D2B1F] hover:text-[#bb0a4a] bg-white px-3 py-1.5 rounded-full border border-[#E6D5C3] transition-colors cursor-pointer text-xs font-medium"
              title="Copier le lien de l'article"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'share'}
              </span>
              <span>{copied ? (language === 'fr' ? 'Copié !' : 'Copied!') : (language === 'fr' ? 'Partager' : 'Share')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <section className="px-5 sm:px-8 md:px-12 pb-10 max-w-4xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E6D5C3]/60 aspect-[16/9] bg-[#26170c]">
          <img
            src={article.image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Article Rich Content */}
      <main className="px-5 sm:px-8 md:px-12 max-w-3xl mx-auto w-full">
        {/<[a-z][\s\S]*>/i.test(content) ? (
          <div
            className="article-content prose prose-stone max-w-none text-[#26170c] leading-relaxed text-base space-y-5 
              [&>p]:leading-relaxed [&>p]:text-[#382b22] [&>p]:mb-4
              [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:text-[#26170c] [&>h2]:font-normal [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-[#E6D5C3]/60
              [&>h3]:font-serif [&>h3]:text-xl [&>h3]:text-[#26170c] [&>h3]:mt-6 [&>h3]:mb-3
              [&>blockquote]:my-8 [&>blockquote]:p-6 [&>blockquote]:bg-[#E6D5C3]/30 [&>blockquote]:border-l-4 [&>blockquote]:border-[#3D2B1F] [&>blockquote]:rounded-r-2xl [&>blockquote]:italic [&>blockquote]:font-serif [&>blockquote]:text-lg [&>blockquote]:text-[#26170c]
              [&>ul]:space-y-2.5 [&>ul]:my-5 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:text-[#4f453f]
              [&>ol]:space-y-2.5 [&>ol]:my-5 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:text-[#4f453f]
              [&>p.lead]:text-lg [&>p.lead]:text-[#3D2B1F] [&>p.lead]:font-serif [&>p.lead]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="space-y-5 text-base text-[#382b22] leading-relaxed font-light">
            {content.split(/\n\n+/).map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-8 mt-10 border-t border-[#E6D5C3]/60">
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-white text-[#3D2B1F] px-3 py-1 rounded-full border border-[#E6D5C3] font-medium shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>

      {/* ─── RELATED PRODUCTS SECTION ────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="px-5 sm:px-8 md:px-12 mt-16 pt-12 pb-12 bg-white border-y border-[#E6D5C3]/60">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#824f39] block mb-2">
              {language === 'fr' ? 'Soins Mentionnés dans ce Guide' : 'Care Mentioned in this Guide'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#26170c] mb-8 font-normal">
              {language === 'fr' ? 'Adopter le Rituel chez Vous' : 'Bring this Ritual Home'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#fdf9f5] rounded-2xl border border-[#E6D5C3]/70 p-4 sm:p-5 flex gap-4 items-center justify-between group shadow-xs hover:shadow-md transition-all"
                >
                  <div
                    onClick={() => onSelectProduct(prod)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 cursor-pointer"
                  >
                    <img
                      src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => onSelectProduct(prod)}
                      className="font-serif text-base text-[#26170c] font-normal truncate hover:text-[#bb0a4a] cursor-pointer"
                    >
                      {language === 'en' && prod.nameEn ? prod.nameEn : prod.name}
                    </h4>
                    <span className="text-xs text-[#81756e] block mt-0.5 truncate">{prod.tagline}</span>
                    <span className="font-serif text-base font-bold text-[#3D2B1F] block mt-1">
                      {formatPrice(prod.price, siteSettings.currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(prod, 1)}
                    disabled={prod.stock <= 0}
                    className="bg-[#3D2B1F] hover:bg-[#bb0a4a] text-white p-2.5 rounded-full transition-colors shrink-0 shadow-xs cursor-pointer"
                    title="Ajouter au panier"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SUGGESTED ARTICLES ──────────────────────────────────────── */}
      <section className="px-5 sm:px-8 md:px-12 mt-16 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#824f39] block mb-1">
              {language === 'fr' ? 'À Lire Ensuite' : 'Read Next'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#26170c] font-normal">
              {language === 'fr' ? 'Poursuivez Votre Exploration' : 'Continue Your Exploration'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('articles')}
            className="text-xs font-bold uppercase tracking-wider text-[#3D2B1F] hover:text-[#bb0a4a] flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'fr' ? 'Tous les articles' : 'All articles'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {suggestedArticles.map((sug) => {
            const sugTitle = language === 'en' && sug.titleEn ? sug.titleEn : sug.title;
            return (
              <div
                key={sug.id}
                onClick={() => onSelectArticle(sug)}
                className="bg-white rounded-2xl border border-[#E6D5C3]/60 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#26170c]">
                  <img
                    src={sug.image}
                    alt={sugTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#824f39] font-bold">
                    {language === 'en' && sug.categoryLabelEn ? sug.categoryLabelEn : sug.categoryLabel}
                  </span>
                  <h4 className="font-serif text-sm font-normal text-[#26170c] group-hover:text-[#bb0a4a] transition-colors line-clamp-2">
                    {sugTitle}
                  </h4>
                  <span className="text-[11px] text-[#81756e]">{sug.readTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
