import { useState, useEffect } from 'react';
import { mockProducts, mockCategories, mockApiResponse } from '../services/mockData';

export function useProducts(params?: { page?: number; limit?: number; category?: string; search?: string }) {
  const [data, setData] = useState(mockApiResponse.products);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filteredProducts = mockProducts;
      
      if (params?.category) {
        filteredProducts = filteredProducts.filter(p => p.category === params.category);
      }
      
      if (params?.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(params.search!.toLowerCase())
        );
      }

      const limit = params?.limit || 20;
      const page = params?.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      setData({
        data: filteredProducts.slice(startIndex, endIndex),
        pagination: {
          page,
          per_page: limit,
          total: filteredProducts.length,
          total_pages: Math.ceil(filteredProducts.length / limit)
        },
        filters: mockApiResponse.products.filters
      });
      
      setIsLoading(false);
    }, 100);
  }, [params?.page, params?.limit, params?.category, params?.search]);

  return { data, isLoading, error: null };
}

export function useProduct(id: number) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const product = mockProducts.find(p => p.id === id);
    setTimeout(() => {
      setData(product || null);
      setIsLoading(false);
    }, 100);
  }, [id]);

  return { data, isLoading, error: null };
}

export function useCategories() {
  const data = mockCategories;
  const isLoading = false;

  return { data, isLoading, error: null };
}

export function useLogin() {
  return {
    mutate: (credentials: any) => {
      console.log('Login:', credentials);
      localStorage.setItem('auth_token', 'mock_token');
    },
    isPending: false,
    error: null
  };
}

export function useRegister() {
  return {
    mutate: (userData: any) => {
      console.log('Register:', userData);
    },
    isPending: false,
    error: null
  };
}

export function useAddToCart() {
  return {
    mutate: (params: { productId: number; quantity: number }) => {
      console.log('Add to cart:', params);
    },
    isPending: false,
    error: null
  };
}

export function useUpdateCartItem() {
  return {
    mutate: (params: { id: number; quantity: number }) => {
      console.log('Update cart item:', params);
    },
    isPending: false,
    error: null
  };
}

export function useRemoveFromCart() {
  return {
    mutate: (id: number) => {
      console.log('Remove from cart:', id);
    },
    isPending: false,
    error: null
  };
}

export function useClearCart() {
  return {
    mutate: () => {
      console.log('Clear cart');
    },
    isPending: false,
    error: null
  };
}