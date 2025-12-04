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
    return <div className="text-center py-8">Loading comparison data...</div>;
  }

  const chartData = comparisons.map((comp) => ({
    routeId: comp.comparison.routeId,
    baseline: comp.baseline.ghgIntensity,
    comparison: comp.comparison.ghgIntensity,
    target: TARGET_INTENSITY,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Compare Routes</h2>
      <p className="text-sm text-gray-600">
        Target Intensity: <span className="font-medium">{TARGET_INTENSITY} gCO₂e/MJ</span>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">GHG Intensity Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="routeId" />
            <YAxis label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="baseline" fill="#3b82f6" name="Baseline" />
            <Bar dataKey="comparison" fill="#10b981" name="Comparison" />
            <Bar dataKey="target" fill="#ef4444" name="Target" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Baseline GHG (gCO₂e/MJ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comparison GHG (gCO₂e/MJ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Difference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisons.map((comp, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {comp.comparison.routeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comp.baseline.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comp.comparison.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={
                        comp.percentDiff > 0 ? 'text-red-600' : 'text-green-600'
                      }
                    >
                      {comp.percentDiff > 0 ? '+' : ''}
                      {comp.percentDiff.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {comp.compliant ? (
                      <span className="text-green-600 font-bold">✅ Compliant</span>
                    ) : (
                      <span className="text-red-600 font-bold">❌ Non-Compliant</span>
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

