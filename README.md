# FuelEU Maritime Compliance Platform

A full-stack web application for managing Fuel EU Maritime compliance, featuring route management, compliance balance calculations, banking, and pooling functionality.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Key Features](#key-features)

## 🎯 Overview

This platform helps maritime operators comply with Fuel EU Maritime regulations by:
- Tracking shipping routes and their GHG intensity
- Calculating compliance balance (CB)
- Banking surplus compliance balance for future use
- Creating compliance pools to optimize fleet compliance

### Key Formulas

**Compliance Balance (CB):**
```
Energy in scope (MJ) = fuelConsumption (t) × 41,000 MJ/t
CB (gCO₂e) = (Target - Actual) × Energy in scope
```

**Target Intensity:**
- Target (2025) = **89.3368 gCO₂e/MJ** (2% below 91.16)

**Percent Difference:**
```
percentDiff = ((comparison / baseline) - 1) × 100
```

## 🏗️ Architecture

This project follows **Hexagonal Architecture** (Ports & Adapters) principles for both backend and frontend:

### Backend Architecture

```
src/
  core/
    domain/          # Business entities (Route, ComplianceBalance, etc.)
    application/     # Use cases (business logic)
    ports/           # Interfaces (repositories)
  adapters/
    inbound/http/    # Express controllers & routes
    outbound/        # Prisma repositories (implement ports)
  infrastructure/
    db/              # Prisma client & schema
    server/          # Express app setup
```

**Benefits:**
- Core business logic is independent of frameworks
- Easy to swap implementations (e.g., Prisma → TypeORM)
- Testable with mocks
- Clear separation of concerns

### Frontend Architecture

```
src/
  core/
    domain/          # Domain models (TypeScript interfaces)
    ports/           # Service interfaces
  adapters/
    ui/              # React components
    infrastructure/  # API service implementations
  shared/            # Utilities & constants
```

**Benefits:**
- Business logic separated from React
- Easy to test components in isolation
- Can swap API implementations

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Build Tool:** Vite
- **Charts:** Recharts
- **HTTP Client:** Axios

## 📁 Project Structure

```
FuelEU Maritime/
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Seed data
│   ├── src/
│   │   ├── core/               # Business logic (framework-agnostic)
│   │   ├── adapters/           # Framework adapters
│   │   ├── infrastructure/     # Database & server setup
│   │   └── index.ts            # Entry point
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── core/               # Domain models & ports
│   │   ├── adapters/           # UI & API adapters
│   │   ├── shared/             # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── README.md
├── AGENT_WORKFLOW.md
└── REFLECTION.md
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the Backend directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fueleu_maritime?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database:**
   ```bash
   npm run prisma:seed
   ```

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## ▶️ Running the Application

### Backend

```bash
cd Backend
npm run dev
```

The backend server will start on `http://localhost:3001`

### Frontend

```bash
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000`

## 📡 API Documentation

### Routes

- `GET /routes` - Get all routes (with optional filters: `vesselType`, `fuelType`, `year`)
- `POST /routes/:routeId/baseline` - Set a route as baseline
- `GET /routes/comparison` - Get comparison data (baseline vs others)

### Compliance

- `GET /compliance/cb?shipId={id}&year={year}` - Get compliance balance
- `GET /compliance/adjusted-cb?shipId={id}&year={year}` - Get adjusted compliance balance

### Banking

- `GET /banking/records?shipId={id}&year={year}` - Get banking records
- `POST /banking/bank` - Bank surplus compliance balance
  ```json
  {
    "shipId": "R001",
    "year": 2024
  }
  ```
- `POST /banking/apply` - Apply banked amount
  ```json
  {
    "shipId": "R001",
    "year": 2024,
    "amount": 1000.5
  }
  ```

### Pooling

- `POST /pools` - Create a compliance pool
  ```json
  {
    "year": 2024,
    "shipIds": ["R001", "R002", "R003"]
  }
  ```

### Health Check

- `GET /health` - Server health status

## ✅ Key Features

### 1. Routes Tab
- View all shipping routes in a table
- Filter by vessel type, fuel type, and year
- Set baseline route for comparison
- Display route details: GHG intensity, fuel consumption, distance, emissions

### 2. Compare Tab
- Compare routes against baseline
- Visual bar chart showing GHG intensity comparison
- Percent difference calculation
- Compliance indicators (✅/❌)

### 3. Banking Tab
- View current compliance balance
- Bank positive CB (surplus) for future use
- Apply banked amounts to cover deficits
- Track banking KPIs: total banked, applied, available

**Banking Rules:**
- Only positive CB can be banked
- Cannot apply more than available banked amount

### 4. Pooling Tab
- Create compliance pools with multiple ships
- Greedy allocation algorithm for optimal distribution
- Validation: Sum of adjusted CB must be ≥ 0
- Display before/after CB for each pool member

**Pooling Rules:**
- Sum(adjustedCB) ≥ 0
- Deficit ship cannot exit worse
- Surplus ship cannot exit negative

## 🧪 Testing

### Backend Tests

```bash
cd Backend
npm run test
```

### Frontend Tests

```bash
cd Frontend
npm run test
```

## 📊 Database Schema

### Tables

1. **routes** - Route data
   - id, routeId, vesselType, fuelType, year
   - ghgIntensity, fuelConsumption, distance, totalEmissions
   - isBaseline

2. **ship_compliance** - Compliance balance records
   - id, shipId, year, cbGco2eq, adjustedCbGco2eq

3. **bank_entries** - Banking records
   - id, shipId, year, amountGco2eq

4. **pools** - Pool registry
   - id, year, createdAt

5. **pool_members** - Pool member allocations
   - id, poolId, shipId, cbBefore, cbAfter

## 📝 Seed Data

The database is seeded with 5 routes:
- R001 (Container, HFO, 2024) - Baseline
- R002 (BulkCarrier, LNG, 2024)
- R003 (Tanker, MGO, 2024)
- R004 (RoRo, HFO, 2025)
- R005 (Container, LNG, 2025)

## 🔧 Development

### Building for Production

**Backend:**
```bash
cd Backend
npm run build
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

## 📚 Additional Documentation

- [AGENT_WORKFLOW.md](./AGENT_WORKFLOW.md) - AI agent usage documentation
- [REFLECTION.md](./REFLECTION.md) - Reflection on AI agent usage
- [STEP_BY_STEP_IMPLEMENTATION.md](./STEP_BY_STEP_IMPLEMENTATION.md) - Detailed implementation guide

## 🎯 Future Improvements

- Unit and integration tests
- Error handling improvements
- Authentication & authorization
- Real-time updates
- Export functionality (CSV, PDF)
- Advanced reporting and analytics
- Multi-year compliance tracking

## 📄 License

ISC

---

Built with ❤️ using Hexagonal Architecture principles

