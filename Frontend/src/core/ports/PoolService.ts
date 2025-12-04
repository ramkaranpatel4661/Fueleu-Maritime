import { CreatePoolRequest, CreatePoolResult } from '../domain/entities/Pool';

export interface PoolService {
  create(request: CreatePoolRequest): Promise<CreatePoolResult>;
}

