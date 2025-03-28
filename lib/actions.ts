"use server"

import { addDays, format } from "date-fns"

interface SuggestionParams {
  date: Date
  participants: string
  duration: string
}

export async function generateAISuggestions({ date, participants, duration }: SuggestionParams): Promise<string[]> {
  try {
    // Get the current date for reference
    const currentDate = new Date()

    // Ensure the selected date is not in the past
    const selectedDate = date < currentDate ? addDays(currentDate, 1) : date

    // Generate time slots for the selected date and the next two days
    const suggestions = []

    // Generate suggestions for the selected date
    const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy")

    // Morning slots (9 AM - 12 PM)
    for (let hour = 9; hour < 12; hour++) {
      const startTime = `${hour}:00 AM`
      const endTime = `${hour + 1}:00 AM`
      suggestions.push(`${formattedDate} at ${startTime} - ${endTime}`)
    }

    // Afternoon slots (1 PM - 5 PM)
    for (let hour = 1; hour < 5; hour++) {
      const startTime = `${hour}:00 PM`
      const endTime = `${hour + 1}:00 PM`
      suggestions.push(`${formattedDate} at ${startTime} - ${endTime}`)
    }

    // Generate suggestions for the next day
    const nextDay = addDays(selectedDate, 1)
    const nextDayFormatted = format(nextDay, "EEEE, MMMM d, yyyy")

    // Morning slots for next day
    for (let hour = 9; hour < 12; hour++) {
      const startTime = `${hour}:00 AM`
      const endTime = `${hour + 1}:00 AM`
      suggestions.push(`${nextDayFormatted} at ${startTime} - ${endTime}`)
    }

    // Afternoon slots for next day
    for (let hour = 1; hour < 5; hour++) {
      const startTime = `${hour}:00 PM`
      const endTime = `${hour + 1}:00 PM`
      suggestions.push(`${nextDayFormatted} at ${startTime} - ${endTime}`)
    }

    // Generate suggestions for two days after
    const twoDaysAfter = addDays(selectedDate, 2)
    const twoDaysAfterFormatted = format(twoDaysAfter, "EEEE, MMMM d, yyyy")

    // Morning slots for two days after
    for (let hour = 9; hour < 12; hour++) {
      const startTime = `${hour}:00 AM`
      const endTime = `${hour + 1}:00 AM`
      suggestions.push(`${twoDaysAfterFormatted} at ${startTime} - ${endTime}`)
    }

    // Randomly select 6 slots and mark one as recommended
    const shuffled = suggestions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 6)

    // Mark one slot as recommended
    const recommendedIndex = Math.floor(Math.random() * selected.length)
    selected[recommendedIndex] = selected[recommendedIndex] + " (Recommended)"

    return selected
  } catch (error) {
    console.error("Error generating AI suggestions:", error)
    return []
  }
}

