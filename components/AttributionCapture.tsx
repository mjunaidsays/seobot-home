'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

type AttributionData = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  utm_id?: string
  gclid?: string
  wbraid?: string
  gbraid?: string
  msclkid?: string
  first_touch_ts?: string
  last_touch_ts?: string
  first_landing_url?: string
  last_landing_url?: string
  initial_referrer?: string
}

const ATTR_COOKIE_NAME = 'seobot_attr'
const ATTR_COOKIE_MAX_AGE_DAYS = 90

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

function getAttributionFromCookie(): AttributionData | null {
  try {
    const cookies = parseCookie()
    const raw = cookies[ATTR_COOKIE_NAME]
    if (!raw) return null
    const decoded = decodeURIComponent(raw)
    return JSON.parse(decoded) as AttributionData
  } catch {
    return null
  }
}

function setAttributionCookie(data: AttributionData) {
  if (typeof document === 'undefined') return
  const encoded = encodeURIComponent(JSON.stringify(data))
  const maxAgeSeconds = ATTR_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${ATTR_COOKIE_NAME}=${encoded}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`
}

function hasNewAttribution(data: AttributionData): boolean {
  return Boolean(
    data.utm_source ||
      data.utm_medium ||
      data.utm_campaign ||
      data.utm_term ||
      data.utm_content ||
      data.utm_id ||
      data.gclid ||
      data.wbraid ||
      data.gbraid ||
      data.msclkid,
  )
}

export default function AttributionCapture() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || !searchParams) return
    if (typeof window === 'undefined') return

    const url = new URL(window.location.href)
    const now = new Date().toISOString()

    const current: AttributionData = {
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      utm_id: searchParams.get('utm_id') || undefined,
      gclid: searchParams.get('gclid') || undefined,
      wbraid: searchParams.get('wbraid') || undefined,
      gbraid: searchParams.get('gbraid') || undefined,
      msclkid: searchParams.get('msclkid') || undefined,
    }

    const existing = getAttributionFromCookie()
    const hasAttributionParams = hasNewAttribution(current)

    // Last non-direct-touch: only overwrite when new UTMs/click IDs are present
    if (!existing) {
      const base: AttributionData = {
        ...current,
        first_touch_ts: now,
        last_touch_ts: now,
        first_landing_url: url.href,
        last_landing_url: url.href,
        initial_referrer: document.referrer || undefined,
      }
      setAttributionCookie(base)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug('AttributionCapture: initial attribution set', base)
      }
      return
    }

    const updated: AttributionData = { ...existing }

    if (hasAttributionParams) {
      updated.utm_source = current.utm_source ?? updated.utm_source
      updated.utm_medium = current.utm_medium ?? updated.utm_medium
      updated.utm_campaign = current.utm_campaign ?? updated.utm_campaign
      updated.utm_term = current.utm_term ?? updated.utm_term
      updated.utm_content = current.utm_content ?? updated.utm_content
      updated.utm_id = current.utm_id ?? updated.utm_id
      updated.gclid = current.gclid ?? updated.gclid
      updated.wbraid = current.wbraid ?? updated.wbraid
      updated.gbraid = current.gbraid ?? updated.gbraid
      updated.msclkid = current.msclkid ?? updated.msclkid
      if (!updated.first_landing_url) {
        updated.first_landing_url = existing.first_landing_url || url.href
      }
      if (!updated.initial_referrer) {
        updated.initial_referrer = existing.initial_referrer || document.referrer || undefined
      }
      updated.last_landing_url = url.href
      updated.last_touch_ts = now
    } else {
      // No new UTMs/click IDs: keep existing attribution, only refresh last_seen metadata
      updated.last_touch_ts = now
      updated.last_landing_url = url.href
    }

    setAttributionCookie(updated)
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('AttributionCapture: attribution updated', updated)
    }
  }, [pathname, searchParams])

  return null
}

