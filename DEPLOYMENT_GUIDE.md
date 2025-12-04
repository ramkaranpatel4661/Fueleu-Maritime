# 🚀 Deployment Guide - FuelEU Maritime Platform

## 📋 Deployment Options

### Option 1: Railway (Recommended - Easiest)
✅ Handles Backend + Database + Frontend
✅ Free tier available
✅ Automatic deployments from GitHub

### Option 2: Render (Good Free Tier)
✅ Free PostgreSQL database
✅ Free static site hosting
✅ Automatic deployments

### Option 3: Separate Deployments
✅ Vercel (Frontend - Best performance)
✅ Railway/Render (Backend + Database)

---

## 🎯 Option 1: Railway (Recommended)

### Step 1: Prepare Your Code

1. **Make sure everything is committed to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

### Step 2: Deploy Backend to Railway

1. **Go to Railway:** https://railway.app
2. **Sign up/Login** (use GitHub account)
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Select the `Backend` folder as root directory**

### Step 3: Add PostgreSQL Database

1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will create database automatically
4. Copy the **DATABASE_URL** from the database service

### Step 4: Configure Environment Variables

In Railway backend service, go to **"Variables"** tab and add:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

Railway automatically provides `DATABASE_URL` if you reference it like above.

### Step 5: Deploy Frontend to Vercel

1. **Go to Vercel:** https://vercel.com
2. **Sign up/Login** (use GitHub account)
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - Framework Preset: **Vite**
   - Root Directory: `Frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app` (get this from Railway)

### Step 6: Update CORS in Backend

After getting frontend URL, update Railway backend environment:
- Add: `FRONTEND_URL=https://your-frontend-url.vercel.app`

### Step 7: Run Migrations

In Railway backend service:
1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Open **"View Logs"**
4. Or add this to startup command:
   ```bash
   npm run prisma:generate && npm run prisma:migrate deploy && npm start
   ```

### Step 8: Seed Database (Optional)

Connect to Railway PostgreSQL and run seed, or add to startup:
```bash
npm run prisma:seed
```

---

## 🎯 Option 2: Render

### Backend Deployment

1. **Go to Render:** https://render.com
2. **Sign up/Login**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure:**
   - Name: `fueleu-backend`
   - Environment: `Node`
   - Build Command: `cd Backend && npm install && npm run build && npm run prisma:generate`
   - Start Command: `cd Backend && npm run prisma:migrate deploy && npm start`
   - Root Directory: `Backend`

6. **Add Environment Variables:**
   ```env
   DATABASE_URL=<from-postgres-service>
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=<your-frontend-url>
   ```

### Database on Render

1. **New + → PostgreSQL**
2. **Copy DATABASE_URL** to backend environment variables
3. Run migrations manually or in build command

### Frontend on Render

1. **New + → Static Site**
2. **Configure:**
   - Build Command: `cd Frontend && npm install && npm run build`
   - Publish Directory: `Frontend/dist`
   - Root Directory: `Frontend`

3. **Add Environment Variable:**
   - `VITE_API_URL=https://your-backend-url.onrender.com`

---

## 🎯 Option 3: Vercel (Frontend) + Railway (Backend)

### Frontend - Vercel

1. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   cd Frontend
   vercel
   ```

2. **Set Environment Variable:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.railway.app`

3. **Redeploy** after adding environment variable

### Backend - Railway

Follow Railway steps above (Option 1)

---

## 📝 Environment Variables Summary

### Backend (.env or Railway/Render Variables)
```env
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel/Render Environment Variables)
```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 🔧 Important Notes

### 1. Database Migrations

**For Railway:**
- Add to start command: `npm run prisma:migrate deploy && npm start`
- Or run manually in Railway shell

**For Render:**
- Add to build command: `npm run prisma:migrate deploy`
- Or run in Render shell

### 2. Prisma Generate

Make sure to run `prisma:generate` before starting:
- Add to build command or start command

### 3. CORS Configuration

Backend CORS is already configured to accept `FRONTEND_URL` environment variable.

### 4. Build Commands

**Backend Build:**
```bash
npm install
npm run build
npm run prisma:generate
```

**Backend Start:**
```bash
npm run prisma:migrate deploy
npm start
```

**Frontend Build:**
```bash
npm install
npm run build
```

---

## ✅ Deployment Checklist

### Backend
- [ ] Code pushed to GitHub
- [ ] Database created (PostgreSQL)
- [ ] Environment variables set
- [ ] Migrations run
- [ ] Prisma client generated
- [ ] Server starts successfully
- [ ] Health check works: `/health`

### Frontend
- [ ] Code pushed to GitHub
- [ ] Environment variable `VITE_API_URL` set
- [ ] Build succeeds
- [ ] Frontend loads
- [ ] API calls work

---

## 🎯 Quick Railway Commands

### Update Backend Start Command

In Railway dashboard → Backend Service → Settings → Deploy:

```
npm run prisma:generate && npm run prisma:migrate deploy && npm start
```

### Check Logs

Railway → Your Service → Deployments → View Logs

---

## 🚀 Quick Deploy Script

Create a script to deploy both:

**deploy.sh:**
```bash
#!/bin/bash

echo "🚀 Deploying FuelEU Maritime Platform..."

# Backend (Railway will auto-deploy from GitHub)
echo "✅ Backend: Push to GitHub (Railway auto-deploys)"

# Frontend (Vercel)
cd Frontend
vercel --prod

echo "🎉 Deployment complete!"
```

---

## 📞 Troubleshooting

### Backend won't start
- Check logs in Railway/Render
- Verify DATABASE_URL is correct
- Make sure migrations ran
- Check Prisma client is generated

### Frontend can't connect to backend
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Make sure backend is running
- Check browser console for errors

### Database connection fails
- Verify DATABASE_URL format
- Check database is running
- Ensure migrations completed
- Test connection manually

---

## 🎉 After Deployment

Your app will be live at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app`

Test everything:
- ✅ Routes tab loads
- ✅ Compare tab works
- ✅ Banking functions
- ✅ Pooling works

---

**🎊 Your app is now live! 🎊**

