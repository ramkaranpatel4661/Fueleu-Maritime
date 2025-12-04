import express, { Express } from "express";
import cors from "cors";
import { PrismaRouteRepository } from "../../adapters/outbound/PrismaRouteRepository";
import { PrismaComplianceRepository } from "../../adapters/outbound/PrismaComplianceRepository";
import { PrismaBankingRepository } from "../../adapters/outbound/PrismaBankingRepository";
import { PrismaPoolRepository } from "../../adapters/outbound/PrismaPoolRepository";

// Use Cases
import { GetRoutesUseCase } from "../../core/application/use-cases/GetRoutesUseCase";
import { SetBaselineUseCase } from "../../core/application/use-cases/SetBaselineUseCase";
import { GetComparisonUseCase } from "../../core/application/use-cases/GetComparisonUseCase";
import { CalculateCBUseCase } from "../../core/application/use-cases/CalculateCBUseCase";
import { BankSurplusUseCase } from "../../core/application/use-cases/BankSurplusUseCase";
import { ApplyBankedUseCase } from "../../core/application/use-cases/ApplyBankedUseCase";
import { CreatePoolUseCase } from "../../core/application/use-cases/CreatePoolUseCase";

// Controllers
import { RoutesController } from "../../adapters/inbound/http/controllers/RoutesController";
import { ComplianceController } from "../../adapters/inbound/http/controllers/ComplianceController";
import { BankingController } from "../../adapters/inbound/http/controllers/BankingController";
import { PoolController } from "../../adapters/inbound/http/controllers/PoolController";

// Routers
import { createRoutesRouter } from "../../adapters/inbound/http/routes/routesRoutes";
import { createComplianceRouter } from "../../adapters/inbound/http/routes/complianceRoutes";
import { createBankingRouter } from "../../adapters/inbound/http/routes/bankingRoutes";
import { createPoolRouter } from "../../adapters/inbound/http/routes/poolRoutes";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Repositories
  const routeRepository = new PrismaRouteRepository();
  const complianceRepository = new PrismaComplianceRepository();
  const bankingRepository = new PrismaBankingRepository();
  const poolRepository = new PrismaPoolRepository();

  // Use cases
  const getRoutesUseCase = new GetRoutesUseCase(routeRepository);
  const setBaselineUseCase = new SetBaselineUseCase(routeRepository);
  const getComparisonUseCase = new GetComparisonUseCase(routeRepository);
  const calculateCBUseCase = new CalculateCBUseCase(
    complianceRepository,
    routeRepository,
    bankingRepository
  );
  const bankSurplusUseCase = new BankSurplusUseCase(
    bankingRepository,
    complianceRepository
  );
  const applyBankedUseCase = new ApplyBankedUseCase(
    bankingRepository,
    complianceRepository
  );
  const createPoolUseCase = new CreatePoolUseCase(
    poolRepository,
    complianceRepository
  );

  // Controllers
  const routesController = new RoutesController(
    getRoutesUseCase,
    setBaselineUseCase,
    getComparisonUseCase
  );
  const complianceController = new ComplianceController(calculateCBUseCase);
  const bankingController = new BankingController(
    bankSurplusUseCase,
    applyBankedUseCase,
    bankingRepository
  );
  const poolController = new PoolController(createPoolUseCase);

  // Routes
  app.use("/routes", createRoutesRouter(routesController));
  app.use("/compliance", createComplianceRouter(complianceController));
  app.use("/banking", createBankingRouter(bankingController));
  app.use("/pools", createPoolRouter(poolController));

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Error handler
  app.use((err: Error, req: any, res: any, next: any) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error", message: err.message });
  });

  return app;
}
