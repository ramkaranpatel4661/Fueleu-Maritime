import { RouteRepository } from "../../ports/RouteRepository";
import { Route } from "../../domain/entities/Route";

export class SetBaselineUseCase {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(routeId: string): Promise<Route> {
    const route = await this.routeRepository.findByRouteId(routeId);

    if (!route) {
      throw new Error(`Route with ID ${routeId} not found`);
    }

    // Get vessel + fuel
    const vesselType = route.vesselType;
    const fuelType = route.fuelType;

    // Find existing baseline for SAME vessel + fuel
    const currentBaseline = await this.routeRepository.findBaseline(
      vesselType,
      fuelType
    );

    if (currentBaseline && currentBaseline.routeId !== routeId) {
      await this.routeRepository.update(currentBaseline.unmarkAsBaseline());
    }

    // Set new baseline
    const updated = route.markAsBaseline();
    return await this.routeRepository.update(updated);
  }
}
