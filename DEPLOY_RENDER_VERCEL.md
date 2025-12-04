# 🚀 Deploy to Render (Backend) + Vercel (Frontend)

## 📋 Overview

- **Backend + Database:** Render (PostgreSQL + Node.js)
- **Frontend:** Vercel (React/Vite)

---

## Step 1: Push Code to GitHub

```bash
cd "D:\FuelEU Maritime"
git add .
git commit -m "Ready for deployment"
git push
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to: **https://render.com**
2. Sign up (use GitHub account - easiest)
3. Connect your GitHub account

### 2.2 Create PostgreSQL Database

1. In Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `fueleu-maritime-db`
   - **Database:** `fueleu_maritime`
   - **User:** (auto-generated)
   - **Region:** Choose closest to you
   - **Plan:** Free (or paid)
4. Click **"Create Database"**
5. **IMPORTANT:** Copy the **"Internal Database URL"** or **"External Database URL"**
   - Format: `postgresql://user:password@host:port/database`

### 2.3 Deploy Backend Web Service

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Connect your GitHub repository
4. Configure service:

   **Basic Settings:**
   - **Name:** `fueleu-backend`
   - **Region:** Same as database
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `Backend`
   - **Runtime:** `Node`
   - **Build Command:** 
     ```bash
     npm install && npm run build && npm run prisma:generate
     ```
   - **Start Command:**
     ```bash
     npm run prisma:migrate deploy && npm start
     ```
   - **Plan:** Free (or paid)

5. Click **"Advanced"** and add **Environment Variables:**

   ```env
   DATABASE_URL=<paste-internal-database-url-from-step-2.2>
   PORT=10000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

   ⚠️ **Important:** Use **Internal Database URL** if database and backend are on Render!

6. Click **"Create Web Service"**

7. Wait for deployment (first time takes 5-10 minutes)

8. **Copy your backend URL:** 
   - Format: `https://fueleu-backend.onrender.com`

---

## Step 3: Run Database Migrations

### Option A: Automatic (Recommended)

The start command already includes migrations:
```bash
npm run prisma:migrate deploy && npm start
```

### Option B: Manual (If needed)

1. In Render backend service, go to **"Shell"** tab
2. Run:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate deploy
   npm run prisma:seed
   ```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to Frontend folder
cd Frontend

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# When asked:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? fueleu-frontend
# - Directory? ./
# - Override settings? No
```

### 4.2 Using Vercel Web Dashboard

1. Go to: **https://vercel.com**
2. Sign up/Login (use GitHub account)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure project:

   **Build Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

6. **Environment Variables:**
   - Click **"Environment Variables"**
   - Add:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://fueleu-backend.onrender.com` (your Render backend URL)
   - **Environment:** Production, Preview, Development (all)

7. Click **"Deploy"**

8. Wait for deployment (2-3 minutes)

9. **Copy your frontend URL:**
   - Format: `https://fueleu-frontend.vercel.app`

---

## Step 5: Update Backend CORS

1. Go back to Render Dashboard → Your Backend Service
2. Go to **"Environment"** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://fueleu-frontend.vercel.app
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

---

## Step 6: Test Your Deployment

### Backend Health Check
Open: `https://fueleu-backend.onrender.com/health`
- Should return: `{"status":"ok","timestamp":"..."}`

### Frontend
Open: `https://fueleu-frontend.vercel.app`
- Should load the dashboard
- Test all 4 tabs

---

## 📝 Environment Variables Summary

### Render Backend Environment Variables:
```env
DATABASE_URL=postgresql://user:pass@host:port/db (from Render PostgreSQL)
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://fueleu-frontend.vercel.app
```

### Vercel Frontend Environment Variables:
```env
VITE_API_URL=https://fueleu-backend.onrender.com
```

---

## 🔧 Render Configuration Files

### Create `Backend/render.yaml` (Optional but recommended):

```yaml
services:
  - type: web
    name: fueleu-backend
    env: node
    plan: free
    buildCommand: npm install && npm run build && npm run prisma:generate
    startCommand: npm run prisma:migrate deploy && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        fromDatabase:
          name: fueleu-maritime-db
          property: connectionString
      - key: FRONTEND_URL
        sync: false

databases:
  - name: fueleu-maritime-db
    plan: free
    databaseName: fueleu_maritime
    user: fueleu_user
```

---

## ⚙️ Important Render Notes

### Port Configuration
- Render uses port from `PORT` environment variable
- Default is `10000` for free tier
- Your code already uses `process.env.PORT || 3001`

### Database Connection
- Use **Internal Database URL** when backend and database are both on Render
- Use **External Database URL** if connecting from outside Render

### Build Time
- First deployment: 5-10 minutes
- Subsequent: 2-5 minutes
- Free tier has slower builds

### Sleep Mode (Free Tier)
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider upgrading for production

---

## 🚨 Troubleshooting

### Backend won't start
- Check Render logs: Service → Logs tab
- Verify DATABASE_URL is correct
- Make sure migrations ran
- Check if Prisma client generated

### Database connection error
- Verify using Internal Database URL
- Check database is running (Render dashboard)
- Test connection string format

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit health endpoint)
- Make sure CORS allows your frontend URL
- Check browser console for errors

### Migrations fail
- Run manually in Render Shell:
  ```bash
  npm run prisma:generate
  npm run prisma:migrate deploy
  ```

### Build fails
- Check build logs in Render
- Verify all dependencies in package.json
- Make sure TypeScript compiles

---

## ✅ Deployment Checklist

### Render Backend
- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created
- [ ] Web service created
- [ ] Environment variables set
- [ ] Build command configured
- [ ] Start command configured
- [ ] Migrations run successfully
- [ ] Health check works

### Vercel Frontend
- [ ] Code pushed to GitHub
- [ ] Project created on Vercel
- [ ] Environment variable `VITE_API_URL` set
- [ ] Build succeeds
- [ ] Frontend loads correctly
- [ ] API calls work

### Integration
- [ ] Backend CORS allows frontend URL
- [ ] All tabs work
- [ ] Database operations work
- [ ] No console errors

---

## 🎯 Quick Command Reference

### Update Backend (Render auto-deploys from GitHub)
```bash
git add .
git commit -m "Update"
git push
# Render automatically redeploys
```

### Update Frontend (Vercel auto-deploys from GitHub)
```bash
git add .
git commit -m "Update"
git push
# Vercel automatically redeploys
```

### Manual Redeploy
- **Render:** Dashboard → Service → Manual Deploy
- **Vercel:** Dashboard → Project → Deployments → Redeploy

---

## 🎉 Your Live URLs

After deployment:

- **Frontend:** `https://fueleu-frontend.vercel.app`
- **Backend:** `https://fueleu-backend.onrender.com`
- **Database:** Managed by Render (internal)

---

**🚀 Your app is now live on Render + Vercel!**

