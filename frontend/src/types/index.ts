export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  status?: 'active' | 'hidden';
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  category_name?: string;
  description: string;
  price: number;
  discount_price?: number;
  fabric?: string;
  color?: string;
  size?: string;
  stock: number;
  status: 'active' | 'out_of_stock' | 'hidden';
  featured: number;
  new_arrival: number;
  image_url: string;
  created_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: number;
}

export interface Inquiry {
  id: number;
  customer_id?: number;
  product_id?: number;
  product_name?: string;
  product_image?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}

export interface GalleryItem {
  id: number;
  image_url: string;
  title: string;
  description?: string;
  category?: string;
  created_at?: string;
}

export interface Offer {
  id: number;
  title: string;
  description?: string;
  discount_tag?: string;
  image?: string;
  status: 'active' | 'inactive';
  valid_until?: string;
}

export interface SiteSettings {
  business_name: string;
  business_type: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  business_hours: string;
  instagram_url: string;
  facebook_url: string;
  google_maps_embed: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  newInquiries: number;
  totalInquiries: number;
  customerAccounts: number;
  lowStockProducts: number;
}
