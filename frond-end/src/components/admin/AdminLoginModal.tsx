import React, { useState, useEffect } from 'react';
import {
  getFailedAttempts,
  recordFailedAttempt,
  setAdminSession,
  DEFAULT_ADMIN_TOKEN,
} from '../../lib/security';
import { loginUserAPI } from '../../lib/api';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLoginModal({ onSuccess, onCancel }: AdminLoginModalProps) {
  const [authMode, setAuthMode] = useState<'credentials' | 'master_key'>('credentials');
  const [email, setEmail] = useState('admin@ndolo-rituals.fr');
  const [password, setPassword] = useState('');
  const [masterKey, setMasterKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier le verrouillage initial
  useEffect(() => {
    const attempts = getFailedAttempts();
    if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
      const remainingSeconds = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
      setLockoutTime(remainingSeconds);
    }
  }, []);

  // Décompte de temporisation
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (authMode === 'credentials') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Veuillez renseigner votre email et mot de passe.');
          setIsLoading(false);
          return;
        }

        const res = await loginUserAPI(email.trim(), password.trim());
        if (res.success && res.token && res.user) {
          setAdminSession(res.token, res.user);
          setIsLoading(false);
          onSuccess();
          return;
        } else {
          const attemptResult = recordFailedAttempt();
          setIsLoading(false);
          if (attemptResult.locked) {
            setLockoutTime(attemptResult.lockoutSeconds);
            setErrorMsg(
              `Trop de tentatives infructueuses. Accès temporairement verrouillé pour ${attemptResult.lockoutSeconds} secondes.`
            );
          } else {
            setErrorMsg(res.error || `Identifiants incorrects. Il vous reste ${attemptResult.remainingAttempts} tentative(s).`);
          }
        }
      } else {
        // Mode Clé Maîtresse Admin
        if (!masterKey.trim()) {
          setErrorMsg('Veuillez saisir la clé secrète administrateur.');
          setIsLoading(false);
          return;
        }

        const configuredToken = (import.meta as any).env?.VITE_ADMIN_API_TOKEN || DEFAULT_ADMIN_TOKEN;
        if (masterKey.trim() === configuredToken.trim()) {
          setAdminSession(masterKey.trim(), {
            id: 'usr_superadmin',
            name: 'Administrateur Principal',
            email: 'admin@ndolo-rituals.fr',
            role: 'admin',
          });
          setIsLoading(false);
          onSuccess();
        } else {
          const attemptResult = recordFailedAttempt();
          setIsLoading(false);
          if (attemptResult.locked) {
            setLockoutTime(attemptResult.lockoutSeconds);
            setErrorMsg(
              `Trop de tentatives infructueuses. Accès temporairement verrouillé pour ${attemptResult.lockoutSeconds} secondes.`
            );
          } else {
            setErrorMsg(`Clé secrète invalide. Il vous reste ${attemptResult.remainingAttempts} tentative(s).`);
          }
        }
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Erreur de communication avec le serveur.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#151e15] border border-[#2d3d2c] rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Lueur d'accentuation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-[#bb0a4a] to-transparent" />

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#bb0a4a]/20 border border-[#bb0a4a]/40 text-[#ff4d88] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="material-symbols-outlined text-[32px]">shield_lock</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Connexion Administration & Gestion
          </h2>
          <p className="text-[#a0b0a0] text-xs mt-1">
            Connectez-vous avec votre compte Administrateur ou Gérant.
          </p>
        </div>

        {/* Sélecteur de méthode de connexion */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#0d140d] border border-[#223022] rounded-xl mb-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setAuthMode('credentials'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'credentials'
                ? 'bg-[#bb0a4a] text-white font-semibold shadow-xs'
                : 'text-[#8ba089] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            Compte (Email)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('master_key'); setErrorMsg(null); }}
            className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'master_key'
                ? 'bg-[#bb0a4a] text-white font-semibold shadow-xs'
                : 'text-[#8ba089] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            Clé Admin
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 animate-shake">
            <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">
              error
            </span>
            <span>{errorMsg}</span>
          </div>
        )}

        {lockoutTime > 0 ? (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-center text-sm mb-6">
            <span className="material-symbols-outlined text-[28px] text-amber-400 block mb-1">
              timer
            </span>
            Accès bloqué. Réessayez dans <strong className="font-mono text-white">{lockoutTime}s</strong>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'credentials' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#a0b0a0] mb-1.5 uppercase tracking-wider">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: admin@ndolo-rituals.fr"
                    disabled={isLoading || lockoutTime > 0}
                    className="w-full bg-[#0d140d] border border-[#2d3d2c] focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] text-white px-4 py-2.5 rounded-xl text-sm transition-all outline-none placeholder:text-[#455744]"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a0b0a0] mb-1.5 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe..."
                      disabled={isLoading || lockoutTime > 0}
                      className="w-full bg-[#0d140d] border border-[#2d3d2c] focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] text-white px-4 py-2.5 rounded-xl text-sm transition-all outline-none placeholder:text-[#455744]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a7d69] hover:text-white p-1 transition-colors"
                      aria-label="Afficher / Masquer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#a0b0a0] mb-1.5 uppercase tracking-wider">
                  Clé Secrète Maître (Admin)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    placeholder="Entrez la clé secrète admin..."
                    disabled={isLoading || lockoutTime > 0}
                    className="w-full bg-[#0d140d] border border-[#2d3d2c] focus:border-[#bb0a4a] focus:ring-1 focus:ring-[#bb0a4a] text-white px-4 py-2.5 rounded-xl text-sm transition-all outline-none placeholder:text-[#455744]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a7d69] hover:text-white p-1 transition-colors"
                    aria-label="Afficher / Masquer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || lockoutTime > 0 || (authMode === 'credentials' ? (!email.trim() || !password.trim()) : !masterKey.trim())}
              className="w-full py-3 px-4 rounded-xl bg-[#bb0a4a] hover:bg-[#a0083e] active:scale-[0.99] text-white font-medium text-sm transition-all shadow-lg shadow-[#bb0a4a]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Vérification sécurisée...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-[#223022] flex items-center justify-between text-xs text-[#6a7d69]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Session protégée (BCrypt + JWT)
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#a0b0a0] hover:text-white hover:underline cursor-pointer"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    </div>
  );
}

