'use client'

type TrackMetaOptions = {
  email?: string
  phone?: string
  customData?: Record<string, any>
}

const generateEventId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export async function trackMeta(eventName: string, options: TrackMetaOptions = {}) {
  if (typeof window === 'undefined') return

  const eventId = generateEventId()
  const { email, phone, customData } = options

  if (typeof (window as any).fbq === 'function') {
    ;(window as any).fbq('track', eventName, customData || {}, { eventID: eventId })
  }

  try {
    await fetch('/api/meta-event', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        eventName,
        eventId,
        email,
        phone,
        customData: customData || {},
        sourceUrl: window.location.href,
      }),
    })
  } catch {
    // Best-effort; ignore CAPI errors
  }
}

