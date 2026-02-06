import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use | Seoscribed',
}

const linkClass =
  'text-indigo-600 hover:text-indigo-500 transition-all duration-300 underline underline-offset-2'

export default function TermsPage() {
  return (
    <div className="landing-page-scope bg-[#FAFBFC] text-[#1E293B] min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-border-light">
        <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold font-sans">S</div>
            <span className="font-semibold text-lg tracking-tight text-slate-900">Seoscribed</span>
          </a>
        </div>
      </nav>

      <div className="pt-24 md:pt-28 pb-16 md:pb-24 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
            <p className="text-slate-600 leading-relaxed mb-8">
              These Terms of Use govern your use of Seoscribed and our website. By accessing or using our services, you agree to these terms.
            </p>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By creating an account or using Seoscribed, you agree to be bound by these Terms of
                Use and our Privacy Policy. If you do not agree, do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">2. Description of Service</h2>
              <p className="text-slate-600 leading-relaxed">
                Seoscribed provides SEO and content-related tools and services. We reserve the
                right to modify, suspend, or discontinue any part of the service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">3. Account and Registration</h2>
              <p className="text-slate-600 leading-relaxed">
                You must provide accurate information when registering. You are responsible for
                maintaining the confidentiality of your account and for all activity under
                your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">4. Acceptable Use</h2>
              <p className="text-slate-600 leading-relaxed">
                You agree not to use the service for any unlawful purpose or in any way that
                could damage, disable, or impair the service or interfere with others&apos; use.
                You must comply with all applicable laws and our policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">
                5. Payments and Subscriptions
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Paid plans are subject to the pricing and billing terms presented at the time
                of purchase. Fees are non-refundable except as required by law or as stated
                in our refund policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">6. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed">
                Seoscribed and its content, features, and functionality are owned by us and
                protected by intellectual property laws. You may not copy, modify, or
                distribute our materials without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">7. Disclaimers</h2>
              <p className="text-slate-600 leading-relaxed">
                The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
                any kind. We do not guarantee specific SEO or business results from use of
                our tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">
                8. Limitation of Liability
              </h2>
              <p className="text-slate-600 leading-relaxed">
                To the maximum extent permitted by law, Seoscribed shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any
                loss of profits or data arising from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">9. Termination</h2>
              <p className="text-slate-600 leading-relaxed">
                We may suspend or terminate your access to the service at any time for
                violation of these terms or for any other reason. You may cancel your
                account at any time through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">10. Governing Law</h2>
              <p className="text-slate-600 leading-relaxed">
                These terms are governed by the laws applicable in our jurisdiction. Any
                disputes shall be resolved in the courts of that jurisdiction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">11. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                For questions about these Terms of Use, contact us at:{' '}
                <Link href="mailto:bilal.shahid@nuclieos.com" className={linkClass}>
                  bilal.shahid@nuclieos.com
                </Link>
                .
              </p>
            </section>

            <p className="text-slate-500 text-sm">Last updated: February 2nd, 2026</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-10 bg-[#0F172A] border-t border-slate-800">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p>&copy; 2026 Seoscribed. All rights reserved.</p>
            </div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a className="hover:text-white transition-colors" href="/privacy">Privacy Policy</a>
              <a className="hover:text-white transition-colors" href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
