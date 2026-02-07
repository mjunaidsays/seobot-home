'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/posthog'

export default function SectionTracker() {
  const firedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll<HTMLElement>('[data-track-section]')
      if (sections.length === 0) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const name = (entry.target as HTMLElement).dataset.trackSection
            if (!name || firedRef.current.has(name)) return
            firedRef.current.add(name)
            trackEvent('section_viewed', { section_name: name })
          })
        },
        { threshold: 0.3 }
      )

      sections.forEach((el) => observer.observe(el))

      return () => observer.disconnect()
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
