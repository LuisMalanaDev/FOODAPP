# KusinaDex Production Deployment Guide

## 🏗️ Architecture Overview

| Component | Platform | Purpose |
| :--- | :--- | :--- |
| **Database** | **Supabase** | Cloud PostgreSQL database for storing recipes, categories, ingredients, and steps |
| **Backend API** | **Render** | 24/7 Fastify Node.js server handling REST APIs, search, and Chef Dex Gemini AI |
| **Mobile App** | **Expo (EAS Build)** | Compiles directly into a standalone installable Android `.apk` file |

> **Do we need Vercel?**  
> **NO, you do NOT need Vercel!** Vercel is only for hosting websites (like Next.js or React web apps). Since your application is a native mobile app (`.apk`) talking directly to your Render backend API, Vercel is completely unnecessary.

---

## 1. 🗄️ Supabase Setup (Database)

1. Go to [supabase.com](https://supabase.com) and create a free project named **`kusinadex-db`**.
2. Set a strong database password (save this password!).
3. In your Supabase project dashboard, navigate to **Project Settings** -> **Database**.
4. Under **Connection string**, select **URI** (or **Session mode / Port 5432**):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```
5. From your local machine or terminal, run Prisma to create tables and seed all 435 recipes into Supabase:
   ```bash
   # Temporarily paste your Supabase URL into apps/server/.env as DATABASE_URL
   pnpm --filter server prisma migrate deploy
   pnpm --filter server db:seed
   ```

---

## 2. 🚀 Render Setup (Backend API)

1. Go to [render.com](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository: `https://github.com/LuisMalanaDev/FOODAPP`.
3. Configure the service settings:
   * **Name**: `kusinadex-api`
   * **Region**: *Singapore* (closest to Philippines / lowest latency)
   * **Root Directory**: Leave empty or set to root (`.`)
   * **Runtime**: `Node`
   * **Build Command**: `pnpm install && pnpm --filter @kusinadex/types build && pnpm --filter server build`
   * **Start Command**: `pnpm --filter server start`
4. Add **Environment Variables** in Render:
   * `NODE_ENV`: `production`
   * `PORT`: `10000`
   * `HOST`: `0.0.0.0`
   * `DATABASE_URL`: *(Your Supabase connection string from Step 1)*
   * `GEMINI_API_KEY`: `your_gemini_api_key_here`
5. Click **Create Web Service**.
6. Once deployed, copy your Render URL (e.g., `https://kusinadex-api.onrender.com`).

---

## 3. 📱 Expo EAS Build (Generate Android APK)

Now that your backend is deployed, you build your Android `.apk`:

1. Update your mobile environment variable with your live Render URL:
   Create or edit `apps/mobile/.env`:
   ```env
   EXPO_PUBLIC_API_URL="https://kusinadex-api.onrender.com"
   ```
2. Install EAS CLI globally if you haven't already:
   ```bash
   pnpm add -g eas-cli
   ```
3. Log in to your Expo account:
   ```bash
   eas login
   ```
4. Build the standalone APK:
   ```bash
   cd apps/mobile
   eas build -p android --profile preview
   ```
5. EAS will build the app in the cloud and give you a direct download link and QR code to download the `.apk` straight to your phone!
