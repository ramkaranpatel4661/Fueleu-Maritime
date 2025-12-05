import { ComplianceRepository } from '../../ports/ComplianceRepository';
import { RouteRepository } from '../../ports/RouteRepository';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import { BankingRepository } from '../../ports/BankingRepository';

export class CalculateCBUseCase {
  constructor(
    private readonly complianceRepository: ComplianceRepository,
    private readonly routeRepository: RouteRepository,
    private readonly bankingRepository: BankingRepository
  ) {}

  async execute(shipId: string, year: number): Promise<ComplianceBalance> {
    // 1️⃣ Get route data
    const route = await this.routeRepository.findByRouteId(shipId);
    if (!route || route.year !== year) {
      throw new Error(`Route not found for ship ${shipId} in year ${year}`);
    }

    // 2️⃣ Calculate CB using regulatory target intensity
    // Formula: CB = (Target - Actual) × Energy in scope
    // Energy in scope = fuelConsumption × 42,000 MJ/t
    const cbGco2eq = ComplianceBalance.calculateForRoute(
      route.ghgIntensity,
      route.fuelConsumption,
      year
    );

    // 4️⃣ Load existing compliance record
    let compliance = await this.complianceRepository.findByShipAndYear(shipId, year);

    if (compliance) {
      const updated = ComplianceBalance.create({
        id: compliance.id,
        shipId,
        year,
        cbGco2eq,
        adjustedCbGco2eq: compliance.adjustedCbGco2eq,
        createdAt: compliance.createdAt,
        updatedAt: new Date(),
      });

      return await this.complianceRepository.update(updated);
    }

    // 5️⃣ Create new record
    const newCompliance = ComplianceBalance.create({
      id: '',
      shipId,
      year,
      cbGco2eq,
      adjustedCbGco2eq: null,
    });

    return await this.complianceRepository.save(newCompliance);
  }

  async getAdjustedCB(shipId: string, year: number): Promise<ComplianceBalance> {
    let compliance = await this.complianceRepository.findByShipAndYear(shipId, year);

    if (!compliance) {
      compliance = await this.execute(shipId, year);
    }

    // Add applied banked amount
    const appliedAmount = await this.bankingRepository.getTotalApplied(shipId, year);
    const adjustedCb = compliance.cbGco2eq + appliedAmount;

    if (compliance.adjustedCbGco2eq !== adjustedCb) {
      const updated = ComplianceBalance.create({
        id: compliance.id,
        shipId,
        year,
        cbGco2eq: compliance.cbGco2eq,
        adjustedCbGco2eq: adjustedCb,
        createdAt: compliance.createdAt,
        updatedAt: new Date(),
      });

      return await this.complianceRepository.update(updated);
    }

    return compliance;
  }
}
