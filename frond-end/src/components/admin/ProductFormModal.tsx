import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { uploadProductImage } from '../../lib/api';
import { CKEditorComponent } from './CKEditorComponent';
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from '../../lib/currency';

interface Props {
  product: Product | null;
  onClose: () => void;
}

type Category = 'soaps' | 'oils' | 'rituals' | 'accessories';
type AspectRatio = 'square' | 'portrait' | 'tall';

interface IngredientForm {
  name: string;
  description: string;
  icon: string;
  bgClass: string;
  iconClass: string;
}

const EMPTY_INGREDIENT: IngredientForm = {
  name: '',
  description: '',
  icon: 'spa',
  bgClass: 'bg-[#d4e8d0]',
  iconClass: 'text-[#bb0a4a]',
};

function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
}

export default function ProductFormModal({ product, onClose }: Props) {
  const { addProduct, updateProduct, siteSettings } = useAdmin();
  const activeCurrency = (siteSettings?.currency || 'EUR').trim().toUpperCase() || 'EUR';
  const currencyInfo = SUPPORTED_CURRENCIES[activeCurrency] || {
    code: activeCurrency,
    symbol: getCurrencySymbol(activeCurrency),
    label: activeCurrency,
  };
  const isEdit = !!product;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [descLang, setDescLang] = useState<'fr' | 'en'>('fr');

  const [form, setForm] = useState({
    name: '',
    nameEn: '',
    tagline: '',
    taglineEn: '',
    category: 'soaps' as Category,
    price: '',
    rating: '5.0',
    reviewCount: '0',
    description: '',
    descriptionEn: '',
    longDescription: '',
    longDescriptionEn: '',
    weight: '',
    surgrasPercentage: '',
    scentProfile: '',
    usageTips: '',
    shippingInfo: '',
    aspectRatio: 'square' as AspectRatio,
    featured: false,
    images: [] as string[],
    tags: '',
    
    // Stocks & Seuil (Phase 2)
    stock: '20',
    lowStockThreshold: '5',
    
    // Conformité GPSR / Cosmétique UE
    inci: '',
    originCountry: 'France / Provence',
    responsiblePerson: 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    batchNumber: 'LOT-2026-ND01',
    pao: '18M',
  });

  const [ingredients, setIngredients] = useState<IngredientForm[]>([{ ...EMPTY_INGREDIENT }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        nameEn: product.nameEn || '',
        tagline: product.tagline,
        taglineEn: product.taglineEn || '',
        category: product.category,
        price: String(product.price),
        rating: String(product.rating),
        reviewCount: String(product.reviewCount),
        description: product.description,
        descriptionEn: product.descriptionEn || '',
        longDescription: product.longDescription,
        weight: product.weight || '',
        surgrasPercentage: product.surgrasPercentage || '',
        scentProfile: product.scentProfile || '',
        usageTips: product.usageTips || '',
        shippingInfo: product.shippingInfo || '',
        aspectRatio: product.aspectRatio || 'square',
        featured: product.featured || false,
        images: product.images || [],
        tags: product.tags.join(', '),
        stock: String(product.stock ?? 20),
        lowStockThreshold: String(product.lowStockThreshold ?? 5),
        inci: product.inci || '',
        originCountry: product.originCountry || 'France / Provence',
        responsiblePerson: product.responsiblePerson || 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
        batchNumber: product.batchNumber || 'LOT-2026-ND01',
        pao: product.pao || '18M',
      });
      setIngredients(product.ingredients.length > 0 ? product.ingredients : [{ ...EMPTY_INGREDIENT }]);
    }
  }, [product]);

  const set = (key: string, value: string | boolean) => setForm(f => ({ ...f, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Le nom est requis';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Prix invalide';
    if (!form.description.trim()) e.description = 'La description est requise';
    if (isNaN(Number(form.stock))) e.stock = 'Stock invalide';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadProductImage(file);
      if (res.success && res.url) {
        uploadedUrls.push(res.url);
      } else {
        setUploadError(res.error || `Erreur d'importation pour ${file.name}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddManualUrl = () => {
    if (manualUrl.trim()) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, manualUrl.trim()],
      }));
      setManualUrl('');
    }
  };

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const setMainImage = (idx: number) => {
    if (idx === 0) return;
    setForm(f => {
      const newImages = [...f.images];
      const [chosen] = newImages.splice(idx, 1);
      return { ...f, images: [chosen, ...newImages] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalImages = form.images.length > 0
      ? form.images
      : ['https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=80'];

    const saved: Product = {
      id: product?.id || generateId(form.name),
      name: String(form.name || '').trim(),
      nameEn: String(form.nameEn || '').trim() || undefined,
      tagline: String(form.tagline || '').trim(),
      taglineEn: String(form.taglineEn || '').trim() || undefined,
      category: form.category,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating) || 5.0,
      reviewCount: parseInt(form.reviewCount) || 0,
      description: String(form.description || '').trim(),
      descriptionEn: String(form.descriptionEn || '').trim() || undefined,
      longDescription: String(form.longDescription || '').trim(),
      longDescriptionEn: String(form.longDescriptionEn || '').trim() || undefined,
      weight: String(form.weight || '').trim() || undefined,
      surgrasPercentage: String(form.surgrasPercentage || '').trim() || undefined,
      scentProfile: String(form.scentProfile || '').trim() || undefined,
      usageTips: String(form.usageTips || '').trim() || undefined,
      shippingInfo: String(form.shippingInfo || '').trim() || undefined,
      aspectRatio: form.aspectRatio,
      featured: form.featured,
      images: finalImages,
      tags: String(form.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      ingredients: ingredients.filter(i => String(i.name || '').trim() !== ''),

      // Stock & GPSR
      stock: parseInt(form.stock, 10) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 5,
      inci: String(form.inci || '').trim() || 'Composition 100% naturelle.',
      originCountry: String(form.originCountry || '').trim() || 'France / Provence',
      responsiblePerson: String(form.responsiblePerson || '').trim() || 'Ndolo Rituals SARL',
      batchNumber: String(form.batchNumber || '').trim() || undefined,
      pao: String(form.pao || '').trim() || '18M',
    };

    setIsSaving(true);
    try {
      if (isEdit) {
        await updateProduct(saved);
      } else {
        await addProduct(saved);
      }
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const addIngredient = () => setIngredients(prev => [...prev, { ...EMPTY_INGREDIENT }]);
  const removeIngredient = (idx: number) => setIngredients(prev => prev.filter((_, i) => i !== idx));
  const setIngredient = (idx: number, key: keyof IngredientForm, val: string) =>
    setIngredients(prev => prev.map((ing, i) => i === idx ? { ...ing, [key]: val } : ing));

  const inputCls = (field?: string) =>
    `w-full bg-[#2a3529] border ${field && errors[field] ? 'border-red-500' : 'border-[#3d4f3c]'} text-white placeholder-[#6a7d69] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#bb0a4a] transition-colors text-sm`;

  const labelCls = 'block text-[#9aad98] text-xs font-semibold uppercase tracking-wider mb-1.5';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#151e15] border border-[#2d3d2c] rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2d3d2c]">
          <div>
            <h2 className="text-white font-bold text-xl">
              {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
            </h2>
            <p className="text-[#6a7d69] text-sm mt-0.5">{isEdit ? `Édition de "${product?.name}"` : 'Nouveau produit dans la boutique'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#6a7d69] hover:text-white hover:bg-[#2a3529] rounded-xl transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photos du Produit (Téléversement depuis l'ordinateur) */}
          <section className="bg-[#1c261c] p-4 rounded-xl border border-[#2d3d2c]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                Photos du produit ({form.images.length})
              </h3>
              <span className="text-[11px] text-[#9aad98]">JPG, PNG, WEBP (Max 5 Mo)</span>
            </div>

            {/* Input fichier caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            {/* Zone de téléversement (Drag / Click) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#3d4f3c] hover:border-[#bb0a4a] bg-[#151e15] hover:bg-[#202c1f] rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
            >
              {isUploading ? (
                <div className="flex items-center gap-3 py-2 text-amber-400">
                  <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                  <span className="text-sm font-semibold">Téléversement de l'image sur le serveur...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#bb0a4a]/10 group-hover:bg-[#bb0a4a]/20 text-[#bb0a4a] flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-2xl">upload_file</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">
                      Cliquez pour importer des photos depuis votre appareil
                    </span>
                    <span className="text-xs text-[#6a7d69]">
                      Les photos sont automatiquement sauvegardées sur le serveur
                    </span>
                  </div>
                </>
              )}
            </div>

            {uploadError && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {uploadError}
              </p>
            )}

            {/* Galerie des photos importées */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {form.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-[#3d4f3c] bg-[#111a11] aspect-square flex items-center justify-center"
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badge photo principale */}
                    {idx === 0 ? (
                      <span className="absolute top-1.5 left-1.5 bg-[#bb0a4a] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                        Principale
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setMainImage(idx)}
                        title="Définir comme photo principale"
                        className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-[#bb0a4a] text-white text-[9px] uppercase px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        Mettre en 1er
                      </button>
                    )}

                    {/* Bouton supprimer */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      title="Supprimer cette photo"
                      className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-md transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Option URL manuelle */}
            <div className="mt-3 pt-3 border-t border-[#2d3d2c]/60 flex gap-2">
              <input
                type="text"
                placeholder="Ou collez une URL d'image externe..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 bg-[#2a3529] border border-[#3d4f3c] text-white placeholder-[#6a7d69] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#bb0a4a]"
              />
              <button
                type="button"
                onClick={handleAddManualUrl}
                disabled={!manualUrl.trim()}
                className="px-3 py-1.5 bg-[#3d4f3c] hover:bg-[#bb0a4a] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
              >
                Ajouter URL
              </button>
            </div>
          </section>

          {/* Infos de base */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span> Informations générales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nom du produit (FR) *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="ex: Savon Lavande & Olive" className={inputCls('name')} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Nom du produit (EN)</label>
                <input value={form.nameEn} onChange={e => set('nameEn', e.target.value)} placeholder="ex: Lavender & Olive Soap" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Accroche / Slogan (FR)</label>
                <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="ex: Apaisant & Nourrissant" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Accroche / Slogan (EN)</label>
                <input value={form.taglineEn} onChange={e => set('taglineEn', e.target.value)} placeholder="ex: Soothing & Deeply Nourishing" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Catégorie</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls()}>
                  <option value="soaps">🧼 Savons</option>
                  <option value="oils">🫙 Huiles</option>
                  <option value="rituals">✨ Rituels</option>
                  <option value="accessories">🪴 Accessoires</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>
                  Prix ({currencyInfo.symbol} — {currencyInfo.code}) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    placeholder="24.00"
                    className={`${inputCls('price')} pr-14`}
                  />
                  <span className="absolute right-3 px-2 py-0.5 rounded-md bg-[#1d271d] border border-[#3d4f3c] text-xs font-bold text-emerald-400">
                    {currencyInfo.symbol}
                  </span>
                </div>
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
                <p className="text-[#6a7d69] text-[11px] mt-1">
                  Devise active configurée dans les réglages : <strong className="text-[#9aad98]">{currencyInfo.label}</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Gestion des Stocks (Phase 2) */}
          <section className="bg-[#1c261c] p-4 rounded-xl border border-[#2d3d2c]">
            <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">inventory</span> Gestion des Stocks (Temps Réel)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Quantité en stock *</label>
                <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="20" className={inputCls('stock')} />
                {errors.stock && <p className="text-red-400 text-xs mt-1">{errors.stock}</p>}
              </div>
              <div>
                <label className={labelCls}>Seuil d'alerte stock bas</label>
                <input type="number" min="1" value={form.lowStockThreshold} onChange={e => set('lowStockThreshold', e.target.value)} placeholder="5" className={inputCls()} />
                <p className="text-[#6a7d69] text-[11px] mt-1">Affiche un badge d'urgence si stock ≤ seuil.</p>
              </div>
            </div>
          </section>

          {/* Conformité GPSR & Cosmétique UE (Phase 2) */}
          <section className="bg-[#1c261c] p-4 rounded-xl border border-[#2d3d2c]">
            <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">verified</span> Conformité GPSR & Réglementation UE
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Liste INCI Complète (Ingrédients normalisés)</label>
                <textarea
                  value={form.inci}
                  onChange={e => set('inci', e.target.value)}
                  rows={2}
                  placeholder="Sodium Olivate, Sodium Cocoate, Aqua, Glycerin, Lavandula Angustifolia Oil, Linalool*..."
                  className={inputCls()}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Pays de fabrication / Origine</label>
                  <input value={form.originCountry} onChange={e => set('originCountry', e.target.value)} placeholder="France / Provence" className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls}>Numéro de lot</label>
                  <input value={form.batchNumber} onChange={e => set('batchNumber', e.target.value)} placeholder="LOT-2026-ND01" className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls}>Personne Responsable UE</label>
                  <input value={form.responsiblePerson} onChange={e => set('responsiblePerson', e.target.value)} placeholder="Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix..." className={inputCls()} />
                </div>
                <div>
                  <label className={labelCls}>PAO (Période Après Ouverture)</label>
                  <input value={form.pao} onChange={e => set('pao', e.target.value)} placeholder="18M" className={inputCls()} />
                </div>
              </div>
            </div>
          </section>

          {/* Descriptions */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">article</span> Textes & Descriptions
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Description courte (FR) *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Description affichée dans les cartes produit..." className={inputCls('description')} />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className={labelCls}>Description courte (EN)</label>
                <textarea value={form.descriptionEn} onChange={e => set('descriptionEn', e.target.value)} rows={2} placeholder="Product card description in English..." className={inputCls()} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls}>
                    Description détaillée & vertus (Éditeur Riche CKEditor)
                  </label>

                  {/* Onglets langue FR / EN */}
                  <div className="flex items-center bg-[#1c261c] p-1 rounded-xl border border-[#2d3d2c]">
                    <button
                      type="button"
                      onClick={() => setDescLang('fr')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        descLang === 'fr'
                          ? 'bg-[#bb0a4a] text-white shadow-xs'
                          : 'text-[#9aad98] hover:text-white'
                      }`}
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescLang('en')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        descLang === 'en'
                          ? 'bg-[#bb0a4a] text-white shadow-xs'
                          : 'text-[#9aad98] hover:text-white'
                      }`}
                    >
                      🇬🇧 Anglais
                    </button>
                  </div>
                </div>

                {descLang === 'fr' ? (
                  <CKEditorComponent
                    id="ckeditor-product-long-desc-fr"
                    value={form.longDescription}
                    onChange={(html) => set('longDescription', html)}
                    placeholder="Rédigez la description complète et les bienfaits du soin (titres, listes, paragraphes, citations)..."
                  />
                ) : (
                  <CKEditorComponent
                    id="ckeditor-product-long-desc-en"
                    value={form.longDescriptionEn}
                    onChange={(html) => set('longDescriptionEn', html)}
                    placeholder="Write the full rich description in English..."
                  />
                )}
              </div>
            </div>
          </section>

          {/* Ingrédients clés visuels */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">spa</span> Ingrédients clés visuels
              </h3>
              <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-xs text-[#9aad98] hover:text-white bg-[#2a3529] px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[14px]">add</span> Ajouter un ingrédient
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="bg-[#1c261c] p-3 rounded-xl border border-[#2d3d2c] flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    value={ing.name}
                    onChange={e => setIngredient(idx, 'name', e.target.value)}
                    placeholder="Nom de l'ingrédient"
                    className="w-full sm:w-1/3 bg-[#2a3529] border border-[#3d4f3c] text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#bb0a4a]"
                  />
                  <input
                    value={ing.description}
                    onChange={e => setIngredient(idx, 'description', e.target.value)}
                    placeholder="Bienfaits & Vertus"
                    className="w-full sm:flex-1 bg-[#2a3529] border border-[#3d4f3c] text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#bb0a4a]"
                  />
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(idx)} className="text-red-400 hover:text-red-300 p-1 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Propriétés complémentaires */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">tune</span> Caractéristiques
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Poids (ex: 120g)</label>
                <input value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="120g" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Surgras (ex: 8%)</label>
                <input value={form.surgrasPercentage} onChange={e => set('surgrasPercentage', e.target.value)} placeholder="8%" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Profil Olfactif</label>
                <input value={form.scentProfile} onChange={e => set('scentProfile', e.target.value)} placeholder="Floral, boisé..." className={inputCls()} />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Tags (séparés par des virgules)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Apaisant, Nourrissant, Surgras 8%" className={inputCls()} />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="featured-check"
                checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-[#bb0a4a] rounded cursor-pointer"
              />
              <label htmlFor="featured-check" className="text-white text-xs font-semibold cursor-pointer">
                Mettre en avant sur la page d'accueil (Produit Vedette)
              </label>
            </div>
          </section>

          {/* Actions */}
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
                  <span>Enregistrement sur le serveur...</span>
                </>
              ) : (
                isEdit ? '✓ Enregistrer les modifications' : '+ Enregistrer le produit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
