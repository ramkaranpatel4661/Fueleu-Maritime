import { RouteRepository } from '../../ports/RouteRepository';
import { Route } from '../../domain/entities/Route';

export class SetBaselineUseCase {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(routeId: string): Promise<Route> {
    const route = await this.routeRepository.findByRouteId(routeId);
    
    if (!route) {
      throw new Error(`Route with ID ${routeId} not found`);
    }

    // Unset current baseline
    const currentBaseline = await this.routeRepository.findBaseline();
    if (currentBaseline && currentBaseline.routeId !== routeId) {
      await this.routeRepository.update(currentBaseline.unmarkAsBaseline());
    }

    // Set new baseline
    const updatedRoute = route.markAsBaseline();
    return await this.routeRepository.update(updatedRoute);
  }
}

