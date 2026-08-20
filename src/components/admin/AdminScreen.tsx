import React, { useState } from 'react';
import { ScreenType } from '../../types';
import ProductsTab from './ProductsTab';
import SettingsTab from './SettingsTab';
import { useAdmin } from '../../context/AdminContext';

type AdminTab = 'products' | 'settings';

interface AdminScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'products', label: 'Produits', icon: 'inventory_2' },
  { id: 'settings', label: 'Réglages', icon: 'tune' },
];

export default function AdminScreen({ onNavigate }: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const { products } = useAdmin();

  return (
    <div className="min-h-screen bg-[#111a11] flex flex-col">
      {/* Admin Top Bar */}
      <header className="bg-[#151e15] border-b border-[#2d3d2c] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#1a191c] flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-wide">Ndolo</span>
            <span className="text-[#6a7d69] text-xs ml-2 uppercase tracking-widest">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[#9aad98] text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
            {products.length} produit{products.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#3d4f3c] text-[#9aad98] hover:text-white hover:border-[#1a191c] transition-all text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span className="hidden sm:inline">Voir le site</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-16 sm:w-56 bg-[#151e15] border-r border-[#2d3d2c] flex flex-col py-4 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col gap-1 px-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left group ${activeTab === item.id
                  ? 'bg-[#1a191c] text-white shadow-lg shadow-[#1a191c]/20'
                  : 'text-[#6a7d69] hover:bg-[#1e2a1e] hover:text-[#9aad98]'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                <span className="hidden sm:block text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom: Back to shop */}
          <div className="mt-auto px-2 pt-4 border-t border-[#2d3d2c]">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#6a7d69] hover:bg-[#1e2a1e] hover:text-[#9aad98] transition-all duration-200 w-full text-left"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">arrow_back</span>
              <span className="hidden sm:block text-sm font-medium">Retour boutique</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
