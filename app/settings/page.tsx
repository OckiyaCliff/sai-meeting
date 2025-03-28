"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardShell from "@/components/dashboard/dashboard-shell"
import GoogleCalendarAuth from "@/components/calendar/google-calendar-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings, Calendar, Bell, Shield } from "lucide-react"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <SettingsSkeleton />
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings and preferences." />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden md:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {/* General settings content */}
              <p>General settings content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6 space-y-6">
          <GoogleCalendarAuth />

          <Card>
            <CardHeader>
              <CardTitle>Calendar Preferences</CardTitle>
              <CardDescription>Configure how your calendar integrates with SAi Meeting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Google Meet Integration</h3>
                <p className="text-sm text-muted-foreground">
                  When you connect your Google Calendar, you can generate real Google Meet links for your meetings. This
                  ensures that all participants receive proper calendar invitations with working video conference links.
                </p>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p className="font-medium">How it works:</p>
                  <ol className="list-decimal pl-5 space-y-1 mt-2">
                    <li>Connect your Google Calendar using the button above</li>
                    <li>When scheduling a meeting, select "Google Meet" as the location</li>
                    <li>Click "Generate Link" to create an official Google Meet link</li>
                    <li>The meeting will be added to your Google Calendar when scheduled</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Notification settings content */}
              <p>Notification settings content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Privacy settings content */}
              <p>Privacy settings content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function SettingsSkeleton() {
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
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-6">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </main>
    </div>
  )
}

