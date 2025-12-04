export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface CreatePoolRequest {
  year: number;
  shipIds: string[];
}

export interface CreatePoolResult {
  poolId: string;
  members: PoolMember[];
  totalCbAfter: number;
}

