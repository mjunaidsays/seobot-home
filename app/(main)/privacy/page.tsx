import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Seoscribed',
}

const linkClass =
  'text-indigo-600 hover:text-indigo-500 transition-all duration-300 underline underline-offset-2'

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
            <p className="text-slate-600 leading-relaxed mb-8">
              This Privacy Policy describes how Seoscribed (&quot;we&quot;) collects, uses, and
              protects your data on our website.
            </p>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">1. Data We Collect</h2>
              <p className="text-slate-600 leading-relaxed">
                We collect the following data: Email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">2. Use of Data</h2>
              <p className="text-slate-600 leading-relaxed">
                Collected data is used to provide services, improve the website, and for
                analytics purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">3. Data Protection</h2>
              <p className="text-slate-600 leading-relaxed">
                We implement technical and organizational measures to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">
                4. Sharing Data with Third Parties
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We do not share your data with third parties, except as required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">5. Your Rights</h2>
              <p className="text-slate-600 leading-relaxed">
                You may request access, correction, or deletion of your data by contacting us
                at:{' '}
                <Link href="mailto:bilal.shahid@nuclieos.com" className={linkClass}>
                  bilal.shahid@nuclieos.com
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-slate-900 font-semibold text-lg mb-3">6. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions, please contact us at:{' '}
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
