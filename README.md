# Backend API - Yupi Global

API Backend développée avec Express, TypeScript et Prisma.

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- MySQL 8+

### Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configurer la base de données :**
Créez un fichier `.env` à la racine du dossier `backend` :
```env
DATABASE_URL="mysql://user:password@localhost:3306/yupi_global"
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

3. **Initialiser Prisma :**
```bash
# Générer le client Prisma
npm run prisma:generate

# Créer la base de données et exécuter les migrations
npm run prisma:migrate
```

4. **Démarrer le serveur :**
```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm run build
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` - Démarrer en mode développement avec nodemon
- `npm run build` - Compiler TypeScript vers JavaScript
- `npm run start` - Démarrer le serveur en production
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:migrate` - Exécuter les migrations
- `npm run prisma:studio` - Ouvrir Prisma Studio (interface graphique)

## 🗄️ Base de Données

Le schéma Prisma se trouve dans `prisma/schema.prisma`.

### Modèles disponibles :
- `Page` - Pages du site
- `Post` - Articles de blog
- `Portfolio` - Projets portfolio
- `Service` - Services
- `Media` - Médias (images, fichiers)
- `Member` - Membres (adhésions)
- `Admin` - Administrateurs

### Créer une nouvelle migration :
```bash
npm run prisma:migrate
```

## 📁 Structure

```
backend/
├── src/
│   ├── app.ts              # Configuration Express
│   ├── index.ts            # Point d'entrée
│   ├── routes/             # Routes API
│   ├── controllers/        # Contrôleurs
│   ├── middleware/         # Middlewares
│   ├── services/           # Services métier
│   ├── types/              # Types TypeScript
│   ├── utils/              # Utilitaires
│   └── lib/
│       └── prisma.ts       # Client Prisma
├── prisma/
│   └── schema.prisma       # Schéma de base de données
└── dist/                   # Build output (généré)
```

## 🔌 Endpoints API

### Public
- `GET /api/v1/health` - Health check
- `GET /api/v1/pages` - Liste des pages
- `GET /api/v1/pages/:slug` - Page par slug
- `GET /api/v1/posts` - Articles blog
- `GET /api/v1/posts/:slug` - Article par slug
- `GET /api/v1/portfolio` - Projets portfolio
- `GET /api/v1/services` - Services
- `POST /api/v1/membership` - Adhésion nouveau membre

### Admin (Authentifié)
- `POST /api/v1/admin/auth/login` - Connexion admin
- `GET /api/v1/admin/auth/me` - Info admin connecté
- `GET /api/v1/admin/pages` - Liste pages (admin)
- `POST /api/v1/admin/pages` - Créer page
- `PUT /api/v1/admin/pages/:id` - Modifier page
- `DELETE /api/v1/admin/pages/:id` - Supprimer page
- ... (voir ARCHITECTURE-CUSTOM.md pour la liste complète)

## 🔒 Authentification

L'authentification admin utilise JWT. Le secret JWT doit être défini dans `.env` :
```env
JWT_SECRET=your-secret-key-here-change-in-production
```

## 🛠️ Développement

Le serveur démarre sur `http://localhost:3001` par défaut.

Pour le développement avec hot-reload, utilisez :
```bash
npm run dev
```

## 📚 Documentation

Voir `../ARCHITECTURE-CUSTOM.md` pour l'architecture complète.

