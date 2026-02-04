'use client'

import { useEffect, useState } from 'react'
import { LazyMotion, m, AnimatePresence } from 'framer-motion'

const loadFeatures = () => import('@/lib/framer-features').then(res => res.domAnimation)
import { FaTimes } from 'react-icons/fa'
import ButtonSeobot from '../ui/ButtonSeobot'
import { createClient } from '@/utils/supabase/client'
import { trackEvent } from '@/lib/posthog'
import { trackMeta } from '@/utils/trackMeta'
import { gtagEvent, trackGoogleAdsLeadConversion } from '@/lib/gtag'

interface SeobotAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

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

export default function SeobotAuthModal({ isOpen, onClose }: SeobotAuthModalProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const redirectToThankYou = () => {
    onClose()
    window.location.href = '/thank-you'
  }

  useEffect(() => {
    if (isOpen) {
      // Reset form each time the modal opens so the same user can submit repeatedly.
      setFullName('')
      setEmail('')
      setIsSubmitting(false)
      setFormError(null)

      trackEvent('popup_opened', {
        source: 'try_now_modal',
      })

      trackMeta('ViewContent')
    }
  }, [isOpen])

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    // Track submit click separately from successful lead conversion
    gtagEvent('try_now_continue_click', {
      source: 'try_now_modal',
    })

    try {
      // Track lead submission attempt
      trackEvent('try_now_lead_submitted', {
        source: 'try_now_modal',
        full_name: fullName,
        email,
      })

      // Best-effort: store lead in Supabase guest_users (if configured)
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const supabase = createClient()

          const cookies = parseCookie()
          const existingGuestId = cookies[GUEST_ID_COOKIE_NAME]

          let error = null as unknown as { message: string; code?: string | null } | null

          if (existingGuestId) {
            // Update existing anonymous guest row with identified lead details
            const { error: updateError } = await supabase
              .from('guest_users')
              .update({
                email,
                full_name: fullName,
                source: 'try_now_modal_lead',
                last_seen_at: new Date().toISOString(),
              })
              .eq('id', existingGuestId)

            error = updateError as typeof error
          } else {
            // Fallback: create a new guest row if we don't have an anonymous record
            const { error: insertError } = await supabase.from('guest_users').insert({
              email,
              full_name: fullName,
              source: 'try_now_modal_lead',
            })

            error = insertError as typeof error
          }

          if (error) {
            trackEvent('signup_failed', {
              source: 'try_now_modal',
              email,
              error_message: error.message,
              error_code: error.code ?? undefined,
            })
          } else {
            trackEvent('signup_success', {
              source: 'try_now_modal',
              email,
            })

            trackMeta('Lead', { email })
            // Google Ads Lead conversion (only fires when conversion label + Ads ID are configured)
            trackGoogleAdsLeadConversion({
              email,
            })
          }
        }
      } catch (storageError) {
        // Don't block the UX if storage fails; still proceed to thank-you page.
        trackEvent('signup_failed', {
          source: 'try_now_modal',
          email,
          error_message: storageError instanceof Error ? storageError.message : 'Unknown error',
        })
        console.warn('Lead storage failed:', storageError)
      }

      await new Promise(r => setTimeout(r, REDIRECT_DELAY_MS))
      redirectToThankYou()
    } catch (error) {
      console.error('Lead submit error:', error)
      setFormError(error instanceof Error ? error.message : 'Unknown error')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <LazyMotion features={loadFeatures} strict>
      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Get Started</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-2 -mr-2"
                    aria-label="Close"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  <m.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      Start with your details
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Enter your name and email and we&apos;ll notify you when UpRank is ready to test.
                    </p>

                    <form
                      onSubmit={handleSubmitLead}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onFocus={() => {
                          trackEvent('form_focused_name', { source: 'try_now_modal' })
                          gtagEvent('form_focused_name', { source: 'try_now_modal' })
                        }}
                          required
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                          placeholder="Enter your full name"
                          autoComplete="name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => {
                          trackEvent('form_focused_email', { source: 'try_now_modal' })
                          gtagEvent('form_focused_email', { source: 'try_now_modal' })
                        }}
                          required
                          className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 sm:py-3.5 text-white text-base focus:outline-none focus:border-primary-green transition-colors"
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                      </div>

                      {formError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                          {formError}
                        </div>
                      )}

                      <ButtonSeobot
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full min-h-[48px]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Loading...' : 'Continue'}
                      </ButtonSeobot>
                    </form>
                  </m.div>
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </LazyMotion>
  )
}
