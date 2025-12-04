export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO₂e
  adjustedCbGco2eq: number | null;
  isSurplus: boolean;
  isDeficit: boolean;
}

export interface AdjustedComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  adjustedCbGco2eq: number | null;
  effectiveCb: number;
}

