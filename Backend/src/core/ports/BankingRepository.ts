import { BankEntry } from '../domain/entities/BankEntry';

export interface BankingRepository {
  save(entry: BankEntry): Promise<BankEntry>;
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  getTotalApplied(shipId: string, year: number): Promise<number>;
  getAvailableBanked(shipId: string, year: number): Promise<number>;
}

