import { useEffect, useState } from 'react'

export function usePersistentFlag(key: string, defaultValue: boolean) {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === '1') return true
      if (raw === '0') return false
    } catch (err) {
      console.warn('usePersistentFlag: read error', err)
    }
    return defaultValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, value ? '1' : '0')
    } catch (err) {
      console.warn('usePersistentFlag: write error', err)
    }
  }, [key, value])

  return [value, setValue] as const
}
