import React, { useMemo, useState } from 'react'
import { useRepos } from './api/useRepos'
import type { GithubRepo } from './types/github'
import TokenInput from './components/TokenInput'
import RepoSidebar, { type RepoScope } from './components/RepoSidebar'
import PRList from './components/PRList'
import ThemeToggle from './components/ThemeToggle'


const App: React.FC = () => {
  const [token, setToken] = useState<string>('')
  const [selected, setSelected] = useState<string[]>([])
  const [scope, setScope] = useState<RepoScope>('all')

  const { data: userRepos = [], isLoading: isLoadingUser, isError: isUserError, error: userError } = useRepos(token)
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

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <header className="sticky top-0 z-10 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 p-4">
          <h1 className="text-lg font-semibold">GitHub PR Dashboard</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
        <section className="flex-1">
          {isUserError && (
            <div className="p-6 text-danger">{(userError as Error)?.message}</div>
          )}
          {isLoadingUser && token && (
            <div className="p-6 text-muted">Loading repositories…</div>
          )}
          <PRList token={token} selectedRepoFullNames={selected} />
        </section>
      </main>
    </div>
  )
}

export default App
