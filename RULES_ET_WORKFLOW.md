# Règles & Workflow — Projet E-commerce (Next.js + PHP)

## 1. Principes directeurs

1. **Séparation stricte frontend / backend.** Next.js ne parle jamais directement à MySQL. Il ne communique qu'avec l'API PHP via HTTPS + JSON. Aucune logique métier (prix, stock, TVA) dans le frontend.
2. **Le serveur est la seule source de vérité.** Prix, stock, remises, taxes : toujours recalculés côté PHP à la commande, jamais fait confiance au prix envoyé par le navigateur.
3. **Sécurité par défaut, pas en option.** Toute route API est protégée, validée et journalisée avant d'être considérée "terminée".
4. **Rien en production sans environnement de test.** Aucun changement de code de paiement, de stock ou de prix ne part directement en prod.
5. **RGPD et légal ne sont pas des "extras".** Ils font partie de la définition de "fini" (Definition of Done) pour toute fonctionnalité qui touche des données client.

---

## 2. Règles de sécurité (obligatoires, non négociables)

| Domaine | Règle |
|---|---|
| Base de données | Uniquement des requêtes préparées PDO (`prepare` + `bindParam`). Jamais de concaténation SQL. |
| Mots de passe | `password_hash()` (bcrypt/argon2), jamais MD5/SHA1 stockés en clair. |
| Authentification | JWT signé côté serveur, expiration courte (15–30 min) + refresh token en cookie `HttpOnly`, `Secure`, `SameSite=Strict`. |
| Entrées utilisateur | Validation stricte (type, longueur, format) + `htmlspecialchars()` en sortie contre le XSS. |
| CORS | Liste blanche explicite de domaines autorisés (jamais `*` en production). |
| Fichiers uploadés | Extension + MIME réel vérifiés, renommage aléatoire, stockage hors `webroot` exécutable. |
| Paiement | Aucune donnée de carte ne transite ni ne se stocke sur votre serveur (Stripe Elements / PayPal SDK côté client uniquement). Vérification des webhooks par signature (`Stripe-Signature`, etc.). |
| Transport | HTTPS forcé (HSTS), aucun mixed content. |
| Rate limiting | Limitation des tentatives sur `/login`, `/checkout`, `/promo` (ex. 10 req/min/IP). |
| Logs | Logs d'erreurs serveur séparés des logs applicatifs, jamais de mot de passe/token dans un log. |
| Secrets | Toutes les clés (Stripe, PayPal, DB) dans des variables d'environnement `.env`, jamais commit dans Git. |

---

## 3. Workflow Git / branches

```
main            → production (protégée, déploiement auto après validation)
staging         → pré-production (tests d'intégration, paiements en mode sandbox)
develop         → intégration continue des features
feature/xxx     → une branche par fonctionnalité (ex: feature/tunnel-paiement)
hotfix/xxx      → correctif urgent, part de main, revient dans main + develop
```

**Règle de fusion :** aucune fusion directe dans `main`. Toute PR vers `main` doit :
1. Provenir de `staging` validé.
2. Avoir été testée avec au moins un paiement sandbox (Stripe test mode).
3. Avoir été relue par une 2e personne (ou par vous-même à froid, le lendemain).

---

## 4. Workflow de développement d'une fonctionnalité

1. **Cadrage** : quelle donnée entre, quelle donnée sort, quelles règles métier (ex : seuil de stock = 5).
2. **Schéma DB** d'abord si la feature touche une nouvelle donnée.
3. **API PHP** : endpoint + validation + tests avec Postman/curl avant de toucher au frontend.
4. **Frontend Next.js** : consomme l'API, jamais de données en dur.
5. **Tests manuels** : cas normal + cas limite (stock à 0, code promo expiré, paiement refusé).
6. **Revue de sécurité rapide** : voir checklist section 2.
7. **Déploiement sur `staging`**, test réel avec un paiement sandbox de bout en bout.
8. **Déploiement `main`** uniquement après validation.

---

## 5. Environnements

| Environnement | Base de données | Paiements | Objectif |
|---|---|---|---|
| Local (dev) | MySQL local | Clés de test Stripe/PayPal | Développement quotidien |
| Staging | Copie anonymisée de la prod | Mode sandbox | Tests avant mise en ligne |
| Production | MySQL managé + sauvegardes auto | Clés live | Site réel, clients réels |

**Règle :** les clés "live" n'existent que sur le serveur de production, jamais en local, jamais dans le code source, jamais dans Git.

---

## 6. Sauvegardes

- Sauvegarde **automatique quotidienne** de la base de données (rétention 30 jours).
- Sauvegarde **avant chaque migration de schéma**.
- Export mensuel stocké hors du serveur principal (autre région/provider).
- Test de restauration trimestriel (une sauvegarde qu'on ne sait pas restaurer ne sert à rien).

---

## 7. Definition of Done (une fonctionnalité n'est "terminée" que si)

- [ ] Fonctionne sur mobile et desktop
- [ ] Validée par PHP côté serveur (pas seulement côté JS)
- [ ] Ne casse pas le calcul du stock ni de la TVA
- [ ] Testée avec un cas d'erreur (ex : rupture de stock pendant le paiement)
- [ ] Aucune clé secrète en dur dans le code
- [ ] Page légale/mention associée mise à jour si nécessaire
- [ ] Temps de chargement vérifié (< 2s)

---

## 8. Processus de mise en conformité (avant ouverture du site au public)

1. Créer les pages légales avec vos vraies informations (SIRET, adresse, hébergeur).
2. Faire valider les CGV par vous-même (idéalement un juriste si budget permet).
3. Activer le bandeau cookies AVANT tout script Meta Pixel / TikTok Pixel (consentement préalable obligatoire en UE).
4. Vérifier la conformité GPSR sur au moins 3 fiches produits pilotes.
5. Test de bout en bout d'une commande réelle (petit montant) en production avant l'annonce publique.

---

## 9. Ce que ce document ne remplace pas

Ce workflow structure le développement mais ne remplace pas un avis juridique (CGV, RGPD, TVA/OSS) ni un expert-comptable pour la facturation. Je peux préparer les gabarits techniques ; leur contenu final doit être validé par vous ou un professionnel avant mise en ligne.
