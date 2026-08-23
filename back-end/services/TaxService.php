<?php
declare(strict_types=1);

namespace Ndolo\Services;

/**
 * Service de Fiscalité & TVA (Régime OSS Union Européenne & Export)
 * Le serveur est la seule source de vérité pour le calcul des taxes.
 */
class TaxService
{
    /**
     * Grille des taux de TVA standards par code pays ISO-2
     */
    private const VAT_RATES = [
        // Union Européenne (Régime OSS - Guichet Unique)
        'FR' => ['name' => 'France', 'rate' => 20.0, 'is_eu' => true],
        'ES' => ['name' => 'Espagne', 'rate' => 21.0, 'is_eu' => true],
        'DE' => ['name' => 'Allemagne', 'rate' => 19.0, 'is_eu' => true],
        'IT' => ['name' => 'Italie', 'rate' => 22.0, 'is_eu' => true],
        'BE' => ['name' => 'Belgique', 'rate' => 21.0, 'is_eu' => true],
        'NL' => ['name' => 'Pays-Bas', 'rate' => 21.0, 'is_eu' => true],
        'PT' => ['name' => 'Portugal', 'rate' => 23.0, 'is_eu' => true],
        'AT' => ['name' => 'Autriche', 'rate' => 20.0, 'is_eu' => true],
        'IE' => ['name' => 'Irlande', 'rate' => 23.0, 'is_eu' => true],
        'LU' => ['name' => 'Luxembourg', 'rate' => 17.0, 'is_eu' => true],
        
        // Exportations Hors UE (Exonération de TVA à l'export - Art. 262-I CGI)
        'US' => ['name' => 'États-Unis', 'rate' => 0.0, 'is_eu' => false],
        'CA' => ['name' => 'Canada', 'rate' => 0.0, 'is_eu' => false],
        'GB' => ['name' => 'Royaume-Uni', 'rate' => 0.0, 'is_eu' => false],
        'CH' => ['name' => 'Suisse', 'rate' => 0.0, 'is_eu' => false],
        'CM' => ['name' => 'Cameroun', 'rate' => 0.0, 'is_eu' => false],
        'CI' => ['name' => 'Côte d\'Ivoire', 'rate' => 0.0, 'is_eu' => false],
        'SN' => ['name' => 'Sénégal', 'rate' => 0.0, 'is_eu' => false],
    ];

    /**
     * Obtenir le taux de TVA et le statut fiscal pour un pays donné
     *
     * @param string $countryCode Code ISO (FR, ES, US, CM, etc.)
     * @return array
     */
    public static function getTaxInfo(string $countryCode): array
    {
        $code = strtoupper(trim($countryCode));
        if (isset(self::VAT_RATES[$code])) {
            return array_merge(['code' => $code], self::VAT_RATES[$code]);
        }

        // Par défaut pour les pays non répertoriés : Export Hors UE
        return [
            'code' => $code,
            'name' => 'International',
            'rate' => 0.0,
            'is_eu' => false,
        ];
    }

    /**
     * Calculer la décomposition HT / TVA / TTC à partir d'un montant TTC ou net
     *
     * @param float $amountTTC Montant TTC
     * @param float $vatRate Pourcentage de TVA (ex: 20.0)
     * @return array ['ht' => float, 'vat' => float, 'ttc' => float]
     */
    public static function calculateTaxBreakdown(float $amountTTC, float $vatRate): array
    {
        if ($vatRate <= 0.0) {
            return [
                'ht' => round($amountTTC, 2),
                'vat' => 0.00,
                'ttc' => round($amountTTC, 2),
            ];
        }

        $ht = $amountTTC / (1 + ($vatRate / 100));
        $vat = $amountTTC - $ht;

        return [
            'ht' => round($ht, 2),
            'vat' => round($vat, 2),
            'ttc' => round($amountTTC, 2),
        ];
    }
}
