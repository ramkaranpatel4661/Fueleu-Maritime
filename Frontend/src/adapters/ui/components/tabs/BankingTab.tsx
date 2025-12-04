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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
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
    if (!compliance || !compliance.isSurplus) return;

    try {
      setLoading(true);
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
      alert('⚠️ Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
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
          <h2 className="text-3xl font-bold text-gray-900">Banking</h2>
          <p className="text-gray-500 mt-1">Manage compliance banking operations</p>
        </div>
      </div>

      {/* Ship Selection */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ship ID (Route ID)
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              placeholder="R001"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={loadData}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load Data"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Compliance Cards */}
      {compliance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current CB */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-600">Current CB</p>
            <p className={`text-3xl font-bold ${compliance.isSurplus ? "text-green-600" : "text-red-600"}`}>
              {compliance.cbGco2eq.toLocaleString()}
            </p>
          </div>

          {/* Adjusted CB */}
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-600">Adjusted CB</p>
            <p className="text-3xl font-bold text-gray-900">
              {(compliance.adjustedCbGco2eq ?? compliance.cbGco2eq).toLocaleString()}
            </p>
          </div>

          {/* Available Banked */}
          {bankingSummary && (
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-sm text-gray-600">Available Banked</p>
              <p className="text-3xl font-bold text-blue-600">
                {bankingSummary.available.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {compliance && (
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          {/* Bank Surplus */}
          <div>
            <h4 className="font-semibold">Bank Surplus</h4>
            <button
              onClick={handleBank}
              disabled={!compliance.isSurplus || loading}
              className="mt-2 px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              Bank Surplus
            </button>
          </div>

          {/* Apply Banked */}
          <div>
            <h4 className="font-semibold">Apply Banked Amount</h4>
            <div className="flex gap-3">
              <input
                type="number"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                className="flex-1 border rounded px-4 py-2"
                placeholder="Amount"
              />
              <button
                onClick={handleApply}
                disabled={
                  loading ||
                  !applyAmount ||
                  parseFloat(applyAmount) <= 0 ||
                  (bankingSummary && parseFloat(applyAmount) > bankingSummary.available)
                }
                className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {bankingSummary && (
              <p className="text-sm mt-1">Available: {bankingSummary.available.toLocaleString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Apply Result */}
      {applyResult && (
        <div className="bg-green-50 border border-green-300 p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Application Successful</h3>
          <p>CB Before: {applyResult.cb_before.toLocaleString()}</p>
          <p>Applied: {applyResult.applied.toLocaleString()}</p>
          <p>CB After: {applyResult.cb_after.toLocaleString()}</p>
        </div>
      )}

      {/* Banking Summary */}
      {bankingSummary && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Banking Summary</h3>
          <p>Total Banked: {bankingSummary.totalBanked.toLocaleString()}</p>
          <p>Total Applied: {bankingSummary.totalApplied.toLocaleString()}</p>
          <p>Available: {bankingSummary.available.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
