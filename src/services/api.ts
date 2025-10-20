import { auth } from '@/integrations/firebase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function getAuthToken(): Promise<string | null> {
  if (!auth || !auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<{ data?: T; error?: any }> {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();
    
    if (!response.ok) return { error: data };
    return { data };
  } catch (error) {
    console.error('API request error:', error);
    return { error: { message: 'Network error. Please check your connection.' } };
  }
}

export const authAPI = {
  async getProfile() {
    return apiRequest('/auth/me');
  },
  async updateProfile(data: any) {
    return apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteAccount() {
    return apiRequest('/auth/account', { method: 'DELETE' });
  },
};

export const issuesAPI = {
  async getAll(params?: any) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/issues?${query}`);
  },
  async getById(id: string) {
    return apiRequest(`/issues/${id}`);
  },
  async create(data: any) {
    return apiRequest('/issues', { method: 'POST', body: JSON.stringify(data) });
  },
  async update(id: string, data: any) {
    return apiRequest(`/issues/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async delete(id: string) {
    return apiRequest(`/issues/${id}`, { method: 'DELETE' });
  },
};

export const usersAPI = {
  async getAll(params?: any) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/users?${query}`);
  },
};

export const propertiesAPI = {
  async getAll(params?: any) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/properties?${query}`);
  },
};

export const paymentsAPI = {
  async getAll(params?: any) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/payments?${query}`);
  },
  async create(paymentData: any) {
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  async getOne(id: string) {
    return apiRequest(`/payments/${id}`);
  },
  async update(id: string, updateData: any) {
    return apiRequest(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
  async delete(id: string) {
    return apiRequest(`/payments/${id}`, {
      method: 'DELETE',
    });
  },
};

export default { auth: authAPI, issues: issuesAPI, users: usersAPI, properties: propertiesAPI, payments: paymentsAPI };

