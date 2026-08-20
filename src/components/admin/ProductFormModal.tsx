import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useAdmin } from '../../context/AdminContext';

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
  const { addProduct, updateProduct } = useAdmin();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    category: 'soaps' as Category,
    price: '',
    rating: '5.0',
    reviewCount: '0',
    description: '',
    longDescription: '',
    weight: '',
    surgrasPercentage: '',
    scentProfile: '',
    usageTips: '',
    shippingInfo: '',
    aspectRatio: 'square' as AspectRatio,
    featured: false,
    images: [''],
    tags: '',
  });

  const [ingredients, setIngredients] = useState<IngredientForm[]>([{ ...EMPTY_INGREDIENT }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        tagline: product.tagline,
        category: product.category,
        price: String(product.price),
        rating: String(product.rating),
        reviewCount: String(product.reviewCount),
        description: product.description,
        longDescription: product.longDescription,
        weight: product.weight || '',
        surgrasPercentage: product.surgrasPercentage || '',
        scentProfile: product.scentProfile || '',
        usageTips: product.usageTips || '',
        shippingInfo: product.shippingInfo || '',
        aspectRatio: product.aspectRatio || 'square',
        featured: product.featured || false,
        images: product.images.length > 0 ? product.images : [''],
        tags: product.tags.join(', '),
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const saved: Product = {
      id: product?.id || generateId(form.name),
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      category: form.category,
      price: parseFloat(form.price),
      rating: parseFloat(form.rating) || 5.0,
      reviewCount: parseInt(form.reviewCount) || 0,
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      weight: form.weight.trim() || undefined,
      surgrasPercentage: form.surgrasPercentage.trim() || undefined,
      scentProfile: form.scentProfile.trim() || undefined,
      usageTips: form.usageTips.trim() || undefined,
      shippingInfo: form.shippingInfo.trim() || undefined,
      aspectRatio: form.aspectRatio,
      featured: form.featured,
      images: form.images.filter(img => img.trim() !== ''),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: ingredients.filter(i => i.name.trim() !== ''),
    };

    if (isEdit) {
      updateProduct(saved);
    } else {
      addProduct(saved);
    }
    onClose();
  };

  const addImage = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImage = (idx: number) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  const setImage = (idx: number, val: string) => setForm(f => ({ ...f, images: f.images.map((img, i) => i === idx ? val : img) }));

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
          <button onClick={onClose} className="p-2 text-[#6a7d69] hover:text-white hover:bg-[#2a3529] rounded-xl transition-all">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Infos de base */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span> Informations de base
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Nom du produit *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Savon Lavande & Olive" className={inputCls('name')} />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Tagline</label>
                <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Ex: Apaisant & Nourrissant" className={inputCls()} />
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
                <label className={labelCls}>Prix (€) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="24.00" className={inputCls('price')} />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className={labelCls}>Poids / Volume</label>
                <input value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="120g" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Tags (séparés par virgules)</label>
                <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Apaisant, Naturel, Surgras 8%" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Note (0-5)</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Nombre d'avis</label>
                <input type="number" min="0" value={form.reviewCount} onChange={e => set('reviewCount', e.target.value)} className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Format image</label>
                <select value={form.aspectRatio} onChange={e => set('aspectRatio', e.target.value)} className={inputCls()}>
                  <option value="square">Carré</option>
                  <option value="portrait">Portrait</option>
                  <option value="tall">Tall</option>
                </select>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => set('featured', !form.featured)}
                  className={`w-12 h-6 rounded-full transition-all duration-200 relative ${form.featured ? 'bg-[#bb0a4a]' : 'bg-[#3d4f3c]'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${form.featured ? 'left-7' : 'left-1'}`} />
                </button>
                <label className="text-[#9aad98] text-sm cursor-pointer" onClick={() => set('featured', !form.featured)}>
                  Produit en vedette (affiché sur la page d'accueil)
                </label>
              </div>
            </div>
          </section>

          {/* Descriptions */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">article</span> Descriptions
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Description courte *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Description affichée dans les cartes produit..." className={inputCls('description')} />
                {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className={labelCls}>Description longue</label>
                <textarea value={form.longDescription} onChange={e => set('longDescription', e.target.value)} rows={4} placeholder="Description détaillée sur la page produit..." className={inputCls()} />
              </div>
            </div>
          </section>

          {/* Détails produit */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">science</span> Détails produit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Surgras %</label>
                <input value={form.surgrasPercentage} onChange={e => set('surgrasPercentage', e.target.value)} placeholder="8%" className={inputCls()} />
              </div>
              <div>
                <label className={labelCls}>Profil olfactif</label>
                <input value={form.scentProfile} onChange={e => set('scentProfile', e.target.value)} placeholder="Floral, boisé, herbacé..." className={inputCls()} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Conseils d'utilisation</label>
                <textarea value={form.usageTips} onChange={e => set('usageTips', e.target.value)} rows={2} className={inputCls()} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Informations de livraison</label>
                <textarea value={form.shippingInfo} onChange={e => set('shippingInfo', e.target.value)} rows={2} className={inputCls()} />
              </div>
            </div>
          </section>

          {/* Images */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">image</span> Images (URLs)
            </h3>
            <div className="space-y-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={img}
                    onChange={e => setImage(idx, e.target.value)}
                    placeholder={`URL image ${idx + 1}...`}
                    className={`${inputCls()} flex-1`}
                  />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => removeImage(idx)} className="p-2.5 text-[#6a7d69] hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all">
                      <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImage} className="flex items-center gap-2 text-[#bb0a4a] hover:text-[#9aad98] text-sm transition-colors mt-1">
                <span className="material-symbols-outlined text-[16px]">add_circle</span> Ajouter une image
              </button>
            </div>
          </section>

          {/* Ingrédients */}
          <section>
            <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">eco</span> Ingrédients clés
            </h3>
            <div className="space-y-4">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="bg-[#1e2a1e] rounded-xl p-4 border border-[#2d3d2c] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9aad98] text-xs font-semibold uppercase tracking-wider">Ingrédient {idx + 1}</span>
                    {ingredients.length > 1 && (
                      <button type="button" onClick={() => removeIngredient(idx)} className="text-[#6a7d69] hover:text-red-400 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                  <input
                    value={ing.name}
                    onChange={e => setIngredient(idx, 'name', e.target.value)}
                    placeholder="Nom de l'ingrédient"
                    className={inputCls()}
                  />
                  <input
                    value={ing.description}
                    onChange={e => setIngredient(idx, 'description', e.target.value)}
                    placeholder="Description des bienfaits..."
                    className={inputCls()}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input value={ing.icon} onChange={e => setIngredient(idx, 'icon', e.target.value)} placeholder="Icône (ex: spa)" className={inputCls()} />
                    <input value={ing.bgClass} onChange={e => setIngredient(idx, 'bgClass', e.target.value)} placeholder="bg-[#d4e8d0]" className={inputCls()} />
                    <input value={ing.iconClass} onChange={e => setIngredient(idx, 'iconClass', e.target.value)} placeholder="text-[#bb0a4a]" className={inputCls()} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addIngredient} className="flex items-center gap-2 text-[#bb0a4a] hover:text-[#9aad98] text-sm transition-colors">
                <span className="material-symbols-outlined text-[16px]">add_circle</span> Ajouter un ingrédient
              </button>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-[#2d3d2c]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-[#3d4f3c] text-[#9aad98] hover:text-white hover:border-[#bb0a4a] transition-all font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-[#bb0a4a] hover:bg-[#5e7461] text-white font-semibold transition-all hover:shadow-lg hover:shadow-[#bb0a4a]/30 active:scale-[0.98]"
            >
              {isEdit ? '✓ Enregistrer les modifications' : '+ Ajouter le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
