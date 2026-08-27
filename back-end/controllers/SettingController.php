<?php
declare(strict_types=1);

namespace Ndolo\Controllers;

use Ndolo\Config\Database;

/**
 * Contrôleur de gestion des Paramètres du Site (Identité, Logo, Devises, SEO, Contact)
 */
class SettingController
{
    private \PDO $db;

    private const DEFAULT_SETTINGS = [
        'siteName'              => 'Ndolo Rituals',
        'tagline'               => 'Rituels de beauté naturels & artisanaux',
        'logoUrl'               => '',
        'primaryColor'          => '#bb0a4a',
        'secondaryColor'        => '#824f39',
        'accentColor'           => '#d4e8d0',
        'freeShippingThreshold' => 50,
        'currency'              => 'EUR',
        'contactEmail'          => 'contact@ndolo-rituals.fr',
        'address'               => 'Atelier Provençal, France',
        'instagram'             => '@ndolo.rituals',
        'facebook'              => 'NdoloRituals',
        'metaTitle'             => 'Ndolo Rituals — Savons & Huiles Naturels Artisanaux',
        'metaDescription'       => 'Découvrez notre collection de savons saponifiés à froid, huiles précieuses et rituels de beauté 100% naturels fabriqués à la main en Provence.',
    ];

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Récupère les paramètres du site (GET /settings) - Public
     */
    public function getSettings(): void
    {
        try {
            $stmt = $this->db->prepare("SELECT setting_value FROM site_settings WHERE setting_key = 'general' LIMIT 1");
            $stmt->execute();
            $row = $stmt->fetch();

            if ($row && !empty($row['setting_value'])) {
                $saved = json_decode((string)$row['setting_value'], true);
                if (is_array($saved)) {
                    $merged = array_merge(self::DEFAULT_SETTINGS, $saved);
                    echo json_encode([
                        'success' => true,
                        'data'    => $merged,
                    ], JSON_UNESCAPED_UNICODE);
                    return;
                }
            }

            echo json_encode([
                'success' => true,
                'data'    => self::DEFAULT_SETTINGS,
            ], JSON_UNESCAPED_UNICODE);
        } catch (\Throwable $e) {
            echo json_encode([
                'success' => true,
                'data'    => self::DEFAULT_SETTINGS,
            ], JSON_UNESCAPED_UNICODE);
        }
    }

    /**
     * Met à jour les paramètres du site (POST ou PUT /settings) - Admin Protégé
     */
    public function updateSettings(): void
    {
        $raw = file_get_contents('php://input');
        $input = json_decode((string)$raw, true);

        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Format JSON invalide.']);
            return;
        }

        // Nettoyage et fusion
        $currency = strtoupper(trim((string)($input['currency'] ?? 'EUR')));
        if ($currency === '') {
            $currency = 'EUR'; // Par défaut l'euro si aucune devise choisie
        }

        $cleanSettings = [
            'siteName'              => trim((string)($input['siteName'] ?? self::DEFAULT_SETTINGS['siteName'])),
            'tagline'               => trim((string)($input['tagline'] ?? self::DEFAULT_SETTINGS['tagline'])),
            'logoUrl'               => trim((string)($input['logoUrl'] ?? '')),
            'primaryColor'          => trim((string)($input['primaryColor'] ?? self::DEFAULT_SETTINGS['primaryColor'])),
            'secondaryColor'        => trim((string)($input['secondaryColor'] ?? self::DEFAULT_SETTINGS['secondaryColor'])),
            'accentColor'           => trim((string)($input['accentColor'] ?? self::DEFAULT_SETTINGS['accentColor'])),
            'freeShippingThreshold' => (float)($input['freeShippingThreshold'] ?? self::DEFAULT_SETTINGS['freeShippingThreshold']),
            'currency'              => $currency,
            'contactEmail'          => trim((string)($input['contactEmail'] ?? self::DEFAULT_SETTINGS['contactEmail'])),
            'address'               => trim((string)($input['address'] ?? self::DEFAULT_SETTINGS['address'])),
            'instagram'             => trim((string)($input['instagram'] ?? self::DEFAULT_SETTINGS['instagram'])),
            'facebook'              => trim((string)($input['facebook'] ?? self::DEFAULT_SETTINGS['facebook'])),
            'metaTitle'             => trim((string)($input['metaTitle'] ?? self::DEFAULT_SETTINGS['metaTitle'])),
            'metaDescription'       => trim((string)($input['metaDescription'] ?? self::DEFAULT_SETTINGS['metaDescription'])),
        ];

        $jsonValue = json_encode($cleanSettings, JSON_UNESCAPED_UNICODE);

        $stmt = $this->db->prepare("
            INSERT INTO site_settings (setting_key, setting_value)
            VALUES ('general', :val)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ");

        $stmt->execute(['val' => $jsonValue]);

        echo json_encode([
            'success' => true,
            'message' => 'Réglages enregistrés avec succès.',
            'data'    => $cleanSettings,
        ], JSON_UNESCAPED_UNICODE);
    }
}
