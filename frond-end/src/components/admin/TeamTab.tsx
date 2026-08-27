import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../../types';
import { fetchStaffUsers, createStaffUser, updateStaffUser, deleteStaffUser } from '../../lib/api';
import { getAuthUser, isUserAdmin } from '../../lib/security';

export default function TeamTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('gerant');
  const [formError, setFormError] = useState<string | null>(null);

  const currentUser = getAuthUser();
  const isAdmin = isUserAdmin();

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchStaffUsers();
      if (data) {
        setUsers(data);
      } else {
        // Utilisateur par défaut si non disponible
        setUsers([
          {
            id: 'usr_superadmin',
            name: 'Administrateur Ndolo',
            email: 'admin@ndolo-rituals.fr',
            role: 'admin',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setErrorMsg('Impossible de charger la liste des utilisateurs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setFormError('Seul un administrateur est autorisé à ajouter un gérant.');
      return;
    }

    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (formPassword.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await createStaffUser({
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword,
        role: formRole,
      });

      if (res.success) {
        setSuccessMsg(res.message || `${formRole === 'gerant' ? 'Gérant' : 'Administrateur'} ajouté avec succès.`);
        setIsAddModalOpen(false);
        setFormName('');
        setFormEmail('');
        setFormPassword('');
        setFormRole('gerant');
        await loadUsers();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setFormError(res.error || 'Échec de la création du compte.');
      }
    } catch (err: any) {
      setFormError(err?.message || 'Erreur de connexion au serveur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!isAdmin) {
      setErrorMsg('Action réservée aux administrateurs.');
      return;
    }

    if (user.id === currentUser?.id) {
      setErrorMsg('Vous ne pouvez pas désactiver votre propre compte.');
      return;
    }

    try {
      const res = await updateStaffUser(user.id, { isActive: !user.isActive });
      if (res.success) {
        setSuccessMsg(`Statut de ${user.name} mis à jour.`);
        await loadUsers();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.error || 'Erreur lors de la mise à jour.');
      }
    } catch {
      setErrorMsg('Erreur de connexion au serveur.');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!isAdmin) {
      setErrorMsg('Action réservée aux administrateurs.');
      return;
    }

    if (user.id === currentUser?.id) {
      setErrorMsg('Vous ne pouvez pas supprimer votre propre compte.');
      return;
    }

    if (!window.confirm(`Êtes-vous certain de vouloir supprimer définitivement l'accès pour "${user.name}" (${user.email}) ?`)) {
      return;
    }

    try {
      const res = await deleteStaffUser(user.id);
      if (res.success) {
        setSuccessMsg(`Compte de ${user.name} supprimé avec succès.`);
        await loadUsers();
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(res.error || 'Erreur lors de la suppression.');
      }
    } catch {
      setErrorMsg('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── EN-TÊTE DE SECTION ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151e15] border border-[#2d3d2c] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#bb0a4a] text-[26px]">
              manage_accounts
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Gestion de l'Équipe & Rôles
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#9aad98]">
            Contrôle des accès back-office : Seuls les administrateurs peuvent ajouter ou gérer les gérants.
          </p>
        </div>

        {/* Bouton d'action Administrateur */}
        {isAdmin ? (
          <button
            onClick={() => {
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#bb0a4a] hover:bg-[#a0083e] active:scale-[0.98] text-white text-sm font-semibold transition-all shadow-lg shadow-[#bb0a4a]/25 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Ajouter un Gérant</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#202c1f] border border-[#2d3d2c] text-xs text-[#8ca08b] shrink-0">
            <span className="material-symbols-outlined text-[18px] text-amber-400">lock</span>
            <span>Rôle Gérant (Lecture seule)</span>
          </div>
        )}
      </div>

      {/* ── BANNIÈRE D'INFORMATION RÔLE GÉRANT ──────────────────── */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-amber-400 shrink-0">
            info
          </span>
          <div>
            <strong className="font-semibold block mb-0.5">Accès Gérant :</strong>
            Vous êtes connecté en tant que gérant. Vous pouvez consulter les membres de l'équipe, mais seul un
            <strong> Administrateur</strong> a l'autorisation d'ajouter de nouveaux gérants ou de modifier les permissions.
          </div>
        </div>
      )}

      {/* Messages de succès / erreur */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 text-sm flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[20px] text-emerald-400 shrink-0">
            check_circle
          </span>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-sm flex items-center gap-2 animate-shake">
          <span className="material-symbols-outlined text-[20px] text-red-400 shrink-0">
            error
          </span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── LISTE DES UTILISATEURS ──────────────────────────────── */}
      <div className="bg-[#151e15] border border-[#2d3d2c] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-[#2d3d2c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8ca08b] text-[20px]">group</span>
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Comptes Utilisateurs ({users.length})
            </h2>
          </div>
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-[#8ca08b] hover:text-white hover:bg-[#202c1f] transition-all cursor-pointer"
            title="Actualiser la liste"
          >
            <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-[#8ca08b]">
            <span className="material-symbols-outlined text-[32px] animate-spin mb-2 text-[#bb0a4a]">
              progress_activity
            </span>
            <p className="text-xs">Chargement des membres de l'équipe...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-[#8ca08b]">
            <span className="material-symbols-outlined text-[40px] mb-2 text-[#4d5f4c]">
              person_off
            </span>
            <p className="text-sm font-medium text-white">Aucun compte enregistré</p>
            <p className="text-xs text-[#6a7d69] mt-1">Créez le premier gérant pour votre boutique.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#223022]">
            {users.map((u) => {
              const isCurrent = currentUser?.id === u.id || (currentUser?.email === u.email);
              return (
                <div
                  key={u.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1a251a] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Avatar Initials */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-inner ${
                      u.role === 'admin'
                        ? 'bg-[#bb0a4a]/20 border border-[#bb0a4a]/40 text-[#ff6699]'
                        : 'bg-emerald-950/40 border border-emerald-700/40 text-emerald-300'
                    }`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-sm sm:text-base">
                          {u.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#bb0a4a]/30 border border-[#bb0a4a]/50 text-white font-medium">
                            Vous
                          </span>
                        )}
                        {/* Role Badge */}
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                          u.role === 'admin'
                            ? 'bg-[#bb0a4a] text-white shadow-xs'
                            : 'bg-[#2a452a] text-emerald-300 border border-emerald-600/30'
                        }`}>
                          {u.role === 'admin' ? 'Administrateur' : 'Gérant'}
                        </span>
                      </div>

                      <div className="text-xs text-[#8ca08b] flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">mail</span>
                          {u.email}
                        </span>
                        {u.createdByName && (
                          <span className="text-[#6a7d69]">
                            • Ajouté par : {u.createdByName}
                          </span>
                        )}
                        {u.lastLoginAt && (
                          <span className="text-[#6a7d69]">
                            • Connexion : {new Date(u.lastLoginAt).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    {/* Status Badge */}
                    <span className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium ${
                      u.isActive
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                      {u.isActive ? 'Actif' : 'Désactivé'}
                    </span>

                    {/* Actions réservées aux Administrateurs */}
                    {isAdmin && !isCurrent && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.isActive ? 'Désactiver le compte' : 'Activer le compte'}
                          className="p-1.5 rounded-lg border border-[#2d3d2c] text-[#8ca08b] hover:text-white hover:bg-[#202c1f] transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {u.isActive ? 'block' : 'check_circle'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          title="Supprimer définitivement"
                          className="p-1.5 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-950/60 hover:text-red-200 transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MODAL AJOUT D'UN GÉRANT / UTILISATEUR ────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#151e15] border border-[#2d3d2c] rounded-2xl w-full max-w-lg p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2d3d2c]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#bb0a4a]/20 border border-[#bb0a4a]/40 text-[#ff6699] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">person_add</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Nouveau Membre de l'Équipe</h3>
                  <p className="text-xs text-[#8ca08b]">Ajoutez un gérant ou un administrateur</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8ca08b] hover:text-white p-1 rounded-lg hover:bg-[#202c1f] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 animate-shake">
                <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">
                  error
                </span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#a0b0a0] mb-1.5 uppercase tracking-wider">
                  Nom Complet du Gérant *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ex: Sophie Laurent"
                  className="w-full bg-[#0d140d] border border-[#2d3d2c] focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] text-white px-4 py-2.5 rounded-xl text-sm transition-all outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a0b0a0] mb-1.5 uppercase tracking-wider">
                  Adresse Email Professionnelle *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="ex: gerant@ndolo-rituals.fr"
                  className="w-full bg-[#0d140d] border border-[#2d3d2c] focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] text-white px-4 py-2.5 rounded-xl text-sm transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a0b0a0] mb-1.5 uppercase tracking-wider">
                  Mot de passe Initial * (min. 6 caractères)
                </label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0d140d] border border-[#2d3d2c] focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] text-white px-4 py-2.5 rounded-xl text-sm transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a0b0a0] mb-1.5 uppercase tracking-wider">
                  Rôle & Niveau de Permission *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option Gérant */}
                  <label
                    onClick={() => setFormRole('gerant')}
                    className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                      formRole === 'gerant'
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40 text-white'
                        : 'bg-[#0d140d] border-[#2d3d2c] text-[#8ca08b] hover:border-[#3d503c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5 text-emerald-400">
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                        Gérant
                      </span>
                      <span className={`w-3 h-3 rounded-full border ${formRole === 'gerant' ? 'bg-emerald-400 border-emerald-400' : 'border-zinc-600'}`} />
                    </div>
                    <span className="text-[11px] text-[#9aad98] leading-tight mt-0.5">
                      Gestion des produits, des articles du journal et suivi des commandes.
                    </span>
                  </label>

                  {/* Option Admin */}
                  <label
                    onClick={() => setFormRole('admin')}
                    className={`p-3.5 rounded-xl border flex flex-col gap-1 cursor-pointer transition-all ${
                      formRole === 'admin'
                        ? 'bg-[#bb0a4a]/20 border-[#bb0a4a] ring-1 ring-[#bb0a4a]/40 text-white'
                        : 'bg-[#0d140d] border-[#2d3d2c] text-[#8ca08b] hover:border-[#3d503c]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm flex items-center gap-1.5 text-[#ff6699]">
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        Administrateur
                      </span>
                      <span className={`w-3 h-3 rounded-full border ${formRole === 'admin' ? 'bg-[#bb0a4a] border-[#bb0a4a]' : 'border-zinc-600'}`} />
                    </div>
                    <span className="text-[11px] text-[#9aad98] leading-tight mt-0.5">
                      Accès complet incluant les réglages et l'ajout de nouveaux gérants.
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#223022] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-[#2d3d2c] text-[#9aad98] hover:text-white transition-colors text-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#bb0a4a] hover:bg-[#a0083e] text-white font-semibold text-sm transition-all shadow-lg shadow-[#bb0a4a]/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      <span>Créer le compte</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
