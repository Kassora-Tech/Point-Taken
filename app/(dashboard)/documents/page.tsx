'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Upload, FileText, Download, Trash2, Search, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import type { Document } from '@/lib/types'

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => { fetchDocs() }, [])

  async function fetchDocs() {
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
    if (data) setDocs(data as Document[])
    setLoading(false)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file)
        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName)
        
        const { error: dbError } = await supabase.from('documents').insert({
          name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          category: 'general',
        })
        if (dbError) throw dbError
      }
      toast.success('Files uploaded!')
      fetchDocs()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  async function deleteDoc(doc: Document) {
    if (!confirm('Delete this document?')) return
    const { error } = await supabase.from('documents').delete().eq('id', doc.id)
    if (error) toast.error('Failed')
    else { toast.success('Deleted!'); fetchDocs() }
  }

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))

  function formatSize(bytes: number | null) {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Documents</h1>
        <p className="text-[#9A9A9A] mt-1">Upload and manage documents.</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-[#C0152A] bg-[#C0152A]/5' : 'border-white/10 hover:border-[#C0152A]/30'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-[#C0152A] mx-auto mb-4" />
        <p className="text-[#F5F5F5] font-semibold">
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="text-[#9A9A9A] text-sm mt-1">Upload documents, contracts, invoices, and reports</p>
        {uploading && <Loader2 className="h-5 w-5 animate-spin text-[#C0152A] mx-auto mt-4" />}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9A9A]" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[#1A1A1A] border-white/10 text-[#F5F5F5]"
        />
      </div>

      <Card className="bg-[#1A1A1A] border-white/5">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-[#9A9A9A]">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-[#9A9A9A]">No documents found.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-[#C0152A] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F5F5F5] truncate">{doc.name}</p>
                      <div className="flex items-center gap-3 text-xs text-[#9A9A9A]">
                        <span>{formatSize(doc.file_size)}</span>
                        <span>{formatDate(doc.created_at)}</span>
                        {doc.category && <Badge variant="outline" className="text-[10px]">{doc.category}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md p-2 text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-white/5 transition-colors">
                      <Download className="h-4 w-4" />
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => deleteDoc(doc)} className="text-[#9A9A9A] hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
