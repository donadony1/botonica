import React, { useState, useEffect, useRef } from 'react';
import { Article, Product } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { uploadProductImage } from '../../lib/api';
import { CKEditorComponent } from './CKEditorComponent';

interface Props {
  article: Article | null;
  allProducts: Product[];
  onClose: () => void;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ArticleFormModal({ article, allProducts, onClose }: Props) {
  const { addArticle, updateArticle } = useAdmin();
  const isEdit = !!article;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mode d'importation de l'image : 'upload' (machine) ou 'url' (lien web)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');

  // Langue du contenu en cours d'édition (FR par défaut, EN optionnel)
  const [contentLang, setContentLang] = useState<'fr' | 'en'>('fr');

  const [form, setForm] = useState({
    title: '',
    titleEn: '',
    slug: '',
    category: 'culture' as 'rituals' | 'ingredients' | 'skin-health' | 'culture',
    categoryLabel: 'Culture & Savoir-Faire',
    categoryLabelEn: 'Culture & Craft',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    author: 'Karene Bella',
    authorRole: 'Fondatrice & Formulatrice Botanique',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    publishedAt: '',
    readTime: '4 min de lecture',
    readTimeEn: '4 min read',
    image: '',
    tags: '',
    featured: false,
    relatedProductIds: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (article) {
      setForm({
        title: article.title,
        titleEn: article.titleEn || '',
        slug: article.slug,
        category: article.category,
        categoryLabel: article.categoryLabel,
        categoryLabelEn: article.categoryLabelEn || '',
        excerpt: article.excerpt,
        excerptEn: article.excerptEn || '',
        content: article.content,
        contentEn: article.contentEn || '',
        author: article.author,
        authorRole: article.authorRole,
        authorAvatar: article.authorAvatar,
        publishedAt: article.publishedAt,
        readTime: article.readTime,
        readTimeEn: article.readTimeEn || '',
        image: article.image,
        tags: article.tags.join(', '),
        featured: article.featured || false,
        relatedProductIds: article.relatedProductIds || [],
      });
      if (article.image && (article.image.startsWith('http://') || article.image.startsWith('https://')) && !article.image.includes('/uploads/')) {
        setImageMode('url');
      }
    } else {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setForm((f) => ({ ...f, publishedAt: formattedDate }));
    }
  }, [article]);

  const set = (key: string, value: string | boolean | string[]) => setForm((f) => ({ ...f, [key]: value }));

  const handleCategoryChange = (cat: 'rituals' | 'ingredients' | 'skin-health' | 'culture') => {
    const labels: Record<string, { fr: string; en: string }> = {
      culture: { fr: 'Culture & Savoir-Faire', en: 'Culture & Craft' },
      'skin-health': { fr: 'Santé de la Peau', en: 'Skin Health' },
      ingredients: { fr: 'Ingrédients Purs', en: 'Pure Ingredients' },
      rituals: { fr: 'Rituels de Bain', en: 'Bath Rituals' },
    };
    setForm((f) => ({
      ...f,
      category: cat,
      categoryLabel: labels[cat].fr,
      categoryLabelEn: labels[cat].en,
    }));
  };

  const handleTitleChange = (val: string) => {
    setForm((f) => ({
      ...f,
      title: val,
      slug: !isEdit ? generateSlug(val) : f.slug,
    }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

    const file = files[0];
    const res = await uploadProductImage(file);
    if (res.success && res.url) {
      setForm((f) => ({ ...f, image: res.url! }));
    } else {
      setUploadError(res.error || 'Erreur lors du téléversement de la photo.');
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleRelatedProduct = (prodId: string) => {
    setForm((f) => {
      const exists = f.relatedProductIds.includes(prodId);
      const updated = exists
        ? f.relatedProductIds.filter((id) => id !== prodId)
        : [...f.relatedProductIds, prodId];
      return { ...f, relatedProductIds: updated };
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Le titre est obligatoire';
    if (!form.excerpt.trim()) e.excerpt = "L'extrait est obligatoire";
    if (!form.content.trim()) e.content = 'Le contenu de l\'article est obligatoire';
    if (!form.image.trim()) e.image = "L'image de couverture est requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedArticle: Article = {
      id: article?.id || form.slug || `article-${Date.now().toString(36)}`,
      slug: String(form.slug || '').trim() || generateSlug(form.title),
      title: String(form.title || '').trim(),
      titleEn: String(form.titleEn || '').trim() || undefined,
      excerpt: String(form.excerpt || '').trim(),
      excerptEn: String(form.excerptEn || '').trim() || undefined,
      content: String(form.content || '').trim(),
      contentEn: String(form.contentEn || '').trim() || undefined,
      category: form.category,
      categoryLabel: form.categoryLabel,
      categoryLabelEn: form.categoryLabelEn || undefined,
      author: String(form.author || '').trim() || 'Karene Bella',
      authorRole: String(form.authorRole || '').trim() || 'Fondatrice & Formulatrice Botanique',
      authorAvatar: String(form.authorAvatar || '').trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      publishedAt: String(form.publishedAt || '').trim() || new Date().toLocaleDateString('fr-FR'),
      readTime: String(form.readTime || '').trim() || '4 min de lecture',
      readTimeEn: String(form.readTimeEn || '').trim() || '4 min read',
      image: String(form.image || '').trim(),
      tags: String(form.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      relatedProductIds: form.relatedProductIds,
    };

    setIsSaving(true);
    try {
      if (isEdit) {
        await updateArticle(savedArticle);
      } else {
        await addArticle(savedArticle);
      }
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const inputCls = (field?: string) =>
    `w-full bg-[#2a3529] border ${field && errors[field] ? 'border-red-500' : 'border-[#3d4f3c]'} text-white placeholder-[#6a7d69] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#bb0a4a] transition-colors text-sm`;

  const labelCls = 'block text-[#9aad98] text-xs font-semibold uppercase tracking-wider mb-1.5';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#151e15] border border-[#2d3d2c] rounded-2xl w-full max-w-3xl my-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2d3d2c]">
          <div>
            <h2 className="text-white font-bold text-xl">
              {isEdit ? "Modifier l'article" : 'Rédiger un nouvel article'}
            </h2>
            <p className="text-[#6a7d69] text-sm mt-0.5">
              {isEdit ? `Édition de "${article?.title}"` : 'Publication dans le Journal & Conseils Botaniques'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6a7d69] hover:text-white hover:bg-[#2a3529] rounded-xl transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ─── IMAGE DE COUVERTURE : MACHINE OU LIEN WEB ─────────────── */}
          <section className="bg-[#1c261c] p-4 rounded-xl border border-[#2d3d2c] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">image</span> Image de couverture *
              </h3>

              {/* Sélecteur de méthode d'importation */}
              <div className="flex items-center bg-[#151e15] p-1 rounded-xl border border-[#3d4f3c]">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-[#bb0a4a] text-white shadow-xs'
                      : 'text-[#9aad98] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  <span>Depuis ma machine</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    imageMode === 'url'
                      ? 'bg-[#bb0a4a] text-white shadow-xs'
                      : 'text-[#9aad98] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">link</span>
                  <span>Depuis un lien URL</span>
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />

            {/* Mode 1: Import depuis la machine */}
            {imageMode === 'upload' && (
              <div>
                {form.image ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-[#3d4f3c] bg-black">
                    <img src={form.image} alt="Couverture" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#bb0a4a] hover:bg-[#99073b] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span className="material-symbols-outlined text-[16px]">change_circle</span>
                        Remplacer l'image
                      </button>
                      <button
                        type="button"
                        onClick={() => set('image', '')}
                        className="bg-black/80 hover:bg-red-900 text-red-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        Supprimer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#3d4f3c] hover:border-[#bb0a4a] bg-[#151e15] hover:bg-[#202c1f] rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-3 text-amber-400">
                        <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                        <span className="text-sm font-semibold">Téléversement de la photo locale...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-[#bb0a4a]/15 group-hover:bg-[#bb0a4a]/25 text-[#bb0a4a] flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                        </div>
                        <span className="text-sm font-bold text-white">
                          Cliquez pour sélectionner une photo sur votre ordinateur
                        </span>
                        <span className="text-xs text-[#6a7d69]">
                          Formats acceptés : PNG, JPG, WEBP, AVIF (Stockage automatique sur le serveur)
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Entrée d'URL d'image */}
            {imageMode === 'url' && (
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Lien URL direct de l'image</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => set('image', e.target.value)}
                      placeholder="https://images.unsplash.com/... ou https://exemple.com/photo.jpg"
                      className="w-full bg-[#2a3529] border border-[#3d4f3c] text-white text-xs rounded-xl px-4 py-2.5 pl-10 placeholder-[#6a7d69] focus:outline-none focus:border-[#bb0a4a]"
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#6a7d69] text-[18px]">
                      link
                    </span>
                  </div>
                </div>

                {form.image && (
                  <div className="rounded-xl overflow-hidden aspect-[16/9] border border-[#3d4f3c] bg-black max-w-md mx-auto relative">
                    <img
                      src={form.image}
                      alt="Aperçu URL"
                      className="w-full h-full object-cover"
                      onError={() => setUploadError("Impossible de charger l'image depuis cette URL.")}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-1 rounded text-[10px] text-white font-mono">
                      Aperçu URL
                    </div>
                  </div>
                )}
              </div>
            )}

            {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
            {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
          </section>

          {/* ─── TITRE & CATÉGORIE ─────────────────────────────────────── */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Titre de l'article (FR) *</label>
                <input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ex: Les bienfaits du Savon Noir Brut"
                  className={inputCls('title')}
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className={labelCls}>Titre de l'article (EN - Optionnel)</label>
                <input
                  value={form.titleEn}
                  onChange={(e) => set('titleEn', e.target.value)}
                  placeholder="ex: Benefits of Raw African Black Soap"
                  className={inputCls()}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Catégorie Thématique</label>
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value as any)}
                  className={inputCls()}
                >
                  <option value="culture">🏺 Culture & Savoir-Faire</option>
                  <option value="skin-health">🌿 Santé de la Peau</option>
                  <option value="ingredients">🍃 Ingrédients Purs</option>
                  <option value="rituals">✨ Rituels de Bain</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Temps de lecture estimé</label>
                <input
                  value={form.readTime}
                  onChange={(e) => set('readTime', e.target.value)}
                  placeholder="ex: 4 min de lecture"
                  className={inputCls()}
                />
              </div>
            </div>
          </section>

          {/* ─── EXTRAIT / RÉSUMÉ D'ACCROCHE ──────────────────────────── */}
          <section className="space-y-4">
            <div>
              <label className={labelCls}>Extrait / Résumé d'accroche (FR) *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                rows={2}
                placeholder="Court résumé affiché dans les cartes d'articles et sur la page d'accueil..."
                className={inputCls('excerpt')}
              />
              {errors.excerpt && <p className="text-red-400 text-xs mt-1">{errors.excerpt}</p>}
            </div>
            <div>
              <label className={labelCls}>Extrait d'accroche (EN - Optionnel)</label>
              <textarea
                value={form.excerptEn}
                onChange={(e) => set('excerptEn', e.target.value)}
                rows={2}
                placeholder="Short excerpt in English for international readers..."
                className={inputCls()}
              />
            </div>
          </section>

          {/* ─── CONTENU RICHE AVEC CKEDITOR ───────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={labelCls}>
                Contenu de l'article (Éditeur Riche CKEditor) *
              </label>

              {/* Onglets langue FR / EN pour le contenu */}
              <div className="flex items-center bg-[#1c261c] p-1 rounded-xl border border-[#2d3d2c]">
                <button
                  type="button"
                  onClick={() => setContentLang('fr')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    contentLang === 'fr'
                      ? 'bg-[#bb0a4a] text-white shadow-xs'
                      : 'text-[#9aad98] hover:text-white'
                  }`}
                >
                  🇫🇷 Français
                </button>
                <button
                  type="button"
                  onClick={() => setContentLang('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    contentLang === 'en'
                      ? 'bg-[#bb0a4a] text-white shadow-xs'
                      : 'text-[#9aad98] hover:text-white'
                  }`}
                >
                  🇬🇧 Anglais
                </button>
              </div>
            </div>

            {contentLang === 'fr' ? (
              <div>
                <CKEditorComponent
                  id="ckeditor-article-content-fr"
                  value={form.content}
                  onChange={(html) => set('content', html)}
                  placeholder="Rédigez ici le corps de votre article avec titres, listes, citations et mise en forme..."
                />
                {errors.content && <p className="text-red-400 text-xs mt-1.5">{errors.content}</p>}
              </div>
            ) : (
              <div>
                <CKEditorComponent
                  id="ckeditor-article-content-en"
                  value={form.contentEn}
                  onChange={(html) => set('contentEn', html)}
                  placeholder="Write the full article content in English here..."
                />
              </div>
            )}
          </section>

          {/* ─── AUTEUR & INFORMATIONS ─────────────────────────────────── */}
          <section className="bg-[#1c261c] p-4 rounded-xl border border-[#2d3d2c]">
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">person</span> Auteur & Publication
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Nom de l'auteur</label>
                <input
                  value={form.author}
                  onChange={(e) => set('author', e.target.value)}
                  placeholder="Karene Bella"
                  className={inputCls()}
                />
              </div>
              <div>
                <label className={labelCls}>Rôle / Titre de l'auteur</label>
                <input
                  value={form.authorRole}
                  onChange={(e) => set('authorRole', e.target.value)}
                  placeholder="Fondatrice & Formulatrice"
                  className={inputCls()}
                />
              </div>
              <div>
                <label className={labelCls}>Date de publication</label>
                <input
                  value={form.publishedAt}
                  onChange={(e) => set('publishedAt', e.target.value)}
                  placeholder="22 Août 2026"
                  className={inputCls()}
                />
              </div>
            </div>
          </section>

          {/* ─── SOINS ASSOCIÉS AU RITUEL ─────────────────────────────── */}
          <section className="bg-[#1c261c] p-4 rounded-xl border border-[#2d3d2c]">
            <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span> Soins recommandés dans cet article
            </h3>
            <p className="text-xs text-[#9aad98] mb-3">
              Cochez les produits du catalogue à afficher en pied d'article pour convertir les lecteurs en acheteurs :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {allProducts.map((prod) => {
                const isSelected = form.relatedProductIds.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => toggleRelatedProduct(prod.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#263825] border-emerald-500 text-white'
                        : 'bg-[#2a3529] border-[#3d4f3c] text-[#9aad98] hover:border-[#bb0a4a]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="accent-[#bb0a4a] rounded"
                    />
                    <img
                      src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80'}
                      alt={prod.name}
                      className="w-8 h-8 rounded-md object-cover"
                    />
                    <div className="truncate text-xs font-medium">{prod.name}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── TAGS & MISE À LA UNE ──────────────────────────────────── */}
          <section className="space-y-4">
            <div>
              <label className={labelCls}>Tags & Mots-clés (séparés par des virgules)</label>
              <input
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="Savon Noir, Saponification, Eczéma, Karité"
                className={inputCls()}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="article-featured-check"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 accent-[#bb0a4a] rounded cursor-pointer"
              />
              <label htmlFor="article-featured-check" className="text-white text-xs font-semibold cursor-pointer">
                Mettre cet article à la Une (Grand format en tête du Journal)
              </label>
            </div>
          </section>

          {/* ─── ACTIONS ───────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-4 border-t border-[#2d3d2c]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isUploading}
              className="flex-1 px-4 py-3 rounded-xl border border-[#3d4f3c] text-[#9aad98] hover:text-white hover:border-[#bb0a4a] transition-all font-medium cursor-pointer disabled:opacity-40"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="flex-1 px-4 py-3 rounded-xl bg-[#bb0a4a] hover:bg-[#b7003a] text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#bb0a4a]/30 active:scale-[0.98] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Enregistrement en base...</span>
                </>
              ) : isEdit ? (
                '✓ Enregistrer les modifications'
              ) : (
                '+ Publier l\'article'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
