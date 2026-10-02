import { supabase } from "./supabase";
import { getCurrentUserRole } from "./profiles";

export type EventInput = {
  eventId: string;
  title: string;
  start: string;
  end: string;
  eventCode?: string;
};

export type EventLookup = {
  id: string;
  title: string;
};

export async function createEvent(
  event: EventInput
): Promise<{ error: string | null }> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return {
      error: userError.message,
    };
  }

  if (!user) {
    return {
      error: "You must be logged in to create an event.",
    };
  }

  const role = await getCurrentUserRole();

  if (role !== "teacher") {
    return {
      error: "Only teacher accounts can create events.",
    };
  }

  const cleanTitle = event.title.trim();

  if (!cleanTitle) {
    return {
      error: "Event title is required.",
    };
  }

  const cleanEventId = event.eventId.trim();

  if (!cleanEventId) {
    return {
      error: "Event ID is required.",
    };
  }

  const cleanEventCode =
    event.eventCode?.trim() || cleanEventId;

  const { error } = await supabase
    .from("events")
    .insert({
      event_code: cleanEventCode,
      title: cleanTitle,
      start_time: event.start || null,
      end_time: event.end || null,
      created_by: user.id,
    });

  if (error) {
    console.error("Error creating event:", error);

    return {
      error: error.message,
    };
  }

  return {
    error: null,
  };
}

export async function getEventByCode(
  eventCode: string
): Promise<EventLookup | null> {
  const cleanEventCode = eventCode.trim();

  if (!cleanEventCode) {
    return null;
  }

  const { data, error } = await supabase
    .from("events")
    .select("id, title")
    .eq("event_code", cleanEventCode)
    .maybeSingle();

  if (error) {
    console.error("Error finding event by code:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return data;
}