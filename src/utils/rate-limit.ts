export function createRateLimiter(options: {
  windowMs: number
  max: number
}) {
  const store = new Map<string, { count: number; resetTime: number }>()

  // Cleanup loop to prevent memory leaks over time
  if (typeof setInterval !== 'undefined') {
    const interval = setInterval(() => {
      const now = Date.now()
      for (const [key, value] of Array.from(store.entries())) {
        if (now > value.resetTime) {
          store.delete(key)
        }
      }
    }, options.windowMs)
    if (interval.unref) {
      interval.unref()
    }
  }

  return function rateLimit(identifier: string) {
    const now = Date.now()
    const record = store.get(identifier)

    if (!record) {
      store.set(identifier, {
        count: 1,
        resetTime: now + options.windowMs,
      })
      return { success: true, remaining: options.max - 1 }
    }

    if (now > record.resetTime) {
      store.set(identifier, {
        count: 1,
        resetTime: now + options.windowMs,
      })
      return { success: true, remaining: options.max - 1 }
    }

    if (record.count >= options.max) {
      return { success: false, remaining: 0 }
    }

    record.count += 1
    store.set(identifier, record)
    return { success: true, remaining: options.max - record.count }
  }
}

// Instantiate specific limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
})

export const apiRateLimiter = createRateLimiter({
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // 5 attempts
})
