-- ==============================================================================
-- SCHEMA BDD — E-COMMERCE NDOLO RITUALS (Saponification artisanale & Cosmétiques)
-- Compatible MySQL 8.0+ / MariaDB / PostgreSQL (Supabase)
-- ==============================================================================

-- 1. Table des Catégories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des Produits (avec conformité GPSR & gestion des stocks)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    tagline VARCHAR(255),
    tagline_en VARCHAR(255),
    category_id VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    tags JSON,
    description TEXT NOT NULL,
    description_en TEXT,
    long_description TEXT,
    long_description_en TEXT,
    images JSON NOT NULL,
    aspect_ratio VARCHAR(20) DEFAULT 'square',
    ingredients JSON,
    usage_tips TEXT,
    usage_tips_en TEXT,
    shipping_info TEXT,
    shipping_info_en TEXT,
    surgras_percentage VARCHAR(20),
    scent_profile VARCHAR(255),
    scent_profile_en VARCHAR(255),
    weight VARCHAR(50) DEFAULT '120g',
    featured BOOLEAN DEFAULT FALSE,
    stock INT NOT NULL DEFAULT 20,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    inci_list TEXT NOT NULL,
    origin_country VARCHAR(100) DEFAULT 'France / Provence',
    responsible_person VARCHAR(255) DEFAULT 'Ndolo Rituals SARL, 14 Rue des Lavandes, 13100 Aix-en-Provence, France',
    pao VARCHAR(20) DEFAULT '18M',
    batch_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 3. Table des Avis Clients
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    product_id VARCHAR(100) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. Table des Codes Promotionnels
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    min_spend DECIMAL(10, 2) DEFAULT 0.00,
    max_uses INT DEFAULT NULL,
    current_uses INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table des Commandes
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
    payment_method ENUM('stripe', 'paypal', 'orange_money', 'mtn_momo', 'bank_transfer') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_transaction_id VARCHAR(255),
    order_status ENUM('processing', 'prepared', 'shipped', 'delivered', 'cancelled') DEFAULT 'processing',
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Table des Lignes de Commande
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- 7. Table des Paramètres du Site
CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. Table des Articles de Blog / Journal
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
);

-- 9. Table des Factures Clients (Génération après paiement & envoi email)
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
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ===============================================================================
-- DONNÉES INITIALES (SEED)
-- ===============================================================================

INSERT INTO categories (id, name, name_en, slug, description) VALUES
('soaps', 'Savons Saponifiés à Froid', 'Cold Process Soaps', 'savons', 'Savons surgras 100% naturels fabriqués artisanalement.'),
('oils', 'Huiles Précieuses', 'Precious Oils', 'huiles', 'Huiles végétales pures de première pression à froid.'),
('rituals', 'Coffrets & Rituels', 'Sets & Rituals', 'rituels', 'Rituels complets de soin holistique pour le corps et l esprit.'),
('accessories', 'Accessoires Botaniques', 'Botanical Accessories', 'accessoires', 'Porte-savons en bois noble et accessoires durables.')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO coupons (id, code, discount_type, discount_value, min_spend, is_active) VALUES
('c1', 'BIENVENUE10', 'percentage', 10.00, 0.00, TRUE),
('c2', 'NDOLO10', 'percentage', 10.00, 0.00, TRUE),
('c3', 'NATUREL', 'fixed', 15.00, 50.00, TRUE)
ON DUPLICATE KEY UPDATE code=VALUES(code);
