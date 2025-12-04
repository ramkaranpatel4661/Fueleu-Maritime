import { RouteRepository } from '../../core/ports/RouteRepository';
import { Route } from '../../core/domain/entities/Route';
import { prisma } from '../../infrastructure/db/prismaClient';

export class PrismaRouteRepository implements RouteRepository {
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
      orderBy: { routeId: 'asc' },
    });

    return routes.map((r) =>
      Route.create({
        id: r.id,
        routeId: r.routeId,
        vesselType: r.vesselType,
        fuelType: r.fuelType,
        year: r.year,
        ghgIntensity: r.ghgIntensity,
        fuelConsumption: r.fuelConsumption,
        distance: r.distance,
        totalEmissions: r.totalEmissions,
        isBaseline: r.isBaseline,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })
    );
  }

  async findById(id: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({ where: { id } });
    if (!route) return null;

    return Route.create({
      id: route.id,
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
    });
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const route = await prisma.route.findUnique({ where: { routeId } });
    if (!route) return null;

    return Route.create({
      id: route.id,
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
    });
  }

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

    return Route.create({
      id: saved.id,
      routeId: saved.routeId,
      vesselType: saved.vesselType,
      fuelType: saved.fuelType,
      year: saved.year,
      ghgIntensity: saved.ghgIntensity,
      fuelConsumption: saved.fuelConsumption,
      distance: saved.distance,
      totalEmissions: saved.totalEmissions,
      isBaseline: saved.isBaseline,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async update(route: Route): Promise<Route> {
    const updated = await prisma.route.update({
      where: { id: route.id },
      data: {
        isBaseline: route.isBaseline,
        updatedAt: route.updatedAt,
      },
    });

    return Route.create({
      id: updated.id,
      routeId: updated.routeId,
      vesselType: updated.vesselType,
      fuelType: updated.fuelType,
      year: updated.year,
      ghgIntensity: updated.ghgIntensity,
      fuelConsumption: updated.fuelConsumption,
      distance: updated.distance,
      totalEmissions: updated.totalEmissions,
      isBaseline: updated.isBaseline,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async findBaseline(): Promise<Route | null> {
    const route = await prisma.route.findFirst({ where: { isBaseline: true } });
    if (!route) return null;

    return Route.create({
      id: route.id,
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
    });
  }

  async setBaseline(routeId: string): Promise<Route> {
    // First unset all baselines
    await prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false },
    });

    // Set new baseline
    const updated = await prisma.route.update({
      where: { routeId },
      data: { isBaseline: true },
    });

    return Route.create({
      id: updated.id,
      routeId: updated.routeId,
      vesselType: updated.vesselType,
      fuelType: updated.fuelType,
      year: updated.year,
      ghgIntensity: updated.ghgIntensity,
      fuelConsumption: updated.fuelConsumption,
      distance: updated.distance,
      totalEmissions: updated.totalEmissions,
      isBaseline: updated.isBaseline,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  }

  async findAllForComparison(): Promise<{ baseline: Route | null; others: Route[] }> {
    const allRoutes = await prisma.route.findMany();
    const baselineData = allRoutes.find((r) => r.isBaseline);
    const othersData = allRoutes.filter((r) => !r.isBaseline);

    const baseline = baselineData
      ? Route.create({
          id: baselineData.id,
          routeId: baselineData.routeId,
          vesselType: baselineData.vesselType,
          fuelType: baselineData.fuelType,
          year: baselineData.year,
          ghgIntensity: baselineData.ghgIntensity,
          fuelConsumption: baselineData.fuelConsumption,
          distance: baselineData.distance,
          totalEmissions: baselineData.totalEmissions,
          isBaseline: baselineData.isBaseline,
          createdAt: baselineData.createdAt,
          updatedAt: baselineData.updatedAt,
        })
      : null;

    const others = othersData.map((r) =>
      Route.create({
        id: r.id,
        routeId: r.routeId,
        vesselType: r.vesselType,
        fuelType: r.fuelType,
        year: r.year,
        ghgIntensity: r.ghgIntensity,
        fuelConsumption: r.fuelConsumption,
        distance: r.distance,
        totalEmissions: r.totalEmissions,
        isBaseline: r.isBaseline,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })
    );

    return { baseline, others };
  }
}

