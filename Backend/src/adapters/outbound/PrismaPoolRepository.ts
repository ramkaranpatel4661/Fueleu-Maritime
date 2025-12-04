import { PoolRepository } from '../../core/ports/PoolRepository';
import { Pool } from '../../core/domain/entities/Pool';
import { PoolMember } from '../../core/domain/entities/PoolMember';
import { prisma } from '../../infrastructure/db/prismaClient';
import { v4 as uuidv4 } from 'uuid';

export class PrismaPoolRepository implements PoolRepository {
  async save(pool: Pool): Promise<Pool> {
    await prisma.pool.create({
      data: {
        id: pool.id,
        year: pool.year,
        createdAt: pool.createdAt,
      },
    });

    return pool;
  }

  async findById(id: string): Promise<Pool | null> {
    const poolData = await prisma.pool.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!poolData) return null;

    const members = poolData.members.map((m) =>
      PoolMember.create({
        id: m.id,
        poolId: m.poolId,
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })
    );

    return Pool.create({
      id: poolData.id,
      year: poolData.year,
      members,
      createdAt: poolData.createdAt,
    });
  }

  async findByYear(year: number): Promise<Pool[]> {
    const poolsData = await prisma.pool.findMany({
      where: { year },
      include: { members: true },
    });

    return poolsData.map((poolData) => {
      const members = poolData.members.map((m) =>
        PoolMember.create({
          id: m.id,
          poolId: m.poolId,
          shipId: m.shipId,
          cbBefore: m.cbBefore,
          cbAfter: m.cbAfter,
        })
      );

      return Pool.create({
        id: poolData.id,
        year: poolData.year,
        members,
        createdAt: poolData.createdAt,
      });
    });
  }

  async saveMember(member: PoolMember): Promise<PoolMember> {
    await prisma.poolMember.create({
      data: {
        id: member.id || uuidv4(),
        poolId: member.poolId,
        shipId: member.shipId,
        cbBefore: member.cbBefore,
        cbAfter: member.cbAfter,
      },
    });

    return member;
  }

  async findMembersByPoolId(poolId: string): Promise<PoolMember[]> {
    const members = await prisma.poolMember.findMany({
      where: { poolId },
    });

    return members.map((m) =>
      PoolMember.create({
        id: m.id,
        poolId: m.poolId,
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })
    );
  }
}

