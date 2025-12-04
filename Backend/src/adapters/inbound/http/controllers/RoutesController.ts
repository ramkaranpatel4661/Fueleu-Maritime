import { Request, Response } from 'express';
import { GetRoutesUseCase } from '../../../../core/application/use-cases/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../../core/application/use-cases/SetBaselineUseCase';
import { GetComparisonUseCase } from '../../../../core/application/use-cases/GetComparisonUseCase';

export class RoutesController {
  constructor(
    private readonly getRoutesUseCase: GetRoutesUseCase,
    private readonly setBaselineUseCase: SetBaselineUseCase,
    private readonly getComparisonUseCase: GetComparisonUseCase
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters: {
        vesselType?: string;
        fuelType?: string;
        year?: number;
      } = {};

      if (req.query.vesselType) {
        filters.vesselType = req.query.vesselType as string;
      }
      if (req.query.fuelType) {
        filters.fuelType = req.query.fuelType as string;
      }
      if (req.query.year) {
        filters.year = parseInt(req.query.year as string, 10);
      }

      const routes = await this.getRoutesUseCase.execute(filters);

      res.json(routes.map((route) => ({
        id: route.id,
        routeId: route.routeId,
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distance: route.distance,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline,
      })));
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async setBaseline(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      const route = await this.setBaselineUseCase.execute(routeId);

      res.json({
        id: route.id,
        routeId: route.routeId,
        isBaseline: route.isBaseline,
        message: `Route ${routeId} set as baseline`,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getComparison(_req: Request, res: Response): Promise<void> {
    try {
      const comparisons = await this.getComparisonUseCase.execute();

      res.json(
        comparisons.map((comp) => ({
          baseline: comp.baseline,
          comparison: comp.comparison,
          percentDiff: comp.percentDiff,
          compliant: comp.compliant,
        }))
      );
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

