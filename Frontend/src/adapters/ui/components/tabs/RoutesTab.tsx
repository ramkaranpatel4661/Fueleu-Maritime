import { useEffect, useState } from 'react';
import { ApiRouteService } from '../../../../adapters/infrastructure/ApiRouteService';
import { Route } from '../../../../core/domain/entities/Route';
import { RouteFilters } from '../../../../core/ports/RouteService';

const routeService = new ApiRouteService();

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>({});
  const [vesselTypes, setVesselTypes] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    loadRoutes();
  }, [filters]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeService.getAll(filters);
      setRoutes(data);

      // Extract unique values for filters
      const uniqueVesselTypes = [...new Set(data.map((r) => r.vesselType))];
      const uniqueFuelTypes = [...new Set(data.map((r) => r.fuelType))];
      const uniqueYears = [...new Set(data.map((r) => r.year))].sort((a, b) => b - a);

      if (vesselTypes.length === 0) setVesselTypes(uniqueVesselTypes);
      if (fuelTypes.length === 0) setFuelTypes(uniqueFuelTypes);
      if (years.length === 0) setYears(uniqueYears);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (routeId: string) => {
    try {
      await routeService.setBaseline(routeId);
      await loadRoutes();
      alert(`Route ${routeId} set as baseline`);
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  const handleFilterChange = (key: keyof RouteFilters, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : key === 'year' ? parseInt(value || '0') : value,
    }));
  };

  if (loading && routes.length === 0) {
    return <div className="text-center py-8">Loading routes...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Routes</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h3 className="font-medium text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.vesselType || ''}
              onChange={(e) => handleFilterChange('vesselType', e.target.value)}
            >
              <option value="">All</option>
              {vesselTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.fuelType || ''}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            >
              <option value="">All</option>
              {fuelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {/* Routes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vessel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GHG Intensity (gCO₂e/MJ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Consumption (t)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance (km)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Emissions (t)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.map((route) => (
                <tr key={route.id} className={route.isBaseline ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.routeId}
                    {route.isBaseline && (
                      <span className="ml-2 text-blue-600 font-bold">(Baseline)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.vesselType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.fuelType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.fuelConsumption.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.distance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.totalEmissions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {!route.isBaseline && (
                      <button
                        onClick={() => handleSetBaseline(route.routeId)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Set Baseline
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

