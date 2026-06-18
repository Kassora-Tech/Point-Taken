'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Plus, Loader2 } from 'lucide-react'
import type { CalendarEvent } from '@/lib/types'

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
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
    setForm({ ...form, start_date: info.dateStr, end_date: info.dateStr })
    setDialogOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase.from('events').insert({
        title: form.title,
        description: form.description || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        location: form.location || null,
        type: form.type,
        color: form.color,
        all_day: form.all_day,
      })
      if (error) throw error
      toast.success('Event created!')
      setDialogOpen(false)
      fetchEvents()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create event')
    } finally {
      setSaving(false)
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
              backgroundColor: e.color || '#C0152A',
              borderColor: e.color || '#C0152A',
              textColor: '#F5F5F5',
            }))}
            dateClick={handleDateClick}
            height="auto"
            themeSystem="standard"
            slotMinTime="06:00:00"
            slotMaxTime="20:00:00"
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
          <DialogTitle className="font-display text-xl font-bold">New Event</DialogTitle>
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
            <Select value={form.type} onValueChange={(v) => v && setForm({ ...form, type: v as 'event' | 'meeting' | 'delivery' | 'deadline' })}>
              <SelectTrigger className="bg-[#0A0A0A] border-white/10 text-[#F5F5F5]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-[#F5F5F5]">
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={saving} className="w-full bg-[#C0152A] hover:bg-[#E8354A] text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Create Event
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
