"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Timestamp } from "firebase/firestore"

interface Meeting {
  id: string
  title: string
  date: Timestamp | string
  timeSlot?: string
  participants: string[]
  location: string
  organizer: {
    name: string
    email: string
  }
}

interface UpcomingMeetingsProps {
  meetings: Meeting[]
  loading: boolean
}

export default function UpcomingMeetings({ meetings, loading }: UpcomingMeetingsProps) {
  const router = useRouter()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>Your schedule for the next few days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // If no meetings, show empty state
  if (meetings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>Your schedule for the next few days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No upcoming meetings</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have any meetings scheduled for the next few days.
            </p>
            <Button
              onClick={() => router.push("/schedule")}
              className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]"
            >
              Schedule a Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Meetings</CardTitle>
        <CardDescription>Your schedule for the next few days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {meetings.map((meeting) => {
            // Format the date
            const meetingDate = meeting.date instanceof Timestamp ? meeting.date.toDate() : new Date(meeting.date)

            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            let dateDisplay = format(meetingDate, "MMM d")

            if (meetingDate.toDateString() === today.toDateString()) {
              dateDisplay = "Today"
            } else if (meetingDate.toDateString() === tomorrow.toDateString()) {
              dateDisplay = "Tomorrow"
            }

            // Get time from timeSlot or use a default
            const timeDisplay = meeting.timeSlot ? meeting.timeSlot.split(" at ")[1] : format(meetingDate, "h:mm a")

            // Determine location icon
            let locationIcon = <Users className="h-4 w-4" />
            if (
              meeting.location === "zoom" ||
              meeting.location === "google-meet" ||
              meeting.location === "microsoft-teams"
            ) {
              locationIcon = <Video className="h-4 w-4" />
            }

            return (
              <div key={meeting.id} className="flex items-start space-x-4">
                <div className="min-w-10 text-center">
                  <Calendar className="h-5 w-5 mx-auto text-muted-foreground" />
                  <div className="mt-1 text-sm font-medium">{dateDisplay}</div>
                </div>
                <div className="flex-1 space-y-1 border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{meeting.title}</h4>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/meetings/${meeting.id}`)}>
                      View
                    </Button>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{timeDisplay}</span>
                    <span className="mx-2">•</span>
                    {locationIcon}
                    <span className="ml-1 capitalize">{meeting.location}</span>
                  </div>
                  <div className="flex items-center pt-2">
                    <div className="flex -space-x-2">
                      {/* Organizer avatar */}
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] text-white">
                          {meeting.organizer?.name?.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>

                      {/* Participant avatars (up to 2) */}
                      {meeting.participants?.slice(0, 2).map((participant, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarFallback className="text-xs bg-muted">
                            {participant.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}

                      {/* Show +X for additional participants */}
                      {meeting.participants && meeting.participants.length > 2 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{meeting.participants.length - 2}
                        </div>
                      )}
                    </div>
                    <div className="ml-2 text-xs text-muted-foreground">
                      {meeting.participants ? meeting.participants.length + 1 : 1} attendees
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

