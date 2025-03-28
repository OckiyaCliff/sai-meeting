// This file provides a TypeScript interface to a Python backend
// implemented via Next.js API routes instead of Firebase Functions

interface MeetingPreference {
  userId: string
  dayOfWeek: number // 0-6 for Sunday-Saturday
  hourOfDay: number // 0-23
  duration: number
  participantCount: number
  meetingType: string
  rating: number // User satisfaction rating
}

interface PredictionRequest {
  userId: string
  possibleSlots: Array<{
    dayOfWeek: number
    hourOfDay: number
    duration: number
    participantCount: number
    meetingType: string
  }>
}

// Function to call our Python backend via Next.js API route
export async function predictOptimalMeetingSlots(
  request: PredictionRequest,
): Promise<Array<{ slot: any; score: number }>> {
  try {
    // Call the prediction API via Next.js API route
    const response = await fetch("/api/ai/predict-slots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error("Failed to get predictions")
    }

    const predictions = await response.json()
    return predictions.rankedSlots
  } catch (error) {
    console.error("Error predicting optimal meeting slots:", error)
    return []
  }
}

// Function to record user preferences for training the model
export async function recordMeetingPreference(preference: MeetingPreference): Promise<boolean> {
  try {
    const response = await fetch("/api/ai/record-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    })

    return response.ok
  } catch (error) {
    console.error("Error recording meeting preference:", error)
    return false
  }
}

