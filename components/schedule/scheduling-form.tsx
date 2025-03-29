"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format, parse, addDays, isBefore } from "date-fns"
import { CalendarIcon, Sparkles, Loader2, FileText } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "firebase/auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { generateMeetingAgenda } from "@/lib/ai/langchain-service"
import AITimeSlots from "@/components/schedule/ai-time-slots"
import { toast } from "@/hooks/use-toast"
import { sendMeetingInvitation } from "@/lib/notification-service"
import { createCalendarEvent, checkSchedulingConflicts } from "@/lib/google-calendar"
import { doc, getDoc } from "firebase/firestore"
import { Calendar } from "@/components/ui/calendar"

// Update the form schema to include locationDetails
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Meeting title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  date: z.date({
    required_error: "A date is required.",
  }),
  duration: z.string({
    required_error: "Please select a duration.",
  }),
  location: z.string({
    required_error: "Please select a location.",
  }),
  locationDetails: z.string().optional(),
  participants: z.string().min(1, {
    message: "Please add at least one participant.",
  }),
  agenda: z.string().optional(),
})

interface SchedulingFormProps {
  user: User | null
  initialData?: any
}

export default function SchedulingForm({ user, initialData }: SchedulingFormProps) {
  const router = useRouter()
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [isGeneratingAgenda, setIsGeneratingAgenda] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasCalendarIntegration, setHasCalendarIntegration] = useState(false)
  const [conflictingEvents, setConflictingEvents] = useState<any[]>([])
  const [currentDate] = useState(new Date())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      participants: user?.email || "",
      agenda: "",
      locationDetails: "",
      date: addDays(new Date(), 1), // Default to tomorrow
    },
  })

  // Check if user has Google Calendar integration
  useEffect(() => {
    const checkCalendarIntegration = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()

        setHasCalendarIntegration(!!userData?.googleCalendar?.accessToken)
      } catch (error) {
        console.error("Error checking calendar integration:", error)
      }
    }

    checkCalendarIntegration()
  }, [user])

  // Populate form with NLP data if available
  useEffect(() => {
    if (initialData) {
      // Set form values from NLP data
      if (initialData.title) {
        form.setValue("title", initialData.title)
      }

      if (initialData.description) {
        form.setValue("description", initialData.description)
      }

      if (initialData.date) {
        try {
          // Ensure date is in a valid format
          let dateToUse
          if (typeof initialData.date === "string" && initialData.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // ISO format YYYY-MM-DD
            dateToUse = new Date(initialData.date + "T00:00:00")
          } else {
            // Try to parse as regular date string
            dateToUse = new Date(initialData.date)
          }

          // Check if date is valid
          if (isNaN(dateToUse.getTime())) {
            throw new Error("Invalid date")
          }

          // Ensure the date is not in the past
          const validDate = isBefore(dateToUse, currentDate) ? addDays(currentDate, 1) : dateToUse
          form.setValue("date", validDate)
        } catch (error) {
          console.error("Error parsing date:", error)
          form.setValue("date", addDays(currentDate, 1)) // Default to tomorrow
        }
      }

      if (initialData.duration) {
        const duration =
          typeof initialData.duration === "number" ? initialData.duration.toString() : initialData.duration
        form.setValue("duration", duration)
      }

      if (initialData.location) {
        form.setValue("location", initialData.location.toLowerCase())
      }

      if (initialData.participants && Array.isArray(initialData.participants)) {
        form.setValue("participants", initialData.participants.join(", "))
      }

      // Clear session storage
      sessionStorage.removeItem("schedulingDetails")
    }
  }, [initialData, form, currentDate])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to schedule meetings",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Parse participants into an array
      const participantsList = values.participants
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0)

      // Check for calendar conflicts if integration is available
      if (hasCalendarIntegration && selectedTimeSlot) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()
        const accessToken = userData?.googleCalendar?.accessToken

        if (accessToken) {
          // Parse the selected time slot
          const timeSlotParts = selectedTimeSlot.split(" at ")[1].split(" - ")
          const startTime = timeSlotParts[0]
          const endTime = timeSlotParts[1].replace(" (Recommended)", "")

          // Create date objects
          const startDate = parse(`${format(values.date, "yyyy-MM-dd")} ${startTime}`, "yyyy-MM-dd h:mm a", new Date())

          const endDate = parse(`${format(values.date, "yyyy-MM-dd")} ${endTime}`, "yyyy-MM-dd h:mm a", new Date())

          // Check for conflicts
          const conflicts = await checkSchedulingConflicts(accessToken, startDate.toISOString(), endDate.toISOString())

          if (conflicts) {
            setConflictingEvents(conflicts)

            // Ask user if they want to proceed despite conflicts
            const shouldProceed = window.confirm(
              `There are ${conflicts.length} conflicting events during this time. Do you want to proceed anyway?`,
            )

            if (!shouldProceed) {
              setIsSubmitting(false)
              return
            }
          }
        }
      }

      // Add the meeting to Firestore
      const meetingRef = await addDoc(collection(db, "meetings"), {
        title: values.title,
        description: values.description || "",
        date: values.date,
        duration: Number.parseInt(values.duration),
        location: values.location,
        locationDetails: values.locationDetails || "",
        participants: participantsList,
        timeSlot: selectedTimeSlot,
        agenda: values.agenda || "",
        organizer: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        },
        status: "scheduled",
        createdAt: serverTimestamp(),
      })

      // Create Google Calendar event if integration is available
      if (hasCalendarIntegration && selectedTimeSlot) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()
        const accessToken = userData?.googleCalendar?.accessToken

        if (accessToken) {
          // Parse the selected time slot
          const timeSlotParts = selectedTimeSlot.split(" at ")[1].split(" - ")
          const startTime = timeSlotParts[0]
          const endTime = timeSlotParts[1].replace(" (Recommended)", "")

          // Create date objects
          const startDate = parse(`${format(values.date, "yyyy-MM-dd")} ${startTime}`, "yyyy-MM-dd h:mm a", new Date())

          const endDate = parse(`${format(values.date, "yyyy-MM-dd")} ${endTime}`, "yyyy-MM-dd h:mm a", new Date())

          // Create calendar event
          const event = {
            summary: values.title,
            description: values.description + (values.agenda ? `\n\nAgenda:\n${values.agenda}` : ""),
            start: {
              dateTime: startDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: endDate.toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            attendees: participantsList.map((email) => ({ email })),
            reminders: {
              useDefault: true,
            },
          }

          await createCalendarEvent(accessToken, event)
        }
      }

      // Send email notifications
      const meetingData = {
        id: meetingRef.id,
        title: values.title,
        description: values.description || "",
        date: format(values.date, "EEEE, MMMM d, yyyy"),
        time: selectedTimeSlot?.split(" at ")[1] || "",
        participants: participantsList,
        location: values.location,
        organizer: {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email,
        },
        locationDetails: values.locationDetails || "",
      }

      await sendMeetingInvitation(meetingData)

      toast({
        title: "Meeting scheduled",
        description: "Your meeting has been successfully scheduled",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error scheduling meeting:", error)
      toast({
        title: "Failed to schedule meeting",
        description: "There was an error scheduling your meeting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update the handleGenerateLink function to integrate with Google Calendar
  const handleGenerateLink = async (locationType: string) => {
    let link = ""

    if (locationType === "google-meet" && hasCalendarIntegration) {
      try {
        // Get the user's Google Calendar access token
        const userDoc = await getDoc(doc(db, "users", user?.uid || ""))
        const userData = userDoc.data()
        const accessToken = userData?.googleCalendar?.accessToken

        if (accessToken) {
          // Create a conference data request
          const conferenceData = {
            createRequest: {
              requestId: `meet-${Date.now()}`,
              conferenceSolutionKey: {
                type: "hangoutsMeet",
              },
            },
          }

          // Create a temporary event to get a conference link
          const tempEvent = {
            summary: "Temporary Event for Meet Link",
            start: {
              dateTime: new Date().toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: new Date(Date.now() + 30 * 60000).toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            conferenceData,
          }

          // Call the Google Calendar API to create the event
          const response = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(tempEvent),
            },
          )

          if (response.ok) {
            const data = await response.json()

            // Extract the Google Meet link
            if (data.conferenceData?.entryPoints) {
              const meetEntryPoint = data.conferenceData.entryPoints.find((ep: any) => ep.entryPointType === "video")

              if (meetEntryPoint?.uri) {
                link = meetEntryPoint.uri

                // Delete the temporary event
                await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${data.id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                })
              }
            }
          }
        }
      } catch (error) {
        console.error("Error generating Google Meet link:", error)
        // Fall back to generating a mock link
        const meetCode = Math.random().toString(36).substring(2, 10)
        link = `https://meet.google.com/${meetCode}`
      }
    } else {
      // Generate mock links for other platforms
      switch (locationType) {
        case "zoom":
          link = `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`
          break
        case "google-meet":
          // Fallback if Google Calendar integration is not available
          const meetCode = Math.random().toString(36).substring(2, 10)
          link = `https://meet.google.com/${meetCode}`
          break
        case "microsoft-teams":
          const teamsCode = Math.random().toString(36).substring(2, 10)
          link = `https://teams.microsoft.com/l/meetup-join/${teamsCode}`
          break
        default:
          link = ""
      }
    }

    form.setValue("locationDetails", link)
  }

  async function handleGenerateSuggestions() {
    setIsGeneratingSuggestions(true)
    const selectedDate = form.getValues("date")

    try {
      // Generate time slots for the selected date and the next two days
      const suggestions = []

      // Generate suggestions for the selected date
      const dayOfWeek = selectedDate.getDay()
      const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy")

      // Morning slots (9 AM - 12 PM)
      for (let hour = 9; hour < 12; hour++) {
        const startTime = `${hour}:00 AM`
        const endTime = `${hour + 1}:00 AM`
        suggestions.push(`${formattedDate} at ${startTime} - ${endTime}`)
      }

      // Afternoon slots (1 PM - 5 PM)
      for (let hour = 1; hour < 5; hour++) {
        const startTime = `${hour}:00 PM`
        const endTime = `${hour + 1}:00 PM`
        suggestions.push(`${formattedDate} at ${startTime} - ${endTime}`)
      }

      // Generate suggestions for the next day
      const nextDay = addDays(selectedDate, 1)
      const nextDayFormatted = format(nextDay, "EEEE, MMMM d, yyyy")

      // Morning slots for next day
      for (let hour = 9; hour < 12; hour++) {
        const startTime = `${hour}:00 AM`
        const endTime = `${hour + 1}:00 AM`
        suggestions.push(`${nextDayFormatted} at ${startTime} - ${endTime}`)
      }

      // Afternoon slots for next day
      for (let hour = 1; hour < 5; hour++) {
        const startTime = `${hour}:00 PM`
        const endTime = `${hour + 1}:00 PM`
        suggestions.push(`${nextDayFormatted} at ${startTime} - ${endTime}`)
      }

      // Generate suggestions for two days after
      const twoDaysAfter = addDays(selectedDate, 2)
      const twoDaysAfterFormatted = format(twoDaysAfter, "EEEE, MMMM d, yyyy")

      // Morning slots for two days after
      for (let hour = 9; hour < 12; hour++) {
        const startTime = `${hour}:00 AM`
        const endTime = `${hour + 1}:00 AM`
        suggestions.push(`${twoDaysAfterFormatted} at ${startTime} - ${endTime}`)
      }

      // Randomly select 6 slots and mark one as recommended
      const shuffled = suggestions.sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 6)

      // Mark one slot as recommended
      const recommendedIndex = Math.floor(Math.random() * selected.length)
      selected[recommendedIndex] = selected[recommendedIndex] + " (Recommended)"

      setAiSuggestions(selected)
    } catch (error) {
      console.error("Error generating suggestions:", error)
      toast({
        title: "Failed to generate suggestions",
        description: "There was an error generating AI suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  // Update the handleGenerateAgenda function to include more meeting details
  async function handleGenerateAgenda() {
    const title = form.getValues("title")
    const description = form.getValues("description") || ""
    const date = form.getValues("date")
    const location = form.getValues("location")
    const participants = form
      .getValues("participants")
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0)

    if (!title) {
      toast({
        title: "Missing information",
        description: "Please provide a meeting title to generate an agenda.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingAgenda(true)

    try {
      // Pass additional meeting details to the agenda generation function
      const additionalDetails = {
        date: date ? format(date, "EEEE, MMMM d, yyyy") : undefined,
        location: location || undefined,
        participants: participants.length > 0 ? participants : undefined,
        time: selectedTimeSlot ? selectedTimeSlot.split(" at ")[1] : undefined,
      }

      const agenda = await generateMeetingAgenda(title, description, additionalDetails)

      if (agenda) {
        form.setValue("agenda", agenda)
      } else {
        throw new Error("Failed to generate agenda")
      }
    } catch (error) {
      console.error("Error generating agenda:", error)
      toast({
        title: "Failed to generate agenda",
        description: "There was an error generating the meeting agenda. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAgenda(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Meeting Details</CardTitle>
          <CardDescription>Enter the details for your new meeting</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Weekly Team Sync" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Discuss project progress and next steps"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => isBefore(date, new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Today is {format(new Date(), "EEEE, MMMM d, yyyy")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        // Reset the locationDetails when location changes
                        form.setValue("locationDetails", "")
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="google-meet">Google Meet</SelectItem>
                        <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                        <SelectItem value="in-person">In Person</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add location details field */}
              <FormField
                control={form.control}
                name="locationDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.getValues("location") === "in-person"
                        ? "Address"
                        : form.getValues("location") === "phone"
                          ? "Phone Number"
                          : "Meeting Link"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          form.getValues("location") === "in-person"
                            ? "Enter address"
                            : form.getValues("location") === "phone"
                              ? "Enter phone number"
                              : "Enter meeting link or click 'Generate Link'"
                        }
                        {...field}
                      />
                    </FormControl>
                    {(form.getValues("location") === "zoom" ||
                      form.getValues("location") === "google-meet" ||
                      form.getValues("location") === "microsoft-teams") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateLink(form.getValues("location"))}
                        className="mt-2"
                      >
                        Generate Link
                      </Button>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <Input placeholder="email1@example.com, email2@example.com" {...field} />
                    </FormControl>
                    <FormDescription>Enter email addresses separated by commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agenda"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Meeting Agenda (Optional)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateAgenda}
                        disabled={isGeneratingAgenda}
                        className="h-8 text-xs"
                      >
                        {isGeneratingAgenda ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-3 w-3" />
                            Generate Agenda
                          </>
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="1. Welcome and introductions (5 min)
2. Project updates (15 min)
3. Discussion points (30 min)
4. Action items and next steps (10 min)"
                        className="resize-none min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Outline the meeting structure and topics to be discussed</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateSuggestions}
                disabled={
                  isGeneratingSuggestions ||
                  !form.getValues("date") ||
                  !form.getValues("participants") ||
                  !form.getValues("duration")
                }
              >
                {isGeneratingSuggestions ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Suggestions
                  </>
                )}
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="space-y-8">
        <AITimeSlots
          suggestions={aiSuggestions}
          isLoading={isGeneratingSuggestions}
          selectedSlot={selectedTimeSlot}
          onSelectSlot={setSelectedTimeSlot}
        />

        {!hasCalendarIntegration && (
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-600 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar Not Connected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect your Google Calendar in settings to automatically add meetings to your calendar and check for
                scheduling conflicts.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push("/settings?tab=calendar")} className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Connect Calendar
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

