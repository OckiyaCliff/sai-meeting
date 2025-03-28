import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "SAi Meeting has completely transformed how our team schedules meetings. The AI suggestions are spot on, and we've saved hours of back-and-forth emails.",
      author: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      avatar: "SJ",
    },
    {
      quote:
        "The time zone handling alone is worth it. Our international team no longer has confusion about meeting times, and the AI always finds slots that work for everyone.",
      author: "Michael Chen",
      role: "Engineering Lead at GlobalTech",
      avatar: "MC",
    },
    {
      quote:
        "I was skeptical about AI scheduling, but SAi Meeting has proven its value. The meeting summaries and action items have improved our team's productivity significantly.",
      author: "Priya Patel",
      role: "Operations Director at InnovateCo",
      avatar: "PP",
    },
  ]

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] px-3 py-1 text-sm text-white mb-2">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Testimonials</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Loved by Teams Everywhere</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            See what our users are saying about how SAi Meeting has transformed their scheduling experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 text-lg italic">"{testimonial.quote}"</div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] text-white">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

