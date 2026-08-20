import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { useAdmin } from '../../context/AdminContext';

export default function SettingsTab() {
  const { siteSettings, updateSettings } = useAdmin();
  const [form, setForm] = useState<SiteSettings>({ ...siteSettings });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = 'w-full bg-[#2a3529] border border-[#3d4f3c] text-white placeholder-[#6a7d69] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1a191c] transition-colors text-sm';
  const labelCls = 'block text-[#9aad98] text-xs font-semibold uppercase tracking-wider mb-1.5';
  const sectionTitle = (icon: string, title: string) => (
    <h3 className="text-[#1a191c] font-semibold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 mt-2">
      <span className="material-symbols-outlined text-[16px]">{icon}</span> {title}
    </h3>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Réglages du site</h2>
          <p className="text-[#9aad98] text-sm mt-1">Personnalisez l'apparence et le comportement de votre boutique</p>
        </div>
        <button
          type="submit"
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${saved
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
            : 'bg-[#1a191c] hover:bg-[#5e7461] text-white hover:shadow-lg hover:shadow-[#1a191c]/30'
            }`}
        >
          <span className="material-symbols-outlined text-[20px]">{saved ? 'check_circle' : 'save'}</span>
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      {/* Identité */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6">
        {sectionTitle('store', 'Identité de la marque')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nom du site</label>
            <input value={form.siteName} onChange={e => set('siteName', e.target.value)} placeholder="Ndolo Rituals" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Slogan</label>
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Rituels de beauté naturels..." className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>URL du logo</label>
            <input value={form.logoUrl} onChange={e => set('logoUrl', e.target.value)} placeholder="https://..." className={inputCls} />
          </div>
        </div>
      </div>

      {/* Couleurs */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6">
        {sectionTitle('palette', 'Palette de couleurs')}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'primaryColor' as const, label: 'Couleur principale', hint: 'Vert sauge — boutons, liens actifs' },
            { key: 'secondaryColor' as const, label: 'Couleur secondaire', hint: 'Terracotta — accents, badges' },
            { key: 'accentColor' as const, label: "Couleur d'accentuation", hint: 'Vert clair — sélection, hover' },
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
                  placeholder="#1a191c"
                  className={`${inputCls} flex-1`}
                />
              </div>
              <p className="text-[#6a7d69] text-xs mt-1">{hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Boutique */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6">
        {sectionTitle('local_shipping', 'Paramètres boutique')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Livraison gratuite à partir de (€)</label>
            <input
              type="number"
              min="0"
              value={form.freeShippingThreshold}
              onChange={e => set('freeShippingThreshold', parseFloat(e.target.value) || 0)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Devise</label>
            <select value={form.currency} onChange={e => set('currency', e.target.value)} className={inputCls}>
              <option value="EUR">€ — Euro</option>
              <option value="USD">$ — Dollar USD</option>
              <option value="GBP">£ — Livre sterling</option>
              <option value="CHF">CHF — Franc suisse</option>
              <option value="MAD">MAD — Dirham marocain</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6">
        {sectionTitle('contact_mail', 'Informations de contact')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email de contact</label>
            <input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="contact@example.com" className={inputCls} />
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
                placeholder="Ndolo.rituals"
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
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6">
        {sectionTitle('travel_explore', 'SEO & Référencement')}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Méta-titre</label>
            <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="Ndolo Rituals — Savons Naturels" className={inputCls} />
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
      <div className="flex justify-end pb-4">
        <button
          type="submit"
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${saved
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
            : 'bg-[#1a191c] hover:bg-[#5e7461] text-white hover:shadow-lg hover:shadow-[#1a191c]/30'
            }`}
        >
          <span className="material-symbols-outlined text-[20px]">{saved ? 'check_circle' : 'save'}</span>
          {saved ? 'Enregistré avec succès !' : 'Enregistrer les réglages'}
        </button>
      </div>
    </form>
  );
}
