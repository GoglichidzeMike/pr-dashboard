import React, { useEffect, useMemo, useState } from 'react'
import { useRepos } from './api/useRepos'
import type { GithubRepo } from './types/github'
import TokenInput from './components/TokenInput'
import RepoSidebar, { type RepoScope } from './components/RepoSidebar'
import PRList from './components/PRList'
import ThemeToggle from './components/ThemeToggle'
import SettingsModal from './components/SettingsModal'


const App: React.FC = () => {
  const [token, setToken] = useState<string>('')
  const STORAGE_SELECTED = 'gh-pr-dashboard:selected-repos'
  const [selected, setSelected] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SELECTED)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter((v) => typeof v === 'string') as string[]
      }
    } catch (err) {
      console.warn('Failed to parse selected repos from storage at init', err)
    }
    return []
  })
  const [scope, setScope] = useState<RepoScope>('all')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SELECTED, JSON.stringify(selected))
    } catch (err) {
      console.warn('Failed to save selected repos to storage', err)
    }
  }, [selected])

  const STORAGE_INCLUDE_PERSONAL = 'gh-pr-dashboard:include-personal'
  const [includePersonal, setIncludePersonal] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_INCLUDE_PERSONAL)
      if (raw === '0') return false
      if (raw === '1') return true
    } catch (err) {
      console.warn('Failed to read includePersonal from storage', err)
    }
    return false
  })

  const { data: userRepos = [], isLoading: isLoadingUser, isError: isUserError, error: userError } = useRepos(token, includePersonal)
  // Dedupe repos by full_name; /user/repos already includes org repos with proper affiliation
  const allRepos: GithubRepo[] = useMemo(() => {
    const map = new Map<string, GithubRepo>()
    for (const r of userRepos) {
      if (!map.has(r.full_name)) map.set(r.full_name, r)
    }
    return Array.from(map.values())
  }, [userRepos])

  const toggleRepo = (fullName: string) => {
    setSelected((prev) => (prev.includes(fullName) ? prev.filter((f) => f !== fullName) : [...prev, fullName]))
  }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INCLUDE_PERSONAL, includePersonal ? '1' : '0')
    } catch (err) {
      console.warn('Failed to persist includePersonal to storage', err)
    }
  }, [includePersonal])

  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <header className="fixed w-full top-0 z-10 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 p-4">
          <h1 className="text-lg font-semibold">GitHub PR Dashboard</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface)]/70"
            >
              Settings
            </button>
          </div>
          <div className="w-full max-w-xl">
            <TokenInput value={token} onChange={setToken} />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-screen-2xl">
        <RepoSidebar
          repos={allRepos}
          selectedFullNames={selected}
          onToggle={toggleRepo}
          headerExtras={<span className="text-xs text-muted">{allRepos.length}</span>}
          scope={scope}
          onScopeChange={setScope}
        />
        <section className="flex-1 pt-24">
          {isUserError && (
            <div className="p-6 text-danger">{(userError as Error)?.message}</div>
          )}
          {isLoadingUser && token && (
            <div className="p-6 text-muted">Loading repositories…</div>
          )}
          <PRList token={token} selectedRepoFullNames={selected} />
        </section>
      </main>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        includePersonal={includePersonal}
        onIncludePersonalChange={setIncludePersonal}
      />
    </div>
  )
}

export default App
