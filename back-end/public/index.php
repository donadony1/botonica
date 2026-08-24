<?php
declare(strict_types=1);

/**
 * Routeur API REST Sécurisé — Ndolo Rituals Backend
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
// 1. CORS DURCI & LISTE BLANCHE
// ─────────────────────────────────────────────────────────
$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost',
    'http://127.0.0.1',
];

$envOrigins = getenv('ALLOWED_ORIGINS');
if ($envOrigins) {
    foreach (explode(',', $envOrigins) as $o) {
        $o = trim($o);
        if ($o !== '') $allowedOrigins[] = $o;
    }
}

$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($httpOrigin && in_array($httpOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $httpOrigin");
    header("Access-Control-Allow-Credentials: true");
} elseif (empty($httpOrigin)) {
    // Requête directe / locale
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token, X-Requested-With, Accept");
header("Access-Control-Max-Age: 86400");

// Répondre aux requêtes préliminaires Preflight OPTIONS
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─────────────────────────────────────────────────────────
// 2. EN-TÊTES DE SÉCURITÉ HTTP STRICTS
// ─────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');

if ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')) {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}

// ─────────────────────────────────────────────────────────
// 3. FONCTIONS DE PROTECTION & AUTHENTIFICATION
// ─────────────────────────────────────────────────────────

/**
 * Vérifie si la requête possède un jeton d'administration valide
 */
function checkAdminAuth(): bool {
    $expectedToken = getenv('ADMIN_API_TOKEN') ?: 'NdoloSecureAdmin2026!';
    
    // 1. Header direct $_SERVER
    $headerToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? null;
    
    // 2. Header Authorization: Bearer <token>
    if (!$headerToken && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Bearer\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            $headerToken = trim($matches[1]);
        }
    }
    
    // 3. Fallback apache_request_headers
    if (!$headerToken && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $headerToken = $headers['X-Admin-Token'] ?? $headers['x-admin-token'] ?? null;
        if (!$headerToken && isset($headers['Authorization'])) {
            if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
                $headerToken = trim($matches[1]);
            }
        }
    }

    // Vérification en temps constant (anti timing-attack)
    if (!$headerToken || !hash_equals($expectedToken, (string)$headerToken)) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error'   => 'Accès non autorisé : Jeton d\'administration manquant ou invalide.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    return true;
}

/**
 * Limiteur de fréquence par IP (Rate Limiter anti-abus)
 */
function checkRateLimit(string $action, int $maxRequests = 20, int $windowSeconds = 60): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $tmpDir = sys_get_temp_dir() . '/ndolo_rate_limits';
    if (!is_dir($tmpDir)) {
        @mkdir($tmpDir, 0777, true);
    }
    $file = $tmpDir . '/' . md5($action . '_' . $ip) . '.json';
    $now = time();
    $data = ['count' => 0, 'first_request' => $now];

    if (file_exists($file)) {
        $content = @file_get_contents($file);
        if ($content) {
            $decoded = json_decode($content, true);
            if (is_array($decoded) && isset($decoded['first_request'], $decoded['count'])) {
                if ($now - $decoded['first_request'] < $windowSeconds) {
                    $data = $decoded;
                }
            }
        }
    }

    $data['count']++;
    @file_put_contents($file, json_encode($data));

    if ($data['count'] > $maxRequests) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'error'   => 'Trop de requêtes. Veuillez patienter un instant avant de réessayer.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// ─────────────────────────────────────────────────────────
// 4. NORMALISATION DE L'URI DEMANDÉE
// ─────────────────────────────────────────────────────────
$requestMethod = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$rawUri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

// Si transmis via query parameter ?route=... ou ?url=...
if (isset($_GET['route'])) {
    $uri = '/' . ltrim((string)$_GET['route'], '/');
} elseif (isset($_GET['url'])) {
    $uri = '/' . ltrim((string)$_GET['url'], '/');
} else {
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
    if ($scriptDir !== '/' && str_starts_with($rawUri, $scriptDir)) {
        $uri = substr($rawUri, strlen($scriptDir));
    } else {
        $uri = $rawUri;
    }
    $uri = preg_replace('#^/index\.php#', '', $uri);
}

// Nettoyer le préfixe /api
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
    // ── ROUTE UPLOAD D'IMAGES (POST — Admin Protégé) ───────
    if ($uri === '/upload' && $requestMethod === 'POST') {
        checkAdminAuth();
        (new UploadController())->upload();

    // ── ROUTE COMMANDES & CHECKOUT (POST Public, GET Admin) 
    } elseif ($uri === '/orders' || $uri === '/checkout') {
        $ctrl = new OrderController();
        if ($requestMethod === 'POST') {
            checkRateLimit('checkout', 15, 60);
            $ctrl->checkout();
        } elseif ($requestMethod === 'GET') {
            checkAdminAuth();
            $ctrl->index();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE ENREGISTREMENT VISITES (POST Public) ────────
    } elseif ($uri === '/visits' && $requestMethod === 'POST') {
        checkRateLimit('visits', 60, 60);
        (new OrderController())->recordVisit();

    // ── ROUTE STATISTIQUES DASHBOARD (GET Admin Protégé) ──
    } elseif (($uri === '/dashboard/stats' || $uri === '/stats') && $requestMethod === 'GET') {
        checkAdminAuth();
        (new OrderController())->getDashboardStats();

    // ── ROUTE FACTURE PAR NUMÉRO (GET Public avec token/numéro) ──
    } elseif (preg_match('#^/invoices/([a-z0-9\-]+)$#i', $uri, $m)) {
        $ctrl = new OrderController();
        if ($requestMethod === 'GET') {
            $ctrl->getInvoice($m[1]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE ARTICLES (GET Public, POST Admin Protégé) ───
    } elseif ($uri === '/articles') {
        $ctrl = new ArticleController();
        if ($requestMethod === 'GET') {
            $ctrl->index();
        } elseif ($requestMethod === 'POST') {
            checkAdminAuth();
            $ctrl->create();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE ARTICLE PAR ID (GET Public, PUT/DELETE Admin) 
    } elseif (preg_match('#^/articles/([a-z0-9\-]+)$#i', $uri, $m)) {
        $ctrl = new ArticleController();
        if ($requestMethod === 'GET') {
            $ctrl->show($m[1]);
        } elseif ($requestMethod === 'PUT') {
            checkAdminAuth();
            $ctrl->update($m[1]);
        } elseif ($requestMethod === 'DELETE') {
            checkAdminAuth();
            $ctrl->delete($m[1]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE PRODUITS (GET Public, POST Admin Protégé) ───
    } elseif ($uri === '/products') {
        $ctrl = new ProductController();
        if ($requestMethod === 'GET') {
            $ctrl->index();
        } elseif ($requestMethod === 'POST') {
            checkAdminAuth();
            $ctrl->create();
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE PRODUIT PAR ID (GET Public, PUT/DELETE Admin) 
    } elseif (preg_match('#^/products/([a-z0-9\-]+)$#i', $uri, $m)) {
        $ctrl = new ProductController();
        if ($requestMethod === 'GET') {
            $ctrl->show($m[1]);
        } elseif ($requestMethod === 'PUT') {
            checkAdminAuth();
            $ctrl->update($m[1]);
        } elseif ($requestMethod === 'DELETE') {
            checkAdminAuth();
            $ctrl->delete($m[1]);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Méthode non autorisée.']);
        }

    // ── ROUTE CALCUL PANIER (POST Public) ─────────────────
    } elseif ($uri === '/cart/calculate' && $requestMethod === 'POST') {
        (new CartController())->calculate();

    // ── ROUTE VALIDATION COUPON (POST Public) ─────────────
    } elseif ($uri === '/coupons/validate' && $requestMethod === 'POST') {
        checkRateLimit('coupon', 30, 60);
        (new CartController())->validateCoupon();

    // ── HEALTH CHECK ──────────────────────────────────────
    } elseif ($uri === '/' || $uri === '/health') {
        echo json_encode([
            'status'     => 'online',
            'service'    => 'Ndolo Rituals API v1.0 (Secured)',
            'env'        => getenv('APP_ENV') ?: 'development',
            'time'       => date('c'),
            'parsed_uri' => $uri,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error'   => 'Endpoint introuvable.',
            'path'    => $uri,
        ]);
    }

} catch (\Throwable $e) {
    http_response_code(500);
    $isDev = (getenv('APP_ENV') ?: 'development') === 'development';
    echo json_encode([
        'success' => false,
        'error'   => 'Erreur serveur interne.',
        'details' => $isDev ? $e->getMessage() : null,
    ]);
}
