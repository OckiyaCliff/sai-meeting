import type { Meeting } from "@/types/meeting"

export async function sendMeetingInvitation(meeting: Meeting) {
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

    console.log("Sending meeting invitation to:", participants)

    // Send the email using our API route
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: participants,
        to: participants,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Email API error:", errorData)
      throw new Error(`Failed to send email notification: ${errorData.error || response.statusText}`)
    }

    const result = await response.json()
    console.log("Email sending result:", result)
    return true
  } catch (error) {
    console.error("Error sending meeting invitation:", error)
    return false
  }
}

