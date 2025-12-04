import { Request, Response } from 'express';
import { BankSurplusUseCase } from '../../../../core/application/use-cases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../../core/application/use-cases/ApplyBankedUseCase';
import { PrismaBankingRepository } from '../../../outbound/PrismaBankingRepository';

export class BankingController {
  constructor(
    private readonly bankSurplusUseCase: BankSurplusUseCase,
    private readonly applyBankedUseCase: ApplyBankedUseCase,
    private readonly bankingRepository: PrismaBankingRepository
  ) {}

  async getRecords(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string, 10);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const records = await this.bankingRepository.findByShipAndYear(shipId, year);
      const totalBanked = await this.bankingRepository.getTotalBanked(shipId, year);
      const totalApplied = await this.bankingRepository.getTotalApplied(shipId, year);
      const available = await this.bankingRepository.getAvailableBanked(shipId, year);

      res.json({
        records: records.map((r) => ({
          id: r.id,
          shipId: r.shipId,
          year: r.year,
          amountGco2eq: r.amountGco2eq,
          createdAt: r.createdAt,
        })),
        totalBanked,
        totalApplied,
        available,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async bank(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.body;

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const bankEntry = await this.bankSurplusUseCase.execute(shipId, year);

      res.json({
        id: bankEntry.id,
        shipId: bankEntry.shipId,
        year: bankEntry.year,
        amountGco2eq: bankEntry.amountGco2eq,
        message: `Successfully banked ${bankEntry.amountGco2eq} gCO₂e`,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async apply(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const result = await this.applyBankedUseCase.execute(shipId, year, amount);

      // Record the application
      await this.bankingRepository.recordApplication(shipId, year, amount);

      res.json({
        cb_before: result.cb_before,
        applied: result.applied,
        cb_after: result.cb_after,
        message: `Successfully applied ${amount} gCO₂e from bank`,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

