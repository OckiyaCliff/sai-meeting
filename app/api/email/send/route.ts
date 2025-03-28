import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with the API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { to, subject, html, text } = await request.json()

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Log the email attempt for debugging
    console.log("Attempting to send email:", {
      to,
      subject,
      apiKeyExists: !!process.env.RESEND_API_KEY,
    })

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "SAi Meeting <onboarding@resend.dev>", // Use the default sender from Resend
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Email sent successfully:", data)
    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

