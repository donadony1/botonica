<?php
declare(strict_types=1);

namespace Ndolo\Controllers;

use Ndolo\Config\Database;
use Ndolo\Services\InvoiceService;
use Ndolo\Services\CartService;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/InvoiceService.php';
require_once __DIR__ . '/../services/CartService.php';

/**
 * Contrôleur des Commandes & Factures
 * - POST /api/orders      → Validation du paiement, création de commande, réduction stock, facture BDD & envoi email
 * - GET  /api/orders      → Liste des commandes pour l'administration
 * - GET  /api/invoices/{num} → Consultation d'une facture spécifique
 */
class OrderController
{
    private \PDO $db;
    private InvoiceService $invoiceService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->invoiceService = new InvoiceService();
    }

    /**
     * POST /api/orders (Finalisation commande & paiement)
     */
    public function checkout(): void
    {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw ?: '{}', true) ?: [];

        $customerName  = trim($body['fullName'] ?? $body['customer_name'] ?? '');
        $customerEmail = trim($body['email'] ?? $body['customer_email'] ?? '');
        $customerPhone = trim($body['phone'] ?? $body['customer_phone'] ?? '');
        $address       = trim($body['address'] ?? $body['shipping_address'] ?? '');
        $city          = trim($body['city'] ?? $body['shipping_city'] ?? '');
        $postalCode    = trim($body['postalCode'] ?? $body['shipping_postal_code'] ?? '');
        $country       = trim($body['country'] ?? $body['shipping_country'] ?? 'FR');
        $shippingMethod= trim($body['shippingMethod'] ?? $body['shipping_method'] ?? 'standard');
        $paymentMethod = trim($body['paymentMethod'] ?? $body['payment_method'] ?? 'card');
        $couponCode    = trim($body['couponCode'] ?? $body['coupon_code'] ?? '');
        $items         = $body['items'] ?? [];

        if (empty($customerName) || empty($customerEmail) || empty($address) || empty($city) || empty($items)) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'error'   => 'Informations client ou panier incomplets.',
            ]);
            return;
        }

        // Calcul fiscal et tarifaire officiel
        $cartService = new CartService();
        $calc = $cartService->calculate($items, $country, $shippingMethod, $couponCode);

        $orderId     = 'ord_' . bin2hex(random_bytes(6));
        $year        = date('Y');
        $orderNumber = "NDO-{$year}-" . str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);

        try {
            $this->db->beginTransaction();

            // 1. Insertion de la commande
            $sqlOrder = "INSERT INTO orders (
                id, order_number, customer_name, customer_email, customer_phone,
                shipping_address, shipping_city, shipping_postal_code, shipping_country,
                shipping_method, shipping_cost, subtotal, discount_amount, coupon_code,
                vat_rate, vat_amount, total_amount, currency, payment_method, payment_status,
                order_status
            ) VALUES (
                :id, :order_number, :customer_name, :customer_email, :customer_phone,
                :shipping_address, :shipping_city, :shipping_postal_code, :shipping_country,
                :shipping_method, :shipping_cost, :subtotal, :discount_amount, :coupon_code,
                :vat_rate, :vat_amount, :total_amount, 'EUR', :payment_method, 'paid',
                'processing'
            )";

            $stmtOrder = $this->db->prepare($sqlOrder);
            $stmtOrder->execute([
                ':id'                   => $orderId,
                ':order_number'         => $orderNumber,
                ':customer_name'        => $customerName,
                ':customer_email'       => $customerEmail,
                ':customer_phone'       => $customerPhone,
                ':shipping_address'     => $address,
                ':shipping_city'        => $city,
                ':shipping_postal_code' => $postalCode,
                ':shipping_country'     => $country,
                ':shipping_method'      => $shippingMethod,
                ':shipping_cost'        => $calc['shipping']['cost'],
                ':subtotal'             => $calc['subtotal'],
                ':discount_amount'      => $calc['discount']['amount'],
                ':coupon_code'          => $couponCode ?: null,
                ':vat_rate'             => $calc['tax']['rate'],
                ':vat_amount'           => $calc['tax']['amount'],
                ':total_amount'         => $calc['total_amount'],
                ':payment_method'       => $paymentMethod,
            ]);

            // 2. Insertion des lignes de commande et décrémentation des stocks
            $sqlItem = "INSERT INTO order_items (id, order_id, product_id, product_name, unit_price, quantity, total_price)
                        VALUES (:id, :order_id, :product_id, :product_name, :unit_price, :quantity, :total_price)";
            $stmtItem = $this->db->prepare($sqlItem);

            $sqlStock = "UPDATE products SET stock = GREATEST(0, stock - :qty) WHERE id = :prod_id";
            $stmtStock = $this->db->prepare($sqlStock);

            foreach ($items as $it) {
                $pId   = $it['product']['id'] ?? $it['id'] ?? 'unknown';
                $pName = $it['product']['name'] ?? $it['name'] ?? 'Soin Ndolo';
                $pPrice= (float)($it['product']['price'] ?? $it['price'] ?? 0.0);
                $pQty  = (int)($it['quantity'] ?? 1);
                $pTot  = $pQty * $pPrice;

                $stmtItem->execute([
                    ':id'          => 'item_' . bin2hex(random_bytes(5)),
                    ':order_id'    => $orderId,
                    ':product_id'  => $pId,
                    ':product_name'=> $pName,
                    ':unit_price'  => $pPrice,
                    ':quantity'    => $pQty,
                    ':total_price' => $pTot,
                ]);

                // Réduction stock
                $stmtStock->execute([':qty' => $pQty, ':prod_id' => $pId]);
            }

            $this->db->commit();

            // 3. Génération officielle de la facture en BDD et envoi par email
            $orderDataForInvoice = [
                'id'                   => $orderId,
                'order_number'         => $orderNumber,
                'customer_name'        => $customerName,
                'customer_email'       => $customerEmail,
                'customer_phone'       => $customerPhone,
                'shipping_address'     => $address,
                'shipping_city'        => $city,
                'shipping_postal_code' => $postalCode,
                'shipping_country'     => $country,
                'subtotal'             => $calc['subtotal'],
                'vat_rate'             => $calc['tax']['rate'],
                'vat_amount'           => $calc['tax']['amount'],
                'shipping_cost'        => $calc['shipping']['cost'],
                'discount_amount'      => $calc['discount']['amount'],
                'coupon_code'          => $couponCode,
                'total_amount'         => $calc['total_amount'],
                'payment_method'       => $paymentMethod,
                'currency'             => 'EUR',
            ];

            $invoiceResult = $this->invoiceService->generateAndSend($orderDataForInvoice, $items);

            http_response_code(201);
            echo json_encode([
                'success'       => true,
                'message'       => 'Paiement confirmé, commande enregistrée et facture envoyée par email.',
                'orderId'       => $orderId,
                'orderNumber'   => $orderNumber,
                'invoiceNumber' => $invoiceResult['invoiceNumber'],
                'invoiceUrl'    => $invoiceResult['invoiceUrl'],
                'emailSent'     => $invoiceResult['emailSent'],
                'totalAmount'   => $calc['total_amount'],
                'invoiceHtml'   => $invoiceResult['html'],
            ], JSON_UNESCAPED_UNICODE);

        } catch (\Throwable $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error'   => 'Erreur lors de l\'enregistrement de la commande : ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * GET /api/orders (Liste des commandes)
     */
    public function index(): void
    {
        $stmt = $this->db->query("
            SELECT o.*, i.invoice_number, i.email_sent 
            FROM orders o
            LEFT JOIN invoices i ON o.id = i.order_id
            ORDER BY o.created_at DESC
        ");
        $orders = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'count'   => count($orders),
            'data'    => $orders,
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * GET /api/invoices/{number}
     */
    public function getInvoice(string $invoiceNumber): void
    {
        $stmt = $this->db->prepare("SELECT * FROM invoices WHERE invoice_number = :num LIMIT 1");
        $stmt->execute([':num' => $invoiceNumber]);
        $inv = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$inv) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Facture introuvable.']);
            return;
        }

        echo json_encode([
            'success' => true,
            'data'    => $inv,
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * GET /api/dashboard/stats
     * Fournit les KPIs globaux : produits, articles, ventes, commandes, chiffre d'affaires, visites
     */
    public function getDashboardStats(): void
    {
        try {
            // 1. Total Produits
            $prodCountStmt = $this->db->query("SELECT COUNT(*) as cnt FROM products");
            $totalProducts = (int)($prodCountStmt ? $prodCountStmt->fetchColumn() : 0);

            // 2. Total Articles
            $artCountStmt = $this->db->query("SELECT COUNT(*) as cnt FROM articles");
            $totalArticles = (int)($artCountStmt ? $artCountStmt->fetchColumn() : 0);

            // 3. Total Commandes & Chiffre d'Affaires
            $orderStatsStmt = $this->db->query("
                SELECT 
                    COUNT(*) as total_orders,
                    COALESCE(SUM(total_amount), 0) as total_revenue,
                    COALESCE(AVG(total_amount), 0) as average_order_value
                FROM orders
            ");
            $orderStats = $orderStatsStmt ? $orderStatsStmt->fetch(\PDO::FETCH_ASSOC) : [
                'total_orders' => 0,
                'total_revenue' => 0.00,
                'average_order_value' => 0.00
            ];

            // 4. Total Unités Vendues
            $unitsStmt = $this->db->query("SELECT COALESCE(SUM(quantity), 0) as units FROM order_items");
            $totalUnitsSold = (int)($unitsStmt ? $unitsStmt->fetchColumn() : 0);

            // 5. Dernières 5 commandes
            $recentOrdersStmt = $this->db->query("
                SELECT o.*, i.invoice_number 
                FROM orders o
                LEFT JOIN invoices i ON o.id = i.order_id
                ORDER BY o.created_at DESC
                LIMIT 5
            ");
            $recentOrders = $recentOrdersStmt ? $recentOrdersStmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            // 6. Statistiques réelles des Visites depuis MySQL (table site_visits)
            $visitsCountStmt = $this->db->query("SELECT COUNT(*) as total_v, COUNT(DISTINCT ip_hash) as unique_v FROM site_visits");
            $visitsData = $visitsCountStmt ? $visitsCountStmt->fetch(\PDO::FETCH_ASSOC) : ['total_v' => 0, 'unique_v' => 0];
            $totalVisits = (int)($visitsData['total_v'] ?? 0);
            $uniqueVisitors = (int)($visitsData['unique_v'] ?? 0);

            // Visites du jour
            $todayVisitsStmt = $this->db->query("SELECT COUNT(*) as today_v FROM site_visits WHERE visited_at >= CURDATE()");
            $todayVisits = (int)($todayVisitsStmt ? $todayVisitsStmt->fetchColumn() : 0);

            // Tendance des 7 derniers jours (Visites journalières depuis MySQL)
            $weeklyStmt = $this->db->query("
                SELECT DATE(visited_at) as visit_date, COUNT(*) as count 
                FROM site_visits 
                WHERE visited_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                GROUP BY DATE(visited_at) 
                ORDER BY visit_date ASC
            ");
            $weeklyVisits = $weeklyStmt ? $weeklyStmt->fetchAll(\PDO::FETCH_ASSOC) : [];

            echo json_encode([
                'success' => true,
                'data' => [
                    'total_products'      => $totalProducts,
                    'total_articles'      => $totalArticles,
                    'total_orders'        => (int)$orderStats['total_orders'],
                    'total_revenue'       => (float)$orderStats['total_revenue'],
                    'average_order_value' => (float)$orderStats['average_order_value'],
                    'total_units_sold'    => $totalUnitsSold,
                    'total_visits'        => $totalVisits,
                    'unique_visitors'     => $uniqueVisitors,
                    'today_visits'        => $todayVisits,
                    'weekly_visits'       => $weeklyVisits,
                    'recent_orders'       => $recentOrders,
                ]
            ], JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error'   => $e->getMessage()
            ]);
        }
    }

    /**
     * POST /api/visits (Enregistrement d'une visite en temps réel dans MySQL)
     */
    public function recordVisit(): void
    {
        try {
            $raw = file_get_contents('php://input');
            $body = json_decode($raw ?: '{}', true) ?: [];

            $pageUrl   = trim($body['page_url'] ?? $_SERVER['REQUEST_URI'] ?? '/');
            $referrer  = trim($body['referrer'] ?? $_SERVER['HTTP_REFERER'] ?? '');
            $userAgent = trim($_SERVER['HTTP_USER_AGENT'] ?? '');
            $ip        = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $ipHash    = hash('sha256', $ip . date('Y-m-d')); // Hash anonymisé RGPD conforme

            $stmt = $this->db->prepare("
                INSERT INTO site_visits (ip_hash, page_url, user_agent, referrer, visited_at)
                VALUES (:ip_hash, :page_url, :user_agent, :referrer, NOW())
            ");
            $stmt->execute([
                ':ip_hash'   => $ipHash,
                ':page_url'  => substr($pageUrl, 0, 255),
                ':user_agent'=> substr($userAgent, 0, 500),
                ':referrer'  => substr($referrer, 0, 255),
            ]);

            $totalVisits = (int)$this->db->query("SELECT COUNT(*) FROM site_visits")->fetchColumn();

            echo json_encode([
                'success'      => true,
                'total_visits' => $totalVisits,
            ]);
        } catch (\Throwable $e) {
            echo json_encode([
                'success' => false,
                'error'   => $e->getMessage(),
            ]);
        }
    }
}

