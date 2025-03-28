import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, TrendingUp, Clock, Users } from "lucide-react"

export default function AIInsights() {
  const insights = [
    {
      icon: <Clock className="h-5 w-5 text-[#ad6bfe]" />,
      title: "Optimal Meeting Times",
      description:
        "Based on your team's activity patterns, Tuesday and Thursday mornings between 10 AM and 12 PM are your most productive meeting times.",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-[#ad6bfe]" />,
      title: "Meeting Efficiency",
      description:
        "Your meetings are 23% shorter than average while maintaining high productivity scores. Keep up the good work!",
    },
    {
      icon: <Users className="h-5 w-5 text-[#ad6bfe]" />,
      title: "Collaboration Patterns",
      description:
        "You collaborate most frequently with the Design and Marketing teams. Consider scheduling a cross-functional sync to align priorities.",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <BrainCircuit className="h-6 w-6 text-[#ad6bfe]" />
        <div>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Smart recommendations based on your meeting patterns</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex space-x-3">
              <div className="mt-0.5">{insight.icon}</div>
              <div>
                <h4 className="font-medium">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

