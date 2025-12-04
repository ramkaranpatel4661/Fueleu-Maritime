# 🔧 Fix Render Deployment Error

## ❌ Error You're Seeing

```
Service Root Directory "/opt/render/project/src/backend" is missing.
cd: /opt/render/project/src/backend: No such file or directory
```

## ✅ Solution

Render is looking for `backend` (lowercase) but your folder is `Backend` (capital B).

### Fix Option 1: Set Root Directory in Render Dashboard (Easiest)

1. **Go to Render Dashboard**
2. **Click on your backend service**
3. **Go to "Settings" tab**
4. **Find "Root Directory" field**
5. **Change it to:** `Backend` (capital B)
6. **Save Changes**
7. **Manually Deploy** (Render will redeploy)

### Fix Option 2: Use render.yaml (Recommended)

I've updated `Backend/render.yaml` to include:
```yaml
rootDir: Backend
```

**Steps:**
1. The file is already updated
2. Push to GitHub:
   ```bash
   git add Backend/render.yaml
   git commit -m "Fix render.yaml root directory"
   git push
   ```
3. In Render Dashboard:
   - Go to your service
   - Settings → Scroll down
   - Enable **"Render YAML Path"**
   - Set to: `Backend/render.yaml`
   - Save

### Fix Option 3: Manual Configuration (No render.yaml)

1. **In Render Dashboard → Your Backend Service → Settings:**

   **Root Directory:**
   ```
   Backend
   ```
   
   **Build Command:**
   ```bash
   npm install && npm run build && npm run prisma:generate
   ```
   
   **Start Command:**
   ```bash
   npm run prisma:migrate deploy && npm start
   ```

2. **Save and Redeploy**

---

## 📋 Complete Render Configuration

### Environment Variables (in Render Dashboard):

```
DATABASE_URL=<your-postgres-internal-url>
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Build Settings:

- **Root Directory:** `Backend`
- **Build Command:** `npm install && npm run build && npm run prisma:generate`
- **Start Command:** `npm run prisma:migrate deploy && npm start`

---

## ✅ Quick Fix Steps

1. **Go to Render Dashboard**
2. **Your Backend Service → Settings**
3. **Set Root Directory to:** `Backend`
4. **Save**
5. **Manual Deploy**

That's it! 🎉

