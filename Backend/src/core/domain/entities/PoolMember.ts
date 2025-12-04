export class PoolMember {
  constructor(
    public readonly id: string,
    public readonly poolId: string,
    public readonly shipId: string,
    public readonly cbBefore: number,
    public readonly cbAfter: number
  ) {}

  static create(data: {
    id: string;
    poolId: string;
    shipId: string;
    cbBefore: number;
    cbAfter: number;
  }): PoolMember {
    return new PoolMember(
      data.id,
      data.poolId,
      data.shipId,
      data.cbBefore,
      data.cbAfter
    );
  }
}

