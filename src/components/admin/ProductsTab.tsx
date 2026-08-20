import React, { useState } from 'react';
import { Product } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import ProductFormModal from './ProductFormModal';

const CATEGORY_LABELS: Record<string, string> = {
  soaps: '🧼 Savons',
  oils: '🫙 Huiles',
  rituals: '✨ Rituels',
  accessories: '🪴 Accessoires',
};

export default function ProductsTab() {
  const { products, deleteProduct } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Produits</h2>
          <p className="text-[#9aad98] text-sm mt-1">{products.length} produit{products.length > 1 ? 's' : ''} au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#bb0a4a] hover:bg-[#5e7461] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#bb0a4a]/30 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Ajouter un produit
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6a7d69] text-[18px]">search</span>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#2a3529] border border-[#3d4f3c] text-white placeholder-[#6a7d69] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#bb0a4a] transition-colors"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-[#2a3529] border border-[#3d4f3c] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#bb0a4a] transition-colors"
        >
          <option value="all">Toutes les catégories</option>
          <option value="soaps">🧼 Savons</option>
          <option value="oils">🫙 Huiles</option>
          <option value="rituals">✨ Rituels</option>
          <option value="accessories">🪴 Accessoires</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#6a7d69]">
            <span className="material-symbols-outlined text-[48px] block mb-3">inventory_2</span>
            <p className="text-lg">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2d3d2c]">
                  <th className="text-left px-6 py-4 text-[#9aad98] text-xs font-semibold uppercase tracking-wider">Produit</th>
                  <th className="text-left px-4 py-4 text-[#9aad98] text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Catégorie</th>
                  <th className="text-left px-4 py-4 text-[#9aad98] text-xs font-semibold uppercase tracking-wider">Prix</th>
                  <th className="text-left px-4 py-4 text-[#9aad98] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Note</th>
                  <th className="text-left px-4 py-4 text-[#9aad98] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Vedette</th>
                  <th className="text-right px-6 py-4 text-[#9aad98] text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3d2c]">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-[#243023] transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#3d4f3c]"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#2a3529] flex items-center justify-center border border-[#3d4f3c]">
                            <span className="material-symbols-outlined text-[#6a7d69] text-[20px]">image</span>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium text-sm">{product.name}</p>
                          <p className="text-[#6a7d69] text-xs mt-0.5">{product.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#2a3529] text-[#9aad98] border border-[#3d4f3c]">
                        {CATEGORY_LABELS[product.category] || product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white font-semibold">{product.price.toFixed(2)} €</span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-[#9aad98] text-sm">{product.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      {product.featured ? (
                        <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Oui
                        </span>
                      ) : (
                        <span className="text-[#6a7d69] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-[#9aad98] hover:text-white hover:bg-[#2a3529] rounded-lg transition-all duration-150"
                          title="Modifier"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 text-[#9aad98] hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-150"
                          title="Supprimer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2a1e] border border-[#2d3d2c] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-400 text-[20px]">warning</span>
              </div>
              <h3 className="text-white font-bold text-lg">Supprimer le produit ?</h3>
            </div>
            <p className="text-[#9aad98] text-sm mb-6">Cette action est irréversible. Le produit sera définitivement supprimé.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#3d4f3c] text-[#9aad98] hover:text-white hover:border-[#bb0a4a] transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}
