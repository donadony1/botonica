<?php
declare(strict_types=1);

namespace Ndolo\Controllers;

use Ndolo\Services\CartService;
use Ndolo\Services\ShippingService;
use Ndolo\Services\CouponService;

require_once __DIR__ . '/../services/CartService.php';

/**
 * Contrôleur REST pour le Panier & le Tunnel de Commande
 */
class CartController
{
    /**
     * POST /api/cart/calculate
     * Recalcule l'intégralité du panier (prix, remises, port, TVA OSS)
     */
    public function calculate(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Corps de requête JSON invalide.',
            ]);
            return;
        }

        $items = isset($input['items']) && is_array($input['items']) ? $input['items'] : [];
        $country = isset($input['country']) ? (string)$input['country'] : 'FR';
        $shippingMethod = isset($input['shipping_method']) ? (string)$input['shipping_method'] : 'standard';
        $couponCode = isset($input['coupon_code']) ? (string)$input['coupon_code'] : null;

        $result = CartService::processCart($items, $country, $shippingMethod, $couponCode);

        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    /**
     * POST /api/coupons/validate
     */
    public function validateCoupon(): void
    {
        $input = json_decode(file_get_contents('php://input'), true);
        $code = isset($input['code']) ? (string)$input['code'] : null;
        $subtotal = isset($input['subtotal']) ? (float)$input['subtotal'] : 0.00;

        $result = CouponService::validateCoupon($code, $subtotal);

        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
