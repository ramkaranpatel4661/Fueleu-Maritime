import { BankingRepository } from '../../core/ports/BankingRepository';
import { BankEntry } from '../../core/domain/entities/BankEntry';
import { prisma } from '../../infrastructure/db/prismaClient';
import { v4 as uuidv4 } from 'uuid';

// For simplicity, we'll track applied amounts as negative bank entries
// In production, you'd have a separate table

export class PrismaBankingRepository implements BankingRepository {
  async save(entry: BankEntry): Promise<BankEntry> {
    const saved = await prisma.bankEntry.create({
      data: {
        id: entry.id || uuidv4(),
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq,
        createdAt: entry.createdAt,
      },
    });

    return BankEntry.create({
      id: saved.id,
      shipId: saved.shipId,
      year: saved.year,
      amountGco2eq: saved.amountGco2eq,
      createdAt: saved.createdAt,
    });
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const entries = await prisma.bankEntry.findMany({
      where: {
        shipId,
        year,
      },
      orderBy: { createdAt: 'desc' },
    });

    return entries.map((e) =>
      BankEntry.create({
        id: e.id,
        shipId: e.shipId,
        year: e.year,
        amountGco2eq: e.amountGco2eq,
        createdAt: e.createdAt,
      })
    );
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: {
        shipId,
        year,
        amountGco2eq: {
          gt: 0, // Only positive amounts (banked)
        },
      },
      _sum: {
        amountGco2eq: true,
      },
    });

    return result._sum.amountGco2eq || 0;
  }

  async getTotalApplied(shipId: string, year: number): Promise<number> {
    // For simplicity, we'll use negative entries to represent applications
    // In production, use a separate table
    const result = await prisma.bankEntry.aggregate({
      where: {
        shipId,
        year,
        amountGco2eq: {
          lt: 0, // Negative amounts represent applications
        },
      },
      _sum: {
        amountGco2eq: true,
      },
    });

    return Math.abs(result._sum.amountGco2eq || 0);
  }

  async getAvailableBanked(shipId: string, year: number): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: {
        shipId,
        year,
      },
      _sum: {
        amountGco2eq: true,
      },
    });

    return result._sum.amountGco2eq || 0;
  }

  // Helper method to record application (creates negative entry)
  async recordApplication(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const entry = BankEntry.create({
      id: uuidv4(),
      shipId,
      year,
      amountGco2eq: -amount, // Negative to represent application
      createdAt: new Date(),
    });

    return await this.save(entry);
  }
}

