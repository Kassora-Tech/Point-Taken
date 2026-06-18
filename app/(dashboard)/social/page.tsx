'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Copy, Edit2, Trash2, Calendar, CheckCircle, Loader2 } from 'lucide-react'
import type { SocialPost } from '@/lib/types'

const platforms = ['facebook', 'instagram', 'linkedin', 'twitter', 'whatsapp'] as const

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SocialPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ platform: 'facebook', content: '', media_urls: '', scheduled_at: '' })
  const supabase = createClient()

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    const { data } = await supabase.from('social_posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data as SocialPost[])
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm({ platform: 'facebook', content: '', media_urls: '', scheduled_at: '' }); setDialogOpen(true) }
  function openEdit(post: SocialPost) { setEditing(post); setForm({ platform: post.platform, content: post.content, media_urls: (post.media_urls || []).join(', '), scheduled_at: post.scheduled_at || '' }); setDialogOpen(true) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { platform: form.platform, content: form.content, media_urls: form.media_urls ? form.media_urls.split(',').map((u) => u.trim()).filter(Boolean) : [], scheduled_at: form.scheduled_at || null }
    try {
      if (editing) {
        const { error } = await supabase.from('social_posts').update(payload).eq('id', editing.id)
        if (error) throw error; toast.success('Updated!')
      } else {
        const { error } = await supabase.from('social_posts').insert(payload)
        if (error) throw error; toast.success('Created!')
      }
      setDialogOpen(false); fetchPosts()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function updateStatus(post: SocialPost, status: string) {
    const payload: any = { status }
    if (status === 'published') payload.published_at = new Date().toISOString()
    const { error } = await supabase.from('social_posts').update(payload).eq('id', post.id)
    if (error) toast.error('Failed'); else { toast.success(`Status: ${status}`); fetchPosts() }
  }

  async function deletePost(post: SocialPost) {
    if (!confirm('Delete this post?')) return
    const { error } = await supabase.from('social_posts').delete().eq('id', post.id)
    if (error) toast.error('Failed'); else { toast.success('Deleted!'); fetchPosts() }
  }

  function copyContent(content: string) {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard!')
  }

  const statusColors: Record<string, string> = { draft: 'bg-yellow-500/20 text-yellow-400', scheduled: 'bg-blue-500/20 text-blue-400', published: 'bg-green-500/20 text-green-400' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Social Media</h1>
          <p className="text-[#9A9A9A] mt-1">Plan and schedule social media content.</p>
        </div>
        <Button onClick={openNew} className="bg-[#C0152A] hover:bg-[#E8354A] text-white"><Plus className="h-4 w-4 mr-2" /> New Post</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-[#1A1A1A] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Badge className="capitalize bg-[#C0152A]/10 text-[#C0152A] border border-[#C0152A]/20">{post.platform}</Badge>
                <Badge className={statusColors[post.status]}>{post.status}</Badge>
              </div>
              <p className="text-[#F5F5F5] text-sm line-clamp-4 mb-3">{post.content}</p>
              {post.scheduled_at && (
                <div className="flex items-center gap-1 text-xs text-[#9A9A9A] mb-3">
                  <Calendar className="h-3 w-3" /> {formatDate(post.scheduled_at)}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => copyContent(post.content)} className="text-[#9A9A9A] hover:text-[#F5F5F5]"><Copy className="h-4 w-4" /></Button>
                {post.status === 'draft' && (
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(post, 'scheduled')} className="text-[#9A9A9A] hover:text-blue-400">Schedule</Button>
                )}
                {post.status === 'scheduled' && (
                  <Button variant="ghost" size="sm" onClick={() => updateStatus(post, 'published')} className="text-[#9A9A9A] hover:text-green-400">Publish</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => openEdit(post)} className="text-[#9A9A9A] hover:text-[#C0152A]"><Edit2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post)} className="text-[#9A9A9A] hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] max-w-lg">
          <DialogTitle className="font-display text-xl font-bold">{editing ? 'Edit Post' : 'New Post'}</DialogTitle>
          <form onSubmit={handleSave} className="space-y-4">
            <Select value={form.platform} onValueChange={(v) => v && setForm({ ...form, platform: v })}>
              <SelectTrigger className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
                {platforms.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea required placeholder="Post content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5] min-h-[100px]" />
            <Input placeholder="Media URLs (comma separated)" value={form.media_urls} onChange={(e) => setForm({ ...form, media_urls: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Button type="submit" disabled={saving} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editing ? 'Update' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
