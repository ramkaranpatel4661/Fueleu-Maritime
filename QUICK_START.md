# 🚀 Quick Start Guide - FuelEU Maritime Platform

## ✅ Everything is Already Built!

All code is complete. You just need to:
1. Install dependencies
2. Set up database
3. Run the application

**Total time:** ~30 minutes

---

## 📝 Step-by-Step Instructions

### 1. Backend Setup (15 minutes)

```bash
# 1. Go to Backend folder
cd Backend

# 2. Install packages
npm install

# 3. Create .env file (see below)
# Copy the template and update your database password

# 4. Generate Prisma client
npm run prisma:generate

# 5. Create database tables
npm run prisma:migrate
# When prompted, name it: init

# 6. Add sample data
npm run prisma:seed

# 7. Start server
npm run dev
```

**Create `.env` file in Backend folder:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```
⚠️ Replace `YOUR_PASSWORD` with your PostgreSQL password!

**Verify:** Open http://localhost:3001/health in browser

---

### 2. Frontend Setup (10 minutes)

```bash
# 1. Open NEW terminal (keep backend running!)
# 2. Go to Frontend folder
cd Frontend

# 3. Install packages
npm install

# 4. Start frontend
npm run dev
```

**Verify:** Open http://localhost:3000 in browser

---

## 🎯 What You'll See

### Routes Tab
- Table with 5 routes (R001-R005)
- R001 is marked as baseline
- Filter by vessel type, fuel type, year
- "Set Baseline" button for each route

### Compare Tab
- Bar chart comparing routes
- Table with percent differences
- Compliance indicators (✅/❌)

### Banking Tab
- Enter Ship ID (e.g., R001) and Year (2024)
- Click "Load Data"
- View compliance balance
- Bank surplus or apply banked amount

### Pooling Tab
- Select year (2024)
- Select multiple ships (checkboxes)
- Create pool if sum ≥ 0
- See before/after CB for each ship

---

## 🔧 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running
- Verify password in `.env` file
- Create database: `CREATE DATABASE fueleu_maritime;`

### Port Already in Use
- Backend: Change `PORT=3001` in `.env`
- Frontend: Change port in `vite.config.ts`

### API Not Working
- Make sure backend is running (http://localhost:3001/health)
- Check browser console for errors
- Verify CORS is enabled (it is in code)

---

## 📚 Full Documentation

- **COMPLETE_STEP_BY_STEP_GUIDE.md** - Detailed walkthrough
- **README.md** - Complete project documentation
- **AGENT_WORKFLOW.md** - AI agent usage
- **REFLECTION.md** - Development reflection

---

## ✅ Success Checklist

- [ ] Backend runs on http://localhost:3001
- [ ] Frontend runs on http://localhost:3000
- [ ] Routes tab shows 5 routes
- [ ] Can set baseline route
- [ ] Compare tab shows chart
- [ ] Banking tab loads data
- [ ] Pooling tab shows ships

---

## 🎉 You're Done!

Your FuelEU Maritime Compliance Platform is ready!

**Features:**
✅ Routes management
✅ Route comparison
✅ Compliance banking
✅ Compliance pooling

**Architecture:**
✅ Hexagonal (Clean Architecture)
✅ TypeScript (Type-safe)
✅ PostgreSQL (Database)
✅ React + TailwindCSS (Modern UI)

---

**Need help?** Check the detailed guides in the project!

