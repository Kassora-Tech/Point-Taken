'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Package, ShoppingCart, Loader2 } from 'lucide-react'
import type { Product, Order } from '@/lib/types'

export default function StoreAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', sku: '', images: '' })
  const [orderForm, setOrderForm] = useState({ customer_name: '', customer_email: '', customer_phone: '', delivery_address: '', notes: '', items: '' as string, total: '' })
  const supabase = createClient()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [pRes, oRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50),
    ])
    if (pRes.data) setProducts(pRes.data as Product[])
    if (oRes.data) setOrders(oRes.data as Order[])
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm({ name: '', description: '', price: '', category: '', stock: '', sku: '', images: '' }); setDialogOpen(true) }
  function openEdit(product: Product) { setEditing(product); setForm({ name: product.name, description: product.description || '', price: product.price.toString(), category: product.category || '', stock: product.stock.toString(), sku: product.sku || '', images: (product.images || []).join(', ') }); setDialogOpen(true) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      category: form.category || null,
      stock: parseInt(form.stock) || 0,
      sku: form.sku || null,
      images: form.images ? form.images.split(',').map((i) => i.trim()).filter(Boolean) : [],
    }
    try {
      if (editing) {
        const { error } = await supabase.from('products').update(payload).eq('id', editing.id)
        if (error) throw error; toast.success('Product updated!')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error; toast.success('Product created!')
      }
      setDialogOpen(false); fetchData()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function toggleActive(product: Product) {
    const { error } = await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
    if (error) toast.error('Failed'); else fetchData()
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) toast.error(error.message || 'Failed to delete')
    else { toast.success('Product deleted!'); fetchData() }
  }

  async function updateOrderStatus(order: Order, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id)
    if (error) toast.error('Failed'); else { toast.success('Status updated!'); fetchData() }
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      let items: any[]
      try {
        items = JSON.parse(orderForm.items)
        if (!Array.isArray(items)) throw new Error()
      } catch {
        toast.error('Items must be valid JSON array, e.g. [{"name":"Item","quantity":1,"price":100}]')
        setSaving(false)
        return
      }
      const total = parseFloat(orderForm.total) || items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
      const { error } = await supabase.from('orders').insert({
        customer_name: orderForm.customer_name,
        customer_email: orderForm.customer_email,
        customer_phone: orderForm.customer_phone || null,
        delivery_address: orderForm.delivery_address || null,
        notes: orderForm.notes || null,
        items,
        total,
        status: 'pending',
      })
      if (error) throw error
      toast.success('Order created!')
      setOrderDialogOpen(false)
      setOrderForm({ customer_name: '', customer_email: '', customer_phone: '', delivery_address: '', notes: '', items: '', total: '' })
      fetchData()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const statusColor: Record<string, string> = { pending: 'text-yellow-500', confirmed: 'text-blue-500', processing: 'text-orange-500', shipped: 'text-blue-400', delivered: 'text-green-500', cancelled: 'text-red-500' }

  if (loading) return <div className="text-center text-[#9A9A9A] py-16">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Store Manager</h1>
          <p className="text-[#9A9A9A] mt-1">Manage products and orders.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOrderDialogOpen(true)} variant="outline" className="border-white/10 text-[#F5F5F5]"><ShoppingCart className="h-4 w-4 mr-2" /> New Order</Button>
          <Button onClick={openNew} className="bg-[#C0152A] hover:bg-[#E8354A] text-white"><Plus className="h-4 w-4 mr-2" /> New Product</Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="bg-[#1A1A1A] border border-white/5">
          <TabsTrigger value="products" className="text-[#9A9A9A] data-[state=active]:text-[#F5F5F5]"><Package className="h-4 w-4 mr-2" /> Products ({products.length})</TabsTrigger>
          <TabsTrigger value="orders" className="text-[#9A9A9A] data-[state=active]:text-[#F5F5F5]"><ShoppingCart className="h-4 w-4 mr-2" /> Orders ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="bg-[#1A1A1A] border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display font-semibold text-[#F5F5F5] text-[15px]">{product.name}</h3>
                    <Badge variant={product.active ? 'default' : 'secondary'} className={product.active ? 'bg-green-500/20 text-green-400' : 'text-[#9A9A9A]'}>{product.active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <p className="font-display text-xl font-bold text-[#C0152A]">R {Number(product.price).toFixed(2)}</p>
                  <p className="text-xs text-white/50 mt-1">Stock: {product.stock} | SKU: {product.sku || 'N/A'}</p>
                  {product.category && <Badge variant="outline" className="mt-2 text-xs">{product.category}</Badge>}
                  <div className="flex items-center gap-1 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(product)} className="text-xs text-[#9A9A9A]">{product.active ? 'Deactivate' : 'Activate'}</Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(product)} className="text-[#9A9A9A] hover:text-[#C0152A]"><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteProduct(product)} className="text-[#9A9A9A] hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-0">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-[#9A9A9A]">No orders yet.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                      <div>
                        <p className="font-medium text-[#F5F5F5]">{order.order_number}</p>
                        <p className="text-xs text-[#9A9A9A]">{order.customer_name} • {formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-[#F5F5F5]">R {Number(order.total).toFixed(2)}</span>
                        <Select value={order.status} onValueChange={(v) => v && updateOrderStatus(order, v)}>
                          <SelectTrigger className={`w-32 h-8 text-xs border-white/10 ${statusColor[order.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-white/10">
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                              <SelectItem key={s} value={s} className="text-[#F5F5F5]">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] max-w-lg">
          <DialogTitle className="font-display text-xl font-bold">{editing ? 'Edit Product' : 'New Product'}</DialogTitle>
          <form onSubmit={handleSave} className="space-y-4">
            <Input required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#9A9A9A] mb-1 block">Price *</label>
                <Input type="number" step="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
              </div>
              <div>
                <label className="text-xs text-[#9A9A9A] mb-1 block">Stock</label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
              <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            </div>
            <Input placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Button type="submit" disabled={saving} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Creation Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] max-w-lg">
          <DialogTitle className="font-display text-xl font-bold">Create Order</DialogTitle>
          <form onSubmit={handleCreateOrder} className="space-y-4">
            <Input required placeholder="Customer name" value={orderForm.customer_name} onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Input required type="email" placeholder="Customer email" value={orderForm.customer_email} onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Input placeholder="Phone number" value={orderForm.customer_phone} onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Input placeholder="Delivery address" value={orderForm.delivery_address} onChange={(e) => setOrderForm({ ...orderForm, delivery_address: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <div>
              <label className="text-xs text-[#9A9A9A] mb-1 block">Items (JSON) *</label>
              <Textarea
                required
                placeholder='[{"name": "Product Name", "quantity": 1, "price": 100.00}]'
                value={orderForm.items}
                onChange={(e) => setOrderForm({ ...orderForm, items: e.target.value })}
                className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5] font-mono text-xs min-h-[80px]"
              />
            </div>
            <Input type="number" step="0.01" placeholder="Total (auto-calculated if blank)" value={orderForm.total} onChange={(e) => setOrderForm({ ...orderForm, total: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Textarea placeholder="Notes" value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Button type="submit" disabled={saving} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
              Create Order
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
