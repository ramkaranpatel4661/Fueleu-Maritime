import { Pool } from '../domain/entities/Pool';
import { PoolMember } from '../domain/entities/PoolMember';

export interface PoolRepository {
  save(pool: Pool): Promise<Pool>;
  findById(id: string): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
  saveMember(member: PoolMember): Promise<PoolMember>;
  findMembersByPoolId(poolId: string): Promise<PoolMember[]>;
}

