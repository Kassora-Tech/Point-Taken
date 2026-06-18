'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react'
import type { DirectoryEntry } from '@/lib/types'

export default function DirectoryAdminPage() {
  const [entries, setEntries] = useState<DirectoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<DirectoryEntry | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', category: '', description: '', contact_name: '', phone: '', email: '', website: '', address: '', logo_url: '' })
  const supabase = createClient()

  useEffect(() => { fetchEntries() }, [])

  async function fetchEntries() {
    const { data } = await supabase.from('directory_entries').select('*').order('created_at', { ascending: false })
    if (data) setEntries(data as DirectoryEntry[])
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm({ name: '', category: '', description: '', contact_name: '', phone: '', email: '', website: '', address: '', logo_url: '' }); setDialogOpen(true) }
  function openEdit(entry: DirectoryEntry) { setEditing(entry); setForm({ name: entry.name, category: entry.category, description: entry.description || '', contact_name: entry.contact_name || '', phone: entry.phone || '', email: entry.email || '', website: entry.website || '', address: entry.address || '', logo_url: entry.logo_url || '' }); setDialogOpen(true) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, description: form.description || null, contact_name: form.contact_name || null, phone: form.phone || null, email: form.email || null, website: form.website || null, address: form.address || null, logo_url: form.logo_url || null }
    try {
      if (editing) {
        const { error } = await supabase.from('directory_entries').update(payload).eq('id', editing.id)
        if (error) throw error
        toast.success('Entry updated!')
      } else {
        const { error } = await supabase.from('directory_entries').insert(payload)
        if (error) throw error
        toast.success('Entry created!')
      }
      setDialogOpen(false); fetchEntries()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function toggleFeatured(entry: DirectoryEntry) {
    const { error } = await supabase.from('directory_entries').update({ featured: !entry.featured }).eq('id', entry.id)
    if (error) toast.error('Failed')
    else fetchEntries()
  }

  async function deleteEntry(entry: DirectoryEntry) {
    if (!confirm('Delete this entry?')) return
    const { error } = await supabase.from('directory_entries').delete().eq('id', entry.id)
    if (error) toast.error('Failed')
    else { toast.success('Deleted!'); fetchEntries() }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Directory Manager</h1>
          <p className="text-[#9A9A9A] mt-1">Manage suppliers, clients, and partners.</p>
        </div>
        <Button onClick={openNew} className="bg-[#C0152A] hover:bg-[#E8354A] text-white"><Plus className="h-4 w-4 mr-2" /> New Entry</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-bold text-[#F5F5F5]">{entry.name}</h3>
                <Badge variant="outline" className="text-xs">{entry.category}</Badge>
              </div>
              {entry.description && <p className="text-[#9A9A9A] text-sm mb-3">{entry.description}</p>}
              <div className="flex items-center gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => toggleFeatured(entry)} className={entry.featured ? 'text-[#C0152A]' : 'text-[#9A9A9A]'}>
                  {entry.featured ? 'Featured' : 'Set Featured'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(entry)} className="text-[#9A9A9A] hover:text-[#C0152A]"><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry)} className="text-[#9A9A9A] hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] max-w-lg">
          <DialogTitle className="font-display text-xl font-bold">{editing ? 'Edit Entry' : 'New Entry'}</DialogTitle>
          <form onSubmit={handleSave} className="space-y-4">
            <Input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Input required placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Input placeholder="Contact Name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
