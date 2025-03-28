"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth/auth-provider"
import { Calendar, CheckCircle, AlertCircle } from "lucide-react"

// Google OAuth configuration with the provided client ID
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "559350327374-qe02ro8mmnb9p1p3jjdmdpkg1vcdtu5d.apps.googleusercontent.com"
const SCOPES = "https://www.googleapis.com/auth/calendar"

// Get the current origin for the redirect URI
const getRedirectUri = () => {
  if (typeof window === "undefined") return ""
  return `${window.location.origin}/calendar/callback`
}

export default function GoogleCalendarAuth() {
  const { user } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [redirectUri, setRedirectUri] = useState("")

  useEffect(() => {
    // Set the redirect URI once the component mounts
    setRedirectUri(getRedirectUri())
  }, [])

  useEffect(() => {
    const checkCalendarConnection = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()

        setIsConnected(!!userData?.googleCalendar?.accessToken)
      } catch (error) {
        console.error("Error checking calendar connection:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkCalendarConnection()
  }, [user])

  const handleConnect = () => {
    if (!user || !redirectUri) return

    console.log("Using redirect URI:", redirectUri)

    // Create the OAuth URL with the provided client ID
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${SCOPES}&include_granted_scopes=true&state=${user.uid}`

    // Open the OAuth window
    window.location.href = authUrl
  }

  const handleDisconnect = async () => {
    if (!user) return

    try {
      // Update the user document to remove the Google Calendar connection
      await setDoc(
        doc(db, "users", user.uid),
        {
          googleCalendar: {
            connected: false,
            accessToken: null,
            expiresAt: null,
          },
        },
        { merge: true },
      )

      setIsConnected(false)
    } catch (error) {
      console.error("Error disconnecting calendar:", error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendar Integration</CardTitle>
          <CardDescription>Connect your Google Calendar to enable scheduling features</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-pulse h-8 w-32 bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>Connect your Google Calendar to enable scheduling features</CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p>Your Google Calendar is connected</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>Connect your Google Calendar to check for conflicts and add meetings automatically</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect Calendar
          </Button>
        ) : (
          <Button
            className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]"
            onClick={handleConnect}
          >
            Connect Google Calendar
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

