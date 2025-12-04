import axios from 'axios';
import { BankingService } from '../../core/ports/BankingService';
import { BankingSummary, ApplyBankedResult } from '../../core/domain/entities/Banking';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export class ApiBankingService implements BankingService {
  async getRecords(shipId: string, year: number): Promise<BankingSummary> {
    const response = await axios.get<BankingSummary>(
      `${API_BASE_URL}/banking/records?shipId=${shipId}&year=${year}`
    );
    return response.data;
  }

  async bank(shipId: string, year: number): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/banking/bank`, {
      shipId,
      year,
    });
    return response.data;
  }

  async apply(shipId: string, year: number, amount: number): Promise<ApplyBankedResult> {
    const response = await axios.post<ApplyBankedResult>(`${API_BASE_URL}/banking/apply`, {
      shipId,
      year,
      amount,
    });
    return response.data;
  }
}

