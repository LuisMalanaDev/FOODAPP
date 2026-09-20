# KusinaDex — Standalone Filipino Food Mobile App & Fastify Backend
## Complete Developer & Operations Run Guide

This project is a standalone, pure mobile application ("KusinaDex") built with **React Native (Expo)**, styled with **NativeWind** & **Lucide React Native**, and powered by a dedicated **Fastify** TypeScript backend with **PostgreSQL + Prisma ORM** database caching.

---

## 1. Prerequisites

Ensure your development environment has the following tools installed and accessible:
- **Node.js**: v18.0.0 or higher (v24.19.0+ tested)
- **pnpm**: v9.0.0 or higher (`corepack enable` or `npm install -g pnpm`)
  > [!IMPORTANT]
  > Strict policy: Use `pnpm` exclusively throughout the entire monorepo. Do NOT use `npm`, `npx`, or `yarn`.
- **PostgreSQL Database**:
  - You can use any running PostgreSQL instance (local PostgreSQL service, Docker container, Supabase, Neon, or Railway).
  - *Zero-Config Docker Option*: A `docker-compose.yml` is provided at the root of the repo. Run:
    ```powershell
    docker compose up -d
    ```
    This spins up a PostgreSQL 16 container with user `kusina_user`, password `kusina_password`, and database `kusinadex_db` on port `5432`.
- **Expo Mobile Client**:
  - Install the **Expo Go** app from the Google Play Store or Apple App Store on your physical device, or launch an Android Emulator / iOS Simulator.

---

## 2. Monorepo Dependency Installation

Install all dependencies across the monorepo strictly via `pnpm`:

```powershell
# In repository root (d:\FOODAPP)
pnpm install
```

Build the shared TypeScript definitions package:
```powershell
pnpm --filter @kusinadex/types build
```

---

## 3. Environment Variables Setup

### A. Fastify Backend Server (`apps/server/.env`)
The server environment file is located at `apps/server/.env` (a template is also available in `apps/server/.env.example`):

```env
PORT=3000
HOST=0.0.0.0

# PostgreSQL Connection String (Prisma)
DATABASE_URL="postgresql://kusina_user:kusina_password@localhost:5432/kusinadex_db?schema=public"

# External API Configuration
MEALDB_API_BASE_URL="https://www.themealdb.com/api/json/v1/1"
```

> [!NOTE]
> If using your own local PostgreSQL installation, adjust `kusina_user`, `kusina_password`, port, and database name to match your local credentials.

### B. React Native Mobile App (`apps/mobile`)
By default, the mobile app connects to:
- Android Emulator: `http://10.0.2.2:3000`
- iOS Simulator: `http://localhost:3000`

If running on a **physical mobile device via Expo Go**, define your computer's local Wi-Fi / LAN IP in `apps/mobile/.env`:
```env
EXPO_PUBLIC_API_URL="http://192.168.1.XX:3000"
```
*(Replace `192.168.1.XX` with your computer's IPv4 address from `ipconfig`).*

---

## 4. Prisma Database Migration & Recipe Seed Execution

Run the Prisma migration and seed script strictly using `pnpm`:

```powershell
# 1. Generate the Prisma Client
pnpm --filter server run prisma:generate

# 2. Run Database Migrations to create tables (Categories, Recipes, Ingredients, Steps)
pnpm --filter server exec prisma migrate dev --name init_kusinadex

# 3. Seed Authentic Filipino Recipes & Culinary Categories
pnpm --filter server db:seed
```

> [!TIP]
> The seed script populates 14 master authentic Filipino recipes with metric measurements across all 5 culinary categories:
> 1. **Sabaw / Stews**: *Sinigang na Baboy, Batangas Bulalo, Tinolang Manok*
> 2. **Ginisa / Dry Dishes**: *Classic Adobo, Sizzling Sisig, Bicol Express, Kare-Kare*
> 3. **Ihaw / Barbecue**: *Bacolod Chicken Inasal, Pinoy Pork Barbecue*
> 4. **Pancit / Noodles**: *Pancit Palabok, Pancit Bihon at Canton Guisado*
> 5. **Kakanin / Desserts**: *Halo-Halo Espesyal, Tradisyunal na Bibingka, Creamy Leche Flan*

---

## 5. Development Server Commands

Open two separate terminals in `d:\FOODAPP`:

### Terminal 1: Start Fastify Backend Server
```powershell
pnpm --filter server dev
```
- Server URL: `http://localhost:3000`
- Health Endpoint: `http://localhost:3000/health`
- Recipes API: `http://localhost:3000/api/recipes`
- Categories API: `http://localhost:3000/api/categories`
- Search API: `http://localhost:3000/api/search?q=pork`

### Terminal 2: Launch Expo Mobile Client
```powershell
pnpm --filter mobile start
```
- Press `a` to run on an attached Android emulator or device.
- Press `i` to run on an iOS simulator.
- Scan the printed QR code with **Expo Go** on Android or the iOS Camera app to load the app directly on your physical device.

---

## 6. Monorepo Project Architecture

```
d:/FOODAPP/
├── pnpm-workspace.yaml
├── package.json
├── docker-compose.yml            # One-liner local PostgreSQL 16
├── RUN_GUIDE.md                  # This run guide
├── packages/
│   └── types/                    # Shared TypeScript domain contracts
│       ├── package.json
│       ├── tsconfig.json
│       └── src/index.ts          # Recipe, Category, Ingredient, Step interfaces
└── apps/
    ├── server/                   # Fastify TypeScript + Prisma ORM Backend
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── .env                  # Backend configuration
    │   ├── prisma/
    │   │   ├── schema.prisma     # Postgres schema with indexes & relations
    │   │   └── seed.ts           # 14 authentic Filipino recipes
    │   └── src/
    │       ├── index.ts          # Fastify entrypoint
    │       ├── app.ts            # CORS, sensible, health route
    │       ├── routes/
    │       │   ├── categories.ts # GET /api/categories
    │       │   ├── recipes.ts    # GET /api/recipes, /api/recipes/:id, /featured
    │       │   └── search.ts     # GET /api/search (dish name + ingredient search)
    │       └── services/
    │           ├── db.ts         # Prisma client singleton
    │           └── externalApi.ts# TheMealDB client, normalizer & DB auto-cacher
    └── mobile/                   # React Native Expo Mobile App
        ├── package.json
        ├── tsconfig.json
        ├── app.json              # Expo configuration
        ├── tailwind.config.js    # NativeWind styling
        ├── babel.config.js       # NativeWind babel plugin
        ├── metro.config.js       # Monorepo Metro resolution
        ├── index.js              # Expo root registration
        ├── App.tsx               # Root Navigation Container
        └── src/
            ├── navigation/
            │   └── AppNavigator.tsx # Bottom Tabs (Tuklasin, Maghanap, Paborito) + Stack
            ├── screens/
            │   ├── HomeScreen.tsx         # Bento Hero, Category Carousel, Daily Pick
            │   ├── SearchScreen.tsx       # Instant search & ingredient chips
            │   ├── RecipeDetailScreen.tsx # Hero, checklist, cooking mode button
            │   └── BookmarksScreen.tsx    # Saved offline favorites
            ├── components/
            │   ├── BentoCard.tsx          # Bento-styled Dish of the Day
            │   ├── CategoryPills.tsx      # Category carousel with Lucide icons
            │   ├── RecipeCard.tsx         # Feed card with badges & cook time
            │   ├── IngredientChecklist.tsx# Interactive strikethrough checklist
            │   ├── CookingStepsList.tsx   # Numbered instructions & chef tips
            │   └── CookingModeModal.tsx   # Fullscreen kitchen assistant with timer
            ├── hooks/
            │   ├── useRecipes.ts          # Recipe fetching & category filter
            │   ├── useRecipeDetail.ts     # Detail query hook
            │   ├── useCategories.ts       # Category list hook
            │   └── useBookmarks.ts        # AsyncStorage local bookmark store
            ├── services/
            │   └── api.ts                 # Backend API client with offline fallback
            └── theme/
                └── colors.ts              # Authentic Philippine culinary palette
```
