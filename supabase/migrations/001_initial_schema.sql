-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (tied to Supabase auth users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
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

-- Products (online store)
CREATE TABLE products (
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

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
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

-- Events / Calendar
CREATE TABLE events (
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

-- Documents
CREATE TABLE documents (
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

-- Directory (supplier/client directory)
CREATE TABLE directory_entries (
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

-- Social media posts (tracking/scheduling)
CREATE TABLE social_posts (
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

-- Analytics / Tracking logs
CREATE TABLE tracking_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries / Quote requests
CREATE TABLE enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
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

-- RLS Policies: public read for blog/products/directory
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT USING (published = true);

CREATE POLICY "Public can read active products"
  ON products FOR SELECT USING (active = true);

CREATE POLICY "Public can read active directory"
  ON directory_entries FOR SELECT USING (active = true);

-- Authenticated users (admins) can do anything
CREATE POLICY "Authenticated can manage all blog posts"
  ON blog_posts FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage products"
  ON products FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage orders"
  ON orders FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage events"
  ON events FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage documents"
  ON documents FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage directory"
  ON directory_entries FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage social posts"
  ON social_posts FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage tracking"
  ON tracking_logs FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Public can insert enquiries and subscribe
CREATE POLICY "Public can insert enquiries"
  ON enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert subscribers"
  ON subscribers FOR INSERT WITH CHECK (true);

-- Seed data
INSERT INTO blog_posts (title, slug, excerpt, content, published, tags) VALUES (
  'Welcome to Point-Taken Group — Your Supply Partner',
  'welcome-to-point-taken-group',
  'Point-Taken Group (Pty) Ltd. is proud to launch our new digital platform. Learn about who we are and what we offer.',
  '<h2>Our Story</h2><p>Established in 2021, Point-Taken Group has emerged as a leading supply and delivery company serving businesses across South Africa. With headquarters in Bloemfontein and operations in four cities nationwide, we bring dedication, transparency, and quality to every partnership.</p><p>Our LOGIS and SAHPRA certifications underscore our commitment to regulatory compliance and professional standards across all sectors we serve.</p>',
  true,
  ARRAY['company','supply','announcement']
);

INSERT INTO products (name, description, price, category, stock, featured, sku) VALUES
  ('Medical Grade Gloves (Box of 100)', 'SAHPRA-approved nitrile examination gloves, powder-free', 285.00, 'Healthcare', 500, true, 'MED-GLV-001'),
  ('Office Stationery Bundle', 'Complete office stationery package for small teams', 450.00, 'Stationery', 200, true, 'OFF-STN-001'),
  ('Industrial Safety Kit', 'PPE safety kit: hard hat, vest, gloves, goggles', 650.00, 'Safety', 150, false, 'IND-SAF-001'),
  ('Cleaning Supplies Bundle', 'Commercial grade cleaning products, monthly supply', 380.00, 'Cleaning', 300, false, 'CLN-BDL-001');

INSERT INTO directory_entries (name, category, description, phone, email, featured) VALUES
  ('Welch Allyn SA', 'Healthcare', 'Medical diagnostic equipment supplier — trained Point-Taken sales reps.', '0800 123 456', 'info@welchallyn.co.za', true),
  ('Bloemfontein Medical Suppliers', 'Healthcare', 'Regional medical supply partner covering Free State.', '051 000 0001', 'orders@bms.co.za', false);

INSERT INTO events (title, description, start_date, type) VALUES
  ('Q3 Supply Review Meeting', 'Quarterly review of all supply contracts and delivery performance.', NOW() + INTERVAL '7 days', 'meeting');
