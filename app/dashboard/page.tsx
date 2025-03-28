"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import UpcomingMeetings from "@/components/dashboard/upcoming-meetings"
import MeetingStats from "@/components/dashboard/meeting-stats"
import ScheduleButton from "@/components/dashboard/schedule-button"
import AIInsights from "@/components/dashboard/ai-insights"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { getUserMeetings, getUpcomingMeetings } from "@/lib/firestore-setup"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [meetings, setMeetings] = useState<any[]>([])
  const [loadingMeetings, setLoadingMeetings] = useState(true)
  const [stats, setStats] = useState({
    totalMeetings: 0,
    meetingHours: 0,
    participants: 0,
    completionRate: 0,
  })
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return

      try {
        // Fetch real data from Firestore
        const upcomingMeetings = await getUpcomingMeetings(user.uid, 5)
        setMeetings(upcomingMeetings)

        // Get all meetings for stats
        const allMeetings = await getUserMeetings(user.uid)

        // Calculate stats from real data
        const totalMeetings = allMeetings.length

        // Calculate total meeting hours
        let totalHours = 0
        allMeetings.forEach((meeting) => {
          const duration = meeting.duration || 30
          totalHours += duration / 60
        })

        // Count unique participants
        const uniqueParticipants = new Set()
        allMeetings.forEach((meeting) => {
          if (meeting.participants) {
            meeting.participants.forEach((participant: string) => {
              uniqueParticipants.add(participant)
            })
          }
        })

        // Set real stats
        setStats({
          totalMeetings,
          meetingHours: Number.parseFloat(totalHours.toFixed(1)),
          participants: uniqueParticipants.size,
          completionRate: 94, // This could be calculated based on completed vs scheduled meetings
        })
      } catch (error) {
        console.error("Error fetching meetings:", error)
        toast({
          title: "Error",
          description: "Failed to load meetings. Please try again.",
          variant: "destructive",
        })

        // Fallback to empty data on error
        setMeetings([])
      } finally {
        setLoadingMeetings(false)
      }
    }

    if (user) {
      fetchMeetings()
    }
  }, [user])

  if (authLoading) {
    return <DashboardSkeleton />
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Welcome, ${user?.displayName || "User"}`}
        text="Manage your meetings and view AI-powered insights."
      >
        <ScheduleButton />
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MeetingStats
          stats={[
            {
              title: "Total Meetings",
              value: stats.totalMeetings.toString(),
              icon: "calendar",
              description: "This month",
              trend: "+12%",
              trendUp: true,
            },
            {
              title: "Meeting Hours",
              value: stats.meetingHours.toString(),
              icon: "clock",
              description: "This month",
              trend: "-5%",
              trendUp: false,
            },
            {
              title: "Participants",
              value: stats.participants.toString(),
              icon: "users",
              description: "Total unique",
              trend: "+24%",
              trendUp: true,
            },
            {
              title: "Completion Rate",
              value: `${stats.completionRate}%`,
              icon: "check",
              description: "On schedule",
              trend: "+2%",
              trendUp: true,
            },
          ]}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="col-span-2">
          <UpcomingMeetings meetings={meetings} loading={loadingMeetings} />
        </div>
        <div className="md:col-span-2 xl:col-span-2">
          <AIInsights />
        </div>
      </div>
    </DashboardShell>
  )
}

function DashboardSkeleton() {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="md:col-span-2 xl:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </main>
    </div>
  )
}

