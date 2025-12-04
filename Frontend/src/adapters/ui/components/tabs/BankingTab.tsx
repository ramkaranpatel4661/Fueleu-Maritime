import { useEffect, useState } from 'react';
import { ApiComplianceService } from '../../../../adapters/infrastructure/ApiComplianceService';
import { ApiBankingService } from '../../../../adapters/infrastructure/ApiBankingService';
import { ComplianceBalance } from '../../../../core/domain/entities/ComplianceBalance';
import { BankingSummary, ApplyBankedResult } from '../../../../core/domain/entities/Banking';

const complianceService = new ApiComplianceService();
const bankingService = new ApiBankingService();

export default function BankingTab() {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [compliance, setCompliance] = useState<ComplianceBalance | null>(null);
  const [bankingSummary, setBankingSummary] = useState<BankingSummary | null>(null);
  const [applyResult, setApplyResult] = useState<ApplyBankedResult | null>(null);
  const [applyAmount, setApplyAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shipId && year) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cb, summary] = await Promise.all([
        complianceService.getCB(shipId, year),
        bankingService.getRecords(shipId, year),
      ]);
      setCompliance(cb);
      setBankingSummary(summary);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    try {
      setLoading(true);
      setError(null);
      await bankingService.bank(shipId, year);
      alert('✅ Surplus banked successfully!');
      await loadData();
    } catch (err) {
      setError((err as Error).message);
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    const amount = parseFloat(applyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('⚠️ Please enter a valid positive amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await bankingService.apply(shipId, year, amount);
      setApplyResult(result);
      setApplyAmount('');
      alert('✅ Banked amount applied successfully!');
      await loadData();
    } catch (err) {
      setError((err as Error).message);
      alert(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Banking</h2>
          <p className="text-slate-400 mt-2">Manage compliance balance banking operations</p>
        </div>
      </div>

      {/* Ship Selection */}
      <div className="bg-slate-800/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-700/50">
        <div className="flex items-center space-x-2 mb-5">
          <span className="text-xl">🔍</span>
          <h3 className="text-lg font-bold text-white">Select Ship</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Ship ID (Route ID)
            </label>
            <input
              type="text"
              className="w-full border-2 border-slate-700 rounded-lg px-4 py-2.5 bg-slate-700/50 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-500"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              placeholder="R001"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Year</label>
            <input
              type="number"
              className="w-full border-2 border-slate-700 rounded-lg px-4 py-2.5 bg-slate-700/50 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-500"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Loading...
                </span>
              ) : (
                'Load Data'
              )}
            </button>
          </div>
        </div>
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

      {loading && !compliance && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading compliance data...</p>
          </div>
        </div>
      )}

      {/* Compliance Balance Cards */}
      {compliance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Current CB</p>
              <span className="text-2xl">{compliance.isSurplus ? '📈' : '📉'}</span>
            </div>
            <p
              className={`text-3xl font-bold ${
                compliance.isSurplus ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {compliance.cbGco2eq.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">gCO₂e</p>
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  compliance.isSurplus
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {compliance.isSurplus ? '✅ Surplus' : '❌ Deficit'}
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">Adjusted CB</p>
              <span className="text-2xl">⚖️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {(compliance.adjustedCbGco2eq ?? compliance.cbGco2eq).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1">gCO₂e</p>
          </div>

          {bankingSummary && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Available Banked</p>
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {bankingSummary.available.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">gCO₂e</p>
            </div>
          )}
        </div>
      )}

      {/* Banking Actions */}
      {compliance && (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50 space-y-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-xl font-bold text-gray-900">Actions</h3>
          </div>

          {/* Bank Surplus */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Bank Surplus</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Bank positive compliance balance for future use
                </p>
              </div>
            </div>
            <button
              onClick={handleBank}
              disabled={loading || !compliance.isSurplus || compliance.cbGco2eq <= 0}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="mr-2">💰</span>
              Bank Surplus
            </button>
            {!compliance.isSurplus && (
              <p className="text-sm text-red-600 mt-2 font-medium">
                ⚠️ Cannot bank non-positive compliance balance
              </p>
            )}
          </div>

          {/* Apply Banked */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900">Apply Banked Amount</h4>
              <p className="text-sm text-gray-600 mt-1">
                Apply banked surplus to current compliance balance
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                placeholder="Amount to apply (gCO₂e)"
                min="0"
                step="0.01"
              />
              <button
                onClick={handleApply}
                disabled={
                  loading ||
                  !applyAmount ||
                  parseFloat(applyAmount) <= 0 ||
                  (!bankingSummary || parseFloat(applyAmount) > bankingSummary.available)
                }
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Apply
              </button>
            </div>
            {bankingSummary && (
              <p className="text-sm text-gray-500 mt-2">
                Available: <span className="font-semibold text-blue-600">{bankingSummary.available.toLocaleString()}</span> gCO₂e
              </p>
            )}
          </div>
        </div>
      )}

      {/* Apply Result */}
      {applyResult && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">✅</span>
            <h3 className="text-xl font-bold text-gray-900">Application Successful</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm font-medium text-gray-600 mb-1">CB Before</p>
              <p className="text-2xl font-bold text-gray-900">
                {applyResult.cb_before.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500">gCO₂e</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm font-medium text-gray-600 mb-1">Applied</p>
              <p className="text-2xl font-bold text-blue-600">
                +{applyResult.applied.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500">gCO₂e</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm font-medium text-gray-600 mb-1">CB After</p>
              <p className="text-2xl font-bold text-green-600">
                {applyResult.cb_after.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-500">gCO₂e</p>
            </div>
          </div>
        </div>
      )}

      {/* Banking Summary */}
      {bankingSummary && (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-200/50">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">📊</span>
            <h3 className="text-xl font-bold text-gray-900">Banking Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-700 mb-1">Total Banked</p>
              <p className="text-2xl font-bold text-blue-900">
                {bankingSummary.totalBanked.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-blue-600 mt-1">gCO₂e</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-1">Total Applied</p>
              <p className="text-2xl font-bold text-gray-900">
                {bankingSummary.totalApplied.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-600 mt-1">gCO₂e</p>
            </div>
            <div className="bg-green-50 p-5 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-700 mb-1">Available</p>
              <p className="text-2xl font-bold text-green-900">
                {bankingSummary.available.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-green-600 mt-1">gCO₂e</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
