import React, { useState } from 'react';
import { Article } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import ArticleFormModal from './ArticleFormModal';

export default function ArticlesTab() {
  const { articles, products, deleteArticle } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = articles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      art.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || art.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingArticle(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteArticle(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion du Journal & Articles</h2>
          <p className="text-[#9aad98] text-sm mt-1">
            {articles.length} article{articles.length > 1 ? 's' : ''} publié{articles.length > 1 ? 's' : ''} — Guides botaniques & rituels ancestraux
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#bb0a4a] hover:bg-[#b7003a] text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#bb0a4a]/30 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Rédiger un article
        </button>
      </div>

      {/* Filtres & Recherche */}
      <div className="bg-[#1c261c] p-4 rounded-2xl border border-[#2d3d2c] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par titre, auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#2a3529] border border-[#3d4f3c] rounded-xl px-4 py-2.5 pl-10 text-white placeholder-[#6a7d69] text-sm focus:outline-none focus:border-[#bb0a4a]"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#6a7d69] text-[20px]">
            search
          </span>
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="bg-[#2a3529] border border-[#3d4f3c] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#bb0a4a]"
        >
          <option value="all">Toutes les catégories</option>
          <option value="culture">🏺 Culture & Savoir-Faire</option>
          <option value="skin-health">🌿 Santé de la Peau</option>
          <option value="ingredients">🍃 Ingrédients Purs</option>
          <option value="rituals">✨ Rituels de Bain</option>
        </select>
      </div>

      {/* Liste des articles */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#1c261c] rounded-2xl border border-[#2d3d2c]">
          <span className="material-symbols-outlined text-4xl text-[#6a7d69] mb-2">article</span>
          <p className="text-white font-medium">Aucun article trouvé</p>
          <p className="text-[#6a7d69] text-sm mt-1">Créez votre premier article en cliquant sur "Rédiger un article".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((art) => (
            <div
              key={art.id}
              className="bg-[#1c261c] border border-[#2d3d2c] rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#3d4f3c] transition-all"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-black shrink-0 relative">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                  {art.featured && (
                    <span className="absolute top-1 left-1 bg-[#bb0a4a] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                      À la Une
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#9aad98] mb-1">
                    <span className="text-amber-400 font-semibold">{art.categoryLabel}</span>
                    <span>·</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="text-white font-semibold text-base line-clamp-2">{art.title}</h3>
                  <p className="text-[#9aad98] text-xs mt-1 line-clamp-2">{art.excerpt}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#2d3d2c]">
                <div className="flex items-center gap-2">
                  <img
                    src={art.authorAvatar}
                    alt={art.author}
                    className="w-6 h-6 rounded-full object-cover border border-[#3d4f3c]"
                  />
                  <span className="text-xs text-[#6a7d69]">{art.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  {deleteConfirm === art.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                      >
                        Confirmer
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="bg-[#2a3529] hover:bg-[#3d4f3c] text-white text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(art)}
                        className="p-2 text-[#9aad98] hover:text-white hover:bg-[#2a3529] rounded-lg transition-colors cursor-pointer"
                        title="Modifier l'article"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(art.id)}
                        className="p-2 text-[#9aad98] hover:text-red-400 hover:bg-[#2a3529] rounded-lg transition-colors cursor-pointer"
                        title="Supprimer l'article"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'édition / création */}
      {modalOpen && (
        <ArticleFormModal
          article={editingArticle}
          allProducts={products}
          onClose={() => {
            setModalOpen(false);
            setEditingArticle(null);
          }}
        />
      )}
    </div>
  );
}
