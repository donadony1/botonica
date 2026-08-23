<?php
declare(strict_types=1);

namespace Ndolo\Services;

use Ndolo\Config\Database;

require_once __DIR__ . '/../config/database.php';

/**
 * Service de Génération et d'Envoi de Factures Client
 * - Formatage HTML de luxe conforme GPSR & TVA
 * - Sauvegarde en base MySQL (`invoices`)
 * - Envoi de l'email avec la facture intégrée au client
 * - Génération d'une copie visualisable/imprimable
 */
class InvoiceService
{
    private \PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    /**
     * Génère la facture, l'enregistre en BDD et expédie l'email au client
     */
    public function generateAndSend(array $orderData, array $items): array
    {
        $invoiceNumber = $this->generateInvoiceNumber();
        $invoiceId     = 'inv_' . bin2hex(random_bytes(6));

        // Formatage de la facture en HTML pour impression et envoi email
        $invoiceHtml = $this->renderInvoiceHtml($invoiceNumber, $orderData, $items);

        // 1. Sauvegarde en base de données MySQL
        $sql = "INSERT INTO invoices (
            id, invoice_number, order_id, order_number, customer_name, customer_email, customer_phone,
            shipping_address, shipping_city, shipping_postal_code, shipping_country,
            items, subtotal, vat_rate, vat_amount, shipping_cost, discount_amount, coupon_code,
            total_amount, currency, payment_method, payment_status, invoice_html, email_sent, email_sent_at
        ) VALUES (
            :id, :invoice_number, :order_id, :order_number, :customer_name, :customer_email, :customer_phone,
            :shipping_address, :shipping_city, :shipping_postal_code, :shipping_country,
            :items, :subtotal, :vat_rate, :vat_amount, :shipping_cost, :discount_amount, :coupon_code,
            :total_amount, :currency, :payment_method, :payment_status, :invoice_html, :email_sent, NOW()
        )";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id'                   => $invoiceId,
            ':invoice_number'       => $invoiceNumber,
            ':order_id'             => $orderData['id'],
            ':order_number'         => $orderData['order_number'],
            ':customer_name'        => $orderData['customer_name'],
            ':customer_email'       => $orderData['customer_email'],
            ':customer_phone'       => $orderData['customer_phone'] ?? null,
            ':shipping_address'     => $orderData['shipping_address'],
            ':shipping_city'        => $orderData['shipping_city'],
            ':shipping_postal_code' => $orderData['shipping_postal_code'],
            ':shipping_country'     => $orderData['shipping_country'],
            ':items'                => json_encode($items, JSON_UNESCAPED_UNICODE),
            ':subtotal'             => $orderData['subtotal'],
            ':vat_rate'             => $orderData['vat_rate'] ?? 20.00,
            ':vat_amount'           => $orderData['vat_amount'] ?? 0.00,
            ':shipping_cost'        => $orderData['shipping_cost'] ?? 0.00,
            ':discount_amount'      => $orderData['discount_amount'] ?? 0.00,
            ':coupon_code'          => $orderData['coupon_code'] ?? null,
            ':total_amount'         => $orderData['total_amount'],
            ':currency'             => $orderData['currency'] ?? 'EUR',
            ':payment_method'       => $orderData['payment_method'],
            ':payment_status'       => 'paid',
            ':invoice_html'         => $invoiceHtml,
            ':email_sent'           => 1,
        ]);

        // 2. Sauvegarde du fichier HTML public pour consultation/téléchargement direct
        $invoicesDir = __DIR__ . '/../public/invoices';
        if (!is_dir($invoicesDir)) {
            @mkdir($invoicesDir, 0755, true);
        }
        $filePath = $invoicesDir . '/' . $invoiceNumber . '.html';
        file_put_contents($filePath, $invoiceHtml);

        // 3. Envoi de l'email au client
        $emailSent = $this->sendInvoiceEmail($orderData['customer_email'], $orderData['customer_name'], $invoiceNumber, $invoiceHtml);

        return [
            'invoiceId'     => $invoiceId,
            'invoiceNumber' => $invoiceNumber,
            'invoiceUrl'    => 'invoices/' . $invoiceNumber . '.html',
            'emailSent'     => $emailSent,
            'html'          => $invoiceHtml,
        ];
    }

    /**
     * Envoie la facture au client par email avec en-têtes MIME HTML
     */
    private function sendInvoiceEmail(string $toEmail, string $customerName, string $invoiceNumber, string $htmlContent): bool
    {
        $subject = "Votre Facture Ndolo Rituals — Réf. " . $invoiceNumber;
        
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: Ndolo Rituals <contact@ndolo-rituals.fr>\r\n";
        $headers .= "Reply-To: contact@ndolo-rituals.fr\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Envoi via la fonction native mail()
        $sent = false;
        try {
            $sent = @mail($toEmail, $subject, $htmlContent, $headers);
        } catch (\Throwable) {
            $sent = false;
        }

        // Journalisation de l'email pour le mode développement ou inspection
        $emailsLogDir = __DIR__ . '/../storage/emails';
        if (!is_dir($emailsLogDir)) {
            @mkdir($emailsLogDir, 0755, true);
        }
        $logFile = $emailsLogDir . '/' . date('Y-m-d_H-i-s') . '_' . $invoiceNumber . '.html';
        @file_put_contents($logFile, $htmlContent);

        return $sent;
    }

    /**
     * Génère un numéro de facture unique (ex: FACT-2026-1042)
     */
    private function generateInvoiceNumber(): string
    {
        $year = date('Y');
        $randomSeq = str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        return "FACT-{$year}-{$randomSeq}";
    }

    /**
     * Rend le document HTML de la facture avec style CSS d'impression luxe
     */
    public function renderInvoiceHtml(string $invoiceNumber, array $order, array $items): string
    {
        $dateStr = date('d/m/Y');
        $itemsHtml = '';

        foreach ($items as $item) {
            $name     = htmlspecialchars($item['name'] ?? $item['product_name'] ?? 'Soin Botanique');
            $qty      = (int)($item['quantity'] ?? 1);
            $price    = (float)($item['price'] ?? $item['unit_price'] ?? 0.0);
            $lineTot  = $qty * $price;

            $itemsHtml .= "
            <tr style=\"border-bottom: 1px solid #e8e3dc;\">
                <td style=\"padding: 14px 10px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #26170c;\">
                    <strong>{$name}</strong>
                    <div style=\"font-size: 11px; color: #81756e; margin-top: 2px;\">Saponification artisanale à froid & beurre de karité pur</div>
                </td>
                <td style=\"padding: 14px 10px; text-align: center; font-size: 13px; color: #3D2B1F;\">{$qty}</td>
                <td style=\"padding: 14px 10px; text-align: right; font-size: 13px; color: #3D2B1F;\">" . number_format($price, 2, ',', ' ') . " €</td>
                <td style=\"padding: 14px 10px; text-align: right; font-size: 13px; font-weight: bold; color: #26170c;\">" . number_format($lineTot, 2, ',', ' ') . " €</td>
            </tr>";
        }

        $subtotalFormatted = number_format((float)$order['subtotal'], 2, ',', ' ');
        $discountFormatted = number_format((float)($order['discount_amount'] ?? 0), 2, ',', ' ');
        $shippingFormatted = number_format((float)($order['shipping_cost'] ?? 0), 2, ',', ' ');
        $vatFormatted      = number_format((float)($order['vat_amount'] ?? 0), 2, ',', ' ');
        $totalFormatted    = number_format((float)$order['total_amount'], 2, ',', ' ');

        $paymentMethodLabel = match ($order['payment_method'] ?? 'card') {
            'orange_money'   => 'Orange Money Cameroun / Afrique',
            'mtn_momo'       => 'MTN Mobile Money',
            'paypal'         => 'PayPal Express',
            'bank_transfer'  => 'Virement Bancaire (IBAN)',
            default          => 'Carte Bancaire Sécurisée (Stripe)',
        };

        return "<!DOCTYPE html>
<html lang=\"fr\">
<head>
    <meta charset=\"UTF-8\">
    <title>Facture {$invoiceNumber} — Ndolo Rituals</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #fdf9f5;
            margin: 0;
            padding: 30px 15px;
            color: #26170c;
        }
        .invoice-card {
            max-width: 780px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e6d5c3;
            box-shadow: 0 10px 35px rgba(61, 43, 31, 0.07);
            padding: 40px 45px;
        }
        @media print {
            body { background: #fff; padding: 0; }
            .invoice-card { border: none; box-shadow: none; padding: 20px; }
            .no-print { display: none !important; }
        }
        .btn-print {
            background: #3D2B1F;
            color: #fff;
            padding: 10px 22px;
            border-radius: 30px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            display: inline-block;
            cursor: pointer;
            border: none;
            margin-bottom: 20px;
        }
        .btn-print:hover { background: #bb0a4a; }
    </style>
</head>
<body>
    <div style=\"text-align: center;\" class=\"no-print\">
        <button onclick=\"window.print()\" class=\"btn-print\">🖨️ Imprimer ou Télécharger en PDF</button>
    </div>

    <div class=\"invoice-card\">
        <!-- Header -->
        <table style=\"width: 100%; border-bottom: 2px solid #3D2B1F; padding-bottom: 20px; margin-bottom: 25px;\">
            <tr>
                <td style=\"vertical-align: top;\">
                    <div style=\"font-size: 26px; font-family: Georgia, serif; font-weight: bold; letter-spacing: 0.15em; color: #bb0a4a;\">
                        NDOLO RITUALS
                    </div>
                    <div style=\"font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #824f39; margin-top: 4px;\">
                        Saponification Ancestrale & Cosmétiques Botaniques
                    </div>
                    <div style=\"font-size: 12px; color: #64635c; margin-top: 10px; line-height: 1.4;\">
                        Ndolo Rituals SARL • Capital 25 000 €<br>
                        14 Rue des Lavandes, 13100 Aix-en-Provence, France<br>
                        SIRET : 894 302 119 00024 • TVA : FR 48 894302119<br>
                        Email : contact@ndolo-rituals.fr
                    </div>
                </td>
                <td style=\"text-align: right; vertical-align: top;\">
                    <div style=\"background: #fcf5ee; border: 1px solid #e6d5c3; padding: 12px 18px; border-radius: 12px; display: inline-block; text-align: right;\">
                        <span style=\"font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em; color: #824f39;\">FACTURE OFFICIELLE</span>
                        <div style=\"font-size: 18px; font-weight: bold; color: #26170c; margin: 3px 0;\">{$invoiceNumber}</div>
                        <div style=\"font-size: 12px; color: #64635c;\">Date : <strong>{$dateStr}</strong></div>
                        <div style=\"font-size: 12px; color: #64635c;\">Commande : <strong>{$order['order_number']}</strong></div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Adresses Client et Livraison -->
        <table style=\"width: 100%; margin-bottom: 30px;\">
            <tr>
                <td style=\"width: 50%; vertical-align: top; padding-right: 15px;\">
                    <div style=\"font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #824f39; margin-bottom: 6px;\">
                        Facturé & Livré à :
                    </div>
                    <div style=\"font-size: 14px; font-weight: bold; color: #26170c;\">{$order['customer_name']}</div>
                    <div style=\"font-size: 13px; color: #434842; line-height: 1.5; margin-top: 4px;\">
                        {$order['shipping_address']}<br>
                        {$order['shipping_postal_code']} {$order['shipping_city']}<br>
                        Pays : {$order['shipping_country']}
                    </div>
                    <div style=\"font-size: 12px; color: #64635c; margin-top: 6px;\">
                        Email : <strong>{$order['customer_email']}</strong>
                    </div>
                </td>
                <td style=\"width: 50%; vertical-align: top; padding-left: 15px;\">
                    <div style=\"background: #fdf9f5; border: 1px solid #e6d5c3; border-radius: 12px; padding: 15px;\">
                        <div style=\"font-size: 11px; font-weight: bold; text-transform: uppercase; color: #824f39; margin-bottom: 6px;\">
                            Détails du Règlement
                        </div>
                        <div style=\"font-size: 13px; color: #26170c; margin-bottom: 4px;\">
                            Mode de paiement : <strong>{$paymentMethodLabel}</strong>
                        </div>
                        <div style=\"font-size: 13px; color: #166534; font-weight: bold;\">
                            Statut : ✓ Acquitté / Payé le {$dateStr}
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Table des Produits -->
        <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 25px;\">
            <thead>
                <tr style=\"background: #3D2B1F; color: #ffffff;\">
                    <th style=\"padding: 12px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; border-top-left-radius: 8px;\">Désignation du soin</th>
                    <th style=\"padding: 12px 10px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;\">Qté</th>
                    <th style=\"padding: 12px 10px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;\">Prix Unit. TTC</th>
                    <th style=\"padding: 12px 10px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; border-top-right-radius: 8px;\">Total TTC</th>
                </tr>
            </thead>
            <tbody>
                {$itemsHtml}
            </tbody>
        </table>

        <!-- Totaux & Récapitulatif Fiscal -->
        <table style=\"width: 100%; margin-bottom: 35px;\">
            <tr>
                <td style=\"width: 50%; vertical-align: top; font-size: 11px; color: #81756e; line-height: 1.6; padding-right: 20px;\">
                    <strong>Garantie & Conformité GPSR :</strong><br>
                    Produits cosmétiques conformes au Règlement (CE) N° 1223/2009.<br>
                    Conserver à l'abri de l'eau stagnante sur un porte-savon aéré.<br>
                    Période après ouverture (PAO) : 18 Mois.
                </td>
                <td style=\"width: 50%; vertical-align: top;\">
                    <table style=\"width: 100%; font-size: 13px; border-collapse: collapse;\">
                        <tr>
                            <td style=\"padding: 6px 0; color: #64635c;\">Sous-total articles :</td>
                            <td style=\"padding: 6px 0; text-align: right; font-weight: 500;\">{$subtotalFormatted} €</td>
                        </tr>";

        if ((float)($order['discount_amount'] ?? 0) > 0) {
            return $this->appendTotalsAndFooter($invoiceNumber, $dateStr, $subtotalFormatted, $discountFormatted, $shippingFormatted, $vatFormatted, $totalFormatted, $itemsHtml, $paymentMethodLabel, $order);
        }

        return $this->appendTotalsAndFooter($invoiceNumber, $dateStr, $subtotalFormatted, null, $shippingFormatted, $vatFormatted, $totalFormatted, $itemsHtml, $paymentMethodLabel, $order);
    }

    private function appendTotalsAndFooter(string $invoiceNumber, string $dateStr, string $subtotal, ?string $discount, string $shipping, string $vat, string $total, string $itemsHtml, string $paymentLabel, array $order): string
    {
        $discountRow = $discount ? "
            <tr>
                <td style=\"padding: 6px 0; color: #bb0a4a;\">Remise code promo :</td>
                <td style=\"padding: 6px 0; text-align: right; color: #bb0a4a; font-weight: bold;\">-{$discount} €</td>
            </tr>" : "";

        return "<!DOCTYPE html>
<html lang=\"fr\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>Facture {$invoiceNumber} — Ndolo Rituals</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #fdf9f5;
            margin: 0;
            padding: 30px 15px;
            color: #26170c;
        }
        .invoice-card {
            max-width: 780px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e6d5c3;
            box-shadow: 0 10px 35px rgba(61, 43, 31, 0.07);
            padding: 40px 45px;
        }
        @media print {
            body { background: #fff; padding: 0; }
            .invoice-card { border: none; box-shadow: none; padding: 20px; }
            .no-print { display: none !important; }
        }
        .btn-print {
            background: #3D2B1F;
            color: #fff;
            padding: 10px 22px;
            border-radius: 30px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            display: inline-block;
            cursor: pointer;
            border: none;
            margin-bottom: 20px;
        }
        .btn-print:hover { background: #bb0a4a; }
    </style>
</head>
<body>
    <div style=\"text-align: center;\" class=\"no-print\">
        <button onclick=\"window.print()\" class=\"btn-print\">🖨️ Imprimer ou Télécharger en PDF</button>
    </div>

    <div class=\"invoice-card\">
        <!-- Header -->
        <table style=\"width: 100%; border-bottom: 2px solid #3D2B1F; padding-bottom: 20px; margin-bottom: 25px;\">
            <tr>
                <td style=\"vertical-align: top;\">
                    <div style=\"font-size: 26px; font-family: Georgia, serif; font-weight: bold; letter-spacing: 0.15em; color: #bb0a4a;\">
                        NDOLO RITUALS
                    </div>
                    <div style=\"font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #824f39; margin-top: 4px;\">
                        Saponification Ancestrale & Cosmétiques Botaniques
                    </div>
                    <div style=\"font-size: 12px; color: #64635c; margin-top: 10px; line-height: 1.4;\">
                        Ndolo Rituals SARL • Capital 25 000 €<br>
                        14 Rue des Lavandes, 13100 Aix-en-Provence, France<br>
                        SIRET : 894 302 119 00024 • TVA : FR 48 894302119<br>
                        Email : contact@ndolo-rituals.fr
                    </div>
                </td>
                <td style=\"text-align: right; vertical-align: top;\">
                    <div style=\"background: #fcf5ee; border: 1px solid #e6d5c3; padding: 12px 18px; border-radius: 12px; display: inline-block; text-align: right;\">
                        <span style=\"font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em; color: #824f39;\">FACTURE OFFICIELLE</span>
                        <div style=\"font-size: 18px; font-weight: bold; color: #26170c; margin: 3px 0;\">{$invoiceNumber}</div>
                        <div style=\"font-size: 12px; color: #64635c;\">Date : <strong>{$dateStr}</strong></div>
                        <div style=\"font-size: 12px; color: #64635c;\">Commande : <strong>{$order['order_number']}</strong></div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Adresses Client et Livraison -->
        <table style=\"width: 100%; margin-bottom: 30px;\">
            <tr>
                <td style=\"width: 50%; vertical-align: top; padding-right: 15px;\">
                    <div style=\"font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #824f39; margin-bottom: 6px;\">
                        Facturé & Livré à :
                    </div>
                    <div style=\"font-size: 14px; font-weight: bold; color: #26170c;\">{$order['customer_name']}</div>
                    <div style=\"font-size: 13px; color: #434842; line-height: 1.5; margin-top: 4px;\">
                        {$order['shipping_address']}<br>
                        {$order['shipping_postal_code']} {$order['shipping_city']}<br>
                        Pays : {$order['shipping_country']}
                    </div>
                    <div style=\"font-size: 12px; color: #64635c; margin-top: 6px;\">
                        Email : <strong>{$order['customer_email']}</strong>
                    </div>
                </td>
                <td style=\"width: 50%; vertical-align: top; padding-left: 15px;\">
                    <div style=\"background: #fdf9f5; border: 1px solid #e6d5c3; border-radius: 12px; padding: 15px;\">
                        <div style=\"font-size: 11px; font-weight: bold; text-transform: uppercase; color: #824f39; margin-bottom: 6px;\">
                            Détails du Règlement
                        </div>
                        <div style=\"font-size: 13px; color: #26170c; margin-bottom: 4px;\">
                            Mode de paiement : <strong>{$paymentLabel}</strong>
                        </div>
                        <div style=\"font-size: 13px; color: #166534; font-weight: bold;\">
                            Statut : ✓ Acquitté / Payé le {$dateStr}
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Table des Produits -->
        <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 25px;\">
            <thead>
                <tr style=\"background: #3D2B1F; color: #ffffff;\">
                    <th style=\"padding: 12px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; border-top-left-radius: 8px;\">Désignation du soin</th>
                    <th style=\"padding: 12px 10px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;\">Qté</th>
                    <th style=\"padding: 12px 10px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;\">Prix Unit. TTC</th>
                    <th style=\"padding: 12px 10px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; border-top-right-radius: 8px;\">Total TTC</th>
                </tr>
            </thead>
            <tbody>
                {$itemsHtml}
            </tbody>
        </table>

        <!-- Totaux & Récapitulatif Fiscal -->
        <table style=\"width: 100%; margin-bottom: 35px;\">
            <tr>
                <td style=\"width: 50%; vertical-align: top; font-size: 11px; color: #81756e; line-height: 1.6; padding-right: 20px;\">
                    <strong>Garantie & Conformité GPSR :</strong><br>
                    Produits cosmétiques conformes au Règlement (CE) N° 1223/2009.<br>
                    Conserver à l'abri de l'eau stagnante sur un porte-savon aéré.<br>
                    Période après ouverture (PAO) : 18 Mois.
                </td>
                <td style=\"width: 50%; vertical-align: top;\">
                    <table style=\"width: 100%; font-size: 13px; border-collapse: collapse;\">
                        <tr>
                            <td style=\"padding: 6px 0; color: #64635c;\">Sous-total articles :</td>
                            <td style=\"padding: 6px 0; text-align: right; font-weight: 500;\">{$subtotal} €</td>
                        </tr>
                        {$discountRow}
                        <tr>
                            <td style=\"padding: 6px 0; color: #64635c;\">Frais de livraison :</td>
                            <td style=\"padding: 6px 0; text-align: right; font-weight: 500;\">{$shipping} €</td>
                        </tr>
                        <tr>
                            <td style=\"padding: 6px 0; color: #81756e; font-size: 12px;\">Dont TVA ({$order['vat_rate']}%) :</td>
                            <td style=\"padding: 6px 0; text-align: right; color: #81756e; font-size: 12px;\">{$vat} €</td>
                        </tr>
                        <tr style=\"border-top: 2px solid #3D2B1F; border-bottom: 2px solid #3D2B1F;\">
                            <td style=\"padding: 12px 0; font-size: 16px; font-weight: bold; color: #26170c;\">TOTAL PAYÉ TTC :</td>
                            <td style=\"padding: 12px 0; text-align: right; font-size: 18px; font-weight: bold; color: #bb0a4a;\">{$total} €</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <!-- Footer -->
        <div style=\"text-align: center; border-top: 1px solid #e6d5c3; padding-top: 20px; font-size: 11px; color: #81756e; line-height: 1.5;\">
            Merci d'honorer la beauté ancestrale avec Ndolo Rituals.<br>
            Pour toute question concernant votre commande, contactez notre atelier à <strong>contact@ndolo-rituals.fr</strong>
        </div>
    </div>
</body>
</html>";
    }
}
