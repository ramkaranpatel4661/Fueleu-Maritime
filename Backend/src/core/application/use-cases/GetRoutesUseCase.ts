import { RouteRepository } from '../../ports/RouteRepository';
import { Route } from '../../domain/entities/Route';

export interface GetRoutesFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

export class GetRoutesUseCase {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(filters?: GetRoutesFilters): Promise<Route[]> {
    return await this.routeRepository.findAll(filters);
  }
}

