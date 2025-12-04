import { BankingRepository } from '../../ports/BankingRepository';
import { ComplianceRepository } from '../../ports/ComplianceRepository';
import { BankEntry } from '../../domain/entities/BankEntry';
import { v4 as uuidv4 } from 'uuid';

export class BankSurplusUseCase {
  constructor(
    private readonly bankingRepository: BankingRepository,
    private readonly complianceRepository: ComplianceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<BankEntry> {
    // Get current CB
    const compliance = await this.complianceRepository.findByShipAndYear(shipId, year);

    if (!compliance) {
      throw new Error(`No compliance balance found for ship ${shipId} in year ${year}`);
    }

    // Only bank positive CB (surplus)
    if (compliance.cbGco2eq <= 0) {
      throw new Error('Cannot bank non-positive compliance balance');
    }

    // Create bank entry
    const bankEntry = BankEntry.create({
      id: uuidv4(),
      shipId,
      year,
      amountGco2eq: compliance.cbGco2eq,
    });

    return await this.bankingRepository.save(bankEntry);
  }
}

