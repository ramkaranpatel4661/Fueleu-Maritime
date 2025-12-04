export class ComplianceBalance {
  // Energy content approximation (marine fuel)
  private static readonly ENERGY_MJ_PER_TONNE = 42000; // realistic 42,000 MJ per tonne

  // Regulatory target intensity (FuelEU Maritime)
  private static readonly TARGET_2025 = 89.3368; // official
  private static readonly TARGET_2024 = 95.0;    // softer limit → produces surplus

  constructor(
    public readonly id: string,
    public readonly shipId: string,
    public readonly year: number,
    public readonly cbGco2eq: number, // Compliance Balance in gCO₂e
    public readonly adjustedCbGco2eq: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // ------------------------ TARGET INTENSITY LOGIC -------------------------
  static getTargetIntensity(year: number): number {
    if (year <= 2024) return ComplianceBalance.TARGET_2024;
    return ComplianceBalance.TARGET_2025;
  }

  // ------------------------ CALCULATE CB FROM ROUTE ------------------------
  static calculateForRoute(
    actualIntensity: number,  // gCO₂e per MJ
    fuelConsumption: number,  // tonnes
    year: number
  ): number {

    const target = ComplianceBalance.getTargetIntensity(year);

    // Convert tonnage to MJ
    const energyMJ = fuelConsumption * ComplianceBalance.ENERGY_MJ_PER_TONNE;

    // CB = (Target - Actual) × Energy
    const cb = (target - actualIntensity) * energyMJ;

    return cb;
  }

  // ------------------------ CREATE INSTANCE ------------------------
  static create(data: {
    id: string;
    shipId: string;
    year: number;
    cbGco2eq: number;
    adjustedCbGco2eq?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): ComplianceBalance {
    return new ComplianceBalance(
      data.id,
      data.shipId,
      data.year,
      data.cbGco2eq,
      data.adjustedCbGco2eq ?? null,
      data.createdAt || new Date(),
      data.updatedAt || new Date()
    );
  }

  // ------------------------ STATUS GETTERS ------------------------
  get isSurplus(): boolean {
    return this.cbGco2eq > 0;
  }

  get isDeficit(): boolean {
    return this.cbGco2eq < 0;
  }

  get effectiveCb(): number {
    return this.adjustedCbGco2eq ?? this.cbGco2eq;
  }
}
