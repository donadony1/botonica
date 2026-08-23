# Ndolo Rituals API

API PHP de l'application e-commerce. Le frontend ne doit jamais se connecter directement a MySQL.

## Prerequis

- PHP 8.2+
- MySQL 8+
- Composer si des dependances sont ajoutees

## Demarrage local

1. Copier `.env.example` vers `.env` et renseigner les valeurs locales.
2. Executer `schema.sql` dans la base MySQL locale.
3. Demarrer l'API :

```powershell
php -S localhost:8080 -t public
```

Endpoint de verification : `GET http://localhost:8080/health`

Les secrets et identifiants ne doivent jamais etre commits. Les routes metier seront ajoutees apres validation du schema et des regles d'authentification.
