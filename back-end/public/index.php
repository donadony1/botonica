<?php
declare(strict_types=1);

/**
 * Routeur API REST — Ndolo Rituals Backend
 * Compatible Apache XAMPP, Nginx et PHP Built-in Server
 */

// Chargement du .env
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($val));
    }
}

// ─────────────────────────────────────────────────────────
// CORS — Autorise le frontend Vite (port 5173, 3000, etc.)
// ─────────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 86400");

// Répondre aux requêtes préliminaires Preflight OPTIONS
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// En-têtes de sécurité HTTP
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// ─────────────────────────────────────────────────────────
// Normalisation de l'URI demandée
// ─────────────────────────────────────────────────────────
$requestMethod = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$rawUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

// 1. Si transmis via query parameter ?route=... ou ?url=...
if (isset($_GET['route'])) {
    $uri = '/' . ltrim((string)$_GET['route'], '/');
} elseif (isset($_GET['url'])) {
    $uri = '/' . ltrim((string)$_GET['url'], '/');
} else {
    // 2. Nettoyage du chemin relatif par rapport au script PHP
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    if ($scriptDir !== '/' && str_starts_with($rawUri, $scriptDir)) {
        $uri = substr($rawUri, strlen($scriptDir));
    } else {
        $uri = $rawUri;
    }
    
    // Nettoyer /index.php si présent dans l'URI
    $uri = preg_replace('#^/index\.php#', '', $uri);
}

// Nettoyer le préfixe /api si présent pour normaliser (/api/products -> /products)
$uri = preg_replace('#^/api#', '', '/' . ltrim($uri ?? '', '/'));
$uri = '/' . trim($uri, '/');
if ($uri === '//' || $uri === '') $uri = '/';

// Import des contrôleurs
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/CartController.php';
require_once __DIR__ . '/../controllers/UploadController.php';
require_once __DIR__ . '/../controllers/ArticleController.php';
require_once __DIR__ . '/../controllers/OrderController.php';

use Ndolo\Controllers\ProductController;
use Ndolo\Controllers\CartController;
use Ndolo\Controllers\UploadController;
use Ndolo\Controllers\ArticleController;
use Ndolo\Controllers\OrderController;

try {
    // ── ROUTE UPLOAD D'IMAGES (POST) ──────────────────────
    if ($uri === '/upload' && $requestMethod === 'POST') {
        (new UploadController())->upload();

    // ── ROUTE COMMANDES & CHECKOUT (POST, GET) ────────────
    } elseif ($uri === '/orders' || $uri === '/checkout') {
        $ctrl = new OrderController();
        if ($requestMethod === 'POST') {
            $ctrl->checkout();
        } elseif ($requestMethod === 'GET') {
            $ctrl->index();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE ENREGISTREMENT VISITES (POST) ──────────────
    } elseif ($uri === '/visits' && $requestMethod === 'POST') {
        (new OrderController())->recordVisit();

    // ── ROUTE STATISTIQUES DASHBOARD (GET) ───────────────
    } elseif (($uri === '/dashboard/stats' || $uri === '/stats') && $requestMethod === 'GET') {
        (new OrderController())->getDashboardStats();

    // ── ROUTE FACTURE PAR NUMÉRO (GET) ────────────────────
    } elseif (preg_match('#^/invoices/([a-z0-9\-]+)$#i', $uri, $m)) {
        $ctrl = new OrderController();
        if ($requestMethod === 'GET') {
            $ctrl->getInvoice($m[1]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE ARTICLES (GET, POST) ────────────────────────
    } elseif ($uri === '/articles') {
        $ctrl = new ArticleController();
        if ($requestMethod === 'GET') {
            $ctrl->index();
        } elseif ($requestMethod === 'POST') {
            $ctrl->create();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE ARTICLE PAR ID (GET, PUT, DELETE) ───────────
    } elseif (preg_match('#^/articles/([a-z0-9\-]+)$#i', $uri, $m)) {
        $ctrl = new ArticleController();
        if ($requestMethod === 'GET') {
            $ctrl->show($m[1]);
        } elseif ($requestMethod === 'PUT') {
            $ctrl->update($m[1]);
        } elseif ($requestMethod === 'DELETE') {
            $ctrl->delete($m[1]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE PRODUITS (GET, POST) ────────────────────────
    } elseif ($uri === '/products') {
        $ctrl = new ProductController();
        if ($requestMethod === 'GET') {
            $ctrl->index();
        } elseif ($requestMethod === 'POST') {
            $ctrl->create();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE PRODUIT PAR ID (GET, PUT, DELETE) ───────────
    } elseif (preg_match('#^/products/([a-z0-9\-]+)$#i', $uri, $m)) {
        $ctrl = new ProductController();
        if ($requestMethod === 'GET') {
            $ctrl->show($m[1]);
        } elseif ($requestMethod === 'PUT') {
            $ctrl->update($m[1]);
        } elseif ($requestMethod === 'DELETE') {
            $ctrl->delete($m[1]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE CALCUL PANIER (POST) ────────────────────────
    } elseif ($uri === '/cart/calculate' && $requestMethod === 'POST') {
        (new CartController())->calculate();

    // ── ROUTE VALIDATION COUPON (POST) ────────────────────
    } elseif ($uri === '/coupons/validate' && $requestMethod === 'POST') {
        (new CartController())->validateCoupon();

    // ── HEALTH CHECK ──────────────────────────────────────
    } elseif ($uri === '/' || $uri === '/health') {
        echo json_encode([
            'status'  => 'online',
            'service' => 'Ndolo Rituals API v1.0',
            'env'     => getenv('APP_ENV') ?: 'development',
            'time'    => date('c'),
            'parsed_uri' => $uri,
            'routes'  => [
                'GET    /api/products',
                'GET    /api/products/{id}',
                'POST   /api/products',
                'PUT    /api/products/{id}',
                'DELETE /api/products/{id}',
                'POST   /api/cart/calculate',
                'POST   /api/coupons/validate',
            ],
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error'   => 'Endpoint introuvable.',
            'path'    => $uri,
            'raw_uri' => $rawUri,
            'method'  => $requestMethod,
        ]);
    }

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Erreur serveur interne : ' . $e->getMessage(),
        'file'    => $e->getFile() . ':' . $e->getLine(),
    ]);
}
