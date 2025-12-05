import { useEffect, useState } from 'react';
import { ApiRouteService } from '../../../../adapters/infrastructure/ApiRouteService';
import { ApiComplianceService } from '../../../../adapters/infrastructure/ApiComplianceService';
import { ApiPoolService } from '../../../../adapters/infrastructure/ApiPoolService';
import { Route } from '../../../../core/domain/entities/Route';
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
    <div className="space-y-6 text-gray-100">
      {/* Year Selection */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50">
        <label className="block text-sm font-semibold text-gray-300 mb-2">Year</label>
        <input
          type="number"
          className="border-2 border-slate-600 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all bg-slate-700 text-white"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
        />
      </div>

      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 rounded-lg shadow-md">
          Error: {error}
        </div>
      )}

      {/* Ships List */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-medium text-gray-100">Select Ships for Pool</h3>
          {selectedShips.length > 0 && (
            <div className="mt-2">
              <p
                className={`text-sm font-medium ${
                  poolSum >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                Pool Sum: {poolSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e
                {poolSum >= 0 ? ' ✅ Valid' : ' ❌ Invalid (must be ≥ 0)'}
              </p>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ship ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Adjusted CB (gCO₂e)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {ships.map((ship) => (
                <tr
                  key={ship.shipId}
                  className={ship.selected ? 'bg-blue-900/50' : ''}
                  onClick={() => toggleShip(ship.shipId)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={ship.selected}
                      onChange={() => toggleShip(ship.shipId)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {ship.shipId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <span className={ship.cb >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {ship.cb.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {ship.cb >= 0 ? (
                      <span className="text-green-400 font-medium">Surplus</span>
                    ) : (
                      <span className="text-red-400 font-medium">Deficit</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleCreatePool}
            disabled={loading || !isValidPool}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Pool'}
          </button>
          {selectedShips.length > 0 && !isValidPool && (
            <p className="text-sm text-red-400 mt-2">
              Pool is invalid. Sum must be ≥ 0 and at least 2 ships required.
            </p>
          )}
        </div>
      </div>

      {/* Pool Result */}
      {poolResult && (
        <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50">
          <h3 className="text-lg font-medium text-gray-100 mb-4">Pool Created Successfully</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              Pool ID: <span className="font-mono font-medium text-gray-200">{poolResult.poolId}</span>
            </p>
            <p className="text-sm text-gray-400">
              Total CB After: {poolResult.totalCbAfter.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{' '}
              gCO₂e
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ship ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    CB Before
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    CB After
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {poolResult.members.map((member) => {
                  const change = member.cbAfter - member.cbBefore;
                  return (
                    <tr key={member.shipId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                        {member.shipId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {member.cbBefore.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {member.cbAfter.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
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
