export interface RouteComparison {
  baseline: {
    routeId: string;
    ghgIntensity: number;
  };
  comparison: {
    routeId: string;
    ghgIntensity: number;
  };
  percentDiff: number;
  compliant: boolean;
}

