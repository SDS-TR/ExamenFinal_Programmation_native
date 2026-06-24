# API Livres — FastAPI + MySQL

API REST pour l'examen final en programmation mobile multiplateforme avec NativeScript.

Elle permet de gérer :

- la création d'un utilisateur avec Postman ou Swagger ;
- la connexion ;
- la consultation, modification et suppression du compte ;
- l'ajout, la liste, le détail, la modification et la suppression de livres.

La suppression d'un livre est incluse dans l'API, mais elle peut rester une fonctionnalité bonus dans l'examen mobile.

---

## 1. Technologies utilisées

- Python
- FastAPI
- SQLAlchemy
- MySQL
- PyMySQL
- JWT Bearer Token
- Pydantic

---

## 2. Structure du projet

```txt
fastapi_livres_api/
  app/
    main.py
    config.py
    database.py
    models.py
    schemas.py
    security.py
    routers/
      auth.py
      account.py
      books.py
  .env.example
  docker-compose.yml
  requirements.txt
  schema.sql
  README.md
```

---

## 3. Lancer MySQL avec Docker

Dans le dossier du projet :

```bash
docker compose up -d
```

Cela lance un serveur MySQL avec les informations suivantes :

```txt
Base de données : books_api
Utilisateur     : books_user
Mot de passe    : books_password
Port            : 3306
```

---

## 4. Configuration de l'API

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Contenu principal :

```env
DATABASE_URL="mysql+pymysql://books_user:books_password@127.0.0.1:3306/books_api?charset=utf8mb4"
SECRET_KEY="change-me-super-secret-key"
ACCESS_TOKEN_EXPIRE_MINUTES=120
CORS_ORIGINS="*"
```

Pour générer une vraie clé secrète :

```bash
openssl rand -hex 32
```

---

## 5. Installer les dépendances Python

Créer un environnement virtuel :

```bash
python -m venv .venv
```

Activer l'environnement virtuel.

Sur Windows PowerShell :

```bash
.venv\Scripts\Activate.ps1
```

Sur macOS ou Linux :

```bash
source .venv/bin/activate
```

Installer les dépendances :

```bash
pip install -r requirements.txt
```

---

## 6. Lancer l'API

```bash
uvicorn app.main:app --reload
```

L'API sera disponible ici :

```txt
http://127.0.0.1:8000
```

Documentation Swagger :

```txt
http://127.0.0.1:8000/docs
```

---

## 7. Important pour NativeScript

Depuis une application mobile, `localhost` ne pointe pas toujours vers votre ordinateur.

Pour un émulateur Android, essayez souvent :

```txt
http://10.0.2.2:8000
```

Pour un téléphone physique, utilisez l'adresse IP locale de votre ordinateur, par exemple :

```txt
http://192.168.1.25:8000
```

Dans ce cas, lancez l'API ainsi :

```bash
uvicorn app.main:app --host 0.0.0.0 --reload
```

---

## 8. Routes disponibles

### Authentification

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| POST | `/auth/register` | Créer un utilisateur | Non |
| POST | `/auth/login` | Se connecter avec JSON | Non |
| POST | `/auth/token` | Se connecter avec formulaire OAuth2 pour Swagger | Non |

### Compte utilisateur

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| GET | `/account` | Voir son compte | Oui |
| PUT | `/account` | Modifier son compte | Oui |
| PATCH | `/account` | Modifier partiellement son compte | Oui |
| DELETE | `/account` | Supprimer son compte | Oui |

### Livres

| Méthode | Route | Description | Auth requise |
|---|---|---|---|
| GET | `/books` | Voir la liste des livres | Oui |
| POST | `/books` | Ajouter un livre | Oui |
| GET | `/books/{book_id}` | Voir le détail d'un livre | Oui |
| PUT | `/books/{book_id}` | Modifier un livre | Oui |
| PATCH | `/books/{book_id}` | Modifier partiellement un livre | Oui |
| DELETE | `/books/{book_id}` | Supprimer un livre | Oui |

---

## 9. Corps des requêtes

### Créer un utilisateur

`POST /auth/register`

```json
{
  "name": "Alice Tremblay",
  "email": "alice@example.com",
  "password": "secret123",
  "password_confirm": "secret123"
}
```

Réponse :

```json
{
  "id": 1,
  "name": "Alice Tremblay",
  "email": "alice@example.com",
  "created_at": "2026-06-23T12:00:00",
  "updated_at": "2026-06-23T12:00:00"
}
```

Les étudiants doivent faire cette requête dans Postman ou Swagger et prendre une capture d'écran montrant la création réussie de l'utilisateur.

---

### Se connecter

`POST /auth/login`

```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

Réponse :

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Alice Tremblay",
    "email": "alice@example.com",
    "created_at": "2026-06-23T12:00:00",
    "updated_at": "2026-06-23T12:00:00"
  }
}
```

Pour les routes protégées, envoyer ensuite l'en-tête :

```txt
Authorization: Bearer VOTRE_JETON
```

---

### Utiliser le bouton Authorize dans Swagger

Swagger utilise la route `POST /auth/token`.

Dans le formulaire Swagger :

```txt
username = votre courriel
password = votre mot de passe
```

La route `/auth/login` reste la route recommandée pour l'application NativeScript, car elle reçoit du JSON.

---

### Ajouter un livre

`POST /books`

```json
{
  "title": "Le Petit Prince",
  "author": "Antoine de Saint-Exupéry",
  "year": 1943,
  "status": "À lire",
  "comment": "Lecture pour le cours"
}
```

---

### Modifier un livre

`PATCH /books/1`

```json
{
  "status": "Terminé",
  "comment": "Livre terminé pendant l'examen"
}
```

---

### Modifier son compte

`PATCH /account`

```json
{
  "name": "Alice Gagnon",
  "email": "alice.gagnon@example.com"
}
```

---

## 10. Exemple de requêtes avec curl

### Créer un utilisateur

```bash
curl -X POST http://127.0.0.1:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Tremblay",
    "email": "alice@example.com",
    "password": "secret123",
    "password_confirm": "secret123"
  }'
```

### Connexion

```bash
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "secret123"
  }'
```

### Ajouter un livre

Remplacer `VOTRE_JETON` par le jeton retourné par `/auth/login`.

```bash
curl -X POST http://127.0.0.1:8000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JETON" \
  -d '{
    "title": "Le Petit Prince",
    "author": "Antoine de Saint-Exupéry",
    "year": 1943,
    "status": "À lire",
    "comment": "Lecture pour le cours"
  }'
```

### Voir la liste des livres

```bash
curl http://127.0.0.1:8000/books \
  -H "Authorization: Bearer VOTRE_JETON"
```

---

## 11. Exemple simple pour NativeScript

Exemple de connexion avec `fetch` :

```ts
const API_URL = "http://10.0.2.2:8000";

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error("Connexion impossible");
  }

  return await response.json();
}
```

Exemple de requête protégée :

```ts
export async function getBooks(token: string) {
  const response = await fetch(`${API_URL}/books`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les livres");
  }

  return await response.json();
}
```

Exemple d'ajout de livre :

```ts
export async function createBook(token: string, book: any) {
  const response = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(book)
  });

  if (!response.ok) {
    throw new Error("Impossible d'ajouter le livre");
  }

  return await response.json();
}
```

---

## 12. Notes pédagogiques

Cette API est volontairement simple pour un examen :

- les tables sont créées automatiquement au démarrage ;
- il n'y a pas de migrations Alembic ;
- le CORS est ouvert avec `*` pour faciliter les tests ;
- le mot de passe est hashé ;
- les routes protégées utilisent un jeton JWT ;
- chaque utilisateur voit seulement ses propres livres.

Pour un vrai projet en production, il faudrait renforcer la configuration, limiter le CORS, ajouter des migrations et mieux gérer les environnements.
