import axios from 'axios';
import type { Product, User, Order, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = 'https://api.belibotol.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAll: async (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get<ApiResponse<string[]>>('/products/categories');
    return response.data;
  },
  
  search: async (query: string) => {
    const response = await api.get<PaginatedResponse<Product>>(`/products/search`, {
      params: { q: query }
    });
    return response.data;
  }
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password
    });
    return response.data;
  },
  
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  }
};

export const cartAPI = {
  getCart: async () => {
    const response = await api.get<ApiResponse<any>>('/cart');
    return response.data;
  },
  
  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await api.post<ApiResponse<any>>('/cart/add', {
      product_id: productId,
      quantity
    });
    return response.data;
  },
  
  updateQuantity: async (productId: number, quantity: number) => {
    const response = await api.put<ApiResponse<any>>(`/cart/update`, {
      product_id: productId,
      quantity
    });
    return response.data;
  },
  
  removeFromCart: async (productId: number) => {
    const response = await api.delete<ApiResponse<any>>(`/cart/remove/${productId}`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete<ApiResponse<any>>('/cart/clear');
    return response.data;
  }
};

export const orderAPI = {
  createOrder: async (orderData: any) => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data;
  },
  
  getOrders: async () => {
    const response = await api.get<PaginatedResponse<Order>>('/orders');
    return response.data;
  },
  
  getOrderById: async (id: number) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  }
};

export default api;