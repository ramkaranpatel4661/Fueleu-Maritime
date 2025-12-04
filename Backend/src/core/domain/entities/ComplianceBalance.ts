export class ComplianceBalance {
  private static readonly ENERGY_CONVERSION_FACTOR = 41000; // MJ per tonne
  private static readonly TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ

  constructor(
    public readonly id: string,
    public readonly shipId: string,
    public readonly year: number,
    public readonly cbGco2eq: number, // Compliance Balance in gCO₂e
    public readonly adjustedCbGco2eq: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static calculate(
    targetIntensity: number,
    actualIntensity: number,
    fuelConsumption: number // tonnes
  ): number {
    const energyInScope = fuelConsumption * ComplianceBalance.ENERGY_CONVERSION_FACTOR; // MJ
    const cb = (targetIntensity - actualIntensity) * energyInScope; // gCO₂e
    return cb;
  }

  static calculateForRoute(
    actualIntensity: number,
    fuelConsumption: number,
    year: number
  ): number {
    const target = ComplianceBalance.getTargetIntensity(year);
    return ComplianceBalance.calculate(target, actualIntensity, fuelConsumption);
  }

  static getTargetIntensity(_year: number): number {
    // For 2025 and beyond, use 89.3368
    // For earlier years, you can adjust this logic
    return ComplianceBalance.TARGET_INTENSITY_2025;
  }

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

