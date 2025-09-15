import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw == null) return initialValue
      return JSON.parse(raw) as T
    } catch (err) {
      console.warn(`useLocalStorage: failed to read key ${key}`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`useLocalStorage: failed to write key ${key}`, err)
    }
  }, [key, value])

  return [value, setValue] as const
}
