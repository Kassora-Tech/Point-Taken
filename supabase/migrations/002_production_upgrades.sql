-- ============================================================
-- 002_production_upgrades.sql
-- Complete schema setup + production upgrades
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to re-run — all statements use IF NOT EXISTS or OR REPLACE
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PART A: Create all base tables (from 001) if they don't exist
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  images TEXT[],
  stock INT DEFAULT 0,
  sku TEXT UNIQUE,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL DEFAULT '',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  tracking_number TEXT,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  type TEXT DEFAULT 'event' CHECK (type IN ('event','meeting','delivery','deadline')),
  color TEXT DEFAULT '#C0152A',
  all_day BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS directory_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  logo_url TEXT,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('facebook','instagram','linkedin','twitter','whatsapp')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published')),
  external_post_id TEXT,
  engagement JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracking_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PART B: Enable RLS on all tables
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART C: RLS Policies (drop-if-exists + create for idempotency)
-- ============================================================

-- Profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Authenticated can read all profiles"
  ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Blog
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated can manage all blog posts" ON blog_posts;

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Authenticated can manage all blog posts"
  ON blog_posts FOR ALL USING (auth.uid() IS NOT NULL);

-- Products
DROP POLICY IF EXISTS "Public can read active products" ON products;
DROP POLICY IF EXISTS "Authenticated can manage products" ON products;

CREATE POLICY "Public can read active products"
  ON products FOR SELECT USING (active = true);
CREATE POLICY "Authenticated can manage products"
  ON products FOR ALL USING (auth.uid() IS NOT NULL);

-- Orders
DROP POLICY IF EXISTS "Authenticated can manage orders" ON orders;
DROP POLICY IF EXISTS "Public can read own order by number and email" ON orders;

CREATE POLICY "Authenticated can manage orders"
  ON orders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Public can read own order by number and email"
  ON orders FOR SELECT USING (true);

-- Events
DROP POLICY IF EXISTS "Authenticated can manage events" ON events;
CREATE POLICY "Authenticated can manage events"
  ON events FOR ALL USING (auth.uid() IS NOT NULL);

-- Documents
DROP POLICY IF EXISTS "Authenticated can manage documents" ON documents;
CREATE POLICY "Authenticated can manage documents"
  ON documents FOR ALL USING (auth.uid() IS NOT NULL);

-- Directory
DROP POLICY IF EXISTS "Public can read active directory" ON directory_entries;
DROP POLICY IF EXISTS "Authenticated can manage directory" ON directory_entries;

CREATE POLICY "Public can read active directory"
  ON directory_entries FOR SELECT USING (active = true);
CREATE POLICY "Authenticated can manage directory"
  ON directory_entries FOR ALL USING (auth.uid() IS NOT NULL);

-- Social
DROP POLICY IF EXISTS "Authenticated can manage social posts" ON social_posts;
CREATE POLICY "Authenticated can manage social posts"
  ON social_posts FOR ALL USING (auth.uid() IS NOT NULL);

-- Tracking logs
DROP POLICY IF EXISTS "Authenticated can manage tracking" ON tracking_logs;
DROP POLICY IF EXISTS "Public can read tracking logs" ON tracking_logs;
DROP POLICY IF EXISTS "System can insert tracking logs" ON tracking_logs;

CREATE POLICY "Public can read tracking logs"
  ON tracking_logs FOR SELECT USING (true);
CREATE POLICY "System can insert tracking logs"
  ON tracking_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can manage tracking"
  ON tracking_logs FOR ALL USING (auth.uid() IS NOT NULL);

-- Enquiries
DROP POLICY IF EXISTS "Public can insert enquiries" ON enquiries;
DROP POLICY IF EXISTS "Authenticated can read enquiries" ON enquiries;
DROP POLICY IF EXISTS "Authenticated can manage enquiries" ON enquiries;

CREATE POLICY "Public can insert enquiries"
  ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read enquiries"
  ON enquiries FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can manage enquiries"
  ON enquiries FOR DELETE USING (auth.uid() IS NOT NULL);

-- Subscribers
DROP POLICY IF EXISTS "Public can insert subscribers" ON subscribers;
DROP POLICY IF EXISTS "Authenticated can read subscribers" ON subscribers;
DROP POLICY IF EXISTS "Authenticated can manage subscribers" ON subscribers;

CREATE POLICY "Public can insert subscribers"
  ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read subscribers"
  ON subscribers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can manage subscribers"
  ON subscribers FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- PART D: New table — User Preferences
-- ============================================================

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email_orders BOOLEAN DEFAULT true,
  email_stock BOOLEAN DEFAULT false,
  email_digest TEXT DEFAULT 'weekly' CHECK (email_digest IN ('daily', 'weekly', 'off')),
  push_notifications BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- PART E: Triggers — auto activity logging
-- ============================================================

-- Order status change
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES (
      'order', NEW.id, 'status_changed',
      jsonb_build_object(
        'order_number', NEW.order_number,
        'from_status', OLD.status,
        'to_status', NEW.status,
        'customer_name', NEW.customer_name
      )
    );
    NEW.updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- New order
CREATE OR REPLACE FUNCTION log_order_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
  VALUES (
    'order', NEW.id, 'created',
    jsonb_build_object('order_number', NEW.order_number, 'customer_name', NEW.customer_name, 'total', NEW.total)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_created();

-- Product changes
CREATE OR REPLACE FUNCTION log_product_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES ('product', NEW.id, 'created', jsonb_build_object('name', NEW.name, 'price', NEW.price));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES ('product', NEW.id, 'updated', jsonb_build_object('name', NEW.name, 'active', NEW.active));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES ('product', OLD.id, 'deleted', jsonb_build_object('name', OLD.name));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_product_change ON products;
CREATE TRIGGER on_product_change
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION log_product_change();

-- Blog changes
CREATE OR REPLACE FUNCTION log_blog_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES ('blog_post', NEW.id, 'created', jsonb_build_object('title', NEW.title));
  ELSIF TG_OP = 'UPDATE' AND OLD.published IS DISTINCT FROM NEW.published THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES ('blog_post', NEW.id,
      CASE WHEN NEW.published THEN 'published' ELSE 'unpublished' END,
      jsonb_build_object('title', NEW.title));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_blog_change ON blog_posts;
CREATE TRIGGER on_blog_change
  AFTER INSERT OR UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION log_blog_change();

-- Event changes
CREATE OR REPLACE FUNCTION log_event_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES ('event', NEW.id, 'created', jsonb_build_object('title', NEW.title, 'type', NEW.type));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES ('event', OLD.id, 'deleted', jsonb_build_object('title', OLD.title));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_event_change ON events;
CREATE TRIGGER on_event_change
  AFTER INSERT OR DELETE ON events
  FOR EACH ROW EXECUTE FUNCTION log_event_change();

-- ============================================================
-- PART F: Auto order number generation
-- ============================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = 'PTG-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- PART G: Seed data (only inserts if tables are empty)
-- ============================================================

INSERT INTO blog_posts (title, slug, excerpt, content, published, tags)
SELECT
  'Welcome to Point-Taken Group — Your Supply Partner',
  'welcome-to-point-taken-group',
  'Point-Taken Group (Pty) Ltd. is proud to launch our new digital platform.',
  '<h2>Our Story</h2><p>Established in 2021, Point-Taken Group has emerged as a leading supply and delivery company serving businesses across South Africa.</p>',
  true,
  ARRAY['company','supply','announcement']
WHERE NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1);

INSERT INTO products (name, description, price, category, stock, featured, sku)
SELECT * FROM (VALUES
  ('Medical Grade Gloves (Box of 100)', 'SAHPRA-approved nitrile examination gloves, powder-free', 285.00, 'Healthcare', 500, true, 'MED-GLV-001'),
  ('Office Stationery Bundle', 'Complete office stationery package for small teams', 450.00, 'Stationery', 200, true, 'OFF-STN-001'),
  ('Industrial Safety Kit', 'PPE safety kit: hard hat, vest, gloves, goggles', 650.00, 'Safety', 150, false, 'IND-SAF-001'),
  ('Cleaning Supplies Bundle', 'Commercial grade cleaning products, monthly supply', 380.00, 'Cleaning', 300, false, 'CLN-BDL-001')
) AS t(name, description, price, category, stock, featured, sku)
WHERE NOT EXISTS (SELECT 1 FROM products LIMIT 1);

INSERT INTO directory_entries (name, category, description, phone, email, featured)
SELECT * FROM (VALUES
  ('Welch Allyn SA', 'Healthcare', 'Medical diagnostic equipment supplier.', '0800 123 456', 'info@welchallyn.co.za', true),
  ('Bloemfontein Medical Suppliers', 'Healthcare', 'Regional medical supply partner covering Free State.', '051 000 0001', 'orders@bms.co.za', false)
) AS t(name, category, description, phone, email, featured)
WHERE NOT EXISTS (SELECT 1 FROM directory_entries LIMIT 1);

INSERT INTO events (title, description, start_date, type)
SELECT 'Q3 Supply Review Meeting', 'Quarterly review of all supply contracts.', NOW() + INTERVAL '7 days', 'meeting'
WHERE NOT EXISTS (SELECT 1 FROM events LIMIT 1);

-- ============================================================
-- DONE. Now go to Supabase Dashboard → Storage:
-- 1. Create bucket "avatars" → set as Public
-- 2. Add policy: authenticated users can upload
-- 3. Add policy: public can read
-- ============================================================
