import { supabase } from '@/lib/supabase';

export type AttendanceRecord = {
  id: string;
  eventId: string;
  eventTitle: string;
  scannedAt: string;
};

export type Event = {
  eventId: string;
  eventCode: string;
  title: string;
  start: string;
  end: string;
};

type EventRow = {
  event_id: string;
  event_code: string;
  title: string;
  start_time: string;
  end_time: string;
};

type AttendanceRow = {
  id: string;
  event_id: string;
  event_title: string;
  scanned_at: string;
};

// Get all events
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error loading events:', error);
    throw error;
  }

  return ((data ?? []) as EventRow[]).map((event: EventRow) => ({
    eventId: event.event_id,
    eventCode: event.event_code,
    title: event.title,
    start: event.start_time,
    end: event.end_time,
  }));
}

// Save attendance
export async function registerAttendance(
  eventId: string,
  eventTitle: string
): Promise<AttendanceRecord> {
  const { data, error } = await supabase
    .from('attendance')
    .insert({
      event_id: eventId,
      event_title: eventTitle,
    })
    .select()
    .single();

  if (error) {
    console.error('Error registering attendance:', error);
    throw error;
  }

  return {
    id: data.id,
    eventId: data.event_id,
    eventTitle: data.event_title,
    scannedAt: data.scanned_at,
  };
}

// Get attendance history
export async function getAttendanceHistory(): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .order('scanned_at', { ascending: false });

  if (error) {
    console.error('Error loading attendance:', error);
    throw error;
  }

  return ((data ?? []) as AttendanceRow[]).map((record: AttendanceRow) => ({
    id: record.id,
    eventId: record.event_id,
    eventTitle: record.event_title,
    scannedAt: record.scanned_at,
  }));
}