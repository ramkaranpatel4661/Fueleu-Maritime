import { useEffect, useState } from 'react';
import { ApiRouteService } from '../../../../adapters/infrastructure/ApiRouteService';
import { ApiComplianceService } from '../../../../adapters/infrastructure/ApiComplianceService';
import { ApiPoolService } from '../../../../adapters/infrastructure/ApiPoolService';
import { Route } from '../../../../core/domain/entities/Route';
import { AdjustedComplianceBalance } from '../../../../core/domain/entities/ComplianceBalance';
import { CreatePoolResult } from '../../../../core/domain/entities/Pool';

const routeService = new ApiRouteService();
const complianceService = new ApiComplianceService();
const poolService = new ApiPoolService();

interface ShipCB {
  shipId: string;
  cb: number;
  selected: boolean;
}

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [ships, setShips] = useState<ShipCB[]>([]);
  const [poolResult, setPoolResult] = useState<CreatePoolResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoutes();
  }, [year]);

  useEffect(() => {
    if (routes.length > 0) {
      loadShipsCB();
    }
  }, [routes, year]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeService.getAll({ year });
      setRoutes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadShipsCB = async () => {
    try {
      setLoading(true);
      const cbPromises = routes.map((route) =>
        complianceService.getAdjustedCB(route.routeId, year).catch(() => null)
      );
      const cbResults = await Promise.all(cbPromises);

      const shipsData: ShipCB[] = routes.map((route, index) => {
        const cb = cbResults[index];
        return {
          shipId: route.routeId,
          cb: cb?.effectiveCb ?? 0,
          selected: false,
        };
      });

      setShips(shipsData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleShip = (shipId: string) => {
    setShips((prev) =>
      prev.map((ship) => (ship.shipId === shipId ? { ...ship, selected: !ship.selected } : ship))
    );
  };

  const handleCreatePool = async () => {
    const selectedShipIds = ships.filter((s) => s.selected).map((s) => s.shipId);

    if (selectedShipIds.length < 2) {
      alert('Please select at least 2 ships');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await poolService.create({
        year,
        shipIds: selectedShipIds,
      });
      setPoolResult(result);
      alert('Pool created successfully!');
      await loadShipsCB(); // Reload to get updated CBs
    } catch (err) {
      setError((err as Error).message);
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedShips = ships.filter((s) => s.selected);
  const poolSum = selectedShips.reduce((sum, ship) => sum + ship.cb, 0);
  const isValidPool = selectedShips.length >= 2 && poolSum >= 0;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Pooling</h2>

      {/* Year Selection */}
      <div className="bg-slate-800/60 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-slate-700/50">
        <label className="block text-sm font-semibold text-slate-300 mb-2">Year</label>
        <input
          type="number"
          className="w-full border-2 border-slate-700 rounded-lg px-4 py-2.5 bg-slate-700/50 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-500"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
        />
      </div>

      {error && (
        <div className="bg-red-950/40 border-l-4 border-red-500 text-red-300 p-4 rounded-lg shadow-md backdrop-blur">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Ships List */}
      <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Select Ships for Pool</h3>
          {selectedShips.length > 0 && (
            <div className="mt-2">
              <p
                className={`text-sm font-medium ${
                  poolSum >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                Pool Sum: {poolSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e
                {poolSum >= 0 ? ' ✅ Valid' : ' ❌ Invalid (must be ≥ 0)'}
              </p>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ship ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adjusted CB (gCO₂e)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ships.map((ship) => (
                <tr
                  key={ship.shipId}
                  className={ship.selected ? 'bg-blue-50' : ''}
                  onClick={() => toggleShip(ship.shipId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={ship.selected}
                      onChange={() => toggleShip(ship.shipId)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ship.shipId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={ship.cb >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {ship.cb.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {ship.cb >= 0 ? (
                      <span className="text-green-600 font-medium">Surplus</span>
                    ) : (
                      <span className="text-red-600 font-medium">Deficit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleCreatePool}
            disabled={loading || !isValidPool}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Pool'}
          </button>
          {selectedShips.length > 0 && !isValidPool && (
            <p className="text-sm text-red-600 mt-2">
              Pool is invalid. Sum must be ≥ 0 and at least 2 ships required.
            </p>
          )}
        </div>
      </div>

      {/* Pool Result */}
      {poolResult && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pool Created Successfully</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Pool ID: <span className="font-mono font-medium">{poolResult.poolId}</span>
            </p>
            <p className="text-sm text-gray-600">
              Total CB After: {poolResult.totalCbAfter.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{' '}
              gCO₂e
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ship ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CB Before
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CB After
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {poolResult.members.map((member) => {
                  const change = member.cbAfter - member.cbBefore;
                  return (
                    <tr key={member.shipId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {member.shipId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.cbBefore.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.cbAfter.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {change >= 0 ? '+' : ''}
                          {change.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

