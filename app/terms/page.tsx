import Link from "next/link"
import { CalendarClock } from "lucide-react"

export default function TermsAndConditionsPage() {
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
          <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground">
                These terms and conditions govern your use of the SAi Meeting website and services. By using our website
                and services, you accept these terms and conditions in full. If you disagree with these terms and
                conditions or any part of them, you must not use our website or services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. License to Use Website</h2>
              <p className="text-muted-foreground">
                Unless otherwise stated, we or our licensors own the intellectual property rights in the website and
                material on the website. Subject to the license below, all these intellectual property rights are
                reserved.
              </p>
              <p className="text-muted-foreground mt-3">
                You may view, download for caching purposes only, and print pages from the website for your own personal
                use, subject to the restrictions set out below and elsewhere in these terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Acceptable Use</h2>
              <p className="text-muted-foreground mb-3">
                You must not use our website in any way that causes, or may cause, damage to the website or impairment
                of the availability or accessibility of the website; or in any way which is unlawful, illegal,
                fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or
                activity.
              </p>
              <p className="text-muted-foreground">
                You must not use our website to copy, store, host, transmit, send, use, publish or distribute any
                material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke
                logger, rootkit or other malicious computer software.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Accounts</h2>
              <p className="text-muted-foreground mb-3">
                In order to use certain features of the website, you may be required to create a user account. You are
                responsible for maintaining the confidentiality of your account and password and for restricting access
                to your computer, and you agree to accept responsibility for all activities that occur under your
                account or password.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at
                our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Limitations of Liability</h2>
              <p className="text-muted-foreground">
                We will not be liable to you in respect of any losses arising out of any event or events beyond our
                reasonable control. We will not be liable to you in respect of any business losses, including (without
                limitation) loss of or damage to profits, income, revenue, use, production, anticipated savings,
                business, contracts, commercial opportunities or goodwill.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Indemnity</h2>
              <p className="text-muted-foreground">
                You hereby indemnify us and undertake to keep us indemnified against any losses, damages, costs,
                liabilities and expenses (including without limitation legal expenses and any amounts paid by us to a
                third party in settlement of a claim or dispute on the advice of our legal advisers) incurred or
                suffered by us arising out of any breach by you of any provision of these terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Breaches of These Terms and Conditions</h2>
              <p className="text-muted-foreground">
                Without prejudice to our other rights under these terms and conditions, if you breach these terms and
                conditions in any way, we may take such action as we deem appropriate to deal with the breach, including
                suspending your access to the website, prohibiting you from accessing the website, blocking computers
                using your IP address from accessing the website, contacting your internet service provider to request
                that they block your access to the website and/or bringing court proceedings against you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Variation</h2>
              <p className="text-muted-foreground">
                We may revise these terms and conditions from time-to-time. Revised terms and conditions will apply to
                the use of our website from the date of the publication of the revised terms and conditions on our
                website. Please check this page regularly to ensure you are familiar with the current version.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Assignment</h2>
              <p className="text-muted-foreground">
                We may transfer, sub-contract or otherwise deal with our rights and/or obligations under these terms and
                conditions without notifying you or obtaining your consent. You may not transfer, sub-contract or
                otherwise deal with your rights and/or obligations under these terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Severability</h2>
              <p className="text-muted-foreground">
                If a provision of these terms and conditions is determined by any court or other competent authority to
                be unlawful and/or unenforceable, the other provisions will continue in effect. If any unlawful and/or
                unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be
                deemed to be deleted, and the rest of the provision will continue in effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Entire Agreement</h2>
              <p className="text-muted-foreground">
                These terms and conditions constitute the entire agreement between you and us in relation to your use of
                our website, and supersede all previous agreements in respect of your use of this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Law and Jurisdiction</h2>
              <p className="text-muted-foreground">
                These terms and conditions will be governed by and construed in accordance with the laws of [Your
                Jurisdiction], and any disputes relating to these terms and conditions will be subject to the exclusive
                jurisdiction of the courts of [Your Jurisdiction].
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

