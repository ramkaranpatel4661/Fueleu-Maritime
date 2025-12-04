# FuelEU Maritime - Complete Step-by-Step Implementation Guide

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Phase 1: Backend Setup](#phase-1-backend-setup)
3. [Phase 2: Backend Implementation](#phase-2-backend-implementation)
4. [Phase 3: Frontend Setup](#phase-3-frontend-setup)
5. [Phase 4: Frontend Implementation](#phase-4-frontend-implementation)
6. [Phase 5: Integration & Testing](#phase-5-integration--testing)
7. [Phase 6: Documentation](#phase-6-documentation)

---

## 🎯 Project Overview

This project implements a **FuelEU Maritime Compliance Platform** using:
- **Backend**: Node.js + TypeScript + PostgreSQL + Prisma
- **Frontend**: React + TypeScript + TailwindCSS
- **Architecture**: Hexagonal (Ports & Adapters) for both frontend and backend

### Key Features:
1. **Routes Tab**: Display and manage shipping routes
2. **Compare Tab**: Compare routes against baseline
3. **Banking Tab**: Bank surplus compliance balance
4. **Pooling Tab**: Create compliance pools

---

## 🔶 Phase 1: Backend Setup

### Step 1.1: Initialize Backend Project

**What we did:**
- Created `Backend/package.json` with all necessary dependencies
- Set up TypeScript configuration (`tsconfig.json`)
- Added development scripts for running, building, and testing

**Key Dependencies:**
- `express` - Web server framework
- `@prisma/client` - Database ORM
- `prisma` - Database migration tool
- `uuid` - Unique ID generation
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables

### Step 1.2: Database Schema Design

**What we did:**
- Created Prisma schema (`Backend/prisma/schema.prisma`) with 5 tables:
  1. **routes** - Stores route data (vessel type, fuel type, GHG intensity, etc.)
  2. **ship_compliance** - Stores compliance balance (CB) calculations
  3. **bank_entries** - Stores banked surplus amounts
  4. **pools** - Stores pool registry
  5. **pool_members** - Stores pool member allocations

**Key Relationships:**
- `Pool` has many `PoolMember`
- Unique constraints on ship/year combinations

### Step 1.3: Seed Data

**What we did:**
- Created seed script (`Backend/prisma/seed.ts`) with 5 routes:
  - R001 (Container, HFO, 2024) - Set as baseline
  - R002 (BulkCarrier, LNG, 2024)
  - R003 (Tanker, MGO, 2024)
  - R004 (RoRo, HFO, 2025)
  - R005 (Container, LNG, 2025)

---

## 🔶 Phase 2: Backend Implementation

### Step 2.1: Domain Layer (Core Entities)

**What we did:**
Created domain entities representing business concepts:

1. **Route** (`Backend/src/core/domain/entities/Route.ts`)
   - Represents a shipping route
   - Methods: `markAsBaseline()`, `unmarkAsBaseline()`

2. **ComplianceBalance** (`Backend/src/core/domain/entities/ComplianceBalance.ts`)
   - Represents compliance balance calculation
   - Static method: `calculate()` - computes CB using formula
   - Formula: `CB = (Target - Actual) × Energy in scope`
   - Energy in scope = `fuelConsumption × 41,000 MJ/t`

3. **BankEntry** (`Backend/src/core/domain/entities/BankEntry.ts`)
   - Represents a banked surplus entry

4. **Pool** (`Backend/src/core/domain/entities/Pool.ts`)
   - Represents a compliance pool
   - Validation: `isValid()` - checks pool rules

5. **PoolMember** (`Backend/src/core/domain/entities/PoolMember.ts`)
   - Represents a ship in a pool

6. **RouteComparison** (`Backend/src/core/domain/entities/RouteComparison.ts`)
   - Compares routes against baseline
   - Calculates percent difference

### Step 2.2: Ports (Interfaces)

**What we did:**
Created repository interfaces defining contracts:

1. **RouteRepository** - Methods for route operations
2. **ComplianceRepository** - Methods for compliance operations
3. **BankingRepository** - Methods for banking operations
4. **PoolRepository** - Methods for pool operations

**Why Ports?**
- Decouple core business logic from infrastructure
- Allow swapping implementations (e.g., Prisma → TypeORM)
- Enable easier testing with mocks

### Step 2.3: Application Layer (Use Cases)

**What we did:**
Created use cases that orchestrate business logic:

1. **GetRoutesUseCase** - Fetches routes with optional filters
2. **SetBaselineUseCase** - Sets a route as baseline
3. **GetComparisonUseCase** - Compares routes against baseline
4. **CalculateCBUseCase** - Calculates compliance balance
5. **BankSurplusUseCase** - Banks positive CB
6. **ApplyBankedUseCase** - Applies banked amount to deficit
7. **CreatePoolUseCase** - Creates a pool with greedy allocation

**Key Business Rules Implemented:**

**Banking:**
- Only positive CB can be banked
- Cannot apply more than available banked amount

**Pooling:**
- Sum of adjusted CB must be ≥ 0
- Deficit ship cannot exit worse
- Surplus ship cannot exit negative
- Greedy allocation algorithm

### Step 2.4: Infrastructure Adapters (Repositories)

**What we did:**
Implemented Prisma repositories that implement the port interfaces:

1. **PrismaRouteRepository** - Implements RouteRepository using Prisma
2. **PrismaComplianceRepository** - Implements ComplianceRepository
3. **PrismaBankingRepository** - Implements BankingRepository
4. **PrismaPoolRepository** - Implements PoolRepository

**Why Adapters?**
- Core logic doesn't depend on Prisma
- Can swap Prisma for another ORM without changing core
- Follows Dependency Inversion Principle

### Step 2.5: HTTP Adapters (Controllers & Routes)

**What we did:**
Created Express controllers and routes:

**Controllers:**
1. **RoutesController** - Handles route endpoints
2. **ComplianceController** - Handles compliance endpoints
3. **BankingController** - Handles banking endpoints
4. **PoolController** - Handles pool endpoints

**Routes:**
- `GET /routes` - Get all routes (with filters)
- `POST /routes/:routeId/baseline` - Set baseline
- `GET /routes/comparison` - Get comparison data
- `GET /compliance/cb` - Get compliance balance
- `GET /compliance/adjusted-cb` - Get adjusted CB
- `GET /banking/records` - Get bank records
- `POST /banking/bank` - Bank surplus
- `POST /banking/apply` - Apply banked amount
- `POST /pools` - Create pool

### Step 2.6: Server Setup

**What we did:**
- Created Express app factory (`app.ts`)
- Wired up all dependencies (repositories → use cases → controllers → routes)
- Added CORS middleware
- Added error handling middleware
- Created entry point (`index.ts`)

---

## 🔷 Phase 3: Frontend Setup

### Step 3.1: Initialize Frontend Project

**What we'll do:**
1. Create React app with TypeScript
2. Install TailwindCSS
3. Set up project structure following hexagonal architecture

### Step 3.2: Install Dependencies

**Required packages:**
- `react`, `react-dom`
- `typescript`
- `tailwindcss`
- `axios` - For API calls
- `recharts` - For data visualization
- `react-router-dom` - For navigation

---

## 🔷 Phase 4: Frontend Implementation

### Step 4.1: Core Domain Layer

**What we'll create:**
- Domain models matching backend entities
- Value objects for type safety

### Step 4.2: Application Layer

**What we'll create:**
- Use cases for each feature
- Port interfaces for services

### Step 4.3: Infrastructure Adapters

**What we'll create:**
- API service implementations using axios
- HTTP client configured with base URL

### Step 4.4: UI Components

**What we'll create:**

1. **RoutesTab**
   - Table displaying routes
   - Filters (vesselType, fuelType, year)
   - "Set Baseline" button

2. **CompareTab**
   - Table comparing routes
   - Bar/line chart
   - Compliance indicators (✅/❌)

3. **BankingTab**
   - Display current CB
   - Bank surplus button
   - Apply banked button
   - KPIs (cb_before, applied, cb_after)

4. **PoolingTab**
   - List of ships with CB
   - Create pool form
   - Pool sum indicator
   - Member before/after CB display

### Step 4.5: Dashboard Layout

**What we'll create:**
- Tab navigation component
- Main dashboard container
- Responsive layout with TailwindCSS

---

## ✅ Phase 5: Integration & Testing

### Step 5.1: Connect Frontend to Backend

**What we'll do:**
1. Configure API base URL
2. Test all endpoints
3. Handle CORS
4. Add error handling

### Step 5.2: Test Features

**Test each tab:**
1. Routes - Load routes, filter, set baseline
2. Compare - View comparisons, charts
3. Banking - Bank surplus, apply banked
4. Pooling - Create pool, validate rules

---

## 📚 Phase 6: Documentation

### Step 6.1: README.md

**Include:**
- Project overview
- Architecture explanation
- Setup instructions
- Running instructions
- API documentation

### Step 6.2: AGENT_WORKFLOW.md

**Document:**
- Which AI agents were used
- Example prompts and outputs
- Validation steps
- Observations (what worked, what didn't)
- Best practices

### Step 6.3: REFLECTION.md

**Reflect on:**
- Learning from AI agents
- Efficiency gains
- Improvements for next time

---

## 🚀 Quick Start Guide

### Backend Setup:

```bash
cd Backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### Frontend Setup:

```bash
cd Frontend
npm install
npm run dev
```

---

## 📝 Key Formulas

### Compliance Balance (CB)
```
Energy in scope (MJ) = fuelConsumption (t) × 41,000 MJ/t
CB (gCO₂e) = (Target - Actual) × Energy in scope
```

### Target Intensity
```
Target (2025) = 89.3368 gCO₂e/MJ
```

### Percent Difference
```
percentDiff = ((comparison / baseline) - 1) × 100
```

---

## 🔍 Critical Rules

### Banking
- ✅ Only bank positive CB
- ✅ Cannot over-apply banked amount

### Pooling
- ✅ Sum(adjustedCB) ≥ 0
- ✅ Deficit ship cannot exit worse
- ✅ Surplus ship cannot exit negative
- ✅ Greedy allocation algorithm

---

## 🎯 Next Steps

1. **Continue with Frontend implementation**
2. **Test all features end-to-end**
3. **Write comprehensive documentation**
4. **Create test suite**

---

This is your complete roadmap! Follow each step carefully. 🚀

