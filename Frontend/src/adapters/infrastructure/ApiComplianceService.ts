import axios from 'axios';
import { ComplianceService } from '../../core/ports/ComplianceService';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../core/domain/entities/ComplianceBalance';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiComplianceService implements ComplianceService {
  async getCB(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await axios.get<ComplianceBalance>(
      `${API_BASE_URL}/compliance/cb?shipId=${shipId}&year=${year}`
    );
    return response.data;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    const response = await axios.get<AdjustedComplianceBalance>(
      `${API_BASE_URL}/compliance/adjusted-cb?shipId=${shipId}&year=${year}`
    );
    return response.data;
  }
}

