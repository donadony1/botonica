<?php
declare(strict_types=1);

namespace Ndolo\Config;

/**
 * Connexion PDO sécurisée — Singleton avec auto-initialisation de la base
 * Règle RULES_ET_WORKFLOW.md : Uniquement des requêtes préparées PDO.
 */
class Database
{
    private static ?\PDO $instance = null;

    /**
     * Retourne la connexion PDO unique et sécurisée.
     * Si la base ou les tables n'existent pas, elles sont créées automatiquement.
     */
    public static function getConnection(): \PDO
    {
        if (self::$instance === null) {
            $driver = self::env('DB_DRIVER', 'mysql');
            $host   = self::env('DB_HOST', '127.0.0.1');
            $port   = self::env('DB_PORT', '3306');
            $name   = self::env('DB_NAME', 'ndolo_rituals');
            $user   = self::env('DB_USER', 'root');
            $pass   = self::env('DB_PASS', '');

            $options = [
                \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES   => false,
                \PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
            ];

            try {
                // 1. Tentative de connexion directe à la base
                $dsn = "$driver:host=$host;port=$port;dbname=$name;charset=utf8mb4";
                self::$instance = new \PDO($dsn, $user, $pass, $options);
            } catch (\PDOException $e) {
                // Si l'erreur est "Unknown database", on la crée automatiquement
                if (str_contains($e->getMessage(), 'Unknown database') || $e->getCode() == 1049) {
                    try {
                        $rootDsn = "$driver:host=$host;port=$port;charset=utf8mb4";
                        $rootPdo = new \PDO($rootDsn, $user, $pass, $options);
                        $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `$name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                        
                        // Reconnexion à la nouvelle base
                        self::$instance = new \PDO("$driver:host=$host;port=$port;dbname=$name;charset=utf8mb4", $user, $pass, $options);
                    } catch (\Throwable $initErr) {
                        self::handleError($initErr->getMessage());
                    }
                } else {
                    self::handleError($e->getMessage());
                }
            }

            // 2. Vérification et initialisation automatique des tables si vides
            if (self::$instance !== null) {
                self::ensureSchema(self::$instance);
            }
        }

        return self::$instance;
    }

    /**
     * Initialise automatiquement les tables depuis schema.sql si les tables n'existent pas
     */
    private static function ensureSchema(\PDO $pdo): void
    {
        try {
            $checkProducts = $pdo->query("SHOW TABLES LIKE 'products'")->fetchAll();
            if (empty($checkProducts)) {
                $schemaFile = __DIR__ . '/../schema.sql';
                if (file_exists($schemaFile)) {
                    $sql = file_get_contents($schemaFile);
                    $pdo->exec($sql);
                }
            }

            // Vérification spécifique de la table articles
            $checkArticles = $pdo->query("SHOW TABLES LIKE 'articles'")->fetchAll();
            if (empty($checkArticles)) {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS articles (
                        id VARCHAR(100) PRIMARY KEY,
                        slug VARCHAR(150) UNIQUE NOT NULL,
                        title VARCHAR(255) NOT NULL,
                        title_en VARCHAR(255),
                        excerpt TEXT NOT NULL,
                        excerpt_en TEXT,
                        content LONGTEXT NOT NULL,
                        content_en LONGTEXT,
                        category VARCHAR(50) NOT NULL,
                        category_label VARCHAR(100) NOT NULL,
                        category_label_en VARCHAR(100),
                        author VARCHAR(100) NOT NULL,
                        author_role VARCHAR(150),
                        author_avatar VARCHAR(500),
                        published_at VARCHAR(50),
                        read_time VARCHAR(50),
                        read_time_en VARCHAR(50),
                        image VARCHAR(500) NOT NULL,
                        tags JSON,
                        featured BOOLEAN DEFAULT FALSE,
                        related_product_ids JSON,
                        is_active BOOLEAN DEFAULT TRUE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
                ");
            }

            // Vérification des tables orders et invoices
            $checkInvoices = $pdo->query("SHOW TABLES LIKE 'invoices'")->fetchAll();
            if (empty($checkInvoices)) {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS orders (
                        id VARCHAR(100) PRIMARY KEY,
                        order_number VARCHAR(50) UNIQUE NOT NULL,
                        customer_name VARCHAR(255) NOT NULL,
                        customer_email VARCHAR(255) NOT NULL,
                        customer_phone VARCHAR(50),
                        shipping_address TEXT NOT NULL,
                        shipping_city VARCHAR(100) NOT NULL,
                        shipping_postal_code VARCHAR(30) NOT NULL,
                        shipping_country VARCHAR(100) NOT NULL,
                        shipping_method VARCHAR(50) NOT NULL DEFAULT 'standard',
                        shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                        subtotal DECIMAL(10, 2) NOT NULL,
                        discount_amount DECIMAL(10, 2) DEFAULT 0.00,
                        coupon_code VARCHAR(50),
                        vat_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
                        vat_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                        total_amount DECIMAL(10, 2) NOT NULL,
                        currency VARCHAR(10) DEFAULT 'EUR',
                        payment_method VARCHAR(50) NOT NULL,
                        payment_status VARCHAR(50) DEFAULT 'paid',
                        payment_transaction_id VARCHAR(255),
                        order_status VARCHAR(50) DEFAULT 'processing',
                        tracking_number VARCHAR(100),
                        carrier VARCHAR(100),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

                    CREATE TABLE IF NOT EXISTS order_items (
                        id VARCHAR(100) PRIMARY KEY,
                        order_id VARCHAR(100) NOT NULL,
                        product_id VARCHAR(100) NOT NULL,
                        product_name VARCHAR(255) NOT NULL,
                        unit_price DECIMAL(10, 2) NOT NULL,
                        quantity INT NOT NULL,
                        total_price DECIMAL(10, 2) NOT NULL,
                        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

                    CREATE TABLE IF NOT EXISTS invoices (
                        id VARCHAR(100) PRIMARY KEY,
                        invoice_number VARCHAR(50) UNIQUE NOT NULL,
                        order_id VARCHAR(100) NOT NULL,
                        order_number VARCHAR(50) NOT NULL,
                        customer_name VARCHAR(255) NOT NULL,
                        customer_email VARCHAR(255) NOT NULL,
                        customer_phone VARCHAR(50),
                        shipping_address TEXT NOT NULL,
                        shipping_city VARCHAR(100) NOT NULL,
                        shipping_postal_code VARCHAR(30) NOT NULL,
                        shipping_country VARCHAR(100) NOT NULL,
                        items JSON NOT NULL,
                        subtotal DECIMAL(10, 2) NOT NULL,
                        vat_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
                        vat_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                        shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                        discount_amount DECIMAL(10, 2) DEFAULT 0.00,
                        coupon_code VARCHAR(50),
                        total_amount DECIMAL(10, 2) NOT NULL,
                        currency VARCHAR(10) DEFAULT 'EUR',
                        payment_method VARCHAR(50) NOT NULL,
                        payment_status VARCHAR(50) DEFAULT 'paid',
                        invoice_html LONGTEXT,
                        email_sent BOOLEAN DEFAULT TRUE,
                        email_sent_at TIMESTAMP NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_order_id (order_id),
                        INDEX idx_invoice_num (invoice_number),
                        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
                ");
            }

            // Vérification de la table site_visits
            $checkVisits = $pdo->query("SHOW TABLES LIKE 'site_visits'")->fetchAll();
            if (empty($checkVisits)) {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS site_visits (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        ip_hash VARCHAR(64) NULL,
                        page_url VARCHAR(255) DEFAULT '/',
                        user_agent TEXT NULL,
                        referrer VARCHAR(255) NULL,
                        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_visited_at (visited_at),
                        INDEX idx_ip_hash (ip_hash)
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
                ");
            }

            // Vérification de la table users (Authentification & Rôles Admin / Gérant)
            $checkUsers = $pdo->query("SHOW TABLES LIKE 'users'")->fetchAll();
            if (empty($checkUsers)) {
                $pdo->exec("
                    CREATE TABLE IF NOT EXISTS users (
                        id VARCHAR(100) PRIMARY KEY,
                        name VARCHAR(150) NOT NULL,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password_hash VARCHAR(255) NOT NULL,
                        role ENUM('admin', 'gerant') NOT NULL DEFAULT 'gerant',
                        is_active BOOLEAN DEFAULT TRUE,
                        created_by VARCHAR(100) NULL,
                        last_login_at TIMESTAMP NULL DEFAULT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        INDEX idx_user_email (email),
                        INDEX idx_user_role (role),
                        INDEX idx_user_active (is_active),
                        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
                    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
                ");
            }

            // Vérifier et insérer l'administrateur par défaut si aucun compte n'existe
            $adminCount = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
            if ($adminCount === 0) {
                $defaultHash = password_hash('AdminNdolo2026!', PASSWORD_BCRYPT, ['cost' => 12]);
                $stmt = $pdo->prepare("
                    INSERT INTO users (id, name, email, password_hash, role, is_active)
                    VALUES (:id, :name, :email, :hash, 'admin', 1)
                    ON DUPLICATE KEY UPDATE name=VALUES(name)
                ");
                $stmt->execute([
                    'id'    => 'usr_superadmin',
                    'name'  => 'Administrateur Ndolo',
                    'email' => 'admin@ndolo-rituals.fr',
                    'hash'  => $defaultHash,
                ]);
            }
        } catch (\Throwable) {
            // Ignorer si déjà initialisé
        }
    }

    private static function handleError(string $msg): void
    {
        http_response_code(503);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        echo json_encode([
            'success' => false,
            'error' => 'Erreur de connexion MySQL : ' . $msg,
            'hint' => 'Vérifiez que le service MySQL de XAMPP est bien démarré (bouton Start dans le Control Panel).',
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }

    private static function env(string $key, string $default = ''): string
    {
        $val = @getenv($key);
        if ($val === false || $val === '') {
            $val = $_ENV[$key] ?? $_SERVER[$key] ?? false;
        }
        return ($val !== false && $val !== '') ? (string)$val : $default;
    }
}
