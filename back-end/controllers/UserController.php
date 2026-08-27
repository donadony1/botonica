<?php
declare(strict_types=1);

namespace Ndolo\Controllers;

use Ndolo\Config\Database;

/**
 * Contrôleur d'Authentification & Gestion des Utilisateurs (Admin / Gérant)
 * Conforme aux règles de RULES_ET_WORKFLOW.md :
 * - Requêtes préparées PDO systématiques
 * - Hashage bcrypt sécurisé avec password_hash() / password_verify()
 * - Seul un administrateur peut ajouter, modifier ou révoquer un gérant
 */
class UserController
{
    private \PDO $db;
    private string $secretKey;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->secretKey = getenv('ADMIN_API_TOKEN') ?: 'NdoloSecureAdmin2026!';
    }

    /**
     * Génère un jeton d'authentification HMAC sécurisé
     */
    public function generateToken(array $user): string
    {
        $payload = [
            'uid'   => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
            'exp'   => time() + (24 * 3600), // 24h
        ];
        $encodedPayload = base64_encode((string)json_encode($payload));
        $signature = hash_hmac('sha256', $encodedPayload, $this->secretKey);
        return $encodedPayload . '.' . $signature;
    }

    /**
     * Vérifie et décode un jeton d'authentification
     */
    public function verifyToken(?string $token): ?array
    {
        if (empty($token)) return null;

        // Si le token correspond à la clé d'administration globale
        if (hash_equals($this->secretKey, $token)) {
            return [
                'uid'   => 'usr_superadmin',
                'email' => 'admin@ndolo-rituals.fr',
                'role'  => 'admin',
                'name'  => 'Super Administrateur',
            ];
        }

        $parts = explode('.', $token, 2);
        if (count($parts) !== 2) return null;

        [$encodedPayload, $providedSignature] = $parts;
        $expectedSignature = hash_hmac('sha256', $encodedPayload, $this->secretKey);

        if (!hash_equals($expectedSignature, $providedSignature)) {
            return null;
        }

        $payload = json_decode((string)base64_decode($encodedPayload), true);
        if (!is_array($payload) || !isset($payload['uid'], $payload['role'], $payload['exp'])) {
            return null;
        }

        if (time() > (int)$payload['exp']) {
            return null; // Expiré
        }

        return $payload;
    }

    /**
     * Récupère l'utilisateur authentifié depuis les headers HTTP
     */
    public function getAuthUser(): ?array
    {
        $token = null;

        if (isset($_SERVER['HTTP_AUTHORIZATION']) && preg_match('/Bearer\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $m)) {
            $token = trim($m[1]);
        } elseif (isset($_SERVER['HTTP_X_ADMIN_TOKEN'])) {
            $token = trim($_SERVER['HTTP_X_ADMIN_TOKEN']);
        } elseif (isset($_SERVER['HTTP_X_AUTH_TOKEN'])) {
            $token = trim($_SERVER['HTTP_X_AUTH_TOKEN']);
        }

        if (!$token && function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
            if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $m)) {
                $token = trim($m[1]);
            }
            if (!$token) {
                $token = $headers['X-Admin-Token'] ?? $headers['x-admin-token'] ?? $headers['X-Auth-Token'] ?? null;
            }
        }

        return $this->verifyToken($token);
    }

    /**
     * Connexion (POST /auth/login)
     */
    public function login(): void
    {
        $input = json_decode((string)file_get_contents('php://input'), true) ?? [];
        $email = trim((string)($input['email'] ?? ''));
        $password = (string)($input['password'] ?? '');

        if ($email === '' || $password === '') {
            // Compatibilité avec le mode clé secrète directe
            if ($password === '' && isset($input['token']) && hash_equals($this->secretKey, (string)$input['token'])) {
                $token = (string)$input['token'];
                echo json_encode([
                    'success' => true,
                    'token'   => $token,
                    'user'    => [
                        'id'    => 'usr_superadmin',
                        'name'  => 'Administrateur',
                        'email' => 'admin@ndolo-rituals.fr',
                        'role'  => 'admin',
                    ],
                ], JSON_UNESCAPED_UNICODE);
                return;
            }

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error'   => 'Veuillez renseigner votre email et mot de passe.',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Recherche de l'utilisateur actif
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => strtolower($email)]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, (string)$user['password_hash'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error'   => 'Identifiants invalides (email ou mot de passe incorrect).',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        if (empty($user['is_active'])) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error'   => 'Votre compte a été désactivé. Veuillez contacter un administrateur.',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Mise à jour de la dernière date de connexion
        $updateStmt = $this->db->prepare("UPDATE users SET last_login_at = NOW() WHERE id = :id");
        $updateStmt->execute(['id' => $user['id']]);

        $token = $this->generateToken($user);

        echo json_encode([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'          => $user['id'],
                'name'        => $user['name'],
                'email'       => $user['email'],
                'role'        => $user['role'],
                'createdAt'   => $user['created_at'],
                'lastLoginAt' => date('c'),
            ],
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Profil de l'utilisateur connecté (GET /auth/me)
     */
    public function me(): void
    {
        $authUser = $this->getAuthUser();
        if (!$authUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Non authentifié.']);
            return;
        }

        $stmt = $this->db->prepare("SELECT id, name, email, role, is_active, created_at, last_login_at FROM users WHERE id = :id");
        $stmt->execute(['id' => $authUser['uid']]);
        $user = $stmt->fetch();

        if (!$user) {
            // Fallback super admin token
            echo json_encode([
                'success' => true,
                'user' => [
                    'id'    => 'usr_superadmin',
                    'name'  => 'Administrateur',
                    'email' => 'admin@ndolo-rituals.fr',
                    'role'  => 'admin',
                ],
            ]);
            return;
        }

        echo json_encode([
            'success' => true,
            'user'    => [
                'id'          => $user['id'],
                'name'        => $user['name'],
                'email'       => $user['email'],
                'role'        => $user['role'],
                'isActive'    => (bool)$user['is_active'],
                'createdAt'   => $user['created_at'],
                'lastLoginAt' => $user['last_login_at'],
            ],
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Liste des utilisateurs / gérants (GET /users) — Protégé Admin / Gérant
     */
    public function index(): void
    {
        $authUser = $this->getAuthUser();
        if (!$authUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Accès refusé. Authentification requise.']);
            return;
        }

        $stmt = $this->db->query("
            SELECT u.id, u.name, u.email, u.role, u.is_active AS isActive,
                   u.created_at AS createdAt, u.last_login_at AS lastLoginAt,
                   u.created_by AS createdBy,
                   creator.name AS createdByName
            FROM users u
            LEFT JOIN users creator ON u.created_by = creator.id
            ORDER BY u.created_at DESC
        ");
        $users = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data'    => array_map(function ($u) {
                return [
                    'id'            => $u['id'],
                    'name'          => $u['name'],
                    'email'         => $u['email'],
                    'role'          => $u['role'],
                    'isActive'      => (bool)$u['isActive'],
                    'createdAt'     => $u['createdAt'],
                    'lastLoginAt'   => $u['lastLoginAt'],
                    'createdBy'     => $u['createdBy'],
                    'createdByName' => $u['createdByName'],
                ];
            }, $users),
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Création d'un utilisateur / gérant (POST /users)
     * RÈGLE CRITIQUE : SEUL UN ADMINISTRATEUR PEUT AJOUTER UN GÉRANT.
     */
    public function create(): void
    {
        $authUser = $this->getAuthUser();
        if (!$authUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Accès refusé. Veuillez vous connecter.']);
            return;
        }

        // RÈGLE MÉTIER STRICTE : Seul le rôle 'admin' a la permission d'ajouter un gérant
        if ($authUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error'   => 'Permission refusée : Seul un administrateur peut créer ou ajouter un gérant.',
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        $input = json_decode((string)file_get_contents('php://input'), true) ?? [];
        $name = trim((string)($input['name'] ?? ''));
        $email = trim(strtolower((string)($input['email'] ?? '')));
        $password = (string)($input['password'] ?? '');
        $role = trim((string)($input['role'] ?? 'gerant'));

        // Validation des champs
        if ($name === '' || $email === '' || $password === '') {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Veuillez renseigner le nom, l\'email et le mot de passe.']);
            return;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Adresse email invalide.']);
            return;
        }

        if (strlen($password) < 6) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Le mot de passe doit contenir au moins 6 caractères.']);
            return;
        }

        // Rôles autorisés
        if (!in_array($role, ['admin', 'gerant'], true)) {
            $role = 'gerant';
        }

        // Vérification de l'unicité de l'email
        $checkStmt = $this->db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
        $checkStmt->execute(['email' => $email]);
        if ($checkStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['success' => false, 'error' => 'Un compte existe déjà avec cette adresse email.']);
            return;
        }

        $userId = 'usr_' . bin2hex(random_bytes(8));
        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $creatorId = $authUser['uid'] ?? null;

        $insertStmt = $this->db->prepare("
            INSERT INTO users (id, name, email, password_hash, role, is_active, created_by)
            VALUES (:id, :name, :email, :password_hash, :role, 1, :created_by)
        ");

        $insertStmt->execute([
            'id'            => $userId,
            'name'          => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            'email'         => $email,
            'password_hash' => $passwordHash,
            'role'          => $role,
            'created_by'    => $creatorId,
        ]);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => ($role === 'gerant' ? 'Gérant' : 'Administrateur') . ' ajouté avec succès.',
            'data'    => [
                'id'        => $userId,
                'name'      => $name,
                'email'     => $email,
                'role'      => $role,
                'isActive'  => true,
                'createdAt' => date('c'),
            ],
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Mise à jour d'un utilisateur (PUT /users/{id}) — Seul un admin peut modifier
     */
    public function update(string $id): void
    {
        $authUser = $this->getAuthUser();
        if (!$authUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Accès refusé.']);
            return;
        }

        if ($authUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error'   => 'Permission refusée : Seul un administrateur peut modifier un compte utilisateur.',
            ]);
            return;
        }

        $input = json_decode((string)file_get_contents('php://input'), true) ?? [];

        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Utilisateur introuvable.']);
            return;
        }

        $name = isset($input['name']) ? trim((string)$input['name']) : $user['name'];
        $role = isset($input['role']) && in_array($input['role'], ['admin', 'gerant'], true) ? $input['role'] : $user['role'];
        $isActive = isset($input['isActive']) ? (bool)$input['isActive'] : (bool)$user['is_active'];

        // Mise à jour mot de passe si fourni
        $passwordHash = $user['password_hash'];
        if (!empty($input['password']) && strlen((string)$input['password']) >= 6) {
            $passwordHash = password_hash((string)$input['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        }

        $updateStmt = $this->db->prepare("
            UPDATE users
            SET name = :name, role = :role, is_active = :is_active, password_hash = :hash
            WHERE id = :id
        ");

        $updateStmt->execute([
            'name'      => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            'role'      => $role,
            'is_active' => $isActive ? 1 : 0,
            'hash'      => $passwordHash,
            'id'        => $id,
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès.',
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Suppression d'un utilisateur (DELETE /users/{id}) — Seul un admin peut supprimer
     */
    public function delete(string $id): void
    {
        $authUser = $this->getAuthUser();
        if (!$authUser) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Accès refusé.']);
            return;
        }

        if ($authUser['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error'   => 'Permission refusée : Seul un administrateur peut supprimer un compte.',
            ]);
            return;
        }

        // Empêcher l'administrateur de supprimer son propre compte
        if ($authUser['uid'] === $id) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error'   => 'Vous ne pouvez pas supprimer votre propre compte.',
            ]);
            return;
        }

        $deleteStmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        $deleteStmt->execute(['id' => $id]);

        echo json_encode([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès.',
        ]);
    }
}
