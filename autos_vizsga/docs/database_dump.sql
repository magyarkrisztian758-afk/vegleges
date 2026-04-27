-- ==========================================
-- CarCore Webshop - Adatbázis SQL Dump
-- ==========================================

-- 1. Termékek (products) tábla
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    oem_code TEXT,
    compatibility TEXT,
    price NUMERIC NOT NULL,
    stock INT4 NOT NULL DEFAULT 0,
    image_url TEXT,
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Felhasználói profilok (profiles) tábla
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    address TEXT,
    phone TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Rendelések (orders) tábla
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Rendelési tételek (order_items) tábla (kapcsoló tábla)
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INT4 NOT NULL,
    price_at_purchase NUMERIC NOT NULL
);

-- PÉLDA ADATOK (Dummy Data) a vizsgáztatók számára:
INSERT INTO public.products (name, brand, oem_code, price, stock, category) 
VALUES ('Brembo Fékbetét', 'Brembo', 'BR-10293', 15990, 24, 'Fékrendszer');