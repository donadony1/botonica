/**
 * Utilitaires de Sécurité — Ndolo Rituals
 * - Désinfection et validation d'URLs (anti-XSS / anti-tabnabbing)
 * - Gestion sécurisée de la session administrateur avec expiration et protection contre le brute-force
 */

/**
 * Valide et assainit une URL pour éviter l'exécution de scripts via javascript: ou data:
 */
export function sanitizeUrl(url: string | null | undefined, fallback: string = '#'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Interdire les pseudo-protocoles dangereux
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('vbscript:')
  ) {
    console.warn(`[Security] URL dangereuse bloquée : ${trimmed}`);
    return fallback;
  }

  return trimmed;
}

/**
 * Ouvre un lien externe de manière sécurisée (protégé contre le reverse tabnabbing)
 */
export function safeOpenExternal(url: string, target: string = '_blank'): void {
  const safe = sanitizeUrl(url);
  if (safe === '#') return;

  const win = window.open(safe, target, 'noopener,noreferrer');
  if (win) {
    win.opener = null;
  }
}

/**
 * Gestion du verrouillage et de la session Administrateur
 */
const ADMIN_SESSION_KEY = 'ndolo_admin_auth_session';
const ADMIN_ATTEMPTS_KEY = 'ndolo_admin_failed_attempts';
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 heure de validité
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 5 * 60 * 1000; // 5 minutes de blocage après 5 échecs

// Clé par défaut pour le mode développement si non définie dans les variables d'environnement
export const DEFAULT_ADMIN_TOKEN =
  (import.meta as any).env?.VITE_ADMIN_API_TOKEN || 'NdoloSecureAdmin2026!';

export interface AdminSession {
  token: string;
  authenticatedAt: number;
  expiresAt: number;
}

interface FailedAttempts {
  count: number;
  lockedUntil: number | null;
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function setAdminSession(token: string): void {
  const session: AdminSession = {
    token,
    authenticatedAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    resetFailedAttempts();
  } catch (err) {
    console.error('[Security] Erreur enregistrement session admin', err);
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (err) {
    console.error('[Security] Erreur suppression session admin', err);
  }
}

export function getFailedAttempts(): FailedAttempts {
  try {
    const raw = localStorage.getItem(ADMIN_ATTEMPTS_KEY);
    if (!raw) return { count: 0, lockedUntil: null };
    const data: FailedAttempts = JSON.parse(raw);
    if (data.lockedUntil && Date.now() > data.lockedUntil) {
      resetFailedAttempts();
      return { count: 0, lockedUntil: null };
    }
    return data;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

export function recordFailedAttempt(): { locked: boolean; remainingAttempts: number; lockoutSeconds: number } {
  const current = getFailedAttempts();
  const newCount = current.count + 1;

  if (newCount >= MAX_ATTEMPTS) {
    const lockedUntil = Date.now() + LOCKOUT_TIME_MS;
    localStorage.setItem(
      ADMIN_ATTEMPTS_KEY,
      JSON.stringify({ count: newCount, lockedUntil })
    );
    return { locked: true, remainingAttempts: 0, lockoutSeconds: Math.ceil(LOCKOUT_TIME_MS / 1000) };
  }

  localStorage.setItem(
    ADMIN_ATTEMPTS_KEY,
    JSON.stringify({ count: newCount, lockedUntil: null })
  );
  return {
    locked: false,
    remainingAttempts: MAX_ATTEMPTS - newCount,
    lockoutSeconds: 0,
  };
}

export function resetFailedAttempts(): void {
  try {
    localStorage.removeItem(ADMIN_ATTEMPTS_KEY);
  } catch {
    // ignore
  }
}
