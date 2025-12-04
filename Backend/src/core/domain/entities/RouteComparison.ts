export class RouteComparison {
  constructor(
    public readonly baseline: {
      routeId: string;
      ghgIntensity: number;
    },
    public readonly comparison: {
      routeId: string;
      ghgIntensity: number;
    },
    public readonly percentDiff: number,
    public readonly compliant: boolean
  ) {}

  static create(
    baseline: { routeId: string; ghgIntensity: number },
    comparison: { routeId: string; ghgIntensity: number },
    targetIntensity: number
  ): RouteComparison {
    const percentDiff = ((comparison.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
    const compliant = comparison.ghgIntensity <= targetIntensity;

    return new RouteComparison(baseline, comparison, percentDiff, compliant);
  }
}

