# 🚀 GitHub Upload Commands

## Step-by-Step Git Commands

### Step 1: Initialize Git Repository

```bash
cd "D:\FuelEU Maritime"
git init
```

### Step 2: Create .gitignore File (if not exists)

The `.gitignore` files should already exist in Backend and Frontend folders.

### Step 3: Stage All Files

```bash
git add .
```

### Step 4: Make First Commit

```bash
git commit -m "Initial commit: FuelEU Maritime Compliance Platform"
```

### Step 5: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `fueleu-maritime` (or any name you want)
3. Set to **Public**
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **"Create repository"**

### Step 6: Add GitHub Remote

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Replace:**
- `YOUR_USERNAME` - Your GitHub username
- `YOUR_REPO_NAME` - Your repository name

**Example:**
```bash
git remote add origin https://github.com/johndoe/fueleu-maritime.git
```

### Step 7: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

---

## Complete Command Sequence (Copy & Paste)

```bash
# Navigate to project folder
cd "D:\FuelEU Maritime"

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: FuelEU Maritime Compliance Platform"

# Add remote (REPLACE YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## If You Need to Rename Folders

If GitHub requires lowercase `/frontend` and `/backend`, rename them:

```bash
cd "D:\FuelEU Maritime"
mv Backend backend
mv Frontend frontend
```

Then follow the commands above.

---

## If You Get Authentication Error

### Option 1: Use Personal Access Token

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use token as password when pushing

### Option 2: Use GitHub CLI

```bash
gh auth login
```

---

## Subsequent Updates

After first push, use these commands for updates:

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Verify Upload

After pushing, check:
- https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
- You should see:
  - `Backend/` folder (or `backend/`)
  - `Frontend/` folder (or `frontend/`)
  - All documentation files

---

**🎯 Quick Copy-Paste (Replace YOUR_USERNAME and REPO_NAME):**

```bash
cd "D:\FuelEU Maritime"
git init
git add .
git commit -m "Initial commit: FuelEU Maritime Compliance Platform"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

