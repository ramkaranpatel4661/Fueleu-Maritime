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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 font-medium">Loading comparison data...</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Route Comparison</h2>
          <p className="text-gray-500 mt-1">Compare routes against baseline and target intensity</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl px-6 py-3">
          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Target Intensity</p>
            <p className="text-xl font-bold text-blue-700">{TARGET_INTENSITY} gCO₂e/MJ</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Routes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Compliant</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{compliantCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Non-Compliant</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{totalCount - compliantCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md">
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
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50">
        <div className="flex items-center space-x-2 mb-6">
          <span className="text-xl">📈</span>
          <h3 className="text-xl font-bold text-gray-900">GHG Intensity Comparison</h3>
        </div>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="routeId"
              tick={{ fill: '#6b7280', fontWeight: 600 }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <YAxis
              label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
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
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600">
          <h3 className="text-lg font-bold text-white">Detailed Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Route ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Baseline GHG
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Comparison GHG
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  % Difference
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisons.map((comp, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-blue-50/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900">
                      {comp.comparison.routeId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-blue-600">
                      {comp.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {comp.comparison.ghgIntensity.toFixed(2)} gCO₂e/MJ
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        comp.percentDiff > 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {comp.percentDiff > 0 ? '+' : ''}
                      {comp.percentDiff.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {comp.compliant ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                        ✅ Compliant
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
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
