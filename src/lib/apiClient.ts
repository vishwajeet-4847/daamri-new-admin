// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.daamrideals.com';

class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const headers = new Headers(options.headers || {});

  // Only set Content-Type to application/json if it's not FormData
  if (!(options.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Check if unauthorized and try refresh (simplified)
    if (response.status === 401 || response.status === 403) {
      // In a full implementation, we'd call the refresh endpoint here and retry
      // For now, if we hit 401, we might clear auth state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-error'));
      throw new ApiError('Unauthorized', response.status, null);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'API Error', response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: any, options?: RequestInit) => request<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data)
  }),
  put: <T>(endpoint: string, data?: any, options?: RequestInit) => request<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data)
  }),
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) => request<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: data instanceof FormData ? data : JSON.stringify(data)
  }),
 delete: <T>(endpoint: string, options?: RequestInit & { data?: any }) =>
  request<T>(endpoint, {
    ...options,
    method: 'DELETE',
    body: options?.data ? JSON.stringify(options.data) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
};
