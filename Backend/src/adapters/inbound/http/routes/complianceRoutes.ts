import { Router } from 'express';
import { ComplianceController } from '../controllers/ComplianceController';

export function createComplianceRouter(controller: ComplianceController): Router {
  const router = Router();

  router.get('/cb', (req, res) => controller.getCB(req, res));
  router.get('/adjusted-cb', (req, res) => controller.getAdjustedCB(req, res));

  return router;
}

