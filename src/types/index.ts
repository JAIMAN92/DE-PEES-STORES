export interface ProductImage {
  id: string;
  url: string;
  is_primary?: boolean;
  alt_text?: string;
}

export interface ProductVideo {
  id: string;
  url: string;
  title?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name: string;
  description: string;
  price: number;
  original_price?: number;
  images: ProductImage[];
  videos?: ProductVideo[];
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  is_featured: boolean;
  is_published: boolean;
  is_latest?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  item_count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  city: string;
  state: string;
  order_notes?: string;
  payment_method: 'whatsapp' | 'bank_transfer' | 'paystack';
  payment_status: 'unpaid' | 'paid' | 'verified';
  order_status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'replied';
}

export interface SiteSettings {
  business_name: string;
  location: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_display: string;
  email: string;
  instagram: string;
  facebook: string;
  hero_headline: string;
  hero_supporting_text: string;
  promotional_banner: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_sort_code?: string;
  delivery_fee_ph: number;
  delivery_fee_nationwide: number;
  free_delivery_threshold: number;
  paystack_public_key: string;
  supabase_url?: string;
  supabase_anon_key?: string;
}

export type PageView = 'home' | 'about' | 'vision' | 'shop' | 'contact' | 'checkout' | 'admin' | 'admin-login';
