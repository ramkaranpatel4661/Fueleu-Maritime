import { BankingRepository } from '../../ports/BankingRepository';
import { ComplianceRepository } from '../../ports/ComplianceRepository';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

export interface ApplyBankedResult {
  cb_before: number;
  applied: number;
  cb_after: number;
}

export class ApplyBankedUseCase {
  constructor(
    private readonly bankingRepository: BankingRepository,
    private readonly complianceRepository: ComplianceRepository
  ) {}

  async execute(
    shipId: string,
    year: number,
    amount: number
  ): Promise<ApplyBankedResult> {
    // Get current compliance
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);

    if (!compliance) {
      throw new Error(`No compliance balance found for ship ${shipId} in year ${year}`);
    }

    // Get available banked amount
    const available = await this.bankingRepository.getAvailableBanked(shipId, year);

    if (amount > available) {
      throw new Error(`Cannot apply ${amount}, only ${available} available`);
    }

    // Get current CB before
    const cbBefore = compliance.cbGco2eq;

    // Apply banked amount (add to CB)
    const cbAfter = cbBefore + amount;

    // Record the application (negative amount in bank to represent application)
    // In a real system, you'd track this separately, but for simplicity:
    // We'll track applied amounts as negative entries or in a separate table
    // For now, we'll just update the adjusted CB

    const updated = ComplianceBalance.create({
      id: compliance.id,
      shipId: compliance.shipId,
      year: compliance.year,
      cbGco2eq: compliance.cbGco2eq,
      adjustedCbGco2eq: cbAfter,
      createdAt: compliance.createdAt,
      updatedAt: new Date(),
    });

    await this.complianceRepository.update(updated);

    return {
      cb_before: cbBefore,
      applied: amount,
      cb_after: cbAfter,
    };
  }
}

