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
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-solid border-cyan-500 border-r-transparent mb-4"></div>
          <p className="text-slate-300 font-semibold">Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Routes</h2>
          <p className="text-slate-400 mt-2">Manage and monitor shipping routes</p>
        </div>
        <div className="bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border border-cyan-600/50 rounded-xl px-5 py-3 backdrop-blur">
          <span className="text-sm font-bold text-cyan-300">
            Total: <span className="text-cyan-200">{routes.length}</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-700/50">
        <div className="flex items-center space-x-2 mb-5">
          <span className="text-xl">🔍</span>
          <h3 className="text-lg font-bold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Vessel Type
            </label>
            <select
              className="w-full border-2 border-slate-700 rounded-lg px-4 py-2.5 bg-slate-700/50 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-500"
              value={filters.vesselType || ''}
              onChange={(e) => handleFilterChange('vesselType', e.target.value)}
            >
              <option value="">All Vessel Types</option>
              {vesselTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Fuel Type
            </label>
            <select
              className="w-full border-2 border-slate-700 rounded-lg px-4 py-2.5 bg-slate-700/50 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-500"
              value={filters.fuelType || ''}
              onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Year</label>
            <select
              className="w-full border-2 border-slate-700 rounded-lg px-4 py-2.5 bg-slate-700/50 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-500"
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All Years</option>
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
        <div className="bg-red-950/40 border-l-4 border-red-500 text-red-300 p-4 rounded-lg shadow-md backdrop-blur">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <div>
              <p className="font-semibold">Error loading routes</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Routes Table */}
      <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border-b border-slate-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Route ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Vessel Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Fuel Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  GHG Intensity
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Fuel (t)
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Distance (km)
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Emissions (t)
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {routes.map((route) => (
                <tr
                  key={route.id}
                  className={`transition-colors hover:bg-slate-700/50 ${
                    route.isBaseline ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-l-4 border-cyan-500' : 'bg-slate-800/30'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-200">{route.routeId}</span>
                      {route.isBaseline && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/30">
                          ⭐ Baseline
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600">
                      {route.vesselType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-900/40 text-orange-300 border border-orange-700/50">
                      {route.fuelType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">
                    {route.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-cyan-300">
                      {route.ghgIntensity.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">gCO₂e/MJ</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {route.fuelConsumption.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {route.distance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-orange-400">
                      {route.totalEmissions.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {!route.isBaseline && (
                      <button
                        onClick={() => handleSetBaseline(route.routeId)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-lg hover:from-blue-500 hover:to-cyan-500 transform hover:scale-110 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
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
        {routes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-400 font-medium">No routes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
