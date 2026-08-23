<?php
declare(strict_types=1);

namespace Ndolo\Services;

/**
 * Service de Calcul des Frais de Livraison
 * Gestion des zones géographiques : France, UE, International (USA/Canada), Afrique (Cameroun, etc.)
 */
class ShippingService
{
    /**
     * Calculer les frais et options de livraison pour un pays et un sous-total donné
     *
     * @param string $countryCode Code ISO-2 (FR, ES, US, CM, etc.)
     * @param float $subtotalAfterDiscount Sous-total net du panier
     * @param string $chosenMethod 'standard' ou 'express'
     * @return array
     */
    public static function calculateShipping(string $countryCode, float $subtotalAfterDiscount, string $chosenMethod = 'standard'): array
    {
        $country = strtoupper(trim($countryCode));

        // 1. Zone 1 — France métropolitaine
        if ($country === 'FR') {
            $freeThreshold = 50.00;
            $standardCost = ($subtotalAfterDiscount >= $freeThreshold) ? 0.00 : 4.90;
            $expressCost = 12.00;

            $methods = [
                'standard' => [
                    'id' => 'standard',
                    'name' => 'Colissimo Domicile Éco-Responsable',
                    'name_en' => 'Carbon Neutral Standard Delivery',
                    'delay' => '2-4 jours ouvrés',
                    'delay_en' => '2-4 business days',
                    'cost' => $standardCost,
                    'is_free' => ($standardCost === 0.00),
                ],
                'express' => [
                    'id' => 'express',
                    'name' => 'Chronopost 24h Express',
                    'name_en' => 'Chronopost 24h Express',
                    'delay' => '24h (livré le lendemain avant 13h)',
                    'delay_en' => 'Next business day',
                    'cost' => $expressCost,
                    'is_free' => false,
                ],
            ];
        }
        // 2. Zone 2 — Union Européenne (Espagne, Allemagne, Italie, Belgique, etc.)
        elseif (in_array($country, ['ES', 'DE', 'IT', 'BE', 'NL', 'PT', 'AT', 'IE', 'LU'], true)) {
            $freeThreshold = 70.00;
            $standardCost = ($subtotalAfterDiscount >= $freeThreshold) ? 0.00 : 8.50;
            $expressCost = 18.00;

            $methods = [
                'standard' => [
                    'id' => 'standard',
                    'name' => 'Deliv\'Europe Standard Tracked',
                    'name_en' => 'EU Standard Tracked Shipping',
                    'delay' => '3-6 jours ouvrés',
                    'delay_en' => '3-6 business days',
                    'cost' => $standardCost,
                    'is_free' => ($standardCost === 0.00),
                ],
                'express' => [
                    'id' => 'express',
                    'name' => 'DHL Express Europe',
                    'name_en' => 'DHL Express Europe',
                    'delay' => '24-48h',
                    'delay_en' => '24-48h',
                    'cost' => $expressCost,
                    'is_free' => false,
                ],
            ];
        }
        // 3. Zone 3 — Amérique du Nord (États-Unis, Canada)
        elseif (in_array($country, ['US', 'CA', 'GB', 'CH'], true)) {
            $standardCost = 19.00;
            $expressCost = 32.00;

            $methods = [
                'standard' => [
                    'id' => 'standard',
                    'name' => 'International Airmail Priority',
                    'name_en' => 'International Priority Airmail',
                    'delay' => '6-10 jours ouvrés',
                    'delay_en' => '6-10 business days',
                    'cost' => $standardCost,
                    'is_free' => false,
                ],
                'express' => [
                    'id' => 'express',
                    'name' => 'DHL Express Worldwide',
                    'name_en' => 'DHL Express Worldwide',
                    'delay' => '2-4 jours ouvrés',
                    'delay_en' => '2-4 business days',
                    'cost' => $expressCost,
                    'is_free' => false,
                ],
            ];
        }
        // 4. Zone 4 — Afrique (Cameroun, Côte d'Ivoire, Sénégal, etc.) & Reste du monde
        else {
            $standardCost = 22.00;
            $expressCost = 35.00;

            $methods = [
                'standard' => [
                    'id' => 'standard',
                    'name' => 'Courrier International Sécurisé',
                    'name_en' => 'International Tracked Shipping',
                    'delay' => '8-14 jours ouvrés',
                    'delay_en' => '8-14 business days',
                    'cost' => $standardCost,
                    'is_free' => false,
                ],
                'express' => [
                    'id' => 'express',
                    'name' => 'DHL Express International',
                    'name_en' => 'DHL Express International',
                    'delay' => '3-5 jours ouvrés',
                    'delay_en' => '3-5 business days',
                    'cost' => $expressCost,
                    'is_free' => false,
                ],
            ];
        }

        $selected = isset($methods[$chosenMethod]) ? $methods[$chosenMethod] : $methods['standard'];

        return [
            'country' => $country,
            'available_methods' => $methods,
            'selected_method' => $selected['id'],
            'cost' => $selected['cost'],
            'delivery_name' => $selected['name'],
            'delivery_delay' => $selected['delay'],
        ];
    }
}
