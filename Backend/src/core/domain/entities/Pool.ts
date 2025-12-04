import { PoolMember } from './PoolMember';

export class Pool {
  constructor(
    public readonly id: string,
    public readonly year: number,
    public readonly members: PoolMember[],
    public readonly createdAt: Date
  ) {}

  static create(data: {
    id: string;
    year: number;
    members: PoolMember[];
    createdAt?: Date;
  }): Pool {
    return new Pool(
      data.id,
      data.year,
      data.members,
      data.createdAt || new Date()
    );
  }

  get totalCbAfter(): number {
    return this.members.reduce((sum, member) => sum + member.cbAfter, 0);
  }

  get isValid(): boolean {
    // Sum of adjusted CB must be >= 0
    if (this.totalCbAfter < 0) {
      return false;
    }

    // Deficit ship cannot exit worse (cbAfter < cbBefore)
    // Surplus ship cannot exit negative (cbAfter < 0)
    for (const member of this.members) {
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
        return false; // Deficit ship exiting worse
      }
      if (member.cbBefore > 0 && member.cbAfter < 0) {
        return false; // Surplus ship exiting negative
      }
    }

    return true;
  }
}

