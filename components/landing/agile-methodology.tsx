import { Card, CardContent } from "@/components/ui/card"
import { GitBranch, RefreshCw, Users, MessageSquare, LineChart, CheckCircle } from "lucide-react"

export default function AgileMethodology() {
  return (
    <section id="methodology" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] px-3 py-1 text-sm text-white mb-2">
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Methodology</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Agile Development Process</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our development process embraces Agile principles to deliver continuous improvement and adapt to changing
            user needs.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ad6bfe]/90 to-[#7366f6]/90 flex items-center justify-center">
                      <div className="text-white text-center p-6 md:p-12 max-w-3xl">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Continuous Improvement Cycle</h3>
                        <p className="text-lg md:text-xl">
                          SAi Meeting evolves through iterative development cycles, incorporating user feedback and
                          adapting to changing requirements.
                        </p>
                      </div>
                    </div>
                    <img
                      src="/placeholder.svg?height=400&width=1200"
                      alt="Agile Development Cycle"
                      className="w-full h-[300px] md:h-[400px] object-cover opacity-20"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <Users className="h-6 w-6 text-[#ad6bfe]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Cross-Functional Teams</h3>
                    <p className="text-muted-foreground mt-1">
                      Our development teams include designers, developers, and AI specialists working collaboratively to
                      deliver complete features.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <GitBranch className="h-6 w-6 text-[#ad6bfe]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Iterative Development</h3>
                    <p className="text-muted-foreground mt-1">
                      Two-week sprints with continuous integration and deployment allow for rapid feature delivery and
                      quick adaptation to feedback.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <MessageSquare className="h-6 w-6 text-[#ad6bfe]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">User Feedback Loop</h3>
                    <p className="text-muted-foreground mt-1">
                      Regular user testing and feedback sessions inform our development priorities and ensure we're
                      building features users actually need.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <LineChart className="h-6 w-6 text-[#ad6bfe]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Data-Driven Decisions</h3>
                    <p className="text-muted-foreground mt-1">
                      Usage analytics and performance metrics guide our development decisions, ensuring we focus on
                      high-impact improvements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <CheckCircle className="h-6 w-6 text-[#ad6bfe]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Quality Assurance</h3>
                    <p className="text-muted-foreground mt-1">
                      Automated testing and continuous integration ensure high-quality code and reliable performance
                      across all microservices.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-0.5">
                    <RefreshCw className="h-6 w-6 text-[#ad6bfe]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Continuous Deployment</h3>
                    <p className="text-muted-foreground mt-1">
                      Automated deployment pipelines allow us to release new features and improvements multiple times
                      per week with minimal disruption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

