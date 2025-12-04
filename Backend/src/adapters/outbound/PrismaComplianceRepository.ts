import { ComplianceRepository } from '../../core/ports/ComplianceRepository';
import { ComplianceBalance } from '../../core/domain/entities/ComplianceBalance';
import { prisma } from '../../infrastructure/db/prismaClient';
import { v4 as uuidv4 } from 'uuid';

export class PrismaComplianceRepository implements ComplianceRepository {
  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const compliance = await prisma.shipCompliance.findUnique({
      where: {
        shipId_year: {
          shipId,
          year,
        },
      },
    });

    if (!compliance) return null;

    return ComplianceBalance.create({
      id: compliance.id,
      shipId: compliance.shipId,
      year: compliance.year,
      cbGco2eq: compliance.cbGco2eq,
      adjustedCbGco2eq: compliance.adjustedCbGco2eq,
      createdAt: compliance.createdAt,
      updatedAt: compliance.updatedAt,
    });
  }

  async save(compliance: ComplianceBalance): Promise<ComplianceBalance> {
    const saved = await prisma.shipCompliance.create({
      data: {
        id: compliance.id || uuidv4(),
        shipId: compliance.shipId,
        year: compliance.year,
        cbGco2eq: compliance.cbGco2eq,
        adjustedCbGco2eq: compliance.adjustedCbGco2eq,
        createdAt: compliance.createdAt,
        updatedAt: compliance.updatedAt,
      },
    });

    return ComplianceBalance.create({
      id: saved.id,
      shipId: saved.shipId,
      year: saved.year,
      cbGco2eq: saved.cbGco2eq,
      adjustedCbGco2eq: saved.adjustedCbGco2eq,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async update(compliance: ComplianceBalance): Promise<ComplianceBalance> {
    const updated = await prisma.shipCompliance.update({
      where: {
        shipId_year: {
          shipId: compliance.shipId,
          year: compliance.year,
        },
      },
      data: {
        cbGco2eq: compliance.cbGco2eq,
        adjustedCbGco2eq: compliance.adjustedCbGco2eq,
        updatedAt: compliance.updatedAt,
      },
    });

    return ComplianceBalance.create({
      id: updated.id,
      shipId: updated.shipId,
      year: updated.year,
      cbGco2eq: updated.cbGco2eq,
      adjustedCbGco2eq: updated.adjustedCbGco2eq,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async findAllByYear(year: number): Promise<ComplianceBalance[]> {
    const compliances = await prisma.shipCompliance.findMany({
      where: { year },
    });

    return compliances.map((c) =>
      ComplianceBalance.create({
        id: c.id,
        shipId: c.shipId,
        year: c.year,
        cbGco2eq: c.cbGco2eq,
        adjustedCbGco2eq: c.adjustedCbGco2eq,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })
    );
  }
}

