import { ComplianceBalance } from '../domain/entities/ComplianceBalance';

export interface ComplianceRepository {
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  save(compliance: ComplianceBalance): Promise<ComplianceBalance>;
  update(compliance: ComplianceBalance): Promise<ComplianceBalance>;
  findAllByYear(year: number): Promise<ComplianceBalance[]>;
}

