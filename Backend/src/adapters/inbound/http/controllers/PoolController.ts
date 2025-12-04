import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../../core/application/use-cases/CreatePoolUseCase';

export class PoolController {
  constructor(private readonly createPoolUseCase: CreatePoolUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { year, shipIds } = req.body;

      if (!year || !shipIds || !Array.isArray(shipIds) || shipIds.length === 0) {
        res.status(400).json({
          error: 'year and shipIds (array) are required',
        });
        return;
      }

      const result = await this.createPoolUseCase.execute({
        year,
        shipIds,
      });

      res.json({
        poolId: result.poolId,
        members: result.members,
        totalCbAfter: result.totalCbAfter,
        message: 'Pool created successfully',
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

