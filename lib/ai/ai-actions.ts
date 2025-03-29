"use server"

import { OpenAI } from "openai"

// Initialize OpenAI client (this will only run on the server)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Server action to generate meeting agenda
export async function generateMeetingAgenda(
  title: string,
  description: string,
  additionalDetails?: {
    date?: string
    time?: string
    location?: string
    participants?: string[]
  },
) {
  try {
    // Format additional details if provided
    let detailsText = ""
    if (additionalDetails) {
      if (additionalDetails.date) {
        detailsText += `\nDate: ${additionalDetails.date}`
      }
      if (additionalDetails.time) {
        detailsText += `\nTime: ${additionalDetails.time}`
      }
      if (additionalDetails.location) {
        detailsText += `\nLocation: ${additionalDetails.location}`
      }
      if (additionalDetails.participants && additionalDetails.participants.length > 0) {
        detailsText += `\nParticipants: ${additionalDetails.participants.join(", ")}`
      }
    }

    // Create a prompt for the OpenAI model
    const prompt = `Generate a detailed meeting agenda for the following meeting:
Title: ${title}
${description ? `Description: ${description}` : ""}${detailsText}

The agenda should include:
1. A brief welcome/introduction section
2. Main discussion points related to the meeting topic
3. Time allocations for each section (in minutes)
4. A conclusion/next steps section

Format the agenda as a numbered list with time allocations in parentheses.
`

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that creates professional meeting agendas.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Return the generated agenda
    return response.choices[0].message.content
  } catch (error) {
    console.error("Error generating meeting agenda:", error)
    // Return a default agenda on error
    return `1. Welcome and introductions (5 minutes)
2. Discuss: ${title} (15 minutes)
${
  description
    ? `3. Review: ${description} (15 minutes)
`
    : ""
}
${description ? "4" : "3"}. Action items and next steps (10 minutes)
${description ? "5" : "4"}. Any other business (5 minutes)`
  }
}

// Server action to process scheduling request
export async function processSchedulingRequest(text: string) {
  try {
    const prompt = `Analyze the following text describing a meeting and extract key details:
${text}

Extract the following information in JSON format:
- title: The meeting title or topic
- description: A brief description of the meeting purpose
- date: The meeting date (if specified, in ISO format YYYY-MM-DD)
- time: The meeting time (if specified, in format like "2:00 PM")
- duration: The meeting duration in minutes (if specified, as a number)
- location: The meeting location or platform (e.g., Zoom, Google Meet, in-person)
- participants: An array of email addresses or names of participants

If any information is not provided in the text, set the value to null.
Ensure that date is in YYYY-MM-DD format or null.
`

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts meeting details from text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    // Parse the JSON response
    const content = response.choices[0].message.content
    if (!content) return null

    const parsedContent = JSON.parse(content)

    // Ensure date is properly formatted or null
    if (parsedContent.date && typeof parsedContent.date === "string") {
      // Check if date is in ISO format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(parsedContent.date)) {
        try {
          // Try to parse and format the date
          const dateObj = new Date(parsedContent.date)
          if (!isNaN(dateObj.getTime())) {
            parsedContent.date = dateObj.toISOString().split("T")[0]
          } else {
            parsedContent.date = null
          }
        } catch (e) {
          parsedContent.date = null
        }
      }
    } else {
      parsedContent.date = null
    }

    // Ensure duration is a number or null
    if (parsedContent.duration && typeof parsedContent.duration !== "number") {
      const durationNum = Number.parseInt(parsedContent.duration)
      parsedContent.duration = isNaN(durationNum) ? null : durationNum
    }

    return parsedContent
  } catch (error) {
    console.error("Error analyzing meeting text:", error)
    return null
  }
}

