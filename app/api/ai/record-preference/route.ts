import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const preference = await request.json()

    // In a real implementation, this would store the preference data
    // and potentially trigger model retraining
    console.log("Recording preference:", preference)

    // Mock successful response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording preference:", error)
    return NextResponse.json({ error: "Failed to record preference" }, { status: 500 })
  }
}

