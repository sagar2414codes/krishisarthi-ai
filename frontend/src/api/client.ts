import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from './types';

// Detect if running in Android emulator
const getBaseURL = (): string => {
  const hostname = window.location.hostname;
  
  // Check if we're in Android emulator
  if (hostname === '10.0.2.2' || hostname.includes('10.0.2.2')) {
    return 'http://10.0.2.2:8000';
  }
  
  // Check if we're in development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000';
  }
  
  // Production URL would go here
  return 'http://127.0.0.1:8000';
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: getBaseURL(),
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      const message = data?.detail || data?.message || `HTTP ${error.response.status} Error`;
      return {
        message,
        status: error.response.status,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'No response from server. Please check your internet connection.',
      };
    } else {
      // Request setup error
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }

  // GET request
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  // POST request
  async post<T>(url: string, data?: any, config?: { params?: Record<string, any> }): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // POST request with FormData (for file uploads)
  async postFormData<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    try {
      await this.client.get('/docs');
      return { status: 'ok' };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

export const apiClient = new ApiClient();