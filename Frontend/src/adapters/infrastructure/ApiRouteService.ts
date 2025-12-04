import axios from 'axios';
import { RouteService, RouteFilters } from '../../core/ports/RouteService';
import { Route } from '../../core/domain/entities/Route';

const API_BASE_URL = '/api';

export class ApiRouteService implements RouteService {
  async getAll(filters?: RouteFilters): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters?.vesselType) params.append('vesselType', filters.vesselType);
    if (filters?.fuelType) params.append('fuelType', filters.fuelType);
    if (filters?.year) params.append('year', filters.year.toString());

    const response = await axios.get<Route[]>(`${API_BASE_URL}/routes?${params.toString()}`);
    return response.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await axios.post<Route>(`${API_BASE_URL}/routes/${routeId}/baseline`);
    return response.data;
  }

  async getComparison(): Promise<any[]> {
    const response = await axios.get<any[]>(`${API_BASE_URL}/routes/comparison`);
    return response.data;
  }
}

