import { useEffect, useState } from 'react'

/**
 * Returns a debounced version of the provided value.
 * @param value - The changing value to debounce
 * @param delay - Delay in milliseconds before the value updates
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
