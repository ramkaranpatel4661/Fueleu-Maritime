import { PoolRepository } from '../../ports/PoolRepository';
import { ComplianceRepository } from '../../ports/ComplianceRepository';
import { Pool } from '../../domain/entities/Pool';
import { PoolMember } from '../../domain/entities/PoolMember';
import { v4 as uuidv4 } from 'uuid';

export interface CreatePoolRequest {
  year: number;
  shipIds: string[];
}

export interface CreatePoolResult {
  poolId: string;
  members: Array<{
    shipId: string;
    cbBefore: number;
    cbAfter: number;
  }>;
  totalCbAfter: number;
}

export class CreatePoolUseCase {
  constructor(
    private readonly poolRepository: PoolRepository,
    private readonly complianceRepository: ComplianceRepository
  ) {}

  async execute(request: CreatePoolRequest): Promise<CreatePoolResult> {
    // Get CB for all ships
    const membersData = await Promise.all(
      request.shipIds.map(async (shipId) => {
        const compliance = await this.complianceRepository.findByShipAndYear(
          shipId,
          request.year
        );
        if (!compliance) {
          throw new Error(`No compliance balance for ship ${shipId} in year ${request.year}`);
        }
        return {
          shipId,
          cbBefore: compliance.effectiveCb,
        };
      })
    );

    // Greedy allocation: sort by CB descending (surplus first)
    membersData.sort((a, b) => b.cbBefore - a.cbBefore);

    // Calculate allocations
    const allocations = this.allocateGreedy(membersData);

    // Validate pool rules
    const totalCbAfter = allocations.reduce((sum, m) => sum + m.cbAfter, 0);

    // Create pool entity for validation
    const poolId = uuidv4();
    const members = allocations.map(
      (alloc) =>
        PoolMember.create({
          id: uuidv4(),
          poolId,
          shipId: alloc.shipId,
          cbBefore: alloc.cbBefore,
          cbAfter: alloc.cbAfter,
        })
    );

    const pool = Pool.create({
      id: poolId,
      year: request.year,
      members,
      createdAt: new Date(),
    });

    if (!pool.isValid) {
      throw new Error('Pool does not meet validation rules');
    }

    // Save pool and members
    await this.poolRepository.save(pool);
    for (const member of members) {
      await this.poolRepository.saveMember(member);
    }

    // Update compliance records with adjusted CB
    for (const alloc of allocations) {
      const compliance = await this.complianceRepository.findByShipAndYear(
        alloc.shipId,
        request.year
      );
      if (compliance) {
        const updated = ComplianceBalance.create({
          id: compliance.id,
          shipId: compliance.shipId,
          year: compliance.year,
          cbGco2eq: compliance.cbGco2eq,
          adjustedCbGco2eq: alloc.cbAfter,
          createdAt: compliance.createdAt,
          updatedAt: new Date(),
        });
        await this.complianceRepository.update(updated);
      }
    }

    return {
      poolId,
      members: allocations.map((m) => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
      totalCbAfter,
    };
  }

  private allocateGreedy(
    membersData: Array<{ shipId: string; cbBefore: number }>
  ): Array<{ shipId: string; cbBefore: number; cbAfter: number }> {
    const allocations: Array<{ shipId: string; cbBefore: number; cbAfter: number }> = [];

    // Separate surpluses and deficits
    const surpluses: Array<{ shipId: string; cbBefore: number }> = [];
    const deficits: Array<{ shipId: string; cbBefore: number }> = [];

    for (const member of membersData) {
      if (member.cbBefore >= 0) {
        surpluses.push(member);
      } else {
        deficits.push(member);
      }
    }

    // Sort surpluses descending, deficits ascending (worst first)
    surpluses.sort((a, b) => b.cbBefore - a.cbBefore);
    deficits.sort((a, b) => a.cbBefore - b.cbBefore);

    // Initialize allocations
    for (const member of membersData) {
      allocations.push({
        shipId: member.shipId,
        cbBefore: member.cbBefore,
        cbAfter: member.cbBefore, // Start with original
      });
    }

    // Greedy allocation: transfer surplus to deficits
    let surplusIndex = 0;
    for (const deficit of deficits) {
      const deficitAlloc = allocations.find((a) => a.shipId === deficit.shipId)!;

      while (deficitAlloc.cbAfter < 0 && surplusIndex < surpluses.length) {
        const surplus = surpluses[surplusIndex];
        const surplusAlloc = allocations.find((a) => a.shipId === surplus.shipId)!;

        const transfer = Math.min(
          -deficitAlloc.cbAfter, // Amount needed
          surplusAlloc.cbAfter // Amount available
        );

        deficitAlloc.cbAfter += transfer;
        surplusAlloc.cbAfter -= transfer;

        if (surplusAlloc.cbAfter <= 0) {
          surplusIndex++;
        }
      }
    }

    return allocations;
  }
}

