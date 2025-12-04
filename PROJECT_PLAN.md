# FuelEU Maritime - Step-by-Step Implementation Plan

## 📋 Project Overview

This document outlines the complete step-by-step approach to building the FuelEU Maritime compliance platform.

---

## 🏗️ Phase 1: Project Setup & Architecture Planning

### Step 1.1: Understand Requirements
- ✅ Frontend: React + TypeScript + TailwindCSS with Hexagonal Architecture
- ✅ Backend: Node.js + TypeScript + PostgreSQL with Hexagonal Architecture
- ✅ 4 Main Features: Routes, Compare, Banking, Pooling
- ✅ Documentation: AGENT_WORKFLOW.md, README.md, REFLECTION.md

### Step 1.2: Project Structure
```
FuelEU Maritime/
├── Backend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── domain/          # Entities, Value Objects
│   │   │   ├── application/     # Use Cases
│   │   │   └── ports/           # Interfaces
│   │   ├── adapters/
│   │   │   ├── inbound/http/    # Express routes
│   │   │   └── outbound/        # Database repositories
│   │   ├── infrastructure/
│   │   │   ├── db/              # Prisma schema, migrations
│   │   │   └── server/          # Express server setup
│   │   └── shared/              # Utilities
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   └── ports/
│   │   ├── adapters/
│   │   │   ├── ui/              # React components
│   │   │   └── infrastructure/  # API clients
│   │   └── shared/
│   ├── package.json
│   └── tsconfig.json
└── Documentation files
```

---

## 🔶 Phase 2: Backend Implementation

### Step 2.1: Initialize Backend Project
- Create package.json with dependencies
- Set up TypeScript configuration
- Install: express, prisma, pg, typeorm (or prisma), cors, dotenv

### Step 2.2: Database Schema Design
Create Prisma schema with:
- `routes` table
- `ship_compliance` table
- `bank_entries` table
- `pools` table
- `pool_members` table

### Step 2.3: Domain Layer (Core)
- Route entity
- ComplianceBalance entity
- BankEntry entity
- Pool entity
- Value objects (GHGIntensity, FuelConsumption, etc.)

### Step 2.4: Application Layer (Use Cases)
- GetRoutesUseCase
- SetBaselineUseCase
- GetComparisonUseCase
- CalculateCBUseCase
- BankSurplusUseCase
- ApplyBankedUseCase
- CreatePoolUseCase

### Step 2.5: Ports (Interfaces)
- RouteRepository (port)
- ComplianceRepository (port)
- BankingRepository (port)
- PoolRepository (port)

### Step 2.6: Adapters - Infrastructure
- PrismaRouteRepository (implements RouteRepository)
- PrismaComplianceRepository
- PrismaBankingRepository
- PrismaPoolRepository

### Step 2.7: Adapters - HTTP (Express)
- RoutesController
- ComplianceController
- BankingController
- PoolController
- Express routes setup

### Step 2.8: Seed Data
- Create seed script with 5 routes
- Set one route as baseline

---

## 🔷 Phase 3: Frontend Implementation

### Step 3.1: Initialize Frontend Project
- Create React app with TypeScript
- Set up TailwindCSS
- Install: react-router, axios, recharts (for charts)

### Step 3.2: Core Domain Layer
- Route domain model
- ComplianceBalance domain model
- Banking domain model
- Pool domain model

### Step 3.3: Application Layer (Use Cases)
- GetRoutesUseCase
- SetBaselineUseCase
- GetComparisonUseCase
- GetCBUseCase
- BankSurplusUseCase
- ApplyBankedUseCase
- CreatePoolUseCase

### Step 3.4: Ports (Interfaces)
- RouteService (port)
- ComplianceService (port)
- BankingService (port)
- PoolService (port)

### Step 3.5: Infrastructure Adapters
- ApiRouteService (implements RouteService)
- ApiComplianceService
- ApiBankingService
- ApiPoolService

### Step 3.6: UI Components
- RoutesTab component
- CompareTab component
- BankingTab component
- PoolingTab component
- Dashboard layout with tabs

### Step 3.7: Styling & UX
- Responsive design with TailwindCSS
- Loading states
- Error handling
- Data visualization (charts)

---

## 📚 Phase 4: Documentation

### Step 4.1: AGENT_WORKFLOW.md
- Document all AI agent usage
- Include prompts and outputs
- Validation steps
- Observations

### Step 4.2: README.md
- Overview
- Architecture explanation
- Setup instructions
- Running instructions
- API endpoints

### Step 4.3: REFLECTION.md
- Learning from AI agents
- Efficiency gains
- Improvements for next time

---

## ✅ Phase 5: Testing & Validation

### Step 5.1: Backend Tests
- Unit tests for use cases
- Integration tests for endpoints
- Database tests

### Step 5.2: Frontend Tests
- Component tests
- Hook tests
- Integration tests

### Step 5.3: End-to-End Validation
- Test all 4 tabs
- Verify calculations
- Check error handling

---

## 🎯 Implementation Order

1. ✅ **Backend First** - Build APIs so frontend can consume them
2. ✅ **Database Setup** - Ensure data persistence works
3. ✅ **Frontend Core** - Build domain and application layers
4. ✅ **UI Components** - Build user interface
5. ✅ **Integration** - Connect frontend to backend
6. ✅ **Documentation** - Document everything
7. ✅ **Testing** - Validate functionality

---

## 📝 Key Formulas to Implement

### Compliance Balance (CB)
```
Energy in scope (MJ) = fuelConsumption (t) × 41,000 MJ/t
CB = (Target - Actual) × Energy in scope
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
- Only bank positive CB
- Cannot over-apply banked amount

### Pooling
- Sum(adjustedCB) ≥ 0
- Deficit ship cannot exit worse
- Surplus ship cannot exit negative
- Greedy allocation algorithm

---

Let's start implementing! 🚀

