# 🚀 Deployment Guide - Render + Vercel

## 📋 Deployment Stack

- **Backend + Database:** Render (PostgreSQL + Node.js)
- **Frontend:** Vercel (React/Vite)

---

## ⚡ Quick Start

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push
```

### Step 2: Deploy Backend to Render

1. **Go to:** https://render.com → Sign up with GitHub
2. **Create PostgreSQL Database:**
   - New + → PostgreSQL
   - Name: `fueleu-maritime-db`
   - Copy Internal Database URL

3. **Create Web Service:**
   - New + → Web Service
   - Connect GitHub repo
   - **Settings:**
     - Name: `fueleu-backend`
     - **Root Directory:** `Backend` ⚠️ **IMPORTANT!**
     - Build Command: `npm install && npm run build && npm run prisma:generate`
     - Start Command: `npm run prisma:migrate deploy && npm start`
   - **Environment Variables:**
     ```
     DATABASE_URL=<internal-database-url>
     PORT=10000
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

4. **Copy Backend URL:** `https://fueleu-backend.onrender.com`

### Step 3: Deploy Frontend to Vercel

1. **Go to:** https://vercel.com → Sign up with GitHub
2. **Add New Project** → Import repo
3. **Settings:**
   - Framework: Vite
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://fueleu-backend.onrender.com`
5. **Deploy**

### Step 4: Update CORS

In Render → Backend Service → Environment:
- Update `FRONTEND_URL` with your Vercel URL
- Save (auto-redeploys)

---

## ✅ Done!

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://fueleu-backend.onrender.com`

---

**📖 Detailed guide:** See `DEPLOY_RENDER_VERCEL.md`

