export interface Profile {
  id: string
  full_name: string | null
  role: 'admin' | 'editor' | 'viewer'
  avatar_url: string | null
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  tags: string[] | null
  published: boolean
  author_id: string | null
  views: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  images: string[] | null
  stock: number
  sku: string | null
  featured: boolean
  active: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  tracking_number: string | null
  delivery_address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  name: string
  quantity: number
  price: number
}

export interface CalendarEvent {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  location: string | null
  type: 'event' | 'meeting' | 'delivery' | 'deadline'
  color: string
  all_day: boolean
  created_by: string | null
  created_at: string
}

export interface Document {
  id: string
  name: string
  description: string | null
  file_url: string
  file_type: string | null
  file_size: number | null
  category: string
  tags: string[] | null
  uploaded_by: string | null
  created_at: string
}

export interface DirectoryEntry {
  id: string
  name: string
  category: string
  description: string | null
  contact_name: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  logo_url: string | null
  featured: boolean
  active: boolean
  created_at: string
}

export interface SocialPost {
  id: string
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'whatsapp'
  content: string
  media_urls: string[] | null
  scheduled_at: string | null
  published_at: string | null
  status: 'draft' | 'scheduled' | 'published'
  external_post_id: string | null
  engagement: Record<string, unknown>
  created_by: string | null
  created_at: string
}

export interface TrackingLog {
  id: string
  entity_type: string
  entity_id: string
  action: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  product_id: string | null
  created_at: string
}

export interface Subscriber {
  id: string
  email: string
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  email_orders: boolean
  email_stock: boolean
  email_digest: 'daily' | 'weekly' | 'off'
  push_notifications: boolean
  theme: 'dark' | 'light'
  created_at: string
  updated_at: string
}
