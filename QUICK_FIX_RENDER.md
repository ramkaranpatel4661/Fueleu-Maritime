# ⚡ Quick Fix for Render Error

## The Problem

```
Service Root Directory "/opt/render/project/src/backend" is missing.
```

Render is looking for `backend` (lowercase) but your folder is `Backend` (capital B).

---

## ✅ Quick Fix (2 Minutes)

### Option 1: Fix in Render Dashboard (Easiest)

1. **Go to:** https://dashboard.render.com
2. **Click your backend service**
3. **Settings tab**
4. **Find "Root Directory"**
5. **Change to:** `Backend` (capital B)
6. **Save**
7. **Manual Deploy** button

**Done! ✅**

---

### Option 2: Use render.yaml

1. **I've created `render.yaml` at root** (already done)
2. **Push to GitHub:**
   ```bash
   git add render.yaml
   git commit -m "Fix render configuration"
   git push
   ```
3. **In Render Dashboard:**
   - Settings → Scroll down
   - **Enable "Render YAML Path"**
   - Set to: `render.yaml`
   - Save

---

## 📝 What to Set in Render

### Root Directory:
```
Backend
```

### Build Command:
```bash
npm install && npm run build && npm run prisma:generate
```

### Start Command:
```bash
npm run prisma:migrate deploy && npm start
```

---

**🎯 Just change Root Directory to `Backend` in Render settings!**

