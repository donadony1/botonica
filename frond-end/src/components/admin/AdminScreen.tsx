import React, { useState, useEffect } from 'react';
import { ScreenType } from '../../types';
import DashboardTab from './DashboardTab';
import ProductsTab from './ProductsTab';
import ArticlesTab from './ArticlesTab';
import OrdersTab from './OrdersTab';
import TeamTab from './TeamTab';
import SettingsTab from './SettingsTab';
import AdminLoginModal from './AdminLoginModal';
import { useAdmin } from '../../context/AdminContext';
import { getAdminSession, clearAdminSession, getAuthUser } from '../../lib/security';

type AdminTab = 'dashboard' | 'products' | 'articles' | 'orders' | 'team' | 'settings';

interface AdminScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: 'dashboard' },
  { id: 'products', label: 'Produits', icon: 'inventory_2' },
  { id: 'articles', label: 'Journal & Articles', icon: 'article' },
  { id: 'orders', label: 'Commandes & Factures', icon: 'receipt_long' },
  { id: 'team', label: 'Équipe & Gérants', icon: 'manage_accounts' },
  { id: 'settings', label: 'Réglages', icon: 'tune' },
];

export default function AdminScreen({ onNavigate }: AdminScreenProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAdminSession());
  const { products, articles, dataSource, isLoadingProducts, refreshProducts, refreshArticles } = useAdmin();

  useEffect(() => {
    if (isAuthenticated) {
      refreshProducts();
      refreshArticles();
    }
  }, [isAuthenticated, refreshProducts, refreshArticles]);

  useEffect(() => {
    // Vérification périodique de l'expiration de session
    const checkInterval = setInterval(() => {
      const session = getAdminSession();
      if (!session && isAuthenticated) {
        setIsAuthenticated(false);
      }
    }, 15000);
    return () => clearInterval(checkInterval);
  }, [isAuthenticated]);

  const handleLogout = () => {
    clearAdminSession();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111a11]">
        <AdminLoginModal
          onSuccess={() => {
            setIsAuthenticated(true);
            refreshProducts();
          }}
          onCancel={() => onNavigate('home')}
        />
      </div>
    );
  }

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Ferme automatiquement le menu mobile lors du clic
  };

  return (
    <div className="min-h-screen bg-[#111a11] flex flex-col">
      {/* ─── ADMIN TOP BAR ─────────────────────────────────────────── */}
      <header className="bg-[#151e15] border-b border-[#2d3d2c] px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Button (MOBILE ONLY) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Ouvrir le menu d'administration"
            className="sm:hidden text-white hover:text-[#bb0a4a] p-1.5 rounded-xl hover:bg-[#202c1f] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div className="w-8 h-8 rounded-lg bg-[#bb0a4a] flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-white text-[18px]">admin_panel_settings</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-base sm:text-lg tracking-wide">Ndolo</span>
              <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${
                getAuthUser()?.role === 'admin'
                  ? 'bg-[#bb0a4a]/25 text-[#ff6699] border border-[#bb0a4a]/40'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-700/40'
              }`}>
                {getAuthUser()?.role === 'admin' ? 'Admin' : 'Gérant'}
              </span>
            </div>
            {getAuthUser()?.name && (
              <p className="text-[11px] text-[#8ca08b] hidden sm:block truncate max-w-[150px]">
                {getAuthUser()?.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Source de données indicateur */}
          <button
            onClick={refreshProducts}
            title="Rafraîchir les données depuis le backend"
            className={`hidden md:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              dataSource === 'api'
                ? 'border-green-600 text-green-400 bg-green-900/20 hover:bg-green-900/40'
                : 'border-amber-600 text-amber-400 bg-amber-900/20 hover:bg-amber-900/40'
            }`}
          >
            {isLoadingProducts ? (
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
            ) : (
              <span className={`w-2 h-2 rounded-full ${dataSource === 'api' ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`}></span>
            )}
            <span>{dataSource === 'api' ? 'MySQL Connecté' : 'Données locales'}</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-[#3d4f3c] text-[#9aad98] hover:text-white hover:border-[#bb0a4a] transition-all text-xs sm:text-sm font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span className="hidden xs:inline">Voir le site</span>
          </button>

          {/* Bouton de Déconnexion Sécurisée */}
          <button
            onClick={handleLogout}
            title="Fermer la session d'administration"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 hover:bg-red-900/60 hover:text-white transition-all text-xs sm:text-sm font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      {/* ─── MOBILE BACKDROP (TAP OUTSIDE TO CLOSE) ─────────────────── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* ─── LAYOUT MAIN & SIDEBAR ─────────────────────────────────── */}
      <div className="flex flex-1 relative">
        {/* SIDEBAR NAVIGATION (Desktop: Fixed | Mobile: Drawer Overlay) */}
        <aside
          className={`
            fixed sm:sticky top-14 sm:top-14 z-40 sm:z-10 h-[calc(100vh-3.5rem)]
            w-64 sm:w-56 bg-[#151e15] border-r border-[#2d3d2c] flex flex-col py-5 px-3
            transition-transform duration-300 ease-in-out shadow-2xl sm:shadow-none
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          `}
        >
          {/* Mobile Drawer Title Header */}
          <div className="sm:hidden flex items-center justify-between pb-4 mb-2 border-b border-[#2d3d2c] px-2">
            <span className="text-xs uppercase tracking-widest text-[#9aad98] font-bold">
              Navigation Admin
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#9aad98] hover:text-white p-1 rounded-lg hover:bg-[#202c1f] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-1.5 flex-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-left group cursor-pointer ${
                    isActive
                      ? 'bg-[#bb0a4a] text-white shadow-lg shadow-[#bb0a4a]/20 font-semibold'
                      : 'text-[#9aad98] hover:bg-[#1e2a1e] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </div>

                  {/* Badge counter */}
                  {item.id === 'products' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#202c1f] text-[#9aad98]'
                    }`}>
                      {products.length}
                    </span>
                  )}
                  {item.id === 'articles' && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#202c1f] text-[#9aad98]'
                    }`}>
                      {articles.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom: Back to shop button */}
          <div className="mt-auto pt-4 border-t border-[#2d3d2c]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('home');
              }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#9aad98] hover:bg-[#1e2a1e] hover:text-white transition-all duration-200 w-full text-left cursor-pointer text-sm"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">arrow_back</span>
              <span>Retour à la boutique</span>
            </button>
          </div>
        </aside>

        {/* ─── MAIN ADMIN CONTENT ───────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardTab onSelectTab={handleSelectTab} onNavigate={onNavigate} />
            )}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'articles' && <ArticlesTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'team' && <TeamTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
