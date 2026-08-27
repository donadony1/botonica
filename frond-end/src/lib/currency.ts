/**
 * Utilitaire de gestion des devises et formatage des prix — Ndolo Rituals
 * Si aucune devise n'est choisie dans les réglages, la devise par défaut est l'Euro (€ / EUR).
 */

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  position: 'after' | 'before';
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', label: '€ — Euro (EUR)', position: 'after', decimals: 2 },
  USD: { code: 'USD', symbol: '$', label: '$ — Dollar américain (USD)', position: 'before', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'CA$ — Dollar canadien (CAD)', position: 'before', decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', label: '£ — Livre sterling (GBP)', position: 'before', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', label: 'CHF — Franc suisse (CHF)', position: 'after', decimals: 2 },
  XAF: { code: 'XAF', symbol: 'FCFA', label: 'FCFA — Franc CFA (XAF)', position: 'after', decimals: 0 },
  MAD: { code: 'MAD', symbol: 'MAD', label: 'MAD — Dirham marocain (MAD)', position: 'after', decimals: 2 },
};

/**
 * Récupère le symbole de la devise courante (ou '€' par défaut)
 */
export function getCurrencySymbol(currencyCode?: string | null): string {
  const code = String(currencyCode || 'EUR').trim().toUpperCase();
  return SUPPORTED_CURRENCIES[code]?.symbol || (code === '' ? '€' : code);
}

/**
 * Formate un montant numérique selon la devise configurée
 */
export function formatPrice(amount: number | string | null | undefined, currencyCode?: string | null): string {
  const val = typeof amount === 'number' ? amount : parseFloat(String(amount || 0)) || 0;
  const code = String(currencyCode || 'EUR').trim().toUpperCase() || 'EUR';
  const config = SUPPORTED_CURRENCIES[code] || {
    code,
    symbol: code === 'EUR' ? '€' : code,
    label: code,
    position: 'after' as const,
    decimals: 2,
  };

  const formattedNum = val.toLocaleString('fr-FR', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  if (config.position === 'before') {
    return `${config.symbol}${formattedNum}`;
  }
  return `${formattedNum} ${config.symbol}`;
}
