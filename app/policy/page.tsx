import Link from "next/link"
import { CalendarClock } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SAi Meeting</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 container py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to SAi Meeting. We respect your privacy and are committed to protecting your personal data. This
                privacy policy will inform you about how we look after your personal data when you visit our website and
                tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
              <p className="text-muted-foreground mb-3">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Identity Data</strong> includes first name, last name, username or similar identifier.
                </li>
                <li>
                  <strong>Contact Data</strong> includes email address and telephone numbers.
                </li>
                <li>
                  <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type
                  and version, time zone setting and location, browser plug-in types and versions, operating system and
                  platform, and other technology on the devices you use to access this website.
                </li>
                <li>
                  <strong>Profile Data</strong> includes your username and password, your preferences, feedback, and
                  survey responses.
                </li>
                <li>
                  <strong>Usage Data</strong> includes information about how you use our website and services.
                </li>
                <li>
                  <strong>Calendar Data</strong> includes information from your connected calendar services, such as
                  Google Calendar.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
              <p className="text-muted-foreground mb-3">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To register you as a new customer.</li>
                <li>To provide and improve our services to you.</li>
                <li>To manage our relationship with you.</li>
                <li>To make suggestions and recommendations to you about services that may be of interest to you.</li>
                <li>To administer and protect our business and this website.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-muted-foreground">
                We have put in place appropriate security measures to prevent your personal data from being accidentally
                lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to
                your personal data to those employees, agents, contractors, and other third parties who have a business
                need to know.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
              <p className="text-muted-foreground">
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we
                collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or
                reporting requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Legal Rights</h2>
              <p className="text-muted-foreground mb-3">
                Under certain circumstances, you have rights under data protection laws in relation to your personal
                data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new
                privacy policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                <a href="mailto:privacy@saimeeting.com" className="text-primary ml-1">
                  privacy@saimeeting.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p>Last updated: March 29, 2025</p>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SAi Meeting</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SAi Meeting. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

