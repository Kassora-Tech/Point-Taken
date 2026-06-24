'use client'

import './calendar-theme.css'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import type { CalendarEvent } from '@/lib/types'

const EVENT_TYPES = [
  { value: 'event', label: 'Event', color: '#C0152A' },
  { value: 'meeting', label: 'Meeting', color: '#F59E0B' },
  { value: 'delivery', label: 'Delivery', color: '#3B82F6' },
  { value: 'deadline', label: 'Deadline', color: '#EF4444' },
]

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '', location: '', type: 'event', color: '#C0152A', all_day: false })
  const supabase = createClient()

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('events').select('*').order('start_date', { ascending: true })
    if (data) setEvents(data as CalendarEvent[])
    setLoading(false)
  }

  function handleDateClick(info: any) {
    setEditing(null)
    setForm({ title: '', description: '', start_date: info.dateStr, end_date: info.dateStr, location: '', type: 'event', color: '#C0152A', all_day: false })
    setDialogOpen(true)
  }

  function handleEventClick(info: any) {
    const event = events.find((e) => e.id === info.event.id)
    if (!event) return
    setEditing(event)
    setForm({
      title: event.title,
      description: event.description || '',
      start_date: event.start_date ? event.start_date.slice(0, 16) : '',
      end_date: event.end_date ? event.end_date.slice(0, 16) : '',
      location: event.location || '',
      type: event.type,
      color: event.color,
      all_day: event.all_day,
    })
    setDialogOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title,
      description: form.description || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      location: form.location || null,
      type: form.type,
      color: form.color,
      all_day: form.all_day,
    }
    try {
      if (editing) {
        const { error } = await supabase.from('events').update(payload).eq('id', editing.id)
        if (error) throw error
        toast.success('Event updated!')
      } else {
        const { error } = await supabase.from('events').insert(payload)
        if (error) throw error
        toast.success('Event created!')
      }
      setDialogOpen(false)
      fetchEvents()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!editing) return
    if (!confirm('Delete this event?')) return
    try {
      const { error } = await supabase.from('events').delete().eq('id', editing.id)
      if (error) throw error
      toast.success('Event deleted!')
      setDialogOpen(false)
      fetchEvents()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#F5F5F5]">Calendar</h1>
          <p className="text-[#9A9A9A] mt-1">Manage events, meetings, and deliveries.</p>
        </div>
      </div>

      {/* Event type legend */}
      <div className="flex items-center gap-6 text-xs text-white/50 mb-2">
        {EVENT_TYPES.map((t) => (
          <span key={t.value} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} /> {t.label}
          </span>
        ))}
      </div>

      <Card className="bg-[#1A1A1A] border-white/5">
        <CardContent className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events.map((e) => ({
              id: e.id,
              title: e.title,
              start: e.start_date,
              end: e.end_date || undefined,
              allDay: e.all_day,
              classNames: [`event-type-${e.type || 'event'}`],
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              textColor: '#F5F5F5',
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            themeSystem="standard"
            slotMinTime="06:00:00"
            slotMaxTime="20:00:00"
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
          <DialogTitle className="font-display text-xl font-bold">{editing ? 'Edit Event' : 'New Event'}</DialogTitle>
          <form onSubmit={handleSave} className="space-y-4">
            <Input required placeholder="Event title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#9A9A9A] mb-1 block">Start Date *</label>
                <Input type="datetime-local" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
              </div>
              <div>
                <label className="text-xs text-[#9A9A9A] mb-1 block">End Date</label>
                <Input type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
              </div>
            </div>
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]" />
            <div>
              <label className="text-xs text-[#9A9A9A] mb-2 block">Type</label>
              <div className="flex gap-2">
                {EVENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm({ ...form, type: t.value as any, color: t.color })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      form.type === t.value
                        ? 'text-white shadow-sm'
                        : 'text-white/40 hover:text-white/70 bg-white/5'
                    }`}
                    style={form.type === t.value ? { background: `${t.color}25`, border: `1px solid ${t.color}50`, color: t.color } : { background: 'transparent', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="flex-1 bg-[#C0152A] hover:bg-[#E8354A] text-white">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {editing ? 'Update Event' : 'Create Event'}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={handleDelete} className="border-red-500/30 text-red-500 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
