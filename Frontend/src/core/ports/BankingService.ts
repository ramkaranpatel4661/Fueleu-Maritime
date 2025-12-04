import { BankingSummary, ApplyBankedResult } from '../domain/entities/Banking';

export interface BankingService {
  getRecords(shipId: string, year: number): Promise<BankingSummary>;
  bank(shipId: string, year: number): Promise<any>;
  apply(shipId: string, year: number, amount: number): Promise<ApplyBankedResult>;
}

