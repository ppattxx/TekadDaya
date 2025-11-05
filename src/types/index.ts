export interface Product {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  short_description?: string;
  category?: string;
  category_name?: string;
  harga?: number; 
  price?: string | number; 
  discount_price?: string | number | null;
  current_price?: number;
  image?: string;
  primary_image?: string | null;
  stock?: number;
  is_in_stock?: boolean;
  status?: string;
  is_featured?: boolean;
  rating?: number;
  reviews?: number;
  volume?: string; 
  berat?: string; 
  isiPerPolybag?: number;
  ukuran_detail?: string;
  bahan?: string;
  fungsi?: string[];
  list_varian?: ProductVariant[];
  placeholder_gambar?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id: number;
  name: string;
  value: string;
  stock: number;
}

export interface Category {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  product_count?: number;
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
  status?: string;
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  status?: string;
  data: T[] | { products?: T[]; pagination?: PaginationInfo };
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  count?: number;
  next?: string | null;
  previous?: string | null;
  current_page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
}