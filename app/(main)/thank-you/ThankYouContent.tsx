'use client'

import { LazyMotion, m } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { trackMeta, META_CR_KEY } from '@/utils/trackMeta'
import { gtagEvent, trackGoogleAdsCompleteRegistrationConversion } from '@/lib/gtag'

const loadFeatures = () => import('@/lib/framer-features').then(res => res.domAnimation)

export default function ThankYouContent() {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    if (typeof window !== 'undefined' && sessionStorage.getItem(META_CR_KEY)) return
    hasTracked.current = true
    if (typeof window !== 'undefined') sessionStorage.setItem(META_CR_KEY, '1')
    trackMeta('CompleteRegistration')
    // Google Ads CompleteRegistration conversion (fires once per session, gated by conversion label + Ads ID)
    trackGoogleAdsCompleteRegistrationConversion()
    // Additional gtag event for thank-you page view
    if (typeof window !== 'undefined') {
      gtagEvent('thank_you_page_view', {
        path: window.location.pathname,
      })
    }
  }, [])

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-8 min-h-[60vh] flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        </div>

        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center shadow-lg">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-200 mb-6"
            >
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </m.div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
              Thanks for providing your information
            </h1>

            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-lg mx-auto mb-8">
              We&apos;re currently in development and will let you know when the product is ready to test.
            </p>

            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4338CA] text-white rounded-lg font-medium hover:bg-indigo-800 transition-all shadow-lg hover:shadow-xl"
            >
              Back to Seoscribed
              <span className="material-icons-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </m.div>
      </div>
    </LazyMotion>
  )
}
