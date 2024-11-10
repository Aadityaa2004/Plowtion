// services/types.ts
export interface SoilData {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
  }
  
  export interface PredictionResult {
    temperature: number;
    humidity: number;
    rainfall: number;
    input_conditions: {
      N: number;
      P: number;
      K: number;
      ph: number;
    };
  }
  
  export interface UserData {
    email: string;
    name?: string;
    image?: string;
  }
  
  export interface ApiResponse<T> {
    data: T;
    status: string;
  }
  
  export interface ApiError {
    error: string;
    status: string;
  }
  
  export interface AuthResponse {
    token: string;
    user_id: string;
  }