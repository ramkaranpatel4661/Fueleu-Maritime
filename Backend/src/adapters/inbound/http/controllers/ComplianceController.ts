import { Request, Response } from 'express';
import { CalculateCBUseCase } from '../../../../core/application/use-cases/CalculateCBUseCase';

export class ComplianceController {
  constructor(private readonly calculateCBUseCase: CalculateCBUseCase) {}

  async getCB(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string, 10);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const compliance = await this.calculateCBUseCase.execute(shipId, year);

      res.json({
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq,
        adjustedCbGco2eq: compliance.adjustedCbGco2eq,
        isSurplus: compliance.isSurplus,
        isDeficit: compliance.isDeficit,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAdjustedCB(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string, 10);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const compliance = await this.calculateCBUseCase.getAdjustedCB(shipId, year);

      res.json({
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq,
        adjustedCbGco2eq: compliance.adjustedCbGco2eq,
        effectiveCb: compliance.effectiveCb,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

