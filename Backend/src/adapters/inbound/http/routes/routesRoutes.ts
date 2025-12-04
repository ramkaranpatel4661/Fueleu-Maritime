import { Router } from 'express';
import { RoutesController } from '../controllers/RoutesController';

export function createRoutesRouter(controller: RoutesController): Router {
  const router = Router();

  router.get('/', (req, res) => controller.getAll(req, res));
  router.post('/:routeId/baseline', (req, res) => controller.setBaseline(req, res));
  router.get('/comparison', (req, res) => controller.getComparison(req, res));

  return router;
}

