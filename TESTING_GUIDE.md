# FuelEU Maritime - Testing Guide

## 1. Backend Testing

### Prerequisites
- Node.js 22.16.0+
- PostgreSQL running locally
- Database created and migrated

### Running Backend Tests

```bash
cd Backend

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run specific test file
npm test -- CreatePoolUseCase.test.ts

# Run tests with coverage
npm test -- --coverage
```

### Database Setup for Testing
```bash
# Apply migrations
npm run prisma:migrate

# Seed test data
npm run prisma:seed
```

---

## 2. Frontend Testing

### Running Frontend Tests
```bash
cd Frontend

# Run Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 3. Manual API Testing

### Start Services

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Server runs on: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
App runs on: `http://localhost:3000` (or Vite's assigned port)

### Test Endpoints

#### Health Check
```bash
curl http://localhost:3001/health
```
**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-04T10:00:00.000Z"
}
```

---

## 4. Testing Key Features

### A. Routes Management

**Endpoint:** `GET /routes`

**cURL:**
```bash
curl http://localhost:3001/routes
```

**Test Cases:**
- ✅ Get all routes
- ✅ Filter by vessel type: `?vesselType=Container Ship`
- ✅ Filter by fuel type: `?fuelType=LNG`
- ✅ Filter by year: `?year=2024`
- ✅ Set baseline: `POST /routes/{routeId}/baseline`

---

### B. Compliance Balance

**Endpoint:** `GET /compliance/ship/{shipId}/year/{year}`

**cURL:**
```bash
curl http://localhost:3001/compliance/ship/R001/year/2024
```

**Test Cases:**
- ✅ Get compliance balance for ship
- ✅ Verify CB calculation
- ✅ Check adjusted CB after pooling

---

### C. Banking Operations

**Endpoint:** `POST /banking/bank`

**Request Body:**
```json
{
  "shipId": "R001",
  "year": 2024
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"shipId":"R001","year":2024}'
```

**Test Cases:**
- ✅ Bank surplus CB
- ✅ Apply banked amount: `POST /banking/apply`
- ✅ Get banking records: `GET /banking/records`

---

### D. Pooling Operations

**Endpoint:** `POST /pools`

**Request Body:**
```json
{
  "year": 2024,
  "shipIds": ["R001", "R002", "R003"]
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/pools \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2024,
    "shipIds": ["R001", "R002", "R003"]
  }'
```

**Expected Response:**
```json
{
  "poolId": "uuid",
  "members": [
    {
      "shipId": "R001",
      "cbBefore": 100,
      "cbAfter": 50
    }
  ],
  "totalCbAfter": 50,
  "message": "Pool created successfully"
}
```

**Test Cases:**
- ✅ Create pool with valid ships
- ✅ Verify CB redistribution
- ✅ Validate pool sum ≥ 0
- ✅ Require minimum 2 ships

---

## 5. Frontend UI Testing

### Using Browser DevTools

1. **Open DevTools:** Press `F12`
2. **Network Tab:** Monitor all API calls
3. **Console Tab:** Check for JavaScript errors
4. **Application Tab:** Verify local storage/cookies

### Testing Checklist

#### Routes Tab
- [ ] Load all routes
- [ ] Filter by vessel type
- [ ] Filter by fuel type
- [ ] Filter by year
- [ ] Set baseline route
- [ ] Table displays correctly

#### Compare Tab
- [ ] Load baseline and comparison routes
- [ ] Display GHG intensity comparison
- [ ] Show percentage difference
- [ ] Compliance status (green/red)

#### Banking Tab
- [ ] Select ship by ID
- [ ] Load compliance balance
- [ ] Bank surplus CB
- [ ] Apply banked amount
- [ ] View banking history

#### Pooling Tab
- [ ] Load routes for year
- [ ] Select multiple ships
- [ ] Calculate pool sum
- [ ] Validate pool (≥ 0, ≥ 2 ships)
- [ ] Create pool
- [ ] View pool results

---

## 6. Performance Testing

### Monitor Backend Performance

**Check response times:**
```bash
time curl http://localhost:3001/routes
```

**Monitor with 100 requests:**
```bash
# Use Apache Bench (if installed)
ab -n 100 -c 10 http://localhost:3001/routes

# Or use curl in a loop
for i in {1..10}; do curl http://localhost:3001/routes; done
```

### Frontend Performance

1. Open DevTools → Lighthouse
2. Run performance audit
3. Check:
   - Page load time
   - First contentful paint (FCP)
   - Largest contentful paint (LCP)

---

## 7. Error Handling Tests

### Test Invalid Requests

**Missing required fields:**
```bash
curl -X POST http://localhost:3001/pools \
  -H "Content-Type: application/json" \
  -d '{"shipIds":["R001"]}'
```
**Expected:** 400 error with message

**Invalid ship ID:**
```bash
curl http://localhost:3001/compliance/ship/INVALID/year/2024
```
**Expected:** 404 or error response

**Invalid year:**
```bash
curl http://localhost:3001/routes?year=1900
```
**Expected:** Empty array or error

---

## 8. Database Integrity Tests

### Check Seed Data
```sql
-- Connect to database
psql -U postgres -d fueleu_maritime

-- Count routes
SELECT COUNT(*) FROM routes;

-- Check compliance records
SELECT * FROM ship_compliance LIMIT 5;

-- View pooling data
SELECT * FROM pools LIMIT 5;
```

---

## 9. Deployment Testing (Render)

### Pre-deployment Checklist
- [ ] All tests pass
- [ ] No console errors
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run build` (backend)
- [ ] Environment variables set in Render dashboard
- [ ] Database URL correct

### Test Deployed Version
```bash
# Replace YOUR_APP_NAME with actual Render app name
curl https://your-app-name.onrender.com/health
```

---

## 10. Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 3001
taskkill /PID <PID> /F

# Or use different port
PORT=3002 npm run dev
```

**Database connection error:**
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
# Test connection: psql -U postgres -d fueleu_maritime
```

**TypeScript errors:**
```bash
# Rebuild
npm run build

# Check specific file
npx tsc --noEmit
```

---

## 11. Success Indicators

✅ **Your project is working correctly if:**

1. Backend starts without errors
2. All API endpoints respond correctly
3. Frontend loads without console errors
4. Data flows from backend to frontend
5. Create pool functionality works
6. All calculations are accurate
7. Database persists data correctly
8. No TypeScript compilation errors
9. Responsive design works on different screen sizes
10. Dark theme renders properly

---

## 12. Next Steps

1. **Add Unit Tests:** Create test files for use cases
2. **Add Integration Tests:** Test API endpoints
3. **Add E2E Tests:** Test full user workflows
4. **Performance Optimization:** Optimize queries and frontend
5. **Security Audit:** Check for vulnerabilities
6. **Documentation:** Generate API documentation

---

**Last Updated:** December 4, 2025
**Status:** Testing Guide Complete
