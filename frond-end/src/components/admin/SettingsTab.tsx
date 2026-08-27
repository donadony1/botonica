import React, { useState, useRef } from 'react';
import { SiteSettings } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import { uploadProductImage, normalizeImageUrl } from '../../lib/api';
import { SUPPORTED_CURRENCIES } from '../../lib/currency';

export default function SettingsTab() {
  const { siteSettings, updateSettings } = useAdmin();
  const [form, setForm] = useState<SiteSettings>({ ...siteSettings });
  const [saved, setSaved] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setLogoError('Veuillez sélectionner un fichier image valide (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoError('L\'image du logo ne doit pas dépasser 5 Mo.');
      return;
    }

    setIsUploadingLogo(true);
    setLogoError(null);

    try {
      const res = await uploadProductImage(file);
      if (res.success && res.url) {
        set('logoUrl', res.url);
      } else {
        setLogoError(res.error || 'Erreur lors du téléversement du logo.');
      }
    } catch {
      setLogoError('Erreur de connexion au serveur.');
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const inputCls = 'w-full bg-[#2a3529] border border-[#3d4f3c] text-white placeholder-[#6a7d69] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#bb0a4a] transition-colors text-sm';
  const labelCls = 'block text-[#9aad98] text-xs font-semibold uppercase tracking-wider mb-1.5';
  const sectionTitle = (icon: string, title: string) => (
    <h3 className="text-[#bb0a4a] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 mt-2">
      <span className="material-symbols-outlined text-[18px]">{icon}</span> {title}
    </h3>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151e15] border border-[#2d3d2c] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#bb0a4a] text-[26px]">tune</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">Réglages du site</h2>
          </div>
          <p className="text-[#9aad98] text-xs sm:text-sm">
            Personnalisez l'identité, le logo, la devise et les informations affichées sur votre boutique.
          </p>
        </div>
        <button
          type="submit"
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 cursor-pointer shrink-0 ${
            saved
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
              : 'bg-[#bb0a4a] hover:bg-[#a0083e] text-white shadow-lg shadow-[#bb0a4a]/25'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{saved ? 'check_circle' : 'save'}</span>
          {saved ? 'Enregistré avec succès !' : 'Enregistrer'}
        </button>
      </div>

      {/* Identité & Logo */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6 shadow-md">
        {sectionTitle('store', 'Identité de la marque & Logo')}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label className={labelCls}>Nom du site / Marque *</label>
            <input
              value={form.siteName}
              onChange={e => set('siteName', e.target.value)}
              placeholder="Ndolo Rituals"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Slogan de la boutique</label>
            <input
              value={form.tagline}
              onChange={e => set('tagline', e.target.value)}
              placeholder="Rituels de beauté naturels..."
              className={inputCls}
            />
          </div>
        </div>

        {/* Section Importation du Logo */}
        <div className="pt-4 border-t border-[#2d3d2c]">
          <label className={labelCls}>Logo de la boutique (Importation directe ou URL)</label>
          
          <input
            type="file"
            ref={logoInputRef}
            onChange={handleLogoUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Zone d'importation */}
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border-2 border-dashed border-[#3d4f3c] hover:border-[#bb0a4a] bg-[#162116] rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#1a261a] group"
            >
              {isUploadingLogo ? (
                <div className="py-4 flex flex-col items-center gap-2 text-[#bb0a4a]">
                  <span className="w-8 h-8 border-3 border-[#bb0a4a]/30 border-t-[#bb0a4a] rounded-full animate-spin" />
                  <span className="text-xs text-[#9aad98]">Téléversement du logo en cours...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-[#202c1f] group-hover:bg-[#bb0a4a]/20 text-[#bb0a4a] flex items-center justify-center mb-2 transition-colors">
                    <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                  </div>
                  <span className="text-sm font-semibold text-white block mb-0.5">
                    Importer un logo depuis votre appareil
                  </span>
                  <span className="text-xs text-[#6a7d69]">
                    PNG transparent, SVG, WebP ou JPG (Max 5 Mo)
                  </span>
                </>
              )}
            </div>

            {/* Aperçu du logo */}
            <div className="bg-[#162116] border border-[#2d3d2c] rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs text-[#9aad98] font-medium mb-2 block">
                Aperçu du logo actuel :
              </span>

              {form.logoUrl ? (
                <div className="flex items-center justify-between gap-4 bg-[#fdf9f5] rounded-xl p-3 border border-[#E6D5C3]">
                  <img
                    src={normalizeImageUrl(form.logoUrl)}
                    alt="Logo actuel"
                    className="max-h-12 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => set('logoUrl', '')}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Supprimer
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 bg-[#202c1f] border border-[#2d3d2c] rounded-xl text-center">
                  <span className="text-xs text-[#8ca08b] italic">
                    Aucun logo importé (le texte "{form.siteName || 'NDOLO'}" sera affiché par défaut).
                  </span>
                </div>
              )}

              {/* Champ URL manuel */}
              <div className="mt-3">
                <input
                  value={form.logoUrl}
                  onChange={e => set('logoUrl', e.target.value)}
                  placeholder="Ou collez une URL directe (https://...)"
                  className={`${inputCls} text-xs py-2`}
                />
              </div>
            </div>
          </div>

          {logoError && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {logoError}
            </p>
          )}
        </div>
      </div>

      {/* Boutique & Devise */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6 shadow-md">
        {sectionTitle('payments', 'Paramètres boutique & Devise')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Devise active */}
          <div>
            <label className={labelCls}>Devise par défaut de la boutique *</label>
            <select
              value={form.currency || 'EUR'}
              onChange={e => set('currency', e.target.value)}
              className={inputCls}
            >
              {Object.values(SUPPORTED_CURRENCIES).map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
            <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              Cette devise est automatiquement appliquée lors de l'ajout des produits.
            </p>
          </div>

          <div>
            <label className={labelCls}>Livraison gratuite à partir de ({SUPPORTED_CURRENCIES[form.currency || 'EUR']?.symbol || '€'})</label>
            <input
              type="number"
              min="0"
              value={form.freeShippingThreshold}
              onChange={e => set('freeShippingThreshold', parseFloat(e.target.value) || 0)}
              className={inputCls}
            />
            <p className="text-[#6a7d69] text-xs mt-1">Seuil affiché sur le site et appliqué au panier.</p>
          </div>
        </div>
      </div>

      {/* Couleurs */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6 shadow-md">
        {sectionTitle('palette', 'Palette de couleurs')}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'primaryColor' as const, label: 'Couleur principale', hint: 'Bordeaux / Framboise — boutons, liens' },
            { key: 'secondaryColor' as const, label: 'Couleur secondaire', hint: 'Terre cuite — accents, badges' },
            { key: 'accentColor' as const, label: "Couleur d'accentuation", hint: 'Vert sauge — sélection, hover' },
          ].map(({ key, label, hint }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <div className="flex gap-2 items-center">
                <div
                  className="w-10 h-10 rounded-xl border border-[#3d4f3c] cursor-pointer shrink-0 overflow-hidden relative"
                  style={{ backgroundColor: form[key] }}
                >
                  <input
                    type="color"
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <input
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  placeholder="#bb0a4a"
                  className={`${inputCls} flex-1`}
                />
              </div>
              <p className="text-[#6a7d69] text-xs mt-1">{hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6 shadow-md">
        {sectionTitle('contact_mail', 'Informations de contact & Réseaux')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email de contact (affiché dans le footer)</label>
            <input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="contact@ndolo-rituals.fr" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Adresse / Atelier</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Atelier Provençal, France" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Instagram</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6a7d69] text-sm">@</span>
              <input
                value={form.instagram.replace('@', '')}
                onChange={e => set('instagram', '@' + e.target.value.replace('@', ''))}
                placeholder="ndolo.rituals"
                className={`${inputCls} pl-8`}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Facebook</label>
            <input value={form.facebook} onChange={e => set('facebook', e.target.value)} placeholder="NdoloRituals" className={inputCls} />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6 shadow-md">
        {sectionTitle('travel_explore', 'SEO & Référencement Google')}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Méta-titre (Balise title)</label>
            <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="Ndolo Rituals — Savons & Huiles Naturels" className={inputCls} />
            <p className="text-[#6a7d69] text-xs mt-1">{form.metaTitle.length}/60 caractères recommandés</p>
          </div>
          <div>
            <label className={labelCls}>Méta-description</label>
            <textarea
              value={form.metaDescription}
              onChange={e => set('metaDescription', e.target.value)}
              rows={3}
              placeholder="Découvrez notre collection de savons artisanaux..."
              className={inputCls}
            />
            <p className="text-[#6a7d69] text-xs mt-1">{form.metaDescription.length}/160 caractères recommandés</p>
          </div>
        </div>
      </div>

      {/* Save button bottom */}
      <div className="flex justify-end pb-6">
        <button
          type="submit"
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 cursor-pointer ${
            saved
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
              : 'bg-[#bb0a4a] hover:bg-[#a0083e] text-white shadow-lg shadow-[#bb0a4a]/25'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">{saved ? 'check_circle' : 'save'}</span>
          {saved ? 'Enregistré avec succès !' : 'Enregistrer tous les réglages'}
        </button>
      </div>
    </form>
  );
}

