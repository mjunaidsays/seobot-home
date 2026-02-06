'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { trackEvent } from '@/lib/posthog'
import { trackMeta } from '@/utils/trackMeta'
import { gtagEvent, trackGoogleAdsLeadConversion } from '@/lib/gtag'

const REDIRECT_DELAY_MS = 1000
const GUEST_ID_COOKIE_NAME = 'seobot_guest_id'

function parseCookie(): Record<string, string> {
  if (typeof document === 'undefined') return {}
  return document.cookie.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.split('=')
    if (!rawKey) return acc
    const key = rawKey.trim()
    const value = rest.join('=')
    if (!key) return acc
    acc[key] = value
    return acc
  }, {})
}

export default function BetaSignupForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    gtagEvent('beta_signup_submitted', {
      source: 'landing_page_cta',
    })

    try {
      trackEvent('beta_signup_submitted', {
        source: 'landing_page_cta',
        email,
      })

      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const supabase = createClient()

          const cookies = parseCookie()
          const existingGuestId = cookies[GUEST_ID_COOKIE_NAME]

          let error = null as unknown as { message: string; code?: string | null } | null

          if (existingGuestId) {
            const { error: updateError } = await supabase
              .from('guest_users')
              .update({
                email,
                source: 'landing_page_cta_lead',
                last_seen_at: new Date().toISOString(),
              })
              .eq('id', existingGuestId)

            error = updateError as typeof error
          } else {
            const { error: insertError } = await supabase.from('guest_users').insert({
              email,
              source: 'landing_page_cta_lead',
            })

            error = insertError as typeof error
          }

          if (error) {
            trackEvent('signup_failed', {
              source: 'landing_page_cta',
              email,
              error_message: error.message,
              error_code: error.code ?? undefined,
            })
          } else {
            trackEvent('signup_success', {
              source: 'landing_page_cta',
              email,
            })

            trackMeta('Lead', { email })
            trackGoogleAdsLeadConversion({ email })
          }
        }
      } catch (storageError) {
        trackEvent('signup_failed', {
          source: 'landing_page_cta',
          email,
          error_message: storageError instanceof Error ? storageError.message : 'Unknown error',
        })
        console.warn('Lead storage failed:', storageError)
      }

      await new Promise(r => setTimeout(r, REDIRECT_DELAY_MS))
      window.location.href = '/thank-you'
    } catch (error) {
      console.error('Lead submit error:', error)
      setFormError(error instanceof Error ? error.message : 'Unknown error')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-5">
      <input
        className="w-full px-5 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        placeholder="Your email address"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => {
          trackEvent('form_focused_email', { source: 'landing_page_cta' })
          gtagEvent('form_focused_email', { source: 'landing_page_cta' })
        }}
        disabled={isSubmitting}
      />
      {formError && (
        <div className="text-red-400 text-sm px-1">{formError}</div>
      )}
      <button
        className="w-full px-5 py-4 bg-white text-slate-900 font-bold text-base rounded-lg hover:bg-slate-100 transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Get Free Beta Access'}
        {!isSubmitting && <span className="material-icons-outlined text-sm">arrow_forward</span>}
      </button>
    </form>
  )
}
