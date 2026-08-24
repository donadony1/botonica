import React, { useState } from 'react';
import { Article, ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ArticlesScreenProps {
  articles?: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ArticlesScreen: React.FC<ArticlesScreenProps> = ({
  articles = [],
  onSelectArticle,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Tous les articles' : 'All articles' },
    { id: 'culture', label: language === 'fr' ? 'Culture & Savoir-Faire' : 'Culture & Craft' },
    { id: 'skin-health', label: language === 'fr' ? 'Santé de la Peau' : 'Skin Health' },
    { id: 'ingredients', label: language === 'fr' ? 'Ingrédients Purs' : 'Pure Ingredients' },
    { id: 'rituals', label: language === 'fr' ? 'Rituels de Bain' : 'Bath Rituals' },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
    const title = language === 'en' && art.titleEn ? art.titleEn : art.title;
    const excerpt = language === 'en' && art.excerptEn ? art.excerptEn : art.excerpt;
    const matchSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  return (
    <div className="w-full flex flex-col bg-[#fdf9f5] text-[#1c1c19] min-h-screen pb-20">
      {/* Header Banner */}
      <section className="px-5 sm:px-8 md:px-12 pt-10 pb-12 max-w-7xl mx-auto w-full text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#824f39] block mb-3">
          {language === 'fr' ? 'Le Journal Botanique & Ancestral' : 'The Botanical & Ancestral Journal'}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#26170c] font-normal tracking-tight mb-4">
          {language === 'fr' ? 'Sagesse de la Terre & Rituels de Soin' : 'Earth Wisdom & Care Rituals'}
        </h1>
        <p className="text-sm sm:text-base text-[#4f453f] max-w-2xl mx-auto font-light leading-relaxed">
          {language === 'fr'
            ? 'Explorez nos guides experts sur la saponification naturelle, les vertus des plantes africaines et les conseils dermatologiques pour sublimer votre peau.'
            : 'Explore our expert guides on ancestral soapmaking, African botanicals, and dermatological rituals for glowing skin.'}
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-8 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'fr' ? 'Rechercher un article, un ingrédient...' : 'Search an article, ingredient...'}
            className="w-full bg-white border border-[#E6D5C3] text-[#26170c] placeholder-[#81756e] rounded-full px-5 py-3.5 pl-12 text-sm shadow-xs focus:outline-none focus:border-[#3D2B1F] transition-colors"
          />
          <span className="material-symbols-outlined text-[#81756e] absolute left-4 top-3.5 text-[20px]">
            search
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-[#81756e] hover:text-[#26170c] p-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#3D2B1F] text-white shadow-sm'
                  : 'bg-white/80 text-[#4f453f] border border-[#E6D5C3] hover:bg-[#E6D5C3]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Article Card (Shown when viewing all & no search) */}
      {selectedCategory === 'all' && !searchQuery && featuredArticle && (
        <section className="px-5 sm:px-8 md:px-12 pb-16 max-w-7xl mx-auto w-full">
          <div
            onClick={() => onSelectArticle(featuredArticle)}
            className="bg-white rounded-3xl border border-[#E6D5C3]/70 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row cursor-pointer group"
          >
            <div className="w-full lg:w-3/5 relative h-72 sm:h-96 lg:h-[460px] overflow-hidden bg-[#26170c]">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-[#3D2B1F] text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full shadow-md">
                {language === 'fr' ? 'À la Une' : 'Featured'}
              </span>
            </div>

            <div className="w-full lg:w-2/5 p-6 sm:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-[#824f39] font-semibold">
                  <span className="uppercase tracking-wider">
                    {language === 'en' && featuredArticle.categoryLabelEn ? featuredArticle.categoryLabelEn : featuredArticle.categoryLabel}
                  </span>
                  <span>·</span>
                  <span>{language === 'en' && featuredArticle.readTimeEn ? featuredArticle.readTimeEn : featuredArticle.readTime}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#26170c] font-normal leading-tight group-hover:text-[#bb0a4a] transition-colors">
                  {language === 'en' && featuredArticle.titleEn ? featuredArticle.titleEn : featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#4f453f] leading-relaxed font-light line-clamp-4">
                  {language === 'en' && featuredArticle.excerptEn ? featuredArticle.excerptEn : featuredArticle.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#f1ede9]">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredArticle.authorAvatar}
                    alt={featuredArticle.author}
                    className="w-9 h-9 rounded-full object-cover border border-[#E6D5C3]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#26170c] block">{featuredArticle.author}</span>
                    <span className="text-[10px] text-[#81756e]">{featuredArticle.publishedAt}</span>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-[#3D2B1F] group-hover:text-[#bb0a4a] flex items-center gap-1">
                  <span>{language === 'fr' ? 'Lire' : 'Read'}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of Articles */}
      <section className="px-5 sm:px-8 md:px-12 max-w-7xl mx-auto w-full">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E6D5C3]/60 p-8">
            <span className="material-symbols-outlined text-4xl text-[#81756e] mb-2">article</span>
            <h3 className="font-serif text-xl text-[#26170c]">
              {language === 'fr' ? 'Aucun article trouvé' : 'No articles found'}
            </h3>
            <p className="text-xs text-[#81756e] mt-1">
              {language === 'fr' ? 'Essayez un autre mot-clé ou filtre.' : 'Try another keyword or filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => {
              const title = language === 'en' && article.titleEn ? article.titleEn : article.title;
              const excerpt = language === 'en' && article.excerptEn ? article.excerptEn : article.excerpt;
              const categoryLabel = language === 'en' && article.categoryLabelEn ? article.categoryLabelEn : article.categoryLabel;
              const readTime = language === 'en' && article.readTimeEn ? article.readTimeEn : article.readTime;

              return (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="bg-white rounded-3xl border border-[#E6D5C3]/60 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#26170c]">
                      <img
                        src={article.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[#3D2B1F] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        {categoryLabel}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-[#824f39] font-medium">
                        <span>{article.publishedAt}</span>
                        <span>·</span>
                        <span>{readTime}</span>
                      </div>

                      <h3 className="font-serif text-xl text-[#26170c] font-normal leading-snug group-hover:text-[#bb0a4a] transition-colors line-clamp-2">
                        {title}
                      </h3>

                      <p className="text-xs text-[#4f453f] line-clamp-3 font-light leading-relaxed">
                        {excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer Author & Read link */}
                  <div className="px-6 pb-6 pt-3 border-t border-[#f1ede9] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={article.authorAvatar}
                        alt={article.author}
                        className="w-7 h-7 rounded-full object-cover border border-[#E6D5C3]"
                      />
                      <span className="text-xs font-semibold text-[#26170c]">{article.author}</span>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider text-[#3D2B1F] group-hover:text-[#bb0a4a] flex items-center gap-1">
                      <span>{language === 'fr' ? 'Lire' : 'Read'}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
