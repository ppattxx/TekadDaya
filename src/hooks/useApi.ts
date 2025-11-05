import { useState, useEffect } from 'react';
import { productAPI, cartAPI, categoryAPI } from '../services/api';
import type { Product } from '../types';

export function useProducts(params?: { page?: number; limit?: number; category?: string; search?: string }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productAPI.getAll(params);
        
        if (isMounted) {
          setData(response);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal memuat produk');
          console.error('Error fetching products:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [params?.page, params?.limit, params?.category, params?.search]);

  return { data, isLoading, error };
}

export function useProduct(id: number | string) {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productAPI.getById(id);
        
        if (isMounted) {
          setData(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal memuat detail produk');
          console.error('Error fetching product:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, isLoading, error };
}

export function useCategories() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await categoryAPI.getAll();
        
        if (isMounted) {
          setData(response.data || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal memuat kategori');
          console.error('Error fetching categories:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

export function useFeaturedProducts() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productAPI.getFeatured();
        
        if (isMounted) {
          setData(response);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Gagal memuat produk unggulan');
          console.error('Error fetching featured products:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

export function useCart() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat keranjang');
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, isLoading, error, refetch };
}

export function useAddToCart() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (productId: number, quantity: number = 1) => {
    try {
      setIsPending(true);
      setError(null);
      await cartAPI.addToCart(productId, quantity);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menambahkan ke keranjang');
      console.error('Error adding to cart:', err);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}

export function useUpdateCartItem() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (productId: number, quantity: number) => {
    try {
      setIsPending(true);
      setError(null);
      await cartAPI.updateQuantity(productId, quantity);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal update keranjang');
      console.error('Error updating cart:', err);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}

export function useRemoveFromCart() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (productId: number) => {
    try {
      setIsPending(true);
      setError(null);
      await cartAPI.removeFromCart(productId);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus dari keranjang');
      console.error('Error removing from cart:', err);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}

export function useClearCart() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async () => {
    try {
      setIsPending(true);
      setError(null);
      await cartAPI.clearCart();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengosongkan keranjang');
      console.error('Error clearing cart:', err);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, error };
}