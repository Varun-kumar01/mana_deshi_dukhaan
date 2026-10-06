export interface ProductVariant {
  id: number;
  product_id?: number;
  title: string; // e.g. "250g", "500g", "1kg", "1 Litre"
  weight_value?: number;
  weight_unit?: string;
  sku?: string;
  price: number;
  compare_price?: number | null;
  stock_quantity: number;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  tagline?: string;
  short_description?: string;
  description: string;
  base_price: number;
  compare_at_price?: number | null;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_organic_certified?: boolean;
  shelf_life?: string;
  storage_instructions?: string;
  ingredients?: string;
  benefits?: string;
  how_to_use?: string;
  fssai_license?: string;
  rating?: number;
  review_count?: number;
  images?: string[];
  variants?: ProductVariant[];
  related?: Partial<Product>[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  display_order?: number;
  product_count?: number;
}

export interface CartItem {
  id: string; // unique item id: `${productId}-${variantId}`
  product_id: number;
  name: string;
  slug: string;
  image: string;
  variant_id: number;
  variant_title: string;
  price: number;
  quantity: number;
  category_name?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
}

export interface DeliveryPincode {
  pincode: string;
  area_name: string;
  zone: string;
  delivery_time_estimate: string;
  delivery_fee: number;
  free_delivery_above: number;
}

export interface OrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  variant_title: string;
  price: number;
  quantity: number;
  subtotal: number;
  product_image?: string;
}

export interface DeliveryAddress {
  full_name?: string;
  fullName?: string;
  phone?: string;
  flat_house?: string;
  flatHouse?: string;
  street_area?: string;
  streetArea?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: DeliveryAddress;
  delivery_zone?: string;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total_amount: number;
  coupon_code?: string;
  payment_method: 'COD' | 'UPI' | 'Razorpay' | 'WhatsApp';
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  order_status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  special_instructions?: string;
  whatsapp_order_sent?: boolean;
  created_at: string;
  items: OrderItem[];
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  statusCounts: {
    Pending: number;
    Confirmed: number;
    Packed: number;
    Shipped: number;
    Delivered: number;
    Cancelled: number;
  };
  recentOrders: Order[];
}
