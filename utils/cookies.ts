export const GUEST_ID_COOKIE_NAME = 'seobot_guest_id'
export const ATTR_COOKIE_NAME = 'seobot_attr'
export const ATTR_COOKIE_MAX_AGE_DAYS = 90

export function parseCookie(): Record<string, string> {
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
