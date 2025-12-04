# ⚡ Quick Deploy Commands

## 🚀 Railway + Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

### 2. Railway (Backend)
- Go to: https://railway.app
- New Project → GitHub repo → Select `Backend` folder
- Add PostgreSQL database
- Set environment variables:
  ```
  DATABASE_URL=${{Postgres.DATABASE_URL}}
  PORT=3001
  NODE_ENV=production
  FRONTEND_URL=https://your-frontend.vercel.app
  ```
- Update start command: `npm run prisma:generate && npm run prisma:migrate deploy && npm start`

### 3. Vercel (Frontend)
```bash
cd Frontend
vercel
```
- Or use web: https://vercel.com
- Set environment: `VITE_API_URL=https://your-backend.railway.app`

**Done! 🎉**

