# 🔗 DATABASE_URL Quick Setup Guide

## 📋 Quick Steps

### Step 1: Know Your PostgreSQL Password
- The password you set when installing PostgreSQL
- Default username is: `postgres`

### Step 2: Create Database
Open PostgreSQL and run:
```sql
CREATE DATABASE fueleu_maritime;
```

### Step 3: Create .env File

Location: `Backend/.env`

Copy this template:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 4: Replace YOUR_PASSWORD

**Example:**
If password is `postgres123`:
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/fueleu_maritime?schema=public"
```

If password is `mypass`:
```env
DATABASE_URL="postgresql://postgres:mypass@localhost:5432/fueleu_maritime?schema=public"
```

---

## 🎯 Complete Example .env File

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Test It Works

```bash
cd Backend
npm run prisma:generate
npm run prisma:migrate
```

If you see "Migration applied successfully" → ✅ It's working!

---

## 🔧 Common Issues

### ❌ "Cannot connect"
- PostgreSQL not running → Start PostgreSQL service
- Wrong password → Check your password
- Database doesn't exist → Create it: `CREATE DATABASE fueleu_maritime;`

### ❌ "Authentication failed"
- Wrong password in .env file
- Test login: `psql -U postgres` (use your password)

---

**📖 For detailed instructions, see: `DATABASE_SETUP_GUIDE.md`**

