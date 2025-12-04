# Complete Step-by-Step Guide: How to Complete Your FuelEU Maritime Project

## 🎯 Overview

This guide will walk you through **exactly** how to complete your FuelEU Maritime compliance platform project from start to finish. Everything has been set up for you - you just need to follow these steps!

---

## 📋 What's Already Done

✅ **Backend Structure** - All code files created
✅ **Frontend Structure** - All components created  
✅ **Database Schema** - Prisma schema ready
✅ **Documentation** - README, AGENT_WORKFLOW, REFLECTION complete

**What YOU need to do:**
1. Install dependencies
2. Set up database
3. Run migrations
4. Start servers

---

## 🚀 Phase 1: Backend Setup (15 minutes)

### Step 1.1: Install Backend Dependencies

1. Open terminal/command prompt
2. Navigate to Backend folder:
   ```bash
   cd Backend
   ```

3. Install all packages:
   ```bash
   npm install
   ```
   
   ⏱️ **Time:** ~2-3 minutes
   
   ✅ **What this does:** Downloads all required Node.js packages (Express, Prisma, TypeScript, etc.)

### Step 1.2: Set Up PostgreSQL Database

1. **Install PostgreSQL** (if not installed):
   - Download from: https://www.postgresql.org/download/
   - Install with default settings
   - Remember your postgres password!

2. **Create Database:**
   ```sql
   -- Open PostgreSQL command line (psql) or pgAdmin
   CREATE DATABASE fueleu_maritime;
   ```

3. **Create .env file:**
   - In the `Backend` folder, create a file named `.env`
   - Copy this content (update password!):
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fueleu_maritime?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```
   
   ⚠️ **Important:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password!

### Step 1.3: Generate Prisma Client

```bash
npm run prisma:generate
```

✅ **What this does:** Generates TypeScript types from your database schema

### Step 1.4: Run Database Migrations

```bash
npm run prisma:migrate
```

When prompted, name your migration: `init`

✅ **What this does:** Creates all database tables (routes, ship_compliance, bank_entries, pools, pool_members)

### Step 1.5: Seed the Database

```bash
npm run prisma:seed
```

✅ **What this does:** Adds 5 sample routes to your database

**You should see:**
```
🌱 Seeding database...
✅ Seeded 5 routes
🎯 Baseline route: R001
```

### Step 1.6: Test Backend Server

```bash
npm run dev
```

✅ **What this does:** Starts the backend server on http://localhost:3001

**You should see:**
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

**Test it:** Open browser and go to: http://localhost:3001/health

You should see: `{"status":"ok","timestamp":"..."}`

🎉 **Backend is ready!**

---

## 🔷 Phase 2: Frontend Setup (10 minutes)

### Step 2.1: Install Frontend Dependencies

1. Open a **NEW terminal window** (keep backend running!)
2. Navigate to Frontend folder:
   ```bash
   cd Frontend
   ```

3. Install all packages:
   ```bash
   npm install
   ```
   
   ⏱️ **Time:** ~2-3 minutes

### Step 2.2: Test Frontend

```bash
npm run dev
```

✅ **What this does:** Starts frontend development server

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

🎉 **Open your browser:** http://localhost:3000

**You should see:**
- FuelEU Maritime Compliance Platform header
- 4 tabs: Routes, Compare, Banking, Pooling
- Routes tab showing 5 routes in a table

---

## ✅ Phase 3: Testing the Application (20 minutes)

### Test 1: Routes Tab

1. **View Routes:**
   - You should see 5 routes (R001-R005)
   - R001 should show "(Baseline)"

2. **Filter Routes:**
   - Try filtering by vessel type: Select "Container"
   - Try filtering by year: Select "2024"

3. **Set Baseline:**
   - Find R002 (should not be baseline)
   - Click "Set Baseline" button
   - R002 should become baseline
   - R001 should no longer be baseline

✅ **Test Result:** Routes tab works correctly!

### Test 2: Compare Tab

1. **Click "Compare" tab**
2. **You should see:**
   - A bar chart comparing routes
   - A table with percent differences
   - Compliance indicators (✅/❌)

3. **Chart shows:**
   - Baseline GHG intensity (blue)
   - Comparison routes (green)
   - Target line (red at 89.3368)

✅ **Test Result:** Compare tab displays correctly!

### Test 3: Banking Tab

1. **Click "Banking" tab**
2. **Enter ship details:**
   - Ship ID: `R001`
   - Year: `2024`
   - Click "Load Data"

3. **You should see:**
   - Current Compliance Balance (CB)
   - Surplus/Deficit indicator

4. **Calculate CB first:**
   - Backend will calculate CB automatically
   - If R001 has positive CB, you can bank it

5. **Try Banking:**
   - Click "Bank Surplus" (if CB is positive)
   - Success message appears
   - Banking summary updates

6. **Try Applying:**
   - Enter an amount (less than available)
   - Click "Apply"
   - See KPIs: cb_before, applied, cb_after

✅ **Test Result:** Banking functionality works!

### Test 4: Pooling Tab

1. **Click "Pooling" tab**
2. **Select Year:** 2024
3. **Select Ships:**
   - Check boxes for multiple ships (e.g., R001, R002, R003)
   - Watch "Pool Sum" indicator

4. **Create Pool:**
   - If pool sum ≥ 0, "Create Pool" button is enabled
   - Click "Create Pool"
   - Success message appears
   - See before/after CB for each member

✅ **Test Result:** Pooling works correctly!

---

## 🎓 Phase 4: Understanding What You Built

### Architecture Overview

**Backend (Hexagonal Architecture):**

```
Backend/
├── src/
│   ├── core/                    ← Business Logic (No frameworks)
│   │   ├── domain/              ← Entities (Route, ComplianceBalance)
│   │   ├── application/         ← Use Cases (GetRoutes, BankSurplus)
│   │   └── ports/               ← Interfaces (RouteRepository)
│   │
│   ├── adapters/                ← Framework Code
│   │   ├── inbound/http/        ← Express controllers & routes
│   │   └── outbound/            ← Prisma repositories
│   │
│   └── infrastructure/          ← Database & Server Setup
│       ├── db/                  ← Prisma client
│       └── server/              ← Express app
```

**Frontend (Hexagonal Architecture):**

```
Frontend/
├── src/
│   ├── core/                    ← Business Logic
│   │   ├── domain/              ← TypeScript interfaces
│   │   └── ports/               ← Service interfaces
│   │
│   └── adapters/                ← Framework Code
│       ├── ui/                  ← React components
│       └── infrastructure/      ← API services (Axios)
```

### Key Features Explained

#### 1. Routes Tab
- **Data Source:** PostgreSQL `routes` table
- **Features:** Filtering, setting baseline
- **API:** `GET /routes`, `POST /routes/:id/baseline`

#### 2. Compare Tab
- **Data Source:** Routes compared against baseline
- **Features:** Charts, compliance indicators
- **API:** `GET /routes/comparison`
- **Formula:** `percentDiff = ((comparison/baseline) - 1) × 100`

#### 3. Banking Tab
- **Data Source:** `ship_compliance` and `bank_entries` tables
- **Features:** Bank surplus, apply banked
- **API:** `GET /compliance/cb`, `POST /banking/bank`, `POST /banking/apply`
- **Formula:** `CB = (Target - Actual) × Energy in scope`

#### 4. Pooling Tab
- **Data Source:** `pools` and `pool_members` tables
- **Features:** Create pools, greedy allocation
- **API:** `POST /pools`
- **Rules:** Sum ≥ 0, deficit ships can't exit worse

---

## 📊 Database Tables Explained

### routes
Stores shipping route information:
- routeId, vesselType, fuelType, year
- ghgIntensity, fuelConsumption, distance, totalEmissions
- isBaseline flag

### ship_compliance
Stores compliance balance calculations:
- shipId, year, cbGco2eq (compliance balance)
- adjustedCbGco2eq (after banking/pooling)

### bank_entries
Stores banking transactions:
- shipId, year, amountGco2eq
- Positive = banked, Negative = applied

### pools
Stores pool registry:
- id, year, createdAt

### pool_members
Stores pool member allocations:
- poolId, shipId, cbBefore, cbAfter

---

## 🔧 Troubleshooting

### Backend Won't Start

**Problem:** `Cannot connect to database`

**Solution:**
1. Check PostgreSQL is running
2. Verify `.env` file has correct DATABASE_URL
3. Check password is correct

**Problem:** `Port 3001 already in use`

**Solution:**
- Change PORT in `.env` file
- Or stop other service using port 3001

### Frontend Won't Connect to Backend

**Problem:** API calls fail

**Solution:**
1. Check backend is running (http://localhost:3001/health)
2. Check CORS is enabled (it is in code)
3. Check browser console for errors

### Database Migration Fails

**Problem:** `Migration failed`

**Solution:**
1. Reset database:
   ```bash
   npm run prisma:migrate reset
   ```
2. Run migrations again:
   ```bash
   npm run prisma:migrate
   ```

---

## 📝 Next Steps

### What You Have Now

✅ **Complete Full-Stack Application**
✅ **4 Working Features** (Routes, Compare, Banking, Pooling)
✅ **Hexagonal Architecture** (Clean, testable)
✅ **TypeScript** (Type-safe)
✅ **PostgreSQL Database** (Persistent storage)
✅ **React Frontend** (Modern UI)

### Optional Enhancements

1. **Add Tests:**
   - Unit tests for use cases
   - Integration tests for API endpoints
   - Component tests for React

2. **Add Authentication:**
   - User login/logout
   - Protected routes

3. **Add More Features:**
   - Export to CSV/PDF
   - Advanced reporting
   - Multi-year compliance tracking

4. **Deploy:**
   - Backend: Heroku, Railway, or AWS
   - Frontend: Vercel, Netlify, or AWS S3
   - Database: Managed PostgreSQL

---

## ✅ Checklist: Is Everything Working?

- [ ] Backend server starts on port 3001
- [ ] Frontend server starts on port 3000
- [ ] Database has 5 routes (check with: `SELECT * FROM routes;`)
- [ ] Routes tab shows all routes
- [ ] Compare tab shows chart and table
- [ ] Banking tab loads compliance data
- [ ] Pooling tab shows ships list
- [ ] Can set baseline route
- [ ] Can bank surplus (if positive CB)
- [ ] Can create pool (if valid)

---

## 🎉 Congratulations!

You've successfully completed the FuelEU Maritime Compliance Platform!

**What you've built:**
- Full-stack web application
- Clean architecture (Hexagonal)
- Type-safe codebase
- Database-backed persistence
- Modern React UI

**Time to complete:** ~45 minutes (with this guide)

**Skills demonstrated:**
- Backend API development
- Frontend React development
- Database design & migrations
- Architecture patterns
- Full-stack integration

---

## 📚 Additional Resources

- **Project Documentation:**
  - `README.md` - Full project documentation
  - `AGENT_WORKFLOW.md` - AI agent usage
  - `REFLECTION.md` - Development reflection

- **Architecture:**
  - Hexagonal Architecture: https://alistair.cockburn.us/hexagonal-architecture/
  - Clean Architecture: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

- **Technologies:**
  - Prisma: https://www.prisma.io/docs
  - React: https://react.dev
  - TailwindCSS: https://tailwindcss.com/docs
  - Express: https://expressjs.com

---

**Questions?** Review the code, check the README, or test the application!

**Good luck with your project! 🚀**

