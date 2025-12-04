export class BankEntry {
  constructor(
    public readonly id: string,
    public readonly shipId: string,
    public readonly year: number,
    public readonly amountGco2eq: number, // Amount banked in gCO₂e
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id: string;
    shipId: string;
    year: number;
    amountGco2eq: number;
    createdAt?: Date;
  }): BankEntry {
    return new BankEntry(
      data.id,
      data.shipId,
      data.year,
      data.amountGco2eq,
      data.createdAt || new Date()
    );
  }
}

