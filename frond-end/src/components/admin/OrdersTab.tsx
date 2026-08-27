import React, { useState, useEffect } from 'react';
import { fetchAdminOrders } from '../../lib/api';
import { useAdmin } from '../../context/AdminContext';
import { formatPrice } from '../../lib/currency';

interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  shipping_city: string;
  shipping_country: string;
  payment_method: string;
  payment_status: string;
  total_amount: number | string;
  created_at: string;
  invoice_number?: string;
  email_sent?: boolean | number;
}

export default function OrdersTab() {
  const { siteSettings } = useAdmin();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminOrders();
      if (data && Array.isArray(data)) {
        setOrders(data);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) =>
    o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
    o.invoice_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Commandes & Factures</h2>
          <p className="text-[#9aad98] text-sm mt-1">
            {orders.length} commande{orders.length > 1 ? 's' : ''} enregistrée{orders.length > 1 ? 's' : ''} avec factures générées et envoyées
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="flex items-center gap-2 bg-[#2a3529] hover:bg-[#3d4f3c] border border-[#3d4f3c] text-white px-4 py-2.5 rounded-xl font-medium transition-all text-xs cursor-pointer"
        >
          <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
            refresh
          </span>
          Actualiser
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-[#1c261c] p-4 rounded-2xl border border-[#2d3d2c]">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher par N° de commande, N° de facture, nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2a3529] border border-[#3d4f3c] rounded-xl px-4 py-2.5 pl-10 text-white placeholder-[#6a7d69] text-sm focus:outline-none focus:border-[#bb0a4a]"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#6a7d69] text-[20px]">
            search
          </span>
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#1c261c] rounded-2xl border border-[#2d3d2c]">
          <span className="material-symbols-outlined text-4xl text-[#6a7d69] mb-2">receipt_long</span>
          <p className="text-white font-medium">Aucune commande pour le moment</p>
          <p className="text-[#6a7d69] text-sm mt-1">
            Les commandes validées dans le tunnel de paiement et leurs factures apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="bg-[#1c261c] rounded-2xl border border-[#2d3d2c] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151e15] text-[#9aad98] border-b border-[#2d3d2c]">
                <tr>
                  <th className="p-4 font-semibold uppercase tracking-wider">Commande</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Facture</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Client</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Paiement</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-right">Total TTC</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-center">Email</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3d2c] text-white">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#202c1f] transition-colors">
                    <td className="p-4">
                      <strong className="font-mono text-white block">{ord.order_number}</strong>
                      <span className="text-[11px] text-[#6a7d69]">{ord.created_at}</span>
                    </td>
                    <td className="p-4">
                      {ord.invoice_number ? (
                        <span className="bg-[#bb0a4a]/20 text-[#ff7fa9] border border-[#bb0a4a]/40 px-2 py-1 rounded-md font-mono text-[11px] font-bold">
                          {ord.invoice_number}
                        </span>
                      ) : (
                        <span className="text-[#6a7d69] italic">En attente</span>
                      )}
                    </td>
                    <td className="p-4">
                      <strong className="block text-white">{ord.customer_name}</strong>
                      <span className="text-[11px] text-[#9aad98]">{ord.customer_email}</span>
                      <span className="text-[10px] text-[#6a7d69] block">
                        {ord.shipping_city}, {ord.shipping_country}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-700/50 px-2 py-0.5 rounded text-[11px] font-semibold">
                        ✓ {ord.payment_method}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-white font-serif text-sm">
                      {formatPrice(ord.total_amount, siteSettings.currency)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                        <span className="material-symbols-outlined text-[14px]">mark_email_read</span>
                        <span>Envoyé</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {ord.invoice_number && (
                        <a
                          href={`/invoices/${ord.invoice_number}.html`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-[#2a3529] hover:bg-[#bb0a4a] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          <span>Facture</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
