-- ========================================================
-- ManaDeshi Dukaan by Swathi - PostgreSQL Database Schema
-- Natural and Organic Foods eCommerce Platform
-- Manikonda, Hyderabad
-- ========================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customer Delivery Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    flat_house VARCHAR(255) NOT NULL,
    street_area VARCHAR(255) NOT NULL,
    landmark VARCHAR(255),
    city VARCHAR(100) DEFAULT 'Hyderabad',
    state VARCHAR(100) DEFAULT 'Telangana',
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    tagline VARCHAR(255),
    short_description TEXT,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_organic_certified BOOLEAN DEFAULT true,
    shelf_life VARCHAR(100),
    storage_instructions TEXT,
    ingredients TEXT,
    benefits TEXT,
    how_to_use TEXT,
    nutritional_info JSONB,
    fssai_license VARCHAR(100) DEFAULT 'FSSAI Lic: 23621028000492',
    rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Product Variants (Weight/Size: 250g, 500g, 1kg, 1L, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, -- e.g. "250g", "500g", "1kg", "1 Litre"
    weight_value DECIMAL(8, 2),
    weight_unit VARCHAR(20) DEFAULT 'g', -- g, kg, ml, L, pieces
    sku VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    compare_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 100,
    is_available BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0
);

-- 7. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255),
    discount_type VARCHAR(20) DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Delivery Pincodes Table (Hyderabad Local & Pan-India)
CREATE TABLE IF NOT EXISTS delivery_pincodes (
    id SERIAL PRIMARY KEY,
    pincode VARCHAR(10) UNIQUE NOT NULL,
    area_name VARCHAR(150) NOT NULL,
    zone VARCHAR(50) DEFAULT 'Hyderabad Express', -- 'Hyderabad Express', 'Hyderabad Standard', 'Pan India'
    delivery_time_estimate VARCHAR(100) DEFAULT '2-4 Hours',
    delivery_fee DECIMAL(10, 2) DEFAULT 40.00,
    free_delivery_above DECIMAL(10, 2) DEFAULT 499.00,
    is_active BOOLEAN DEFAULT true
);

-- 9. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    delivery_address JSONB NOT NULL,
    delivery_zone VARCHAR(50),
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    coupon_code VARCHAR(50),
    payment_method VARCHAR(50) DEFAULT 'COD' CHECK (payment_method IN ('COD', 'UPI', 'Razorpay', 'WhatsApp')),
    payment_status VARCHAR(50) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    order_status VARCHAR(50) DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
    special_instructions TEXT,
    whatsapp_order_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    variant_id INT REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    variant_title VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    product_image TEXT
);

-- 11. Customer Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    location VARCHAR(100) DEFAULT 'Hyderabad',
    verified_buyer BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_pincodes_code ON delivery_pincodes(pincode);
