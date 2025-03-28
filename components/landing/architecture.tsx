import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, Server, Code, Database, Layers, Cpu } from "lucide-react"

export default function Architecture() {
  return (
    <section id="architecture" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-gradient-to-r from-[#ad6bfe] to-[#7366f6] px-3 py-1 text-sm text-white mb-2">
            <div className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              <span>Architecture</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Modern Microservices Architecture
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            SAi Meeting is built on a scalable, resilient microservices architecture that enables rapid development and
            seamless updates.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Code className="h-10 w-10 text-[#ad6bfe]" />
              </div>
              <CardTitle>React.js & Next.js Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Dynamic and responsive interface with server-side rendering (SSR) for enhanced speed and SEO
                performance. Component-based architecture enables rapid UI development.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Server className="h-10 w-10 text-[#ad6bfe]" />
              </div>
              <CardTitle>Node.js Microservices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Non-blocking, event-driven backend services that handle concurrent scheduling requests efficiently. Each
                service is independently deployable and maintainable.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Database className="h-10 w-10 text-[#ad6bfe]" />
              </div>
              <CardTitle>Firebase Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Secure authentication, real-time database, and cloud functions for serverless operations. Provides
                scalable infrastructure with minimal configuration.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Network className="h-10 w-10 text-[#ad6bfe]" />
              </div>
              <CardTitle>RESTful API Gateway</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Unified API gateway that routes requests to appropriate microservices. Enables fast data interchange and
                integration with external systems.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Cpu className="h-10 w-10 text-[#ad6bfe]" />
              </div>
              <CardTitle>AI Processing Service</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Dedicated microservice for AI operations including scheduling optimization, meeting analysis, and smart
                recommendations using OpenAI integration.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="mb-2">
                <Layers className="h-10 w-10 text-[#ad6bfe]" />
              </div>
              <CardTitle>Fault Isolation & Resilience</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Service isolation ensures system stability even when individual components fail. Circuit breakers and
                retry mechanisms maintain high availability.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

