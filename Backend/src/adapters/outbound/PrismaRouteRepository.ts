import { RouteRepository } from "../../core/ports/RouteRepository";
import { Route } from "../../core/domain/entities/Route";
import { prisma } from "../../infrastructure/db/prismaClient";

export class PrismaRouteRepository implements RouteRepository {
  // ---------------------------------------------------------
  // FIND ALL ROUTES WITH OPTIONAL FILTERS
  // ---------------------------------------------------------
  async findAll(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]> {
    const routes = await prisma.route.findMany({
      where: {
        ...(filters?.vesselType && { vesselType: filters.vesselType }),
        ...(filters?.fuelType && { fuelType: filters.fuelType }),
        ...(filters?.year && { year: filters.year }),
      },
      orderBy: { routeId: "asc" },
    });

    return routes.map((r) => Route.create({ ...r }));
  }

  // ---------------------------------------------------------
  // FIND BY ID
  // ---------------------------------------------------------
  async findById(id: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({ where: { id } });
    return route ? Route.create({ ...route }) : null;
  }

  // ---------------------------------------------------------
  // FIND BY ROUTE ID
  // ---------------------------------------------------------
  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({ where: { routeId } });
    return route ? Route.create({ ...route }) : null;
  }

  // ---------------------------------------------------------
  // SAVE NEW ROUTE
  // ---------------------------------------------------------
  async save(route: Route): Promise<Route> {
    const saved = await prisma.route.create({
      data: {
        routeId: route.routeId,
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distance: route.distance,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline,
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
      },
    });

    return Route.create({ ...saved });
  }

  // ---------------------------------------------------------
  // UPDATE ROUTE
  // ---------------------------------------------------------
  async update(route: Route): Promise<Route> {
    const updated = await prisma.route.update({
      where: { id: route.id },
      data: {
        isBaseline: route.isBaseline,
        updatedAt: route.updatedAt,
      },
    });

    return Route.create({ ...updated });
  }

  // ---------------------------------------------------------
  // FIND BASELINE MATCHING SAME VESSEL TYPE + FUEL TYPE
  // ---------------------------------------------------------
  async findBaseline(
    vesselType: string,
    fuelType: string
  ): Promise<Route | null> {
    const baseline = await prisma.route.findFirst({
      where: {
        isBaseline: true,
        vesselType,
        fuelType,
      },
    });

    return baseline ? Route.create({ ...baseline }) : null;
  }

  // ---------------------------------------------------------
  // SET BASELINE FOR A SPECIFIC ROUTE
  // ---------------------------------------------------------
  async setBaseline(routeId: string): Promise<Route> {
    const current = await prisma.route.findUnique({ where: { routeId } });

    if (!current) {
      throw new Error(`Route ${routeId} not found`);
    }

    // Remove baseline from all routes of SAME vessel + fuel
    await prisma.route.updateMany({
      where: {
        vesselType: current.vesselType,
        fuelType: current.fuelType,
        isBaseline: true,
      },
      data: { isBaseline: false },
    });

    // Set new baseline
    const updated = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });

    return Route.create({ ...updated });
  }

  // ---------------------------------------------------------
  // FIND BASELINE + OTHER ROUTES FOR COMPARISON
  // ---------------------------------------------------------
  async findAllForComparison(): Promise<{
    baseline: Route | null;
    others: Route[];
  }> {
    const all = await prisma.route.findMany();

    const baseline = all.find((r) => r.isBaseline) || null;
    const others = all.filter((r) => !r.isBaseline);

    return {
      baseline: baseline ? Route.create({ ...baseline }) : null,
      others: others.map((o) => Route.create({ ...o })),
    };
  }
}
