import { ErrorHandler } from "@/lib/error-handler"
import type { Meeting } from "@/types/meeting"

interface EmailOptions {
  to: string[] | string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }

    return true
  } catch (error) {
    ErrorHandler.handleApiError("Failed to send email", error)
    return false
  }
}

export async function sendMeetingInvitation(meeting: Meeting): Promise<boolean> {
  try {
    const { title, description, date, timeSlot, location, participants, organizer } = meeting

    // Create email content
    const subject = `Meeting Invitation: ${title}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #ad6bfe, #7366f6); padding: 20px; color: white; text-align: center;">
          <h1 style="margin: 0;">Meeting Invitation</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #eee; border-top: none;">
          <h2>${title}</h2>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${timeSlot}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Organizer:</strong> ${organizer.name} (${organizer.email})</p>
          ${description ? `<p><strong>Description:</strong> ${description}</p>` : ""}
        </div>
      </div>
    `

    return await sendEmail({
      to: participants,
      subject,
      html,
    })
  } catch (error) {
    ErrorHandler.handleApiError("Error sending meeting invitation", error)
    return false
  }
}

