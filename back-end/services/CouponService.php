<?php
declare(strict_types=1);

namespace Ndolo\Services;

/**
 * Service de Gestion et Validation des Codes Promotionnels
 * Seul le serveur autorise et applique une remise.
 */
class CouponService
{
    /**
     * Codes promotionnels officiels enregistrés
     */
    private const COUPONS = [
        'BIENVENUE10' => [
            'code' => 'BIENVENUE10',
            'type' => 'percentage',
            'value' => 10.0,
            'min_spend' => 0.0,
            'label' => 'Offre de bienvenue (-10%)',
            'label_en' => 'Welcome offer (-10%)',
            'is_active' => true,
        ],
        'NDOLO10' => [
            'code' => 'NDOLO10',
            'type' => 'percentage',
            'value' => 10.0,
            'min_spend' => 0.0,
            'label' => 'Remise exclusive (-10%)',
            'label_en' => 'Exclusive discount (-10%)',
            'is_active' => true,
        ],
        'RITUEL10' => [
            'code' => 'RITUEL10',
            'type' => 'percentage',
            'value' => 10.0,
            'min_spend' => 0.0,
            'label' => 'Privilège rituel (-10%)',
            'label_en' => 'Ritual privilege (-10%)',
            'is_active' => true,
        ],
        'NATUREL' => [
            'code' => 'NATUREL',
            'type' => 'fixed',
            'value' => 15.0,
            'min_spend' => 50.0,
            'label' => 'Remise botanique de 15,00 € dès 50€ d\'achat',
            'label_en' => '15.00 € discount on orders over 50€',
            'is_active' => true,
        ],
    ];

    /**
     * Valider et calculer le montant de la remise
     *
     * @param string|null $code Code promo saisi
     * @param float $subtotal Sous-total brut du panier
     * @return array
     */
    public static function validateCoupon(?string $code, float $subtotal): array
    {
        if ($code === null || trim($code) === '') {
            return [
                'valid' => false,
                'code' => null,
                'discount' => 0.00,
                'message' => '',
            ];
        }

        $cleanCode = strtoupper(trim($code));

        if (!isset(self::COUPONS[$cleanCode])) {
            return [
                'valid' => false,
                'code' => $cleanCode,
                'discount' => 0.00,
                'message' => 'Code promotionnel invalide ou expiré.',
            ];
        }

        $coupon = self::COUPONS[$cleanCode];

        if (!$coupon['is_active']) {
            return [
                'valid' => false,
                'code' => $cleanCode,
                'discount' => 0.00,
                'message' => 'Ce code promotionnel n\'est plus actif.',
            ];
        }

        if ($subtotal < $coupon['min_spend']) {
            return [
                'valid' => false,
                'code' => $cleanCode,
                'discount' => 0.00,
                'message' => sprintf('Ce code nécessite un montant minimum de %.2f €.', $coupon['min_spend']),
            ];
        }

        $discount = 0.00;
        if ($coupon['type'] === 'percentage') {
            $discount = round($subtotal * ($coupon['value'] / 100), 2);
        } elseif ($coupon['type'] === 'fixed') {
            $discount = min($subtotal, (float)$coupon['value']);
        }

        return [
            'valid' => true,
            'code' => $cleanCode,
            'type' => $coupon['type'],
            'value' => $coupon['value'],
            'discount' => round($discount, 2),
            'label' => $coupon['label'],
            'label_en' => $coupon['label_en'],
            'message' => sprintf('Code promo %s appliqué avec succès !', $cleanCode),
        ];
    }
}
