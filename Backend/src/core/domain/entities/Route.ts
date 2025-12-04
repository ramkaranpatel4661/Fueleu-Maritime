export class Route {
  constructor(
    public readonly id: string,
    public readonly routeId: string,
    public readonly vesselType: string,
    public readonly fuelType: string,
    public readonly year: number,
    public readonly ghgIntensity: number, // gCO₂e/MJ
    public readonly fuelConsumption: number, // tonnes
    public readonly distance: number, // km
    public readonly totalEmissions: number, // tonnes CO₂e
    public readonly isBaseline: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    id: string;
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): Route {
    return new Route(
      data.id,
      data.routeId,
      data.vesselType,
      data.fuelType,
      data.year,
      data.ghgIntensity,
      data.fuelConsumption,
      data.distance,
      data.totalEmissions,
      data.isBaseline,
      data.createdAt || new Date(),
      data.updatedAt || new Date()
    );
  }

  markAsBaseline(): Route {
    return new Route(
      this.id,
      this.routeId,
      this.vesselType,
      this.fuelType,
      this.year,
      this.ghgIntensity,
      this.fuelConsumption,
      this.distance,
      this.totalEmissions,
      true,
      this.createdAt,
      new Date()
    );
  }

  unmarkAsBaseline(): Route {
    return new Route(
      this.id,
      this.routeId,
      this.vesselType,
      this.fuelType,
      this.year,
      this.ghgIntensity,
      this.fuelConsumption,
      this.distance,
      this.totalEmissions,
      false,
      this.createdAt,
      new Date()
    );
  }
}

