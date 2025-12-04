import { Router } from 'express';
import { BankingController } from '../controllers/BankingController';

export function createBankingRouter(controller: BankingController): Router {
  const router = Router();

  router.get('/records', (req, res) => controller.getRecords(req, res));
  router.post('/bank', (req, res) => controller.bank(req, res));
  router.post('/apply', (req, res) => controller.apply(req, res));

  return router;
}

