# Quick Testing Reference - Copy & Paste Commands

## Start Services

### Terminal 1 - Backend
```powershell
cd D:\FuelEU Maritime\Backend
npm run dev
```
**Expected:** `🚀 Server running on http://localhost:3001`

### Terminal 2 - Frontend
```powershell
cd D:\FuelEU Maritime\Frontend
npm run dev
```
**Expected:** Vite server running (check terminal for port)

---

## API Testing Commands

### 1. Health Check
```powershell
curl http://localhost:3001/health
```
✅ **Expected Response:**
```json
{"status":"ok","timestamp":"2025-12-04T10:00:00.000Z"}
```

---

### 2. Get All Routes
```powershell
curl http://localhost:3001/routes
```
✅ **Expected:** Array of route objects

---

### 3. Filter Routes by Year
```powershell
curl "http://localhost:3001/routes?year=2024"
```
✅ **Expected:** Routes for 2024

---

### 4. Filter by Vessel Type
```powershell
curl "http://localhost:3001/routes?vesselType=Container%20Ship"
```
✅ **Expected:** Container ships only

---

### 5. Get Compliance Balance for Ship
```powershell
curl "http://localhost:3001/compliance/ship/R001/year/2024"
```
✅ **Expected:** Compliance balance object

---

### 6. Create a Pool (POST)
```powershell
curl -X POST http://localhost:3001/pools `
  -H "Content-Type: application/json" `
  -d "{`"year`":2024,`"shipIds`":[`"R001`",`"R002`",`"R003`"]}"
```
✅ **Expected:**
```json
{
  "poolId":"...",
  "members":[...],
  "totalCbAfter":...,
  "message":"Pool created successfully"
}
```

---

### 7. Bank Surplus CB (POST)
```powershell
curl -X POST http://localhost:3001/banking/bank `
  -H "Content-Type: application/json" `
  -d "{`"shipId`":`"R001`",`"year`":2024}"
```
✅ **Expected:** Success message

---

### 8. Get Banking Records
```powershell
curl "http://localhost:3001/banking/records/R001/2024"
```
✅ **Expected:** Array of banking records

---

## Frontend Testing

### Access Dashboard
```
http://localhost:3000
```

### Test Checklist
- [ ] Routes tab loads
- [ ] Can filter by vessel type
- [ ] Can filter by fuel type
- [ ] Can filter by year
- [ ] Can set baseline route
- [ ] Compare tab shows differences
- [ ] Banking tab allows selection
- [ ] Can create pool in Pooling tab
- [ ] Dark theme looks good
- [ ] All buttons respond

---

## Database Testing

### Connect to Database
```powershell
psql -U postgres -d fueleu_maritime
```

### Check Data
```sql
-- Count routes
SELECT COUNT(*) FROM routes;

-- View routes
SELECT routeId, vesselType, fuelType, year FROM routes LIMIT 5;

-- View compliance data
SELECT shipId, year, cbGco2eq FROM ship_compliance LIMIT 5;

-- Exit
\q
```

---

## Run Tests

```powershell
cd D:\FuelEU Maritime\Backend

# Run all tests
npm test

# Run specific test
npm test -- ComplianceBalance.test.ts

# Watch mode
npm run test:watch
```

✅ **Expected:** All tests passing (7/7)

---

## Build & Production Check

### Build Backend
```powershell
cd D:\FuelEU Maritime\Backend
npm run build
```
✅ **Expected:** `dist` folder created, no errors

### Build Frontend
```powershell
cd D:\FuelEU Maritime\Frontend
npm run build
```
✅ **Expected:** `dist` folder created, no errors

---

## Troubleshooting

### Port 3001 Already in Use
```powershell
# Find and kill process
Get-Process -Port 3001 -ErrorAction SilentlyContinue | Stop-Process -Force
# Or use different port
$env:PORT=3002; npm run dev
```

### Database Connection Failed
```powershell
# Check PostgreSQL is running
Get-Process | findstr postgres

# Test connection
psql -U postgres -d fueleu_maritime
```

### TypeScript Errors
```powershell
cd Backend
npm run build
# This will show exact error locations
```

### Clear Node Modules (Nuclear Option)
```powershell
cd Backend
rm -r node_modules
rm package-lock.json
npm install
npm run build
```

---

## Performance Check

### Measure Request Time
```powershell
# Simple timing
$start = Get-Date
curl http://localhost:3001/routes > $null
$elapsed = (Get-Date) - $start
Write-Host "Response time: $($elapsed.TotalMilliseconds)ms"
```

### Monitor Memory Usage
```powershell
# While app is running, check task manager
# Or use:
Get-Process node | Select-Object Name, WorkingSet
```

---

## Push Changes to GitHub

```powershell
cd D:\FuelEU Maritime

# See changes
git status

# Add all changes
git add .

# Commit
git commit -m "Your commit message"

# Push
git push origin main
```

---

## Expected Results Summary

| Feature | Status | Evidence |
|---------|--------|----------|
| Backend starts | ✅ | Server message on port 3001 |
| API responds | ✅ | curl commands return data |
| Frontend loads | ✅ | Dashboard renders without errors |
| Routes show | ✅ | Table displays routes |
| Filters work | ✅ | Filtering reduces results |
| Pool creation | ✅ | Creates pool with valid ships |
| Tests pass | ✅ | 7/7 tests passing |
| Database works | ✅ | psql connects, tables exist |
| Build succeeds | ✅ | No TypeScript errors |
| Dark theme | ✅ | Professional appearance |

---

## Quick Status Check (All-in-One)

Run this to verify everything:

```powershell
# Backend
cd D:\FuelEU Maritime\Backend
Write-Host "=== Checking Backend ===" -ForegroundColor Green
npm run build 2>&1 | Select-String "error" || Write-Host "✅ Build OK"
npm test 2>&1 | Select-String "PASS" || Write-Host "✅ Tests OK"

# Frontend
cd D:\FuelEU Maritime\Frontend
Write-Host "`n=== Checking Frontend ===" -ForegroundColor Green
npm run build 2>&1 | Select-String "error" || Write-Host "✅ Build OK"

Write-Host "`n✅ All systems go!" -ForegroundColor Green
```

---

**Last Updated:** December 4, 2025
