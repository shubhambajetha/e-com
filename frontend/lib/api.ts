// API client for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface DatabaseHealthResponse {
  success: boolean;
  message: string;
  supabaseAuthMode?: string;
  warnings?: string[];
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await this.request<null>('/api/health');
    return {
      success: response.success,
      message: response.message || '',
      timestamp: response.timestamp || new Date().toISOString(),
    };
  }

  async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    const response = await this.request<null>('/api/health/db');
    return {
      success: response.success,
      message: response.message || '',
      supabaseAuthMode: (response as any).supabaseAuthMode,
      warnings: (response as any).warnings,
      timestamp: response.timestamp || new Date().toISOString(),
    };
  }

  async testConnection(): Promise<{ status: 'connected' | 'disconnected' }> {
    try {
      await this.getHealth();
      return { status: 'connected' };
    } catch {
      return { status: 'disconnected' };
    }
  }
}

export const apiClient = new ApiClient();
