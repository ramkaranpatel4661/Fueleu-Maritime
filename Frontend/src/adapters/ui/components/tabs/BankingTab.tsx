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
    loadData();
  }, [shipId, year]);

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
      alert('Surplus banked successfully!');
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
      alert('Please enter a valid positive amount');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await bankingService.apply(shipId, year, amount);
      setApplyResult(result);
      setApplyAmount('');
      alert('Banked amount applied successfully!');
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
      <h2 className="text-xl font-semibold text-gray-900">Banking</h2>

      {/* Ship Selection */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ship ID (Route ID)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              placeholder="R001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
            />
          </div>
        </div>
        <button
          onClick={loadData}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {/* Compliance Balance */}
      {compliance && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Balance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Current CB</p>
              <p
                className={`text-2xl font-bold ${
                  compliance.isSurplus ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {compliance.cbGco2eq.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {compliance.isSurplus ? 'Surplus' : 'Deficit'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Adjusted CB</p>
              <p className="text-2xl font-bold text-gray-900">
                {(compliance.adjustedCbGco2eq ?? compliance.cbGco2eq).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
            </div>
            {bankingSummary && (
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Available Banked</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bankingSummary.available.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  gCO₂e
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banking Actions */}
      {compliance && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Actions</h3>

          {/* Bank Surplus */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-700 mb-2">Bank Surplus</h4>
            <p className="text-sm text-gray-600 mb-3">
              Bank positive compliance balance for future use.
            </p>
            <button
              onClick={handleBank}
              disabled={loading || !compliance.isSurplus || compliance.cbGco2eq <= 0}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Bank Surplus
            </button>
            {!compliance.isSurplus && (
              <p className="text-sm text-red-600 mt-2">
                Cannot bank non-positive compliance balance
              </p>
            )}
          </div>

          {/* Apply Banked */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Apply Banked Amount</h4>
            <p className="text-sm text-gray-600 mb-3">
              Apply banked surplus to current compliance balance.
            </p>
            <div className="flex gap-4">
              <input
                type="number"
                className="border border-gray-300 rounded-md px-3 py-2 flex-1"
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
                  (bankingSummary && parseFloat(applyAmount) > bankingSummary.available)
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
            {bankingSummary && (
              <p className="text-sm text-gray-500 mt-2">
                Available: {bankingSummary.available.toLocaleString()} gCO₂e
              </p>
            )}
          </div>
        </div>
      )}

      {/* Apply Result */}
      {applyResult && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Application Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">CB Before</p>
              <p className="text-xl font-bold text-gray-900">
                {applyResult.cb_before.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Applied</p>
              <p className="text-xl font-bold text-blue-600">
                {applyResult.applied.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">CB After</p>
              <p className="text-xl font-bold text-green-600">
                {applyResult.cb_after.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Banking Summary */}
      {bankingSummary && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Banked</p>
              <p className="text-xl font-bold text-gray-900">
                {bankingSummary.totalBanked.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Total Applied</p>
              <p className="text-xl font-bold text-gray-900">
                {bankingSummary.totalApplied.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-xl font-bold text-blue-600">
                {bankingSummary.available.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{' '}
                gCO₂e
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

