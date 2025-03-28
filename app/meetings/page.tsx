"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Users, Video, Search, Plus } from "lucide-react"
import { ErrorHandler } from "@/lib/error-handler"
import { logger } from "@/lib/logger"
import { getUserMeetings } from "@/lib/firestore-setup"
import { Timestamp } from "firebase/firestore"

export default function MeetingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [meetings, setMeetings] = useState<any[]>([])
  const [filteredMeetings, setFilteredMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return

      try {
        logger.info("Fetching meetings for user", { userId: user.uid })

        // Fetch real meetings from Firestore
        const userMeetings = await getUserMeetings(user.uid)
        setMeetings(userMeetings)
        setFilteredMeetings(userMeetings)
      } catch (error) {
        ErrorHandler.handleDatabaseError("Failed to fetch meetings", error, { userId: user.uid })
        setMeetings([])
        setFilteredMeetings([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMeetings()
    }
  }, [user])

  // Filter meetings based on search query and active tab
  useEffect(() => {
    if (!meetings.length) {
      setFilteredMeetings([])
      return
    }

    let filtered = [...meetings]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (meeting) =>
          meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by tab
    const now = new Date()

    if (activeTab === "upcoming") {
      filtered = filtered.filter((meeting) => {
        const meetingDate = meeting.date instanceof Timestamp ? meeting.date.toDate() : new Date(meeting.date)
        return meetingDate >= now
      })
    } else if (activeTab === "past") {
      filtered = filtered.filter((meeting) => {
        const meetingDate = meeting.date instanceof Timestamp ? meeting.date.toDate() : new Date(meeting.date)
        return meetingDate < now
      })
    }

    setFilteredMeetings(filtered)
  }, [meetings, searchQuery, activeTab])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  if (authLoading) {
    return <MeetingsSkeleton />
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Meetings" text="View and manage all your scheduled meetings.">
        <Button
          onClick={() => router.push("/schedule")}
          className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </DashboardHeader>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Meetings</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search meetings..." className="pl-8" value={searchQuery} onChange={handleSearch} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "all" ? "All Meetings" : activeTab === "upcoming" ? "Upcoming Meetings" : "Past Meetings"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : filteredMeetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No meetings found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "No meetings match your search criteria."
                    : activeTab === "upcoming"
                      ? "You don't have any upcoming meetings."
                      : activeTab === "past"
                        ? "You don't have any past meetings."
                        : "You don't have any meetings scheduled."}
                </p>
                <Button
                  onClick={() => router.push("/schedule")}
                  className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]"
                >
                  Schedule a Meeting
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMeetings.map((meeting) => {
                  // Format the date
                  const meetingDate = meeting.date instanceof Timestamp ? meeting.date.toDate() : new Date(meeting.date)
                  const formattedDate = format(meetingDate, "EEEE, MMMM d, yyyy")

                  // Get time from timeSlot or use a default
                  const timeDisplay = meeting.timeSlot
                    ? meeting.timeSlot.split(" at ")[1]
                    : format(meetingDate, "h:mm a")

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
                    <div
                      key={meeting.id}
                      className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/meetings/${meeting.id}`)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{meeting.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formattedDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>{timeDisplay}</span>
                          </div>
                          <div className="flex items-center">
                            {locationIcon}
                            <span className="ml-1 capitalize">{meeting.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{meeting.participants ? meeting.participants.length + 1 : 1} attendees</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 sm:mt-0">
                        View Details
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

function MeetingsSkeleton() {
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
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </main>
    </div>
  )
}

