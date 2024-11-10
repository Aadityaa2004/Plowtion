// services/api.ts
import axios, { AxiosError } from 'axios';
import { 
  SoilData, 
  PredictionResult, 
  UserData, 
  ApiError, 
  ApiResponse,
  AuthResponse 
} from './types';

class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
    // Also set the token in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.getToken() && { Authorization: `Bearer ${this.getToken()}` }),
    };
  }

  async registerUser(userData: UserData): Promise<AuthResponse> {
    try {
      const response = await axios.post<ApiResponse<AuthResponse>>(
        `${this.baseUrl}/push-user`,
        userData,
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSoilData(zipCode: string): Promise<SoilData> {
    try {
      const response = await axios.get<ApiResponse<SoilData>>(
        `${this.baseUrl}/get-soil-by-zip/${zipCode}`,
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPrediction(data: {
    N: number;
    P: number;
    K: number;
    ph: number;
    [key: string]: number;
  }): Promise<PredictionResult> {
    try {
      const response = await axios.get<ApiResponse<PredictionResult>>(
        `${this.baseUrl}/predict-conditions`,
        { 
          headers: this.getHeaders(),
          data
        }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.data) {
        return new Error(axiosError.response.data.error || 'An error occurred');
      }
      return new Error(axiosError.message);
    }
    return new Error('Network error occurred');
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Also export the class for testing purposes
export default ApiService;