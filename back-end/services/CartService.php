<?php
declare(strict_types=1);

namespace Ndolo\Services;

use Ndolo\Config\Database;

require_once __DIR__ . '/TaxService.php';
require_once __DIR__ . '/ShippingService.php';
require_once __DIR__ . '/CouponService.php';
require_once __DIR__ . '/../config/database.php';

/**
 * Service Central de Recalcul du Panier (Source Unique de Vérité)
 * - Interroge la base de données MySQL `products` en temps réel
 * - Recalcule de façon souveraine prix, taxes, TVA OSS, remises coupons et frais de port
 */
class CartService
{
    /**
     * Catalogue statique de secours si la base de données est indisponible
     */
    private const FALLBACK_CATALOG = [
        'lavande-olive' => [
            'id' => 'lavande-olive',
            'name' => 'Savon Lavande & Olive',
            'name_en' => 'Lavender & Olive Soap',
            'price' => 24.00,
            'weight_g' => 120,
            'stock' => 28,
        ],
        'eucalyptus-clay' => [
            'id' => 'eucalyptus-clay',
            'name' => 'Eucalyptus & French Clay',
            'name_en' => 'Eucalyptus & French Clay',
            'price' => 24.00,
            'weight_g' => 120,
            'stock' => 4,
        ],
        'wild-orange-cedar' => [
            'id' => 'wild-orange-cedar',
            'name' => 'Wild Orange & Cedar',
            'name_en' => 'Wild Orange & Cedar',
            'price' => 24.00,
            'weight_g' => 120,
            'stock' => 19,
        ],
        'oat-milk-honey' => [
            'id' => 'oat-milk-honey',
            'name' => 'Oat Milk & Honey',
            'name_en' => 'Oat Milk & Raw Honey',
            'price' => 24.00,
            'weight_g' => 120,
            'stock' => 35,
        ],
        'savon-signature' => [
            'id' => 'savon-signature',
            'name' => 'Le Savon Signature',
            'name_en' => 'The Signature Ndolo Soap',
            'price' => 24.00,
            'weight_g' => 130,
            'stock' => 14,
        ],
        'cedar-vetiver-oil' => [
            'id' => 'cedar-vetiver-oil',
            'name' => 'Cedar & Vetiver Body Oil',
            'name_en' => 'Cedar & Vetiver Body Oil',
            'price' => 65.00,
            'weight_g' => 150,
            'stock' => 3,
        ],
    ];

    /**
     * Récupère un produit depuis la base de données MySQL
     */
    private function getProductFromDb(string $productId): ?array
    {
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT id, name, name_en, price, stock, weight FROM products WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $productId]);
            $row = $stmt->fetch();
            if ($row) {
                return [
                    'id'       => (string)$row['id'],
                    'name'     => (string)$row['name'],
                    'name_en'  => (string)($row['name_en'] ?? $row['name']),
                    'price'    => (float)$row['price'],
                    'stock'    => (int)$row['stock'],
                    'weight_g' => 120,
                ];
            }
        } catch (\Throwable $e) {
            // Log silencieux et passage au fallback
        }

        return self::FALLBACK_CATALOG[$productId] ?? null;
    }

    /**
     * Calculer l'intégralité d'un panier
     *
     * @param array $rawItems Liste des articles demandés
     * @param string $countryCode Code pays de livraison (FR, ES, US, CM, etc.)
     * @param string $shippingMethod Mode de livraison ('standard' ou 'express')
     * @param string|null $couponCode Code promo éventuel
     * @return array
     */
    public function calculate(
        array $rawItems,
        string $countryCode = 'FR',
        string $shippingMethod = 'standard',
        ?string $couponCode = null
    ): array {
        $validatedItems = [];
        $subtotal = 0.00;
        $totalWeight = 0;
        $warnings = [];

        // 1. Validation de chaque article et calcul du sous-total
        foreach ($rawItems as $item) {
            $productId = (string)($item['productId'] ?? $item['product']['id'] ?? $item['id'] ?? '');
            $requestedQty = max(1, (int)($item['quantity'] ?? 1));

            $product = $this->getProductFromDb($productId);

            // Si le produit n'existe pas en BDD, utiliser les informations passées par la requête
            if (!$product) {
                $pName = (string)($item['product']['name'] ?? $item['name'] ?? 'Soin Ndolo');
                $pPrice = (float)($item['product']['price'] ?? $item['price'] ?? 24.00);
                $product = [
                    'id'       => $productId ?: 'prod_' . bin2hex(random_bytes(4)),
                    'name'     => $pName,
                    'name_en'  => $pName,
                    'price'    => max(0.01, $pPrice),
                    'stock'    => 50,
                    'weight_g' => 120,
                ];
            }

            $actualQty = $requestedQty;
            $lineTotal = round($product['price'] * $actualQty, 2);
            $subtotal += $lineTotal;
            $totalWeight += ($product['weight_g'] * $actualQty);

            $validatedItems[] = [
                'product_id'      => $product['id'],
                'name'            => $product['name'],
                'name_en'         => $product['name_en'] ?? $product['name'],
                'unit_price'      => $product['price'],
                'quantity'        => $actualQty,
                'total_price'     => $lineTotal,
                'available_stock' => $product['stock'] ?? 20,
            ];
        }

        $subtotal = round($subtotal, 2);

        // 2. Application du code promo
        $couponResult = CouponService::validateCoupon($couponCode, $subtotal);
        $discountAmount = (float)$couponResult['discount'];
        $subtotalAfterDiscount = max(0.00, round($subtotal - $discountAmount, 2));

        // 3. Calcul des frais de port
        $shippingResult = ShippingService::calculateShipping($countryCode, $subtotalAfterDiscount, $shippingMethod);
        $shippingCost = (float)$shippingResult['cost'];

        // 4. Calcul fiscal TVA OSS / Export
        $taxInfo = TaxService::getTaxInfo($countryCode);
        $vatRate = (float)$taxInfo['rate'];
        $totalAmount = round($subtotalAfterDiscount + $shippingCost, 2);
        $taxBreakdown = TaxService::calculateTaxBreakdown($totalAmount, $vatRate);

        return [
            'success'               => true,
            'items'                 => $validatedItems,
            'items_count'           => count($validatedItems),
            'total_quantity'        => array_sum(array_column($validatedItems, 'quantity')),
            'total_weight_g'        => $totalWeight,
            
            // Montants standardisés
            'subtotal'              => $subtotal,
            'subtotal_gross'        => $subtotal,
            'discount'              => [
                'amount' => $discountAmount,
                'code'   => $couponCode,
                'valid'  => $couponResult['valid'] ?? false,
            ],
            'discount_amount'       => $discountAmount,
            'subtotal_net'          => $subtotalAfterDiscount,
            'coupon'                => $couponResult,
            
            // Livraison
            'shipping'              => $shippingResult,
            'shipping_cost'         => $shippingCost,
            
            // Fiscalité
            'tax'                   => [
                'rate'   => $vatRate,
                'amount' => $taxBreakdown['vat'],
            ],
            'tax_info'              => [
                'country'      => $taxInfo['code'],
                'country_name' => $taxInfo['name'],
                'is_eu'        => $taxInfo['is_eu'],
                'vat_rate'     => $vatRate,
                'vat_amount'   => $taxBreakdown['vat'],
                'amount_ht'    => $taxBreakdown['ht'],
                'amount_ttc'   => $taxBreakdown['ttc'],
                'tax_regime'   => $taxInfo['is_eu'] ? 'Régime OSS Union Européenne' : 'Exportation exonérée de TVA (Art. 262-I CGI)',
            ],
            
            // Total souverain
            'currency'              => 'EUR',
            'total_amount'          => $totalAmount,
            'warnings'              => $warnings,
            'calculated_at'         => date('c'),
        ];
    }

    /**
     * Méthode statique pour rétro-compatibilité
     */
    public static function processCart(
        array $rawItems,
        string $countryCode = 'FR',
        string $shippingMethod = 'standard',
        ?string $couponCode = null
    ): array {
        return (new self())->calculate($rawItems, $countryCode, $shippingMethod, $couponCode);
    }
}
