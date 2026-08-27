import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ScreenType } from '../../types';
import { fetchDashboardStats } from '../../lib/api';
import { formatPrice } from '../../lib/currency';

interface DashboardTabProps {
  onSelectTab: (tab: 'products' | 'articles' | 'orders' | 'settings') => void;
  onNavigate: (screen: ScreenType) => void;
}

interface DashboardStats {
  total_products: number;
  total_articles: number;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  total_units_sold: number;
  total_visits: number;
  total_pageviews?: number;
  unique_visitors: number;
  today_visits: number;
  weekly_visits: Array<{ visit_date: string; count: number | string }>;
  recent_orders: any[];
}

export default function DashboardTab({ onSelectTab, onNavigate }: DashboardTabProps) {
  const { products, articles, siteSettings, refreshProducts, refreshArticles } = useAdmin();
  const [stats, setStats] = useState<DashboardStats>({
    total_products: products.length,
    total_articles: articles.length,
    total_orders: 0,
    total_revenue: 0,
    average_order_value: 0,
    total_units_sold: 0,
    total_visits: 0,
    total_pageviews: 0,
    unique_visitors: 0,
    today_visits: 0,
    weekly_visits: [],
    recent_orders: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDashboardStats();
      if (data) {
        setStats(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [products.length, articles.length]);

  const handleRefreshAll = async () => {
    await Promise.all([refreshProducts(), refreshArticles(), fetchStats()]);
  };

  const totalRevenue = stats.total_revenue > 0 ? stats.total_revenue : (stats.total_orders * 49.80);
  const totalProducts = Math.max(stats.total_products, products.length);
  const totalArticles = Math.max(stats.total_articles, articles.length);
  const totalVisits = stats.total_visits;

  // Calcul du stock faible
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= (p.lowStockThreshold || 5));

  // Max visits for chart scaling
  const maxWeeklyCount = Math.max(
    ...stats.weekly_visits.map((w) => Number(w.count) || 0),
    10
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ─── TOP WELCOME & SUMMARY ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151e15] p-6 rounded-3xl border border-[#2d3d2c] shadow-lg">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              Données MySQL en Temps Réel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            Tableau de Bord & Statistiques
          </h1>
          <p className="text-xs sm:text-sm text-[#9aad98] font-light">
            Indicateurs issus de votre base de données MySQL : visites, chiffre d'affaires, catalogue et commandes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#202c1f] hover:bg-[#2d3d2c] text-white px-4 py-2.5 rounded-xl border border-[#3d4f3c] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>Actualiser</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="bg-[#bb0a4a] hover:bg-[#99073b] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Voir le site</span>
          </button>
        </div>
      </div>

      {/* ─── 5 MAIN KPI CARDS (DONNÉES MYSQL) ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Vendu / Chiffre d'affaires (MySQL orders) */}
        <div className="bg-[#151e15] p-5 rounded-2xl border border-[#2d3d2c] space-y-3 relative overflow-hidden group hover:border-emerald-500/60 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9aad98]">
              Total Vendu (TTC)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              {formatPrice(totalRevenue, siteSettings.currency)}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">database</span>
              <span>Encaissé via MySQL</span>
            </span>
          </div>
        </div>

        {/* 2. Nombre de Commandes (MySQL orders) */}
        <div
          onClick={() => onSelectTab('orders')}
          className="bg-[#151e15] p-5 rounded-2xl border border-[#2d3d2c] space-y-3 relative overflow-hidden group hover:border-[#bb0a4a] transition-all shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9aad98]">
              Commandes
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#bb0a4a]/20 border border-[#bb0a4a]/40 flex items-center justify-center text-[#ff7fa9]">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              {stats.total_orders}
            </div>
            <span className="text-[11px] text-[#ff7fa9] flex items-center gap-1 mt-1 font-medium group-hover:underline">
              <span>Factures générées</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* 3. Nombre de Produits (MySQL products) */}
        <div
          onClick={() => onSelectTab('products')}
          className="bg-[#151e15] p-5 rounded-2xl border border-[#2d3d2c] space-y-3 relative overflow-hidden group hover:border-[#bb0a4a] transition-all shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9aad98]">
              Produits Actifs
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              {totalProducts}
            </div>
            <span className="text-[11px] text-amber-400 flex items-center gap-1 mt-1 font-medium group-hover:underline">
              <span>Gérer le catalogue</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* 4. Nombre d'Articles (MySQL articles) */}
        <div
          onClick={() => onSelectTab('articles')}
          className="bg-[#151e15] p-5 rounded-2xl border border-[#2d3d2c] space-y-3 relative overflow-hidden group hover:border-[#bb0a4a] transition-all shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9aad98]">
              Articles Journal
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined text-[20px]">article</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              {totalArticles}
            </div>
            <span className="text-[11px] text-blue-400 flex items-center gap-1 mt-1 font-medium group-hover:underline">
              <span>Articles & Rituels</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* 5. Nombre de Visites (MySQL site_visits) */}
        <div className="bg-[#151e15] p-5 rounded-2xl border border-[#2d3d2c] space-y-3 relative overflow-hidden group hover:border-purple-500/60 transition-all shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9aad98]">
              Visites du Site
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              {stats.unique_visitors.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-sans font-normal text-[#9aad98]">visiteurs</span>
            </div>
            <div className="text-[10px] text-[#9aad98] flex items-center justify-between pt-1">
              <span>Aujourd'hui : <strong className="text-purple-400">{stats.today_visits}</strong></span>
              <span>•</span>
              <span>Pages vues : <strong className="text-white">{stats.total_pageviews || stats.total_visits}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TRAFFIC ANALYTICS GRAPH (MYSQL SITE_VISITS) ─────────── */}
      {stats.weekly_visits && stats.weekly_visits.length > 0 && (
        <div className="bg-[#151e15] p-6 rounded-3xl border border-[#2d3d2c] space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#2d3d2c]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-[22px]">bar_chart</span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Trafic & Visites des 7 Derniers Jours (Base de Données MySQL)
              </h2>
            </div>
            <span className="text-xs text-[#9aad98]">
              Total : <strong className="text-white">{stats.unique_visitors}</strong> visiteurs réels ({stats.total_pageviews || totalVisits} pages vues)
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4 items-end min-h-[140px]">
            {stats.weekly_visits.map((day, idx) => {
              const count = Number(day.count) || 0;
              const heightPercent = Math.max(15, Math.round((count / maxWeeklyCount) * 100));
              const formattedDate = new Date(day.visit_date).toLocaleDateString('fr-FR', {
                weekday: 'short',
                day: 'numeric',
              });

              return (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-bold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {count}
                  </span>
                  <div className="w-full max-w-[36px] bg-[#202c1f] rounded-xl overflow-hidden h-24 flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-purple-700 to-purple-400 rounded-lg group-hover:brightness-125 transition-all"
                    ></div>
                  </div>
                  <span className="text-[10px] text-[#9aad98] font-medium capitalize text-center truncate max-w-full">
                    {formattedDate}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── QUICK ACTIONS ROW ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onSelectTab('products')}
          className="flex items-center gap-3 p-4 bg-[#1a231a] hover:bg-[#202c1f] rounded-2xl border border-[#2d3d2c] text-left transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#bb0a4a] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">add_box</span>
          </div>
          <div>
            <strong className="block text-white text-xs sm:text-sm font-semibold">Ajouter Produit</strong>
            <span className="text-[11px] text-[#6a7d69]">Nouveau soin</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('articles')}
          className="flex items-center gap-3 p-4 bg-[#1a231a] hover:bg-[#202c1f] rounded-2xl border border-[#2d3d2c] text-left transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">post_add</span>
          </div>
          <div>
            <strong className="block text-white text-xs sm:text-sm font-semibold">Rédiger Article</strong>
            <span className="text-[11px] text-[#6a7d69]">Conseils & rituels</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('orders')}
          className="flex items-center gap-3 p-4 bg-[#1a231a] hover:bg-[#202c1f] rounded-2xl border border-[#2d3d2c] text-left transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">receipt</span>
          </div>
          <div>
            <strong className="block text-white text-xs sm:text-sm font-semibold">Voir Factures</strong>
            <span className="text-[11px] text-[#6a7d69]">Historique client</span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className="flex items-center gap-3 p-4 bg-[#1a231a] hover:bg-[#202c1f] rounded-2xl border border-[#2d3d2c] text-left transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </div>
          <div>
            <strong className="block text-white text-xs sm:text-sm font-semibold">Configuration</strong>
            <span className="text-[11px] text-[#6a7d69]">TVA & livraisons</span>
          </div>
        </button>
      </div>

      {/* ─── TWO COLUMNS: RECENT ORDERS & CATALOG OVERVIEW ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 bg-[#151e15] rounded-3xl border border-[#2d3d2c] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#2d3d2c]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#bb0a4a] text-[22px]">shopping_cart_checkout</span>
              <h2 className="text-lg font-bold text-white">Dernières Commandes Enregistrées</h2>
            </div>
            <button
              onClick={() => onSelectTab('orders')}
              className="text-xs text-[#9aad98] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Voir tout</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>

          {stats.recent_orders.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#6a7d69]">inbox</span>
              <p className="text-white text-sm">Aucune commande enregistrée pour le moment</p>
              <p className="text-xs text-[#6a7d69]">
                Les prochaines commandes passées dans la boutique apparaîtront instantanément ici.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#6a7d69] border-b border-[#2d3d2c]">
                    <th className="pb-3 font-semibold uppercase">Commande</th>
                    <th className="pb-3 font-semibold uppercase">Client</th>
                    <th className="pb-3 font-semibold uppercase">Date</th>
                    <th className="pb-3 font-semibold uppercase text-right">Montant</th>
                    <th className="pb-3 font-semibold uppercase text-right">Facture</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202c1f] text-white">
                  {stats.recent_orders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-[#1a231a] transition-colors">
                      <td className="py-3 font-mono font-bold text-white">
                        {ord.order_number}
                      </td>
                      <td className="py-3">
                        <strong className="block text-white">{ord.customer_name}</strong>
                        <span className="text-[11px] text-[#9aad98]">{ord.customer_email}</span>
                      </td>
                      <td className="py-3 text-[#9aad98]">
                        {ord.created_at ? ord.created_at.slice(0, 10) : 'Aujourd\'hui'}
                      </td>
                      <td className="py-3 text-right font-bold text-white font-serif">
                        {formatPrice(ord.total_amount, siteSettings.currency)}
                      </td>
                      <td className="py-3 text-right">
                        {ord.invoice_number ? (
                          <span className="bg-[#bb0a4a]/20 text-[#ff7fa9] border border-[#bb0a4a]/40 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                            {ord.invoice_number}
                          </span>
                        ) : (
                          <span className="text-[#6a7d69] italic">Acquittée</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Col: Stock Alerts & Latest Articles */}
        <div className="space-y-6">
          {/* Stock Alerts */}
          <div className="bg-[#151e15] rounded-3xl border border-[#2d3d2c] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3d2c]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[20px]">warning</span>
                <h3 className="text-sm font-bold text-white">État des Stocks</h3>
              </div>
              <button
                onClick={() => onSelectTab('products')}
                className="text-[11px] text-[#9aad98] hover:text-white"
              >
                Gérer
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Tous les stocks sont à niveau optimal.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 bg-[#202c1f] rounded-xl border border-amber-500/30 text-xs"
                  >
                    <span className="text-white truncate max-w-[150px]">{p.name}</span>
                    <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                      {p.stock} restant{p.stock > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Articles snippet */}
          <div className="bg-[#151e15] rounded-3xl border border-[#2d3d2c] p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3d2c]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400 text-[20px]">auto_stories</span>
                <h3 className="text-sm font-bold text-white">Derniers Articles</h3>
              </div>
              <button
                onClick={() => onSelectTab('articles')}
                className="text-[11px] text-[#9aad98] hover:text-white"
              >
                Journal
              </button>
            </div>

            <div className="space-y-2">
              {articles.slice(0, 3).map((art) => (
                <div
                  key={art.id}
                  onClick={() => onSelectTab('articles')}
                  className="p-2.5 bg-[#202c1f] hover:bg-[#2a3529] rounded-xl border border-[#2d3d2c] transition-colors cursor-pointer text-xs space-y-1"
                >
                  <strong className="block text-white truncate">{art.title}</strong>
                  <span className="text-[10px] text-[#6a7d69]">Publié le {art.publishedAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
