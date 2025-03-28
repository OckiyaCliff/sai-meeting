import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Calendar, Clock, Users, BrainCircuit, MessageSquare, Bell } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-[#ad6bfe]" />,
      title: "AI-Powered Suggestions",
      description:
        "Our AI analyzes past meetings, preferences, and availability to suggest optimal meeting times for all participants.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-[#ad6bfe]" />,
      title: "Smart Calendar Integration",
      description:
        "Seamlessly integrates with your existing calendars to find available slots without the back-and-forth.",
    },
    {
      icon: <Clock className="h-10 w-10 text-[#ad6bfe]" />,
      title: "Time Zone Intelligence",
      description:
        "Automatically handles time zone differences, ensuring everyone sees meeting times in their local time zone.",
    },
    {
      icon: <Users className="h-10 w-10 text-[#ad6bfe]" />,
      title: "Team Availability",
      description: "Visualize team availability at a glance and find the perfect time for everyone to meet.",
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-[#ad6bfe]" />,
      title: "Meeting Summaries",
      description: "AI-generated meeting summaries and action items sent automatically after each meeting.",
    },
    {
      icon: <Bell className="h-10 w-10 text-[#ad6bfe]" />,
      title: "Smart Reminders",
      description: "Contextual reminders that know when to notify based on your habits and meeting importance.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] px-3 py-1 text-sm text-white mb-2">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Features</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Smart Features for Effortless Scheduling
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            SAi Meeting combines powerful AI with intuitive design to make scheduling meetings a breeze.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

