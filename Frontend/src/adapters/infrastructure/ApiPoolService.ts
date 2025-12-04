import axios from 'axios';
import { PoolService } from '../../core/ports/PoolService';
import { CreatePoolRequest, CreatePoolResult } from '../../core/domain/entities/Pool';

const API_BASE_URL = '/api';

export class ApiPoolService implements PoolService {
  async create(request: CreatePoolRequest): Promise<CreatePoolResult> {
    const response = await axios.post<CreatePoolResult>(`${API_BASE_URL}/pools`, request);
    return response.data;
  }
}

