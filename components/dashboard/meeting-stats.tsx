import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarClock, Users, Clock, CheckCircle } from "lucide-react"

interface StatItem {
  title: string
  value: string
  icon: string
  description: string
  trend: string
  trendUp: boolean
}

interface MeetingStatsProps {
  stats: StatItem[]
}

export default function MeetingStats({ stats }: MeetingStatsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "calendar":
        return <CalendarClock className="h-4 w-4 text-muted-foreground" />
      case "clock":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "users":
        return <Users className="h-4 w-4 text-muted-foreground" />
      case "check":
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return <CalendarClock className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {getIcon(stat.icon)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {stat.description}
              <span className={`ml-2 ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>{stat.trend}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

