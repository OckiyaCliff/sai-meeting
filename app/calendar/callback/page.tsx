"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

export default function GoogleCalendarCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        console.log("Processing OAuth callback")

        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1)
        console.log("Hash fragment:", hash)

        const params = new URLSearchParams(hash)

        // Extract the access token and state (user ID)
        const accessToken = params.get("access_token")
        const state = params.get("state") // This should be the user's UID

        console.log("Access token exists:", !!accessToken)
        console.log("State exists:", !!state)

        if (!accessToken || !state) {
          throw new Error("Invalid callback parameters")
        }

        // Calculate token expiration (typically 1 hour for Google)
        const expiresIn = Number.parseInt(params.get("expires_in") || "3600", 10)
        const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

        // Store the token in Firestore
        await setDoc(
          doc(db, "users", state),
          {
            googleCalendar: {
              connected: true,
              accessToken,
              expiresAt,
            },
          },
          { merge: true },
        )

        console.log("Successfully stored token in Firestore")

        // Redirect back to settings
        router.push("/settings")
      } catch (error) {
        console.error("Error processing OAuth callback:", error)
        setError("Failed to connect Google Calendar. Please try again.")
      }
    }

    processOAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => router.push("/settings")} className="text-primary hover:underline">
            Return to Settings
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Connecting your Google Calendar...</p>
        </div>
      )}
    </div>
  )
}

