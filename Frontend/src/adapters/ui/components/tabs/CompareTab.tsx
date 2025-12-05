import { useEffect, useState } from 'react';
import { ApiRouteService } from '../../../../adapters/infrastructure/ApiRouteService';
import { RouteComparison } from '../../../../core/domain/entities/RouteComparison';
import { TARGET_INTENSITY } from '../../../../shared/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const routeService = new ApiRouteService();

export default function CompareTab() {
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeService.getComparison();
      setComparisons(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-500 border-r-transparent mb-4"></div>
          <p className="text-gray-400 font-medium">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  const chartData = comparisons.map((comp) => ({
    routeId: comp.comparison.routeId,
    baseline: comp.baseline.ghgIntensity,
    comparison: comp.comparison.ghgIntensity,
    target: TARGET_INTENSITY,
  }));

  const compliantCount = comparisons.filter((c) => c.compliant).length;
  const totalCount = comparisons.length;

  return (
    <div className="space-y-6 text-gray-100">


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Routes</p>
              <p className="text-3xl font-bold text-gray-100 mt-1">{totalCount}</p>
            </div>
            <div className="bg-blue-900/50 p-3 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Compliant</p>
              <p className="text-3xl font-bold text-green-500 mt-1">{compliantCount}</p>
            </div>
            <div className="bg-green-900/50 p-3 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Non-Compliant</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{totalCount - compliantCount}</p>
            </div>
            <div className="bg-red-900/50 p-3 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <div>
              <p className="font-semibold">Error loading comparison</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-xl">📈</span>
          <h3 className="text-xl font-bold text-gray-100">GHG Intensity Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis
              dataKey="routeId"
              tick={{ fill: '#d1d5db', fontWeight: 600 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <YAxis
              label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft', fill: '#d1d5db' }}
              tick={{ fill: '#d1d5db' }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#d1d5db'
              }}
              labelStyle={{ color: '#ffffff' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px', color: '#d1d5db' }} />
            <ReferenceLine
              y={TARGET_INTENSITY}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: 'Target', position: 'right', fill: '#ef4444' }}
            />
            <Bar
              dataKey="baseline"
              fill="#3b82f6"
              name="Baseline"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="comparison"
              fill="#10b981"
              name="Comparison"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border-slate-700/50 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-700 to-cyan-700">
          <h3 className="text-lg font-bold text-white">Detailed Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Route ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Baseline GHG
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Comparison GHG
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  % Difference
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {comparisons.map((comp, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-slate-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-100">
                      {comp.comparison.routeId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-400">
                      {comp.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-100">
                      {comp.comparison.ghgIntensity.toFixed(2)} gCO₂e/MJ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        comp.percentDiff > 0
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-green-900/50 text-green-300'
                      }`}
                    >
                      {comp.percentDiff > 0 ? '+' : ''}
                      {comp.percentDiff.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {comp.compliant ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-900/50 text-green-300">
                        ✅ Compliant
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-900/50 text-red-300">
                        ❌ Non-Compliant
                      </span>
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

