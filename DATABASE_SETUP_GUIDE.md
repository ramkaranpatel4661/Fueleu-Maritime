# 📊 Complete Database Setup Guide - Step by Step

## 🎯 What We Need to Do

Set up PostgreSQL database and create the correct `DATABASE_URL` connection string.

---

## Step 1: Install PostgreSQL (If Not Already Installed)

### 1.1 Download PostgreSQL

1. Go to: **https://www.postgresql.org/download/**
2. Click **"Download"** button
3. Select your operating system (Windows, macOS, or Linux)
4. Download the installer

### 1.2 Install PostgreSQL

**For Windows:**
1. Run the downloaded installer
2. Click **"Next"** through the setup wizard
3. **Important:** When asked for a password:
   - Enter a password (e.g., `postgres123` or `password`)
   - **REMEMBER THIS PASSWORD!** You'll need it later
   - Write it down somewhere safe
4. Keep default port: **5432**
5. Complete the installation

**For macOS:**
- Download from the website OR use Homebrew:
  ```bash
  brew install postgresql
  brew services start postgresql
  ```

**For Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 1.3 Verify Installation

Open a terminal/command prompt and type:

```bash
psql --version
```

You should see something like: `psql (PostgreSQL) 15.x` or similar.

---

## Step 2: Start PostgreSQL Service

### For Windows:

**Method 1: Check Services**
1. Press `Windows + R`
2. Type: `services.msc` and press Enter
3. Look for **"postgresql"** service
4. Right-click → **Start** (if not running)

**Method 2: Command Line**
```bash
# Open Command Prompt as Administrator, then:
net start postgresql-x64-15
# (Replace 15 with your PostgreSQL version)
```

### For macOS:
```bash
brew services start postgresql
```

### For Linux:
```bash
sudo systemctl start postgresql
```

---

## Step 3: Find Your Database Credentials

### Default PostgreSQL Credentials:

- **Username:** `postgres`
- **Password:** The one you set during installation
- **Host:** `localhost` (or `127.0.0.1`)
- **Port:** `5432` (default)

---

## Step 4: Create the Database

### Method 1: Using pgAdmin (GUI Tool - Easiest)

1. **Open pgAdmin** (installed with PostgreSQL)
   - Windows: Search "pgAdmin" in Start menu
   - It will ask for your PostgreSQL password (the one you set during installation)

2. **Connect to Server:**
   - Left sidebar, expand **"Servers"**
   - Click on **"PostgreSQL 15"** (or your version)
   - Enter password when prompted

3. **Create Database:**
   - Right-click on **"Databases"**
   - Select **"Create"** → **"Database..."**
   - Name: `fueleu_maritime`
   - Click **"Save"**

✅ Database created!

### Method 2: Using Command Line (psql)

1. **Open Command Prompt/Terminal**

2. **Connect to PostgreSQL:**
   ```bash
   psql -U postgres
   ```
   - Enter your password when prompted

3. **Create Database:**
   ```sql
   CREATE DATABASE fueleu_maritime;
   ```

4. **Verify it was created:**
   ```sql
   \l
   ```
   - You should see `fueleu_maritime` in the list

5. **Exit psql:**
   ```sql
   \q
   ```

✅ Database created!

---

## Step 5: Create the .env File

### 5.1 Navigate to Backend Folder

Open your file explorer and go to:
```
D:\FuelEU Maritime\Backend
```

### 5.2 Create .env File

1. Right-click in the Backend folder
2. Select **"New"** → **"Text Document"**
3. Name it exactly: `.env` (including the dot at the beginning)
   - ⚠️ **Important:** Windows might add `.txt` extension
   - To fix: Right-click → Rename → Change to `.env` (no .txt)

OR create it using Notepad:

1. Open Notepad
2. Save the file in `Backend` folder
3. Name: `.env`
4. File type: **"All Files"** (not Text Document)

### 5.3 Add Database URL

Open the `.env` file and paste this template:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 5.4 Replace YOUR_PASSWORD

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

**Example:**

If your password is `postgres123`, your DATABASE_URL should be:

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/fueleu_maritime?schema=public"
```

If your password is `mypassword`, it should be:

```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/fueleu_maritime?schema=public"
```

**⚠️ IMPORTANT NOTES:**
- Keep the quotes around the DATABASE_URL
- Don't use spaces in the password part
- If your password has special characters, you might need to URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `$` becomes `%24`
  - etc.

---

## Step 6: Understanding the DATABASE_URL Format

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=SCHEMA
```

**Breakdown:**
- `postgresql://` - Protocol
- `postgres` - Username (default)
- `YOUR_PASSWORD` - Your PostgreSQL password
- `localhost` - Host (your computer)
- `5432` - Port (default PostgreSQL port)
- `fueleu_maritime` - Database name we created
- `?schema=public` - Default schema

---

## Step 7: Test the Connection

### 7.1 Open Terminal in Backend Folder

```bash
cd "D:\FuelEU Maritime\Backend"
```

### 7.2 Generate Prisma Client

```bash
npm run prisma:generate
```

✅ Should see: `Generated Prisma Client`

### 7.3 Test Database Connection

```bash
npm run prisma:migrate
```

**If connection is successful:**
- You'll be asked: `Enter a name for the new migration:`
- Type: `init`
- Press Enter
- You should see: `Migration applied successfully`

**If connection fails:**
- Check error message (see troubleshooting below)

---

## 🔧 Troubleshooting Connection Issues

### Problem 1: "Cannot connect to database"

**Checklist:**
1. ✅ PostgreSQL service is running?
   - Windows: Check Services (postgresql should be running)
   - Or restart: `net start postgresql-x64-15`

2. ✅ Database exists?
   - Connect to psql: `psql -U postgres`
   - Check: `\l` (should see fueleu_maritime)
   - If not, create it: `CREATE DATABASE fueleu_maritime;`

3. ✅ Password is correct?
   - Test login: `psql -U postgres`
   - Enter password - should connect

4. ✅ .env file is in correct location?
   - Should be in: `Backend/.env`
   - Not in: `Backend/src/.env` or root folder

### Problem 2: "Authentication failed"

**Solution:**
- Wrong password in DATABASE_URL
- Try connecting manually: `psql -U postgres`
- If password works there, copy it exactly to .env

### Problem 3: "Database does not exist"

**Solution:**
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE fueleu_maritime;

-- Verify
\l

-- Exit
\q
```

### Problem 4: "Port 5432 is not listening"

**Solution:**
- PostgreSQL service might not be running
- Start it: Windows Services or `net start postgresql-x64-15`

### Problem 5: Special Characters in Password

If your password has special characters like `@`, `#`, `$`, etc., you need to URL-encode them:

**Example:**
- Password: `my@pass#123`
- Encoded: `my%40pass%23123`
- DATABASE_URL: `postgresql://postgres:my%40pass%23123@localhost:5432/fueleu_maritime?schema=public`

**Common Encodings:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`
- `=` → `%3D`

---

## 📝 Quick Reference: Complete .env File Example

**Standard Setup:**
```env
DATABASE_URL="postgresql://postgres:your_password_here@localhost:5432/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**If PostgreSQL is on Different Port:**
```env
DATABASE_URL="postgresql://postgres:your_password_here@localhost:5433/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**If PostgreSQL is on Remote Server:**
```env
DATABASE_URL="postgresql://postgres:your_password_here@192.168.1.100:5432/fueleu_maritime?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Verification Checklist

Before proceeding, verify:

- [ ] PostgreSQL is installed
- [ ] PostgreSQL service is running
- [ ] Database `fueleu_maritime` exists
- [ ] You know your PostgreSQL password
- [ ] `.env` file exists in `Backend` folder
- [ ] `.env` file has correct DATABASE_URL format
- [ ] Password in DATABASE_URL matches your PostgreSQL password
- [ ] `npm run prisma:generate` works
- [ ] `npm run prisma:migrate` connects successfully

---

## 🎯 Next Steps After Database Setup

Once your database connection works:

1. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

2. **Seed the database:**
   ```bash
   npm run prisma:seed
   ```

3. **Start backend server:**
   ```bash
   npm run dev
   ```

---

## 📞 Still Having Issues?

### Test Connection Manually

**Using psql:**
```bash
psql -U postgres -d fueleu_maritime
```
- If this works, your credentials are correct
- Copy the exact password to .env file

### Check PostgreSQL is Running

**Windows:**
```bash
# List all services
sc query | findstr postgresql

# Start service (as Administrator)
net start postgresql-x64-15
```

**macOS/Linux:**
```bash
# Check status
sudo systemctl status postgresql

# Start if stopped
sudo systemctl start postgresql
```

---

**🎉 Once your DATABASE_URL is correct, everything will work smoothly!**

