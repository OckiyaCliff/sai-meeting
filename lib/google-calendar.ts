// Client-side Google Calendar integration

// Constants
const GOOGLE_API_BASE_URL = "https://www.googleapis.com/calendar/v3"

// Helper function to make authenticated requests to Google Calendar API
async function fetchWithAuth(endpoint: string, accessToken: string, options: RequestInit = {}) {
  const url = `${GOOGLE_API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
    throw new Error(error.error?.message || "Failed to fetch from Google Calendar API")
  }

  return response.json()
}

// Fetch user's calendar events
export async function fetchCalendarEvents(accessToken: string, timeMin: string, timeMax: string) {
  try {
    const params = new URLSearchParams({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: "true",
      orderBy: "startTime",
    })

    const data = await fetchWithAuth(`/calendars/primary/events?${params}`, accessToken)
    return data.items || []
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    throw error
  }
}

// Create a new calendar event
export async function createCalendarEvent(accessToken: string, event: any) {
  try {
    const data = await fetchWithAuth("/calendars/primary/events", accessToken, {
      method: "POST",
      body: JSON.stringify(event),
    })

    return data
  } catch (error) {
    console.error("Error creating calendar event:", error)
    throw error
  }
}

// Update an existing calendar event
export async function updateCalendarEvent(accessToken: string, eventId: string, event: any) {
  try {
    const data = await fetchWithAuth(`/calendars/primary/events/${eventId}`, accessToken, {
      method: "PUT",
      body: JSON.stringify(event),
    })

    return data
  } catch (error) {
    console.error("Error updating calendar event:", error)
    throw error
  }
}

// Delete a calendar event
export async function deleteCalendarEvent(accessToken: string, eventId: string) {
  try {
    await fetchWithAuth(`/calendars/primary/events/${eventId}`, accessToken, {
      method: "DELETE",
    })

    return true
  } catch (error) {
    console.error("Error deleting calendar event:", error)
    throw error
  }
}

// Check for scheduling conflicts
export async function checkSchedulingConflicts(accessToken: string, startTime: string, endTime: string) {
  try {
    const events = await fetchCalendarEvents(accessToken, startTime, endTime)

    // Filter out events that don't overlap with the proposed time
    const conflictingEvents = events.filter((event: any) => {
      // Skip events without start or end times
      if (!event.start?.dateTime || !event.end?.dateTime) return false

      // Check if the event overlaps with the proposed time
      const eventStart = new Date(event.start.dateTime).getTime()
      const eventEnd = new Date(event.end.dateTime).getTime()
      const proposedStart = new Date(startTime).getTime()
      const proposedEnd = new Date(endTime).getTime()

      // Events overlap if one starts before the other ends
      return eventStart < proposedEnd && eventEnd > proposedStart
    })

    return conflictingEvents.length > 0 ? conflictingEvents : null
  } catch (error) {
    console.error("Error checking scheduling conflicts:", error)
    throw error
  }
}

// Get available time slots based on calendar
export async function getAvailableTimeSlots(accessToken: string, date: string, duration: number) {
  try {
    // Set time range for the entire day
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Fetch all events for the day
    const events = await fetchCalendarEvents(accessToken, startOfDay.toISOString(), endOfDay.toISOString())

    // Define working hours (9 AM to 5 PM)
    const workingHoursStart = 9
    const workingHoursEnd = 17

    // Create 30-minute slots within working hours
    const slots = []
    const durationInMinutes = duration
    const slotIntervalMinutes = 30

    for (let hour = workingHoursStart; hour < workingHoursEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotIntervalMinutes) {
        const slotStart = new Date(date)
        slotStart.setHours(hour, minute, 0, 0)

        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotStart.getMinutes() + durationInMinutes)

        // Skip slots that end after working hours
        if (slotEnd.getHours() >= workingHoursEnd && slotEnd.getMinutes() > 0) {
          continue
        }

        // Check if the slot conflicts with any existing events
        const hasConflict = events.some((event: any) => {
          if (!event.start?.dateTime || !event.end?.dateTime) return false

          const eventStart = new Date(event.start.dateTime)
          const eventEnd = new Date(event.end.dateTime)

          return (
            (slotStart < eventEnd && slotEnd > eventStart) ||
            Math.abs(slotStart.getTime() - eventStart.getTime()) < 1000 ||
            Math.abs(slotEnd.getTime() - eventEnd.getTime()) < 1000
          )
        })

        if (!hasConflict) {
          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            formatted: `${slotStart.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${slotEnd.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`,
          })
        }
      }
    }

    return slots
  } catch (error) {
    console.error("Error getting available time slots:", error)
    throw error
  }
}

