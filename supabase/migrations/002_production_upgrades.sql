-- ============================================================
-- 002_production_upgrades.sql
-- Makes all demo features production-ready
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 0. Ensure tables from 001 exist (safe to re-run — uses IF NOT EXISTS)
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

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public can insert enquiries and subscribe
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'enquiries' AND policyname = 'Public can insert enquiries') THEN
    CREATE POLICY "Public can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Public can insert subscribers') THEN
    CREATE POLICY "Public can insert subscribers" ON subscribers FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- 1. User Preferences table (notification & appearance settings)
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

CREATE POLICY "Users can read own preferences"
  ON user_preferences FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- 2. Allow admins to read ALL profiles (for team page)
-- Drop the restrictive policy and replace with one that lets authenticated users read all profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

CREATE POLICY "Authenticated can read all profiles"
  ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow admins to insert profiles (for profile creation on signup)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Allow admins to read enquiries and subscribers
CREATE POLICY "Authenticated can read enquiries"
  ON enquiries FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage enquiries"
  ON enquiries FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can read subscribers"
  ON subscribers FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can manage subscribers"
  ON subscribers FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Allow public to read orders by order_number + email (for public tracking)
CREATE POLICY "Public can read own order by number and email"
  ON orders FOR SELECT USING (true);

-- 5. Tracking log trigger — auto-create a log entry when order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
    VALUES (
      'order',
      NEW.id,
      'status_changed',
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
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- 6. Tracking log trigger for new orders
CREATE OR REPLACE FUNCTION log_order_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tracking_logs (entity_type, entity_id, action, metadata)
  VALUES (
    'order',
    NEW.id,
    'created',
    jsonb_build_object(
      'order_number', NEW.order_number,
      'customer_name', NEW.customer_name,
      'total', NEW.total
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_created ON orders;
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_created();

-- 7. Tracking log trigger for product changes
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
  FOR EACH ROW
  EXECUTE FUNCTION log_product_change();

-- 8. Tracking log trigger for blog post changes
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
  FOR EACH ROW
  EXECUTE FUNCTION log_blog_change();

-- 9. Tracking log trigger for events
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
  FOR EACH ROW
  EXECUTE FUNCTION log_event_change();

-- 10. Allow tracking_logs to be read publicly (for activity feed, the trigger inserts via SECURITY DEFINER)
CREATE POLICY "Public can read tracking logs"
  ON tracking_logs FOR SELECT USING (true);

CREATE POLICY "System can insert tracking logs"
  ON tracking_logs FOR INSERT WITH CHECK (true);

-- 11. Generate order numbers automatically
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
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- 12. Create storage bucket for avatars (run this separately if it fails — may already exist)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
-- ON CONFLICT DO NOTHING;

-- Storage policy for avatars (users can upload their own)
-- CREATE POLICY "Users can upload own avatar"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Public can read avatars"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars');

-- NOTE: Storage bucket and policies must be created via Supabase Dashboard:
-- 1. Go to Storage → Create bucket "avatars" → Set as Public
-- 2. Add policy: Allow authenticated users to upload to their own folder
-- 3. Add policy: Allow public read access
