# 🚀 How to Run the FuelEU Maritime Project

## Prerequisites

Before starting, make sure you have:
- ✅ **Node.js** installed (version 18 or higher) - [Download here](https://nodejs.org/)
- ✅ **PostgreSQL** installed - [Download here](https://www.postgresql.org/download/)
- ✅ **npm** (comes with Node.js) or **yarn**

---

## Step 1: Set Up PostgreSQL Database

### 1.1 Install PostgreSQL (if not installed)
- Download and install PostgreSQL from: https://www.postgresql.org/download/
- During installation, remember the password you set for the `postgres` user
- Install with default settings

### 1.2 Create the Database

Open **pgAdmin** (comes with PostgreSQL) or **psql** command line, and run:

```sql
CREATE DATABASE fueleu_maritime;
```

Or using command line:
```bash
psql -U postgres
# Then type:
CREATE DATABASE fueleu_maritime;
\q
```

---

## Step 2: Backend Setup

### 2.1 Open Terminal/Command Prompt

Navigate to the Backend folder:

```bash
cd "D:\FuelEU Maritime\Backend"
```

### 2.2 Install Dependencies

```bash
npm install
```

⏱️ This takes 2-3 minutes. Wait for it to finish.

### 2.3 Create Environment File

Create a file named `.env` in the `Backend` folder with this content:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

⚠️ **IMPORTANT:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password!

**Example:**
```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/fueleu_maritime?schema=public"
```

### 2.4 Generate Prisma Client

```bash
npm run prisma:generate
```

✅ You should see: `Generated Prisma Client`

### 2.5 Create Database Tables

```bash
npm run prisma:migrate
```

When prompted:
- Migration name: type `init` and press Enter

✅ You should see: `Migration applied successfully`

### 2.6 Add Sample Data

```bash
npm run prisma:seed
```

✅ You should see:
```
🌱 Seeding database...
✅ Seeded 5 routes
🎯 Baseline route: R001
```

### 2.7 Start Backend Server

```bash
npm run dev
```

✅ You should see:
```
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
```

**Keep this terminal open!** The backend needs to keep running.

**Test it:** Open your browser and go to: http://localhost:3001/health
- You should see: `{"status":"ok","timestamp":"..."}`

---

## Step 3: Frontend Setup

### 3.1 Open a NEW Terminal/Command Prompt

⚠️ **IMPORTANT:** Keep the backend terminal running! Open a **new** terminal window.

Navigate to the Frontend folder:

```bash
cd "D:\FuelEU Maritime\Frontend"
```

### 3.2 Install Dependencies

```bash
npm install
```

⏱️ This takes 2-3 minutes. Wait for it to finish.

### 3.3 Start Frontend Server

```bash
npm run dev
```

✅ You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

## Step 4: Open the Application

Open your browser and go to:

```
http://localhost:3000
```

🎉 **You should see the FuelEU Maritime Compliance Platform!**

---

## ✅ Verify Everything Works

### Check Backend
- Open: http://localhost:3001/health
- Should show: `{"status":"ok","timestamp":"..."}`

### Check Frontend
- Open: http://localhost:3000
- Should show: Dashboard with 4 tabs (Routes, Compare, Banking, Pooling)

### Test Routes Tab
- Click "Routes" tab
- You should see 5 routes (R001-R005)
- R001 should show "(Baseline)"

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to database"

**Solution:**
1. Check PostgreSQL is running
   - Windows: Check Services (search "Services" in Start menu, find "postgresql")
   - Or restart PostgreSQL service
2. Verify your `.env` file has the correct password
3. Check database exists: `psql -U postgres -l` (should see fueleu_maritime)

### Problem: "Port 3001 already in use"

**Solution:**
- Find what's using port 3001 and stop it
- Or change PORT in `.env` file to another number (e.g., 3002)

### Problem: "Port 3000 already in use"

**Solution:**
- Change port in `Frontend/vite.config.ts`
- Or stop the application using port 3000

### Problem: Frontend shows errors / can't connect to API

**Solution:**
1. Make sure backend is running (check http://localhost:3001/health)
2. Check browser console (F12) for errors
3. Verify both servers are running in separate terminals

### Problem: "npm: command not found"

**Solution:**
- Install Node.js: https://nodejs.org/
- Restart your terminal after installation

### Problem: Migration fails

**Solution:**
```bash
# Reset and try again
npm run prisma:migrate reset
# Answer 'y' to reset
npm run prisma:migrate
npm run prisma:seed
```

---

## 📋 Quick Command Reference

### Backend Commands

```bash
cd Backend

# Install dependencies (first time only)
npm install

# Generate Prisma client (after schema changes)
npm run prisma:generate

# Create/update database tables
npm run prisma:migrate

# Add sample data
npm run prisma:seed

# Start development server
npm run dev
```

### Frontend Commands

```bash
cd Frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

---

## 🎯 What to Do After Starting

1. **Routes Tab:**
   - View all routes
   - Filter by vessel type, fuel type, year
   - Set a route as baseline

2. **Compare Tab:**
   - See route comparisons
   - View charts
   - Check compliance status

3. **Banking Tab:**
   - Enter Ship ID: `R001`
   - Enter Year: `2024`
   - Click "Load Data"
   - Try banking or applying amounts

4. **Pooling Tab:**
   - Select year: `2024`
   - Select multiple ships
   - Create a pool

---

## 🛑 How to Stop the Servers

**To stop backend:**
- Go to backend terminal
- Press `Ctrl + C`

**To stop frontend:**
- Go to frontend terminal
- Press `Ctrl + C`

---

## 📚 Need More Help?

- Check `QUICK_START.md` for a condensed guide
- Check `COMPLETE_STEP_BY_STEP_GUIDE.md` for detailed explanations
- Check `README.md` for full documentation

---

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `fueleu_maritime` created
- [ ] Backend `.env` file created with correct password
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database tables created (`npm run prisma:migrate`)
- [ ] Sample data added (`npm run prisma:seed`)
- [ ] Backend running on http://localhost:3001
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend running on http://localhost:3000
- [ ] Application opens in browser successfully

---

**🎉 You're all set! Enjoy your FuelEU Maritime Compliance Platform!**

