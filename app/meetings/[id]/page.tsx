"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { format } from "date-fns"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, MapPin, Users, Trash2, Edit, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { getMeeting, deleteMeeting } from "@/lib/firestore-setup"
import { Timestamp } from "firebase/firestore"

export default function MeetingDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const meetingId = params.id as string

  const [meeting, setMeeting] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchMeeting = async () => {
      if (!user || !meetingId) return

      try {
        const meetingData = await getMeeting(meetingId)
        setMeeting(meetingData)
      } catch (error) {
        console.error("Error fetching meeting:", error)
        toast({
          title: "Error",
          description: "Failed to load meeting details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMeeting()
  }, [meetingId, user])

  const handleDelete = async () => {
    if (!user || !meetingId) return

    setDeleting(true)
    try {
      await deleteMeeting(meetingId)
      toast({
        title: "Meeting deleted",
        description: "The meeting has been successfully deleted.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting meeting:", error)
      toast({
        title: "Error",
        description: "Failed to delete meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = () => {
    router.push(`/meetings/${meetingId}/edit`)
  }

  const handleCopyLink = () => {
    const meetingUrl = `${window.location.origin}/meetings/${meetingId}`
    navigator.clipboard.writeText(meetingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isOrganizer = meeting?.organizer?.uid === user?.uid

  if (authLoading || loading) {
    return <MeetingDetailSkeleton />
  }

  if (!meeting) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Meeting Not Found" text="The requested meeting could not be found." />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">
              This meeting may have been deleted or you don't have permission to view it.
            </p>
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  // Format the meeting date
  const meetingDate = meeting.date instanceof Timestamp ? meeting.date.toDate() : new Date(meeting.date)

  const formattedDate = format(meetingDate, "EEEE, MMMM d, yyyy")

  return (
    <DashboardShell>
      <DashboardHeader heading={meeting.title} text={`Scheduled for ${formattedDate}`}>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
          {isOrganizer && (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the meeting and remove it from
                      everyone's calendar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground"
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-muted-foreground">{meeting.timeSlot?.split(" at ")[1] || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-muted-foreground capitalize">{meeting.location || "Not specified"}</p>
                {meeting.locationDetails && (
                  <p className="text-sm text-muted-foreground mt-1 break-all">
                    {meeting.location === "in-person"
                      ? "Address: "
                      : meeting.location === "phone"
                        ? "Phone: "
                        : "Link: "}
                    {meeting.locationDetails}
                  </p>
                )}
                {meeting.location &&
                  meeting.locationDetails &&
                  meeting.location !== "in-person" &&
                  meeting.location !== "phone" && (
                    <Button variant="link" className="h-auto p-0 text-primary" asChild>
                      <a href={meeting.locationDetails} target="_blank" rel="noopener noreferrer">
                        Join Meeting <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Participants</p>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] text-white text-xs">
                        {meeting.organizer?.name?.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{meeting.organizer?.name || meeting.organizer?.email}</span>
                    <Badge variant="outline" className="ml-1">
                      Organizer
                    </Badge>
                  </div>

                  {meeting.participants?.map((participant: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-muted text-xs">
                          {participant.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{participant}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {meeting.description ? (
                <p className="whitespace-pre-line">{meeting.description}</p>
              ) : (
                <p className="text-muted-foreground italic">No description provided</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agenda</CardTitle>
            </CardHeader>
            <CardContent>
              {meeting.agenda ? (
                <p className="whitespace-pre-line">{meeting.agenda}</p>
              ) : (
                <p className="text-muted-foreground italic">No agenda provided</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

function MeetingDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Skeleton className="h-8 w-40" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-6">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>
        </div>
      </main>
    </div>
  )
}

