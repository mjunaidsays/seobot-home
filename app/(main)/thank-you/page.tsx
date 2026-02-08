import { Metadata } from 'next'
import ThankYouContent from './ThankYouContent'

export const metadata: Metadata = {
  title: 'Thank You | Seoscribed',
  description: "Thanks for your interest in Seoscribed. We're in development and will notify you when the product is ready.",
}

export default function ThankYouPage() {
  return (
    <div className="landing-page-scope bg-[#F8F6F1] text-[#1A1A19] min-h-screen">
      {/* NAV — Same as landing page */}
      <nav className="sticky top-0 z-50 bg-[#F8F6F1]/80 backdrop-blur-md border-b border-[#E0DBD2]">
        <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C2410C] text-white rounded-lg flex items-center justify-center font-bold font-sans">S</div>
            <span className="font-semibold text-lg tracking-tight text-[#1A1A19]">Seoscribed</span>
          </a>
        </div>
      </nav>

      <ThankYouContent />

      {/* FOOTER — Same as landing page */}
      <footer className="py-10 bg-[#141413] border-t border-[#2A2A28]">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[#706B63]">
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
