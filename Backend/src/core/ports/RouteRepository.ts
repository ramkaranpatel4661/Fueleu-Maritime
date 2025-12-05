import { Route } from "../domain/entities/Route";

export interface RouteRepository {
  findAll(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]>;

  findById(id: string): Promise<Route | null>;

  findByRouteId(routeId: string): Promise<Route | null>;

  save(route: Route): Promise<Route>;

  update(route: Route): Promise<Route>;

  // Updated: Baseline based on vessel + fuel
  findBaseline(vesselType: string, fuelType: string): Promise<Route | null>;

  // Kept for SetBaselineUseCase
  setBaseline(routeId: string): Promise<Route>;

  findAllForComparison(): Promise<{ baseline: Route | null; others: Route[] }>;
}
