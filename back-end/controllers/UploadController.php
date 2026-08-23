<?php
declare(strict_types=1);

namespace Ndolo\Controllers;

/**
 * Contrôleur d'Upload d'Images Produits
 * Conformité Règles de Sécurité RULES_ET_WORKFLOW.md :
 * - Vérification du type MIME réel (finfo)
 * - Vérification de l'extension
 * - Renommage aléatoire sécurisé
 * - Limitation de taille (5 Mo max)
 */
class UploadController
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif',
        'image/avif' => 'avif',
    ];

    private const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

    public function upload(): void
    {
        // 1. Vérification de la présence d'un fichier dans la requête
        $fileKey = isset($_FILES['image']) ? 'image' : (isset($_FILES['file']) ? 'file' : null);

        if (!$fileKey || !isset($_FILES[$fileKey])) {
            $this->error('Aucun fichier image reçu.', 400);
            return;
        }

        $file = $_FILES[$fileKey];

        // 2. Vérification des erreurs d'upload PHP
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $msg = match ($file['error']) {
                UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Le fichier dépasse la taille maximale autorisée (5 Mo).',
                UPLOAD_ERR_PARTIAL   => 'Le téléversement du fichier a été interrompu.',
                UPLOAD_ERR_NO_FILE   => 'Aucun fichier n\'a été sélectionné.',
                default              => 'Erreur interne lors du téléversement (' . $file['error'] . ').',
            };
            $this->error($msg, 400);
            return;
        }

        // 3. Vérification de la taille maximale
        if ($file['size'] > self::MAX_FILE_SIZE) {
            $this->error('L\'image est trop volumineuse (max 5 Mo).', 400);
            return;
        }

        // 4. Vérification du type MIME réel avec finfo
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $realMime = $finfo->file($file['tmp_name']);

        if (!array_key_exists($realMime, self::ALLOWED_MIME_TYPES)) {
            $this->error('Format de fichier non autorisé. Formats acceptés : JPG, PNG, WEBP, GIF, AVIF.', 422);
            return;
        }

        $ext = self::ALLOWED_MIME_TYPES[$realMime];

        // 5. Création sécurisée du dossier de destination
        $uploadDir = dirname(__DIR__) . '/public/uploads/products';
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                $this->error('Impossible de créer le dossier de stockage sur le serveur.', 500);
                return;
            }
        }

        // 6. Génération d'un nom de fichier aléatoire unique
        $randomBytes = bin2hex(random_bytes(10));
        $newFilename = 'prod_' . date('Ymd_His') . '_' . $randomBytes . '.' . $ext;
        $destination = $uploadDir . '/' . $newFilename;

        // 7. Déplacement sécurisé du fichier temporaire
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            $this->error('Échec lors de l\'enregistrement de l\'image sur le serveur.', 500);
            return;
        }

        // 8. Construction de l'URL publique
        $scheme = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
        $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
        
        // Calcul du chemin public
        $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
        $publicBase = rtrim($scriptDir, '/');
        
        $publicUrl = "$scheme://$host$publicBase/uploads/products/$newFilename";
        $relativePath = "$publicBase/uploads/products/$newFilename";

        http_response_code(201);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success'   => true,
            'url'       => $publicUrl,
            'path'      => $relativePath,
            'filename'  => $newFilename,
            'size'      => $file['size'],
            'mime'      => $realMime,
            'message'   => 'Photo téléversée avec succès.',
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    private function error(string $msg, int $code = 400): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error'   => $msg,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
