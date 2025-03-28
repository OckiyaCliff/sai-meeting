import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic scheduling for individuals",
      features: ["5 meetings per month", "Calendar integration", "Basic AI suggestions", "Email notifications"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      description: "Advanced features for professionals",
      features: [
        "Unlimited meetings",
        "AI-powered scheduling",
        "Meeting summaries",
        "Custom availability",
        "Team scheduling",
        "Priority support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "Complete solution for teams",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Advanced analytics",
        "Admin controls",
        "Custom integrations",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] px-3 py-1 text-sm text-white mb-2">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pricing</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, Transparent Pricing</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Choose the plan that's right for you and start scheduling smarter today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {plans.map((plan, index) => (
            <Card key={index} className={`border-0 shadow-md ${plan.popular ? "ring-2 ring-[#7366f6]" : ""}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Popular
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-[#7366f6] mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard" className="w-full">
                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] hover:from-[#9d5bfe] hover:to-[#6356f6]" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

