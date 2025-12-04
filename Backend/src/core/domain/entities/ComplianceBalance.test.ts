import { ComplianceBalance } from './ComplianceBalance';

describe('ComplianceBalance', () => {
  describe('calculate', () => {
    it('should calculate CB correctly', () => {
      const targetIntensity = 89.3368; // gCO₂e/MJ
      const actualIntensity = 100; // gCO₂e/MJ
      const fuelConsumption = 100; // tonnes

      const result = ComplianceBalance.calculate(targetIntensity, actualIntensity, fuelConsumption);

      // CB = (targetIntensity - actualIntensity) * energyInScope
      // energyInScope = 100 * 41000 = 4,100,000 MJ
      // CB = (89.3368 - 100) * 4,100,000 ≈ -43,719,120 gCO₂e

      expect(result).toBeLessThan(0); // Should be negative (deficit)
      expect(result).toBeCloseTo(-43719120, -2);
    });

    it('should return positive CB for surplus', () => {
      const targetIntensity = 100;
      const actualIntensity = 80;
      const fuelConsumption = 50;

      const result = ComplianceBalance.calculate(targetIntensity, actualIntensity, fuelConsumption);

      expect(result).toBeGreaterThan(0);
    });

    it('should return zero for equal intensities', () => {
      const targetIntensity = 90;
      const actualIntensity = 90;
      const fuelConsumption = 100;

      const result = ComplianceBalance.calculate(targetIntensity, actualIntensity, fuelConsumption);

      expect(result).toBe(0);
    });
  });

  describe('create', () => {
    it('should create a ComplianceBalance instance', () => {
      const data = {
        id: 'test-id',
        shipId: 'SHIP001',
        year: 2024,
        cbGco2eq: 1000,
        adjustedCbGco2eq: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const cb = ComplianceBalance.create(data);

      expect(cb.id).toBe('test-id');
      expect(cb.shipId).toBe('SHIP001');
      expect(cb.year).toBe(2024);
      expect(cb.cbGco2eq).toBe(1000);
      expect(cb.adjustedCbGco2eq).toBe(500);
    });

    it('should handle optional adjustedCbGco2eq', () => {
      const data = {
        id: 'test-id',
        shipId: 'SHIP001',
        year: 2024,
        cbGco2eq: 1000,
      };

      const cb = ComplianceBalance.create(data as any);

      expect(cb.adjustedCbGco2eq).toBeNull();
    });
  });

  describe('getTargetIntensity', () => {
    it('should return 2025 target intensity', () => {
      const result = ComplianceBalance.getTargetIntensity(2025);

      expect(result).toBe(89.3368);
    });

    it('should return same value for different years', () => {
      const result2024 = ComplianceBalance.getTargetIntensity(2024);
      const result2025 = ComplianceBalance.getTargetIntensity(2025);

      // Currently same value, but can be customized by year
      expect(result2024).toBe(result2025);
    });
  });
});
