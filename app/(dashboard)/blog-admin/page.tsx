'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { BlogPost } from '@/lib/types'

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_image: '', tags: '' })
  const supabase = createClient()

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data as BlogPost[])
    setLoading(false)
  }

  function openNew() {
    setEditingPost(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', cover_image: '', tags: '' })
    setDialogOpen(true)
  }

  function openEdit(post: BlogPost) {
    setEditingPost(post)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image: post.cover_image || '',
      tags: (post.tags || []).join(', '),
    })
    setDialogOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image || null,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }
    try {
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id)
        if (error) throw error
        toast.success('Post updated!')
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload)
        if (error) throw error
        toast.success('Post created!')
      }
      setDialogOpen(false)
      fetchPosts()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(post: BlogPost) {
    const { error } = await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id)
    if (error) toast.error('Failed to update')
    else { toast.success(post.published ? 'Unpublished' : 'Published!'); fetchPosts() }
  }

  async function deletePost(post: BlogPost) {
    if (!confirm('Delete this post?')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id)
    if (error) toast.error('Failed to delete')
    else { toast.success('Deleted!'); fetchPosts() }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Blog Manager</h1>
          <p className="text-[#9A9A9A] mt-1">Create and manage blog posts.</p>
        </div>
        <Button onClick={openNew} className="bg-[#C0152A] hover:bg-[#E8354A] text-white">
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      <Card className="bg-[#1A1A1A] border-white/5">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-[#9A9A9A]">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-[#9A9A9A]">No posts yet.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-base text-[#F5F5F5] truncate">{post.title}</h3>
                      <Badge variant={post.published ? 'default' : 'secondary'} className={post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/45 mt-1">
                      <span>{post.slug}</span>
                      <span>{formatDate(post.created_at)}</span>
                      <span>{post.views || 0} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => togglePublish(post)} className="text-[#9A9A9A] hover:text-[#F5F5F5]">
                      {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(post)} className="text-[#9A9A9A] hover:text-[#C0152A]">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deletePost(post)} className="text-[#9A9A9A] hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5] max-w-2xl">
          <DialogTitle className="font-display text-xl font-bold">{editingPost ? 'Edit Post' : 'New Post'}</DialogTitle>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm text-[#9A9A9A] mb-1 block">Title</label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editingPost ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            </div>
            <div>
              <label className="text-sm text-[#9A9A9A] mb-1 block">Slug</label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            </div>
            <div>
              <label className="text-sm text-[#9A9A9A] mb-1 block">Excerpt</label>
              <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            </div>
            <div>
              <label className="text-sm text-[#9A9A9A] mb-1 block">Content (HTML)</label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5] min-h-[200px] font-mono text-xs" />
            </div>
            <div>
              <label className="text-sm text-[#9A9A9A] mb-1 block">Cover Image URL</label>
              <Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            </div>
            <div>
              <label className="text-sm text-[#9A9A9A] mb-1 block">Tags (comma separated)</label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" placeholder="tag1, tag2, tag3" />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingPost ? 'Update Post' : 'Create Post'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
