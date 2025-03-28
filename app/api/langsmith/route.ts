import { NextResponse } from "next/server"

// This is a simplified API route that doesn't rely on LangSmith
export async function POST(request: Request) {
  try {
    const { action, data } = await request.json()

    // Log the tracing data instead of sending to LangSmith
    console.log(`LangSmith Tracing: ${action}`, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in LangSmith API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

