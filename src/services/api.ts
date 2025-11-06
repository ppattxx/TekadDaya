import axios from 'axios';
import type { Product, User, Order, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.DEV ? '/api/v1' : 'https://api.belibotol.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const normalizeProduct = (product: any): Product => {
  if (!product) {
    return {} as Product;
  }

  const getFirstNonEmpty = (...values: any[]): string => {
    for (const val of values) {
      if (val && typeof val === 'string' && val.trim() !== '') {
        return val.trim();
      }
    }
    return '';
  };

  return {
    ...product,
    id: product.id,
    name: getFirstNonEmpty(product.name, product.product_name, product.title),
    description: getFirstNonEmpty(
      product.description, 
      product.long_description,
      product.short_description,
      product.detail,
      product.product_description,
      'Deskripsi produk tidak tersedia.'
    ),
    category: product.category || product.category_name || product.category_id || '',
    category_id: product.category_id || product.category?.id || null,
    category_name: product.category_name || product.category || '',
    harga: product.harga || 
           product.price || 
           product.current_price || 
           product.selling_price ||
           (product.discount_price ? parseFloat(product.discount_price) : 0) ||
           0,
    image: product.image || 
           product.primary_image || 
           product.thumbnail || 
           product.image_url ||
           product.featured_image ||
           (product.images && product.images.length > 0 ? product.images[0] : ''),
    stock: product.stock !== undefined ? product.stock : (product.is_in_stock ? 100 : 0),
    rating: product.rating || product.average_rating || 0,
    reviews: product.reviews || product.review_count || product.total_reviews || 0,
  };
};

const normalizeProducts = (products: any[]): Product[] => {
  if (!Array.isArray(products)) {
    return [];
  }
  return products.map(normalizeProduct);
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAll: async (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    try {
      const apiParams: any = {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      };
      
      const response = await api.get<PaginatedResponse<Product>>('/products/', { params: apiParams });
      const data = response.data;
      
      if (data.status === 'success' && data.data) {
        let products: Product[] = [];
        
        if (Array.isArray(data.data)) {
          products = normalizeProducts(data.data);
        } else if ((data.data as any).products && Array.isArray((data.data as any).products)) {
          products = normalizeProducts((data.data as any).products);
        } else if ((data.data as any).results && Array.isArray((data.data as any).results)) {
          products = normalizeProducts((data.data as any).results);
        }
        
        if (params?.category && products.length > 0) {
          const filterCategory = params.category.toLowerCase().replace(/[-_]/g, ' ').trim();
          
          products = products.filter((product: Product) => {
            const productCategoryName = ((product as any).category_name || product.category || '').toLowerCase().replace(/[-_]/g, ' ').trim();
            
            if (!productCategoryName) return false;
            
            const exactMatch = productCategoryName === filterCategory;
            const containsMatch = productCategoryName.includes(filterCategory) || filterCategory.includes(productCategoryName);
            
            const filterWords = filterCategory.split(/\s+/).filter((w: string) => w.length > 1);
            const categoryWords = productCategoryName.split(/\s+/).filter((w: string) => w.length > 1);
            const allWordsMatch = filterWords.length > 0 && 
                                 filterWords.every((fw: string) => 
                                   categoryWords.some((cw: string) => 
                                     cw.includes(fw) || fw.includes(cw)
                                   )
                                 );
            
            const anyWordMatch = filterWords.length > 0 &&
                                categoryWords.length > 0 &&
                                filterWords.some((fw: string) => 
                                  categoryWords.some((cw: string) => 
                                    (fw.length > 2 && cw.includes(fw)) || 
                                    (cw.length > 2 && fw.includes(cw))
                                  )
                                );
            
            return exactMatch || containsMatch || allWordsMatch || anyWordMatch;
          });
        }
        
        if (Array.isArray(data.data)) {
          data.data = products;
        } else if ((data.data as any).products) {
          (data.data as any).products = products;
        }
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching products:', error.response?.data);
      throw error;
    }
  },
  
  getById: async (id: number | string) => {
    try {
      try {
        const response = await api.get<ApiResponse<Product>>(`/products/${id}/`);
        const data = response.data;
        
        if (data.status === 'success' && data.data) {
          if (Array.isArray(data.data)) {
            data.data = normalizeProduct(data.data[0]);
          } else {
            data.data = normalizeProduct(data.data);
          }
          return data;
        }
      } catch (directError: any) {
      }
      
      const allProductsResponse = await api.get<PaginatedResponse<Product>>('/products/');
      const allData = allProductsResponse.data;
      
      let products: Product[] = [];
      if (Array.isArray(allData.data)) {
        products = normalizeProducts(allData.data);
      } else if ((allData.data as any).products && Array.isArray((allData.data as any).products)) {
        products = normalizeProducts((allData.data as any).products);
      } else if ((allData.data as any).results && Array.isArray((allData.data as any).results)) {
        products = normalizeProducts((allData.data as any).results);
      }
      
      const product = products.find(p => p.id?.toString() === id?.toString());
      
      if (product) {
        return {
          status: 'success',
          data: product,
          message: 'Product found'
        } as ApiResponse<Product>;
      }
      
      return {
        status: 'error',
        data: {} as Product,
        message: 'Product not found'
      } as ApiResponse<Product>;
      
    } catch (error: any) {
      console.error('Error fetching product:', error);
      return {
        status: 'error',
        data: {} as Product,
        message: error.message || 'Error fetching product'
      } as ApiResponse<Product>;
    }
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}/`);
    const data = response.data;
    
    if (data.data) {
      data.data = normalizeProduct(data.data);
    }
    
    return data;
  },
  
  getCategories: async () => {
    const response = await api.get<ApiResponse<string[]>>('/categories/');
    return response.data;
  },
  
  getCategoryProducts: async (slug: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Product>>(`/categories/${slug}/products/`, { params });
    return response.data;
  },
  
  getFeatured: async () => {
    const response = await api.get<PaginatedResponse<Product>>('/products/featured/');
    return response.data;
  },
  
  search: async (query: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Product>>(`/products/`, {
      params: { search: query, ...params }
    });
    return response.data;
  },
  
  create: async (productData: Partial<Product>) => {
    const response = await api.post<ApiResponse<Product>>('/products/', productData);
    return response.data;
  },
  
  update: async (id: number | string, productData: Partial<Product>) => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}/`, productData);
    return response.data;
  },
  
  delete: async (id: number | string) => {
    const response = await api.delete<ApiResponse<null>>(`/products/${id}/`);
    return response.data;
  }
};

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login/', {
        username: credentials.email,
        email: credentials.email,
        password: credentials.password
      });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      throw error;
    }
  },
  
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register/', {
      username: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirm: userData.password
    });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/auth/profile/', userData);
    return response.data;
  }
};

export const cartAPI = {
  getCart: async () => {
    const response = await api.get<ApiResponse<any>>('/cart/');
    return response.data;
  },
  
  addToCart: async (productId: number, quantity: number = 1) => {
    const response = await api.post<ApiResponse<any>>('/cart/add/', {
      product_id: productId,
      quantity
    });
    return response.data;
  },
  
  updateQuantity: async (productId: number, quantity: number) => {
    const response = await api.put<ApiResponse<any>>(`/cart/update/`, {
      product_id: productId,
      quantity
    });
    return response.data;
  },
  
  removeFromCart: async (productId: number) => {
    const response = await api.delete<ApiResponse<any>>(`/cart/remove/${productId}/`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete<ApiResponse<any>>('/cart/clear/');
    return response.data;
  }
};

export const orderAPI = {
  createOrder: async (orderData: any) => {
    const response = await api.post<ApiResponse<Order>>('/orders/', orderData);
    return response.data;
  },
  
  getOrders: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Order>>('/orders/', { params });
    return response.data;
  },
  
  getOrderById: async (id: number) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}/`);
    return response.data;
  },
  
  updateOrderStatus: async (id: number, status: string) => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/`, { status });
    return response.data;
  },
  
  cancelOrder: async (id: number) => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel/`);
    return response.data;
  }
};

export const categoryAPI = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any>>('/categories/');
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<any>>(`/categories/${slug}/`);
    return response.data;
  },
  
  getProducts: async (slug: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Product>>(`/categories/${slug}/products/`, { params });
    return response.data;
  }
};

export default api;