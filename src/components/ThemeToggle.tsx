import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState<boolean>(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefers
    setDark(isDark)
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    const root = document.documentElement
    root.classList.toggle('dark', next)
    root.setAttribute('data-theme', next ? 'dark' : 'light')
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      className="bg-accent text-accent-fg rounded-md px-3 py-2 text-sm font-medium hover:opacity-90"
      aria-label="Toggle theme"
    >
      {dark ? 'Dark' : 'Light'}
    </button>
  )
}

export default ThemeToggle
