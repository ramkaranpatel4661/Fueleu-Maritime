export interface BankRecord {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt: string;
}

export interface BankingSummary {
  records: BankRecord[];
  totalBanked: number;
  totalApplied: number;
  available: number;
}

export interface ApplyBankedResult {
  cb_before: number;
  applied: number;
  cb_after: number;
}

