<?php
declare(strict_types=1);

namespace Ndolo\Controllers;

use Ndolo\Config\Database;

require_once __DIR__ . '/../config/database.php';

/**
 * Contrôleur Articles — CRUD complet du Journal / Blog via API REST sécurisée
 * GET    /api/articles          → liste des articles actifs
 * GET    /api/articles/{id}     → détails d'un article
 * POST   /api/articles          → créer un nouvel article
 * PUT    /api/articles/{id}     → modifier un article
 * DELETE /api/articles/{id}     → supprimer un article
 */
class ArticleController
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->seedIfEmpty();
    }

    /**
     * GET /api/articles
     */
    public function index(): void
    {
        $category = $_GET['category'] ?? null;
        $search   = $_GET['search'] ?? null;

        $sql = "SELECT * FROM articles WHERE is_active = 1";
        $params = [];

        if ($category && $category !== 'all') {
            $sql .= " AND category = :cat";
            $params[':cat'] = $category;
        }

        if ($search) {
            $sql .= " AND (title LIKE :s OR excerpt LIKE :s OR tags LIKE :s)";
            $params[':s'] = "%$search%";
        }

        $sql .= " ORDER BY featured DESC, created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $articles = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'count'   => count($articles),
            'data'    => array_map([$this, 'formatArticle'], $articles),
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * GET /api/articles/{id}
     */
    public function show(string $id): void
    {
        $stmt = $this->db->prepare("SELECT * FROM articles WHERE (id = :id OR slug = :id) AND is_active = 1 LIMIT 1");
        $stmt->execute([':id' => $id]);
        $article = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$article) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Article introuvable.']);
            return;
        }

        echo json_encode([
            'success' => true,
            'data'    => $this->formatArticle($article),
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * POST /api/articles
     */
    public function create(): void
    {
        $body = $this->getJsonBody();

        // Validation des champs obligatoires
        $title = trim($body['title'] ?? '');
        $excerpt = trim($body['excerpt'] ?? '');
        $content = trim($body['content'] ?? '');
        $category = trim($body['category'] ?? 'culture');
        $image = trim($body['image'] ?? '');
        $author = trim($body['author'] ?? 'Karene Bella');

        if (empty($title) || empty($excerpt) || empty($content)) {
            http_response_code(422);
            echo json_encode([
                'success' => false,
                'error'   => 'Le titre, l\'extrait et le contenu sont obligatoires.',
            ]);
            return;
        }

        $id = $body['id'] ?? $this->generateSlug($title) . '-' . substr(bin2hex(random_bytes(3)), 0, 6);
        $slug = $body['slug'] ?? $this->generateSlug($title);
        $titleEn = $body['titleEn'] ?? null;
        $excerptEn = $body['excerptEn'] ?? null;
        $contentEn = $body['contentEn'] ?? null;
        $categoryLabel = $body['categoryLabel'] ?? $this->getDefaultCategoryLabel($category);
        $categoryLabelEn = $body['categoryLabelEn'] ?? null;
        $authorRole = $body['authorRole'] ?? 'Fondatrice & Formulatrice';
        $authorAvatar = $body['authorAvatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        $publishedAt = $body['publishedAt'] ?? date('d M Y');
        $readTime = $body['readTime'] ?? '4 min de lecture';
        $readTimeEn = $body['readTimeEn'] ?? '4 min read';
        $featured = !empty($body['featured']) ? 1 : 0;
        
        $tags = isset($body['tags']) && is_array($body['tags']) ? json_encode($body['tags']) : json_encode(['Rituel', 'Botanique']);
        $relatedProducts = isset($body['relatedProductIds']) && is_array($body['relatedProductIds']) ? json_encode($body['relatedProductIds']) : json_encode([]);

        $sql = "INSERT INTO articles (
            id, slug, title, title_en, excerpt, excerpt_en, content, content_en,
            category, category_label, category_label_en, author, author_role, author_avatar,
            published_at, read_time, read_time_en, image, tags, featured, related_product_ids, is_active
        ) VALUES (
            :id, :slug, :title, :title_en, :excerpt, :excerpt_en, :content, :content_en,
            :category, :category_label, :category_label_en, :author, :author_role, :author_avatar,
            :published_at, :read_time, :read_time_en, :image, :tags, :featured, :related_product_ids, 1
        )";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id'                 => $id,
            ':slug'               => $slug,
            ':title'              => $title,
            ':title_en'           => $titleEn,
            ':excerpt'            => $excerpt,
            ':excerpt_en'         => $excerptEn,
            ':content'            => $content,
            ':content_en'         => $contentEn,
            ':category'           => $category,
            ':category_label'     => $categoryLabel,
            ':category_label_en'  => $categoryLabelEn,
            ':author'             => $author,
            ':author_role'        => $authorRole,
            ':author_avatar'      => $authorAvatar,
            ':published_at'       => $publishedAt,
            ':read_time'          => $readTime,
            ':read_time_en'       => $readTimeEn,
            ':image'              => $image ?: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80',
            ':tags'               => $tags,
            ':featured'           => $featured,
            ':related_product_ids'=> $relatedProducts,
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Article publié avec succès.',
            'id'      => $id,
        ]);
    }

    /**
     * PUT /api/articles/{id}
     */
    public function update(string $id): void
    {
        $body = $this->getJsonBody();

        $stmt = $this->db->prepare("SELECT id FROM articles WHERE id = :id AND is_active = 1");
        $stmt->execute([':id' => $id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Article introuvable.']);
            return;
        }

        $sql = "UPDATE articles SET
            title = :title,
            title_en = :title_en,
            excerpt = :excerpt,
            excerpt_en = :excerpt_en,
            content = :content,
            content_en = :content_en,
            category = :category,
            category_label = :category_label,
            author = :author,
            author_role = :author_role,
            read_time = :read_time,
            image = :image,
            tags = :tags,
            featured = :featured,
            related_product_ids = :related_product_ids
            WHERE id = :id";

        $tags = isset($body['tags']) && is_array($body['tags']) ? json_encode($body['tags']) : json_encode([]);
        $relatedProducts = isset($body['relatedProductIds']) && is_array($body['relatedProductIds']) ? json_encode($body['relatedProductIds']) : json_encode([]);

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id'                 => $id,
            ':title'              => $body['title'] ?? '',
            ':title_en'           => $body['titleEn'] ?? null,
            ':excerpt'            => $body['excerpt'] ?? '',
            ':excerpt_en'         => $body['excerptEn'] ?? null,
            ':content'            => $body['content'] ?? '',
            ':content_en'         => $body['contentEn'] ?? null,
            ':category'           => $body['category'] ?? 'culture',
            ':category_label'     => $body['categoryLabel'] ?? $this->getDefaultCategoryLabel($body['category'] ?? 'culture'),
            ':author'             => $body['author'] ?? 'Karene Bella',
            ':author_role'        => $body['authorRole'] ?? 'Fondatrice & Formulatrice',
            ':read_time'          => $body['readTime'] ?? '4 min de lecture',
            ':image'              => $body['image'] ?? '',
            ':tags'               => $tags,
            ':featured'           => !empty($body['featured']) ? 1 : 0,
            ':related_product_ids'=> $relatedProducts,
        ]);

        echo json_encode(['success' => true, 'message' => 'Article mis à jour.']);
    }

    /**
     * DELETE /api/articles/{id}
     */
    public function delete(string $id): void
    {
        $stmt = $this->db->prepare("UPDATE articles SET is_active = 0 WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true, 'message' => 'Article supprimé.']);
    }

    private function formatArticle(array $row): array
    {
        return [
            'id'               => $row['id'],
            'slug'             => $row['slug'],
            'title'            => $row['title'],
            'titleEn'          => $row['title_en'] ?? null,
            'excerpt'          => $row['excerpt'],
            'excerptEn'        => $row['excerpt_en'] ?? null,
            'content'          => $row['content'],
            'contentEn'        => $row['content_en'] ?? null,
            'category'         => $row['category'],
            'categoryLabel'    => $row['category_label'],
            'categoryLabelEn'  => $row['category_label_en'] ?? null,
            'author'           => $row['author'],
            'authorRole'       => $row['author_role'] ?? '',
            'authorAvatar'     => $row['author_avatar'] ?? '',
            'publishedAt'      => $row['published_at'] ?? '',
            'readTime'         => $row['read_time'] ?? '4 min de lecture',
            'readTimeEn'       => $row['read_time_en'] ?? null,
            'image'            => $row['image'],
            'tags'             => json_decode($row['tags'] ?? '[]', true) ?: [],
            'featured'         => (bool)$row['featured'],
            'relatedProductIds'=> json_decode($row['related_product_ids'] ?? '[]', true) ?: [],
        ];
    }

    private function getDefaultCategoryLabel(string $cat): string
    {
        return match ($cat) {
            'skin-health' => 'Santé de la Peau',
            'ingredients' => 'Ingrédients Purs',
            'rituals'     => 'Rituels de Bain',
            default       => 'Culture & Savoir-Faire',
        };
    }

    private function generateSlug(string $title): string
    {
        $slug = preg_replace('~[^\pL\d]+~u', '-', $title);
        $slug = iconv('utf-8', 'us-ascii//TRANSLIT', $slug);
        $slug = preg_replace('~[^-\w]+~', '', $slug);
        $slug = trim($slug, '-');
        $slug = strtolower($slug);
        return empty($slug) ? 'article-' . time() : $slug;
    }

    private function seedIfEmpty(): void
    {
        try {
            $count = $this->db->query("SELECT COUNT(*) FROM articles")->fetchColumn();
            if ((int)$count === 0) {
                $seedSql = "INSERT INTO articles (
                    id, slug, title, title_en, excerpt, excerpt_en, content, content_en,
                    category, category_label, category_label_en, author, author_role, author_avatar,
                    published_at, read_time, read_time_en, image, tags, featured, related_product_ids, is_active
                ) VALUES (
                    'secrets-savon-noir-africain',
                    'secrets-savon-noir-africain',
                    'Les Secrets Ancestraux du Savon Noir Africain : Origines, Bienfaits et Rituel d\'Utilisation',
                    'Ancestral Secrets of African Black Soap: Origins, Benefits, and Daily Ritual',
                    'Découvrez l\'histoire fascinante du véritable savon noir artisanal, sa composition 100% brute et la méthode idéale pour révéler l\'éclat naturel de votre peau sans la dessécher.',
                    'Discover the fascinating story of authentic raw black soap, its 100% natural ingredients, and the optimal ritual to reveal glowing skin.',
                    '<p class=\"lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6\">Depuis des siècles en Afrique de l\'Ouest et Centrale, les femmes élaborent à la main un soin purifiant d\'une puissance végétale inégalée : le véritable Savon Noir.</p><h2 class=\"font-serif text-2xl md:text-3xl text-[#26170c] mt-8 mb-4\">Une Saponification 100% Végétale</h2><p class=\"mb-4 leading-relaxed\">Saponifié exclusivement à partir de cendres végétales de bananes plantains et de karité pur.</p>',
                    '<p class=\"lead text-lg text-[#3D2B1F] font-serif leading-relaxed mb-6\">For centuries across West and Central Africa, authentic raw black soap has been crafted by women cooperatives.</p>',
                    'culture',
                    'Culture & Savoir-Faire',
                    'Culture & Craft',
                    'Karene Bella',
                    'Fondatrice & Formulatrice Botanique',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    '22 Août 2026',
                    '4 min de lecture',
                    '4 min read',
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBgzYo9pIi0DtyG0IpLMPOPOLdTTp_IFTvNQo7KE4UZEwFnQQTEfHxYs9-XxrAl0hsEXc45_wE5WAysIaboHJax-ynjGqiru30UDHJFqOUEb2oV3mwFwpXy3n2ZDcaNEWH0parFyb_3mhdZ93-86LYH-dwbRFsWikxCdkUpJfjtNp_Fscqa8RabYwGJTXoYQlCqTxhgPzblaDZCMZ-HPvex8HCJzVlBViESpi0dfY7HUVnv8jxp8Fk4JsuKycAzQ8rh-A',
                    '[\"Savon Noir\", \"Rituel Ancestral\", \"Saponification\"]',
                    1,
                    '[\"savon-signature\"]',
                    1
                )";
                $this->db->exec($seedSql);
            }
        } catch (\Throwable) {
            // ignore
        }
    }

    private function getJsonBody(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw ?: '{}', true) ?: [];
    }
}
