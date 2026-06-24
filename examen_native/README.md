# Gestion de livres — Examen NativeScript

## Description

Application mobile NativeScript (TypeScript) connectée à une API REST FastAPI. Elle permet à un utilisateur authentifié de consulter, ajouter, modifier et supprimer ses livres.

## Technologies utilisées

- NativeScript 9
- TypeScript
- API REST (FastAPI + MySQL)
- Authentification JWT (Bearer token)

## Prérequis

Avant de tester l'application, installer :

| Outil | Usage |
|-------|--------|
| [Node.js](https://nodejs.org/) 18+ | Dépendances et build NativeScript |
| NativeScript CLI | `npm install -g nativescript` |
| [Android Studio](https://developer.android.com/studio) | Émulateur Android |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Base de données MySQL |
| Python 3.11+ | API FastAPI (projet `fastapi_livres_api`) |

Pour iOS : macOS avec Xcode (simulateur iOS).

---

## 1. Démarrer l'API (obligatoire)

L'application mobile communique avec l'API FastAPI. Sans API active, la connexion et la liste des livres ne fonctionneront pas.

### MySQL avec Docker

Dans le dossier du projet API (`fastapi_livres_api`) :

```bash
docker compose up -d
```

Cela démarre :

- **MySQL** sur le port `3306` (conteneur `books_api_mysql`)
- **Adminer** (interface web MySQL) sur http://localhost:8080

Identifiants MySQL :

| Paramètre | Valeur |
|-----------|--------|
| Serveur (Adminer) | `db` |
| Base de données | `books_api` |
| Utilisateur | `books_user` |
| Mot de passe | `books_password` |

### Lancer FastAPI

Toujours dans `fastapi_livres_api` :

```bash
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --reload
```

Documentation Swagger : **http://127.0.0.1:8000/docs**

---

## 2. Installer et lancer l'application mobile

```bash
npm install
ns run android --no-hmr
```

Autres commandes utiles :

```bash
npm run android          # alias vers ns run android
ns run ios               # simulateur iOS (macOS)
ns build android         # build APK sans lancer
```

> **Windows + chemin OneDrive avec accents** (`Cégep`, `Trois-Rivières`) : le script `scripts/patch-android-gradle.js` s'exécute automatiquement après `npm install`. Si le build Gradle échoue encore :
>
> ```bash
> node scripts/patch-android-gradle.js
> ns build android
> ```
>
> Solution alternative : déplacer le projet vers un chemin sans accents, ex. `C:\dev\examen_native`.

---

## URL de l'API

Configurée dans `app/config/api.config.ts` :

| Plateforme | URL de base |
|------------|-------------|
| Android (émulateur) | `http://10.0.2.2:8000` |
| iOS (simulateur) | `http://localhost:8000` |

- `10.0.2.2` est l'adresse de la machine hôte vue depuis l'émulateur Android.
- L'API doit écouter sur `0.0.0.0:8000` (`uvicorn app.main:app --host 0.0.0.0 --reload`).

Swagger (navigateur sur le PC) : http://127.0.0.1:8000/docs

---

## Utilisateur de test

Compte déjà créé pour les tests :

| Champ | Valeur |
|-------|--------|
| Courriel | `daoudasouare1@livre.com` |
| Mot de passe | `123456` |

Pour créer un autre compte, utiliser Swagger ou Postman :

- **POST** `/auth/register`
- Corps JSON : `{ "name", "email", "password", "password_confirm" }`

---

## Fonctionnalités réalisées

- Création d'un utilisateur via Swagger / Postman (`POST /auth/register`)
- Connexion (`POST /auth/login`)
- Liste des livres de l'utilisateur connecté
- Ajout d'un livre
- Détail d'un livre
- Modification d'un livre
- Déconnexion
- Suppression d'un livre (bonus)

---

## Routes API utilisées

| Fonctionnalité | Méthode | Route | Auth |
|----------------|---------|-------|------|
| Créer un utilisateur | POST | `/auth/register` | Non |
| Connexion | POST | `/auth/login` | Non |
| Liste des livres | GET | `/books` | Bearer JWT |
| Détail d'un livre | GET | `/books/:id` | Bearer JWT |
| Ajouter un livre | POST | `/books` | Bearer JWT |
| Modifier un livre | PUT | `/books/:id` | Bearer JWT |
| Supprimer un livre (bonus) | DELETE | `/books/:id` | Bearer JWT |

L'app envoie le jeton dans l'en-tête : `Authorization: Bearer <access_token>`.

Les champs livre sont affichés en français dans l'app (`titre`, `auteur`, `année`, `statut`) et convertis en anglais pour l'API (`title`, `author`, `year`, `status`) via `app/models/book.model.ts`.

---

## Structure du projet

```txt
app/
├── config/api.config.ts       # URL de l'API
├── constants/messages.ts      # Messages d'erreur (français)
├── models/                    # Modèles TypeScript + mapping API
├── services/                  # auth, books, requêtes HTTP
├── utils/navigation.helper.ts # Navigation et garde d'authentification
└── views/
    ├── login/                 # Connexion
    ├── book-list/             # Liste + ajout / déconnexion
    ├── book-add/              # Formulaire d'ajout
    ├── book-edit/             # Formulaire de modification
    ├── book-detail/           # Détail + suppression (bonus)
    └── shared/                # ViewModel partagé du formulaire
scripts/patch-android-gradle.js  # Correctif Gradle (chemins accentués Windows)
```

---

## Fonctionnalités non terminées

Aucune.

---

## Scénario de test (correcteur)

1. Démarrer MySQL : `docker compose up -d` (dans `fastapi_livres_api`)
2. Démarrer l'API : `uvicorn app.main:app --host 0.0.0.0 --reload`
3. Vérifier Swagger : http://127.0.0.1:8000/docs
4. (Optionnel) Créer un utilisateur via `POST /auth/register`
5. Lancer l'app : `npm install` puis `ns run android --no-hmr`
6. Se connecter avec le courriel et mot de passe de test
7. Vérifier la liste des livres (vide ou avec des entrées existantes)
8. Ajouter un livre et confirmer qu'il apparaît dans la liste
9. Ouvrir le détail du livre
10. Modifier le livre et vérifier les changements
11. (Bonus) Supprimer un livre depuis l'écran de détail
12. Se déconnecter et vérifier le retour à l'écran de connexion

---

## Dépannage

| Problème | Solution |
|----------|----------|
| Connexion impossible | Vérifier que l'API tourne (`/docs` accessible) et que Docker MySQL est actif |
| Erreur Gradle (chemin) | `node scripts/patch-android-gradle.js` puis relancer le build |
| « Application is not running » | Relancer avec `ns run android --no-hmr`, émulateur déverrouillé |
| LiveSync instable | Utiliser `--no-hmr` ou `adb uninstall org.examen.livres` puis relancer |

Identifiant de l'application Android : `org.examen.livres`
