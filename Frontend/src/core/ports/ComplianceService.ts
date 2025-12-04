import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/entities/ComplianceBalance';

export interface ComplianceService {
  getCB(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
}

