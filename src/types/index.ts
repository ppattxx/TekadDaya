export interface Product {
  id: number;
  name: string;
  description: string;
  harga: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  volume?: string; 
  berat?: string; 
  isiPerPolybag?: number;
  ukuran_detail?: string;
  bahan?: string;
  fungsi?: string[];
  list_varian?: ProductVariant[];
  placeholder_gambar?: string[];
}

export interface ProductVariant {
  id: number;
  name: string;
  value: string;
  stock: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  harga: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: Address;
}

export interface Address {
  id?: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}