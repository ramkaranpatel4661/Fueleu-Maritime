import { RouteRepository } from '../../ports/RouteRepository';
import { RouteComparison } from '../../domain/entities/RouteComparison';

export class GetComparisonUseCase {
  private static readonly TARGET_INTENSITY = 89.3368; // gCO₂e/MJ

  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(): Promise<RouteComparison[]> {
    const { baseline, others } = await this.routeRepository.findAllForComparison();

    if (!baseline) {
      throw new Error('No baseline route found');
    }

    return others.map((route) =>
      RouteComparison.create(
        {
          routeId: baseline.routeId,
          ghgIntensity: baseline.ghgIntensity,
        },
        {
          routeId: route.routeId,
          ghgIntensity: route.ghgIntensity,
        },
        GetComparisonUseCase.TARGET_INTENSITY
      )
    );
  }
}

