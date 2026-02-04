'use client'

type GtagEventParams = Record<string, any>

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

const GOOGLE_ADS_LEAD_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD
const GOOGLE_ADS_COMPLETE_REG_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_COMPLETE_REGISTRATION

function getGoogleAdsId(): string | undefined {
  if (typeof document === 'undefined') return undefined
  const body = document.body
  return body?.dataset.googleAdsId || undefined
}

export function gtagEvent(eventName: string, params: GtagEventParams = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('gtagEvent skipped: gtag not available', {
        eventName,
        params,
      })
    }
    return
  }

  try {
    window.gtag('event', eventName, params)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('gtagEvent sent', { eventName, params })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('gtagEvent error', error)
    }
  }
}

function buildSendTo(label: string | undefined): string | undefined {
  const id = getGoogleAdsId()
  if (!id || !label) return undefined
  return `${id}/${label}`
}

export function trackGoogleAdsLeadConversion(
  params: GtagEventParams = {},
): void {
  const sendTo = buildSendTo(GOOGLE_ADS_LEAD_LABEL)
  if (!sendTo) return

  gtagEvent('conversion', {
    send_to: sendTo,
    ...params,
  })
}

export function trackGoogleAdsCompleteRegistrationConversion(
  params: GtagEventParams = {},
): void {
  const sendTo = buildSendTo(GOOGLE_ADS_COMPLETE_REG_LABEL)
  if (!sendTo) return

  gtagEvent('conversion', {
    send_to: sendTo,
    ...params,
  })
}

