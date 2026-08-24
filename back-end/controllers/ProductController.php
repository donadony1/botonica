<?php
declare(strict_types=1);

namespace Ndolo\Controllers;

use Ndolo\Config\Database;

require_once __DIR__ . '/../config/database.php';

/**
 * Contrôleur Produits — CRUD complet via API REST sécurisée
 * GET    /api/products          → liste catalogue actif
 * GET    /api/products/{id}     → fiche détaillée + avis
 * POST   /api/products          → création d'un produit
 * PUT    /api/products/{id}     → mise à jour complète
 * DELETE /api/products/{id}     → désactivation (soft delete)
 */
class ProductController
{
    // ──────────────────────────────────────────────────────────
    // GET /api/products
    // ──────────────────────────────────────────────────────────
    public function index(): void
    {
        $db   = Database::getConnection();
        $stmt = $db->prepare("
            SELECT id, name, name_en, tagline, tagline_en,
                   category_id AS category,
                   price, rating, review_count AS reviewCount,
                   tags, description, description_en,
                   long_description AS longDescription,
                   long_description_en AS longDescriptionEn,
                   images, aspect_ratio AS aspectRatio,
                   ingredients, usage_tips AS usageTips,
                   usage_tips_en AS usageTipsEn,
                   shipping_info AS shippingInfo,
                   shipping_info_en AS shippingInfoEn,
                   surgras_percentage AS surgrasPercentage,
                   scent_profile AS scentProfile,
                   scent_profile_en AS scentProfileEn,
                   weight, featured,
                   stock, low_stock_threshold AS lowStockThreshold,
                   inci_list AS inci, origin_country AS originCountry,
                   responsible_person AS responsiblePerson,
                   pao, batch_number AS batchNumber,
                   created_at AS createdAt, updated_at AS updatedAt
            FROM products
            WHERE is_active = 1
            ORDER BY featured DESC, created_at DESC
        ");
        $stmt->execute();
        $products = array_map([$this, 'hydrate'], $stmt->fetchAll());

        $this->json(['success' => true, 'count' => count($products), 'data' => $products]);
    }

    // ──────────────────────────────────────────────────────────
    // GET /api/products/{id}
    // ──────────────────────────────────────────────────────────
    public function show(string $id): void
    {
        if (!$this->validId($id)) { $this->error('Identifiant invalide.', 400); return; }

        $db   = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM products WHERE id = :id AND is_active = 1 LIMIT 1");
        $stmt->bindValue(':id', $id, \PDO::PARAM_STR);
        $stmt->execute();
        $row  = $stmt->fetch();

        if (!$row) { $this->error('Produit introuvable.', 404); return; }

        $product = $this->hydrate($row);

        // Avis approuvés
        $stmtR = $db->prepare("
            SELECT id, author, rating, comment,
                   verified_purchase AS verifiedPurchase, created_at AS date
            FROM reviews WHERE product_id = :pid AND status = 'approved'
            ORDER BY created_at DESC LIMIT 50
        ");
        $stmtR->bindValue(':pid', $id, \PDO::PARAM_STR);
        $stmtR->execute();
        $product['reviews'] = $stmtR->fetchAll();

        $this->json(['success' => true, 'data' => $product]);
    }

    // ──────────────────────────────────────────────────────────
    // POST /api/products  → Création
    // ──────────────────────────────────────────────────────────
    public function create(): void
    {
        $body = $this->parseBody();
        if (!$body) { $this->error('Corps JSON invalide.', 400); return; }

        $v = $this->validateProductBody($body);
        if ($v !== true) { $this->error($v, 422); return; }

        $id = $this->generateId((string)($body['name'] ?? 'product'));

        $db   = Database::getConnection();
        $stmt = $db->prepare("
            INSERT INTO products (
                id, name, name_en, tagline, tagline_en, category_id,
                price, rating, review_count, tags,
                description, description_en, long_description, long_description_en,
                images, aspect_ratio, ingredients,
                usage_tips, usage_tips_en, shipping_info, shipping_info_en,
                surgras_percentage, scent_profile, scent_profile_en,
                weight, featured, stock, low_stock_threshold, is_active,
                inci_list, origin_country, responsible_person, pao, batch_number
            ) VALUES (
                :id, :name, :name_en, :tagline, :tagline_en, :category_id,
                :price, :rating, :review_count, :tags,
                :description, :description_en, :long_description, :long_description_en,
                :images, :aspect_ratio, :ingredients,
                :usage_tips, :usage_tips_en, :shipping_info, :shipping_info_en,
                :surgras_percentage, :scent_profile, :scent_profile_en,
                :weight, :featured, :stock, :low_stock_threshold, 1,
                :inci_list, :origin_country, :responsible_person, :pao, :batch_number
            )
        ");

        $this->bindProduct($stmt, $id, $body);
        $stmt->execute();

        http_response_code(201);
        $this->json(['success' => true, 'id' => $id, 'message' => 'Produit créé avec succès.']);
    }

    // ──────────────────────────────────────────────────────────
    // PUT /api/products/{id}  → Mise à jour
    // ──────────────────────────────────────────────────────────
    public function update(string $id): void
    {
        if (!$this->validId($id)) { $this->error('Identifiant invalide.', 400); return; }

        $body = $this->parseBody();
        if (!$body) { $this->error('Corps JSON invalide.', 400); return; }

        $v = $this->validateProductBody($body);
        if ($v !== true) { $this->error($v, 422); return; }

        $db   = Database::getConnection();

        // Vérifier que le produit existe
        $chk = $db->prepare("SELECT id FROM products WHERE id = :id LIMIT 1");
        $chk->bindValue(':id', $id, \PDO::PARAM_STR);
        $chk->execute();
        if (!$chk->fetch()) { $this->error('Produit introuvable.', 404); return; }

        $stmt = $db->prepare("
            UPDATE products SET
                name = :name, name_en = :name_en,
                tagline = :tagline, tagline_en = :tagline_en,
                category_id = :category_id, price = :price,
                rating = :rating, review_count = :review_count,
                tags = :tags, description = :description,
                description_en = :description_en,
                long_description = :long_description,
                long_description_en = :long_description_en,
                images = :images, aspect_ratio = :aspect_ratio,
                ingredients = :ingredients,
                usage_tips = :usage_tips, usage_tips_en = :usage_tips_en,
                shipping_info = :shipping_info, shipping_info_en = :shipping_info_en,
                surgras_percentage = :surgras_percentage,
                scent_profile = :scent_profile, scent_profile_en = :scent_profile_en,
                weight = :weight, featured = :featured,
                stock = :stock, low_stock_threshold = :low_stock_threshold,
                inci_list = :inci_list, origin_country = :origin_country,
                responsible_person = :responsible_person,
                pao = :pao, batch_number = :batch_number,
                updated_at = NOW()
            WHERE id = :id
        ");

        $this->bindProduct($stmt, $id, $body);
        $stmt->execute();

        $this->json(['success' => true, 'id' => $id, 'message' => 'Produit mis à jour.']);
    }

    // ──────────────────────────────────────────────────────────
    // DELETE /api/products/{id}  → Soft delete (is_active = 0)
    // ──────────────────────────────────────────────────────────
    public function delete(string $id): void
    {
        if (!$this->validId($id)) { $this->error('Identifiant invalide.', 400); return; }

        $db   = Database::getConnection();
        $stmt = $db->prepare("UPDATE products SET is_active = 0, updated_at = NOW() WHERE id = :id");
        $stmt->bindValue(':id', $id, \PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() === 0) { $this->error('Produit introuvable.', 404); return; }

        $this->json(['success' => true, 'message' => 'Produit désactivé.']);
    }

    // ──────────────────────────────────────────────────────────
    // Helpers privés
    // ──────────────────────────────────────────────────────────

    private function bindProduct(\PDOStatement $stmt, string $id, array $b): void
    {
        $stmt->bindValue(':id',                $id,                                          \PDO::PARAM_STR);
        $stmt->bindValue(':name',              $this->str($b, 'name'),                       \PDO::PARAM_STR);
        $stmt->bindValue(':name_en',           $this->str($b, 'nameEn'),                     \PDO::PARAM_STR);
        $stmt->bindValue(':tagline',           $this->str($b, 'tagline'),                    \PDO::PARAM_STR);
        $stmt->bindValue(':tagline_en',        $this->str($b, 'taglineEn'),                  \PDO::PARAM_STR);
        $stmt->bindValue(':category_id',       $this->str($b, 'category', 'soaps'),          \PDO::PARAM_STR);
        $stmt->bindValue(':price',             (float)($b['price'] ?? 0),                    \PDO::PARAM_STR);
        $stmt->bindValue(':rating',            (float)($b['rating'] ?? 5.0),                 \PDO::PARAM_STR);
        $stmt->bindValue(':review_count',      (int)($b['reviewCount'] ?? 0),                \PDO::PARAM_INT);
        $stmt->bindValue(':tags',              json_encode($b['tags'] ?? [],      JSON_UNESCAPED_UNICODE), \PDO::PARAM_STR);
        $stmt->bindValue(':description',       $this->str($b, 'description'),                \PDO::PARAM_STR);
        $stmt->bindValue(':description_en',    $this->str($b, 'descriptionEn'),              \PDO::PARAM_STR);
        $stmt->bindValue(':long_description',  $this->str($b, 'longDescription'),            \PDO::PARAM_STR);
        $stmt->bindValue(':long_description_en', $this->str($b, 'longDescriptionEn'),        \PDO::PARAM_STR);
        $stmt->bindValue(':images',            json_encode($b['images'] ?? [],    JSON_UNESCAPED_UNICODE), \PDO::PARAM_STR);
        $stmt->bindValue(':aspect_ratio',      $this->str($b, 'aspectRatio', 'square'),      \PDO::PARAM_STR);
        $stmt->bindValue(':ingredients',       json_encode($b['ingredients'] ?? [], JSON_UNESCAPED_UNICODE), \PDO::PARAM_STR);
        $stmt->bindValue(':usage_tips',        $this->str($b, 'usageTips'),                  \PDO::PARAM_STR);
        $stmt->bindValue(':usage_tips_en',     $this->str($b, 'usageTipsEn'),                \PDO::PARAM_STR);
        $stmt->bindValue(':shipping_info',     $this->str($b, 'shippingInfo'),               \PDO::PARAM_STR);
        $stmt->bindValue(':shipping_info_en',  $this->str($b, 'shippingInfoEn'),             \PDO::PARAM_STR);
        $stmt->bindValue(':surgras_percentage', $this->str($b, 'surgrasPercentage'),         \PDO::PARAM_STR);
        $stmt->bindValue(':scent_profile',     $this->str($b, 'scentProfile'),               \PDO::PARAM_STR);
        $stmt->bindValue(':scent_profile_en',  $this->str($b, 'scentProfileEn'),             \PDO::PARAM_STR);
        $stmt->bindValue(':weight',            $this->str($b, 'weight', '120g'),             \PDO::PARAM_STR);
        $stmt->bindValue(':featured',          (int)(!empty($b['featured'])),                \PDO::PARAM_INT);
        $stmt->bindValue(':stock',             (int)($b['stock'] ?? 0),                      \PDO::PARAM_INT);
        $stmt->bindValue(':low_stock_threshold', (int)($b['lowStockThreshold'] ?? 5),        \PDO::PARAM_INT);
        $stmt->bindValue(':inci_list',         $this->str($b, 'inci', 'Composition 100% naturelle.'), \PDO::PARAM_STR);
        $stmt->bindValue(':origin_country',    $this->str($b, 'originCountry', 'France / Provence'),  \PDO::PARAM_STR);
        $stmt->bindValue(':responsible_person', $this->str($b, 'responsiblePerson', 'Ndolo Rituals SARL'), \PDO::PARAM_STR);
        $stmt->bindValue(':pao',               $this->str($b, 'pao', '18M'),                \PDO::PARAM_STR);
        $stmt->bindValue(':batch_number',      $this->str($b, 'batchNumber'),               \PDO::PARAM_STR);
    }

    private function validateProductBody(array $b): bool|string
    {
        if (empty(trim((string)($b['name'] ?? '')))) return 'Le champ "name" est obligatoire.';
        if (!is_numeric($b['price'] ?? null) || (float)$b['price'] <= 0) return 'Prix invalide.';
        if (empty(trim((string)($b['description'] ?? '')))) return 'La description est obligatoire.';
        return true;
    }

    private function hydrate(array $row): array
    {
        $appUrl = @getenv('APP_URL') ?: ($_ENV['APP_URL'] ?? ($_SERVER['APP_URL'] ?? ''));
        $appUrl = rtrim((string)$appUrl, '/');

        foreach (['tags', 'images', 'ingredients'] as $col) {
            if (isset($row[$col]) && is_string($row[$col])) {
                $row[$col] = json_decode($row[$col], true) ?? [];
            }
        }

        // Nettoyage et normalisation des URLs d'images (correction mixed content localhost)
        if (!empty($appUrl) && isset($row['images']) && is_array($row['images'])) {
            $row['images'] = array_map(function ($img) use ($appUrl) {
                if (is_string($img) && preg_match('#/uploads/products/([^/?#]+)#', $img, $m)) {
                    return $appUrl . '/uploads/products/' . $m[1];
                }
                return $img;
            }, $row['images']);
        }

        if (!empty($appUrl) && isset($row['image']) && is_string($row['image']) && preg_match('#/uploads/products/([^/?#]+)#', $row['image'], $m)) {
            $row['image'] = $appUrl . '/uploads/products/' . $m[1];
        }

        $row['price']             = (float)($row['price'] ?? 0);
        $row['rating']            = (float)($row['rating'] ?? 5.0);
        $row['reviewCount']       = (int)($row['reviewCount'] ?? 0);
        $row['stock']             = (int)($row['stock'] ?? 0);
        $row['lowStockThreshold'] = (int)($row['lowStockThreshold'] ?? 5);
        $row['featured']          = (bool)($row['featured'] ?? false);
        return $row;
    }

    private function parseBody(): array|null
    {
        $raw = file_get_contents('php://input');
        if (!$raw) return null;
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : null;
    }

    private function str(array $b, string $key, string $default = ''): string
    {
        return trim((string)($b[$key] ?? $default));
    }

    private function validId(string $id): bool
    {
        return (bool)preg_match('/^[a-z0-9\-]{1,100}$/i', $id);
    }

    private function generateId(string $name): string
    {
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name));
        return trim($slug, '-') . '-' . substr(uniqid(), -6);
    }

    private function json(array $data, int $code = 200): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    private function error(string $message, int $code = 400): void
    {
        $this->json(['success' => false, 'error' => $message], $code);
    }
}
