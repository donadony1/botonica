<?php
declare(strict_types=1);

/**
 * Configuration de l'Application & Sécurité
 * Projet Ndolo Rituals (Saponification artisanale & Cosmétiques)
 */

return [
    'app_name' => 'Ndolo Rituals API',
    'app_env'  => getenv('APP_ENV') ?: 'development',
    'base_url' => getenv('APP_URL') ?: 'http://localhost:8000',
    'currency' => 'EUR',
    
    // Liste blanche CORS explicite (Règle non négociable RULES_ET_WORKFLOW.md)
    'cors' => [
        'allowed_origins' => [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            getenv('FRONTEND_URL') ?: 'http://localhost:3000'
        ],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        'allow_credentials' => true,
        'max_age' => 86400,
    ],
    
    // Seuil de livraison offerte en France métropolitaine
    'free_shipping_threshold_fr' => 50.00,
    'free_shipping_threshold_eu' => 70.00,
];
