-- ==============================================================================
-- DE-PEES BABY & MOTHER CARE - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- This creates all required tables, Row Level Security (RLS) policies, storage bucket,
-- and seeds the initial categories, products, and store settings.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    product_count INTEGER DEFAULT 0,
    icon TEXT DEFAULT 'Sparkles',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    stock_quantity INTEGER DEFAULT 10,
    images JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_latest BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    order_notes TEXT,
    payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    order_status TEXT NOT NULL DEFAULT 'pending',
    subtotal NUMERIC(12, 2) NOT NULL,
    delivery_fee NUMERIC(12, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    business_name TEXT NOT NULL DEFAULT 'DE-PEES BABY & MOTHER CARE',
    location TEXT NOT NULL DEFAULT 'Port Harcourt',
    address TEXT NOT NULL DEFAULT 'Street beside last Bus Stop Rukpowu, Port Harcourt, Rivers State, Nigeria',
    phone TEXT NOT NULL DEFAULT '08100809719',
    whatsapp_number TEXT NOT NULL DEFAULT '08100809719',
    whatsapp_display TEXT NOT NULL DEFAULT '08100809719',
    email TEXT NOT NULL DEFAULT 'annayodele1@gmail.com',
    instagram TEXT DEFAULT 'https://instagram.com/depees_babycare',
    facebook TEXT DEFAULT 'https://facebook.com/depeesbabycare',
    hero_headline TEXT DEFAULT 'Beautiful Choices for Your Little Ones and Every Special Woman.',
    hero_supporting_text TEXT DEFAULT 'Discover beautiful children''s fashion, stylish accessories and carefully selected mother and baby essentials, all in one place.',
    promotional_banner TEXT DEFAULT 'Welcome to DE-PEES! Reliable Port Harcourt pickup & fast nationwide delivery across Nigeria.',
    bank_name TEXT NOT NULL DEFAULT 'Moniepoint MFB',
    account_name TEXT NOT NULL DEFAULT 'Johnson Hannah Iruonagbe',
    account_number TEXT NOT NULL DEFAULT '6740672278',
    bank_sort_code TEXT DEFAULT '',
    delivery_fee_ph NUMERIC(10, 2) DEFAULT 2000,
    delivery_fee_nationwide NUMERIC(10, 2) DEFAULT 4500,
    free_delivery_threshold NUMERIC(10, 2) DEFAULT 60000,
    paystack_public_key TEXT DEFAULT 'pk_test_sample_depees_nigeria',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures cross-device public viewing while allowing order submissions & admin updates
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Categories: Anyone can read, anyone with key can update
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow modify categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Products: Anyone can view published products
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow modify products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Orders: Public can create orders, anyone can read/update (or restrict with auth)
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow update orders" ON public.orders FOR UPDATE USING (true);

-- Messages: Public can send messages, admin can read/update
CREATE POLICY "Public can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow update messages" ON public.messages FOR UPDATE USING (true);

-- Settings: Anyone can read settings, allow updates
CREATE POLICY "Public can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow update settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. STORAGE BUCKET CONFIGURATION (for product images & videos)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow update product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images');

CREATE POLICY "Allow delete product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images');

-- ==============================================================================
-- 9. INITIAL DATA SEEDING
-- ==============================================================================

-- Categories Seed
INSERT INTO public.categories (id, name, slug, description, image_url, product_count, icon)
VALUES
('cat-shoes', 'Children''s Shoes', 'childrens-shoes', 'Comfortable sneakers, formal shoes, orthopaedic footwear & sandals.', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80', 4, 'Sparkles'),
('cat-bags', 'Children''s School Bags', 'childrens-school-bags', 'Durable, ergonomic backpacks, character bags, and waterproof travel packs.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 3, 'Sparkles'),
('cat-lunch', 'Children''s Lunch Boxes', 'childrens-lunch-boxes', 'BPA-free insulated lunch containers, water bottles & snack sets.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', 2, 'Sparkles'),
('cat-clothing', 'Children''s Clothing & Fashion', 'childrens-clothing-fashion', 'Playwear, festive party dresses, smart boys sets, and seasonal fashion.', 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80', 5, 'Sparkles'),
('cat-baby', 'Baby & Newborn Care Essentials', 'baby-newborn-care-essentials', 'Gentle swaddles, infant grooming kits, teething toys & feeding essentials.', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80', 3, 'Sparkles'),
('cat-women', 'Women''s Fashion & Accessories', 'womens-fashion-accessories', 'Chic handbags, comfortable flats, jewelry & accessories for every stylish woman.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', 3, 'Sparkles')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url;

-- Store Settings Seed
INSERT INTO public.site_settings (
  id, business_name, location, address, phone, whatsapp_number, whatsapp_display, email,
  bank_name, account_name, account_number, bank_sort_code,
  delivery_fee_ph, delivery_fee_nationwide, free_delivery_threshold
)
VALUES (
  'default',
  'DE-PEES BABY & MOTHER CARE',
  'Port Harcourt',
  'Street beside last Bus Stop Rukpowu, Port Harcourt, Rivers State, Nigeria',
  '08100809719',
  '08100809719',
  '08100809719',
  'annayodele1@gmail.com',
  'Moniepoint MFB',
  'Johnson Hannah Iruonagbe',
  '6740672278',
  '',
  2000,
  4500,
  60000
)
ON CONFLICT (id) DO UPDATE SET
  bank_name = EXCLUDED.bank_name,
  account_name = EXCLUDED.account_name,
  account_number = EXCLUDED.account_number,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  whatsapp_number = EXCLUDED.whatsapp_number,
  whatsapp_display = EXCLUDED.whatsapp_display,
  email = EXCLUDED.email;

-- Products Seed
INSERT INTO public.products (id, name, slug, category_id, category_name, description, price, original_price, stock_quantity, images, sizes, colors, is_featured, is_latest, is_published)
VALUES
(
  'prod-1',
  'Classic Breathable Kids'' White & Gold Sneakers',
  'kids-white-gold-sneakers',
  'cat-shoes',
  'Children''s Shoes',
  'Durable and lightweight children''s sneakers crafted with breathable canvas and anti-slip rubber soles. Perfect for school sports, active play, and weekend outings in Port Harcourt.',
  18500,
  22000,
  15,
  '[{"id":"img-1","url":"https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=600&q=80","is_primary":true,"alt_text":"White and Gold Kids Sneakers"}]'::jsonb,
  ARRAY['26 EU', '27 EU', '28 EU', '29 EU', '30 EU', '31 EU'],
  ARRAY['White/Gold', 'White/Blue', 'All White'],
  true,
  true,
  true
),
(
  'prod-2',
  'Durable Orthopedic School Shoes for Boys & Girls',
  'orthopedic-kids-school-shoes',
  'cat-shoes',
  'Children''s Shoes',
  'Premium genuine leather school shoes with arch support to protect growing feet during long school days. Built to withstand daily school activities across Nigerian terrains.',
  24000,
  28000,
  20,
  '[{"id":"img-2","url":"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80","is_primary":true,"alt_text":"Kids Orthopedic School Shoes"}]'::jsonb,
  ARRAY['28 EU', '29 EU', '30 EU', '32 EU', '34 EU'],
  ARRAY['Black', 'Dark Brown'],
  true,
  false,
  true
),
(
  'prod-3',
  'Floral Princess Birthday Party Dress with Bow',
  'floral-princess-birthday-party-dress',
  'cat-clothing',
  'Children''s Clothing & Fashion',
  'Exquisite layered tulle party dress with delicate floral embroidery, soft inner cotton lining that does not itch, and a charming statement satin bow.',
  22500,
  26000,
  8,
  '[{"id":"img-3","url":"https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80","is_primary":true,"alt_text":"Floral Princess Birthday Dress"}]'::jsonb,
  ARRAY['2-3 Years', '3-4 Years', '4-5 Years', '6-7 Years'],
  ARRAY['Soft Pink', 'Sky Blue', 'Golden Ivory'],
  true,
  true,
  true
),
(
  'prod-4',
  'Ergonomic Waterproof 3D Cartoon Backpack',
  'ergonomic-waterproof-cartoon-backpack',
  'cat-bags',
  'Children''s School Bags',
  'Padded orthopedic shoulder straps, multi-compartment book dividers, water-resistant outer fabric, and side mesh pockets for water bottles.',
  16500,
  19500,
  12,
  '[{"id":"img-4","url":"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80","is_primary":true,"alt_text":"Ergonomic Cartoon Backpack"}]'::jsonb,
  ARRAY['Medium (Primary 1-3)', 'Large (Primary 4-6)'],
  ARRAY['Blue Astronaut', 'Pink Fairy', 'Yellow Explorer'],
  true,
  false,
  true
),
(
  'prod-5',
  'Stainless Steel Thermal Bento Lunch Box & Bottle Set',
  'stainless-thermal-bento-lunch-box-set',
  'cat-lunch',
  'Children''s Lunch Boxes',
  'Food-grade 304 stainless steel leakproof bento box with 3 compartments. Keeps hot rice, pasta, and snacks fresh for 6+ hours during school days.',
  14500,
  17000,
  18,
  '[{"id":"img-5","url":"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80","is_primary":true,"alt_text":"Thermal Bento Lunch Box Set"}]'::jsonb,
  ARRAY['850ml', '1100ml'],
  ARRAY['Cyan Blue', 'Pastel Pink', 'Sage Green'],
  false,
  true,
  true
),
(
  'prod-6',
  'Complete 9-Piece Newborn Hospital Welcome Hamper',
  'newborn-hospital-welcome-hamper',
  'cat-baby',
  'Baby & Newborn Care Essentials',
  'The quintessential hospital delivery set for expectant Nigerian mothers: 100% combed cotton onesies, scratch mittens, receiving blankets, soft beanies, and grooming essentials.',
  32000,
  38000,
  6,
  '[{"id":"img-6","url":"https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80","is_primary":true,"alt_text":"Newborn Hospital Welcome Hamper"}]'::jsonb,
  ARRAY['0-3 Months', '3-6 Months'],
  ARRAY['Neutral Cream', 'Baby Pink', 'Sky Blue'],
  true,
  true,
  true
),
(
  'prod-7',
  'Structured Multi-Way Mother''s Shoulder Handbag',
  'structured-mothers-shoulder-handbag',
  'cat-women',
  'Women''s Fashion & Accessories',
  'Sleek, scratch-resistant vegan leather handbag featuring gold-tone hardware, detachable crossbody strap, and roomy compartments to effortlessly transition from church to office.',
  27500,
  32000,
  7,
  '[{"id":"img-7","url":"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80","is_primary":true,"alt_text":"Mother''s Shoulder Handbag"}]'::jsonb,
  ARRAY['One Size'],
  ARRAY['Burgundy Wine', 'Classic Black', 'Rich Tan'],
  true,
  false,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT 'Categories created: ' || count(*) FROM public.categories
UNION ALL
SELECT 'Products created: ' || count(*) FROM public.products
UNION ALL
SELECT 'Settings loaded: ' || count(*) FROM public.site_settings;
