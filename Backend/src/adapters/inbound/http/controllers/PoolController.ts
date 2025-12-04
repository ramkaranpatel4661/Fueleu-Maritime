import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../../core/application/use-cases/CreatePoolUseCase';

export class PoolController {
  constructor(private readonly createPoolUseCase: CreatePoolUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { year, shipIds } = req.body;

      if (!year || !shipIds || !Array.isArray(shipIds) || shipIds.length === 0) {
        const msg = 'year and shipIds (array) are required';
        console.error('PoolController error:', msg);
        res.status(400).json({ error: msg });
        return;
      }

      try {
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
      } catch (poolError) {
        console.error('PoolController pool creation error:', poolError);
        res.status(400).json({ error: (poolError as Error).message || String(poolError) });
      }
    } catch (error) {
      console.error('PoolController unexpected error:', error);
      res.status(400).json({ error: (error as Error).message || String(error) });
    }
  }
}

