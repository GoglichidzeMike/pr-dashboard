import React, { useMemo, useState } from 'react'
import { useRepos } from './api/useRepos'
import type { GithubRepo } from './types/github'
import RepoSidebar, { type RepoScope } from './components/RepoSidebar'
import PRList from './components/PRList'
import ThemeToggle from './components/ThemeToggle'
import SettingsModal from './components/SettingsModal'
import { usePersistentFlag } from './hooks/usePersistentFlag'
import { useSelectedRepos } from './hooks/useSelectedRepos'

const App: React.FC = () => {
  const [token, setToken] = useState<string>('')
  const { selected, toggleRepo } = useSelectedRepos()
  const [scope, setScope] = useState<RepoScope>('all')
  const [includePersonal, setIncludePersonal] = usePersistentFlag(
    'gh-pr-dashboard:include-personal',
    false,
  )

  const {
    data: userRepos = [],
    isLoading: isLoadingUser,
    isError: isUserError,
    error: userError,
  } = useRepos(token, includePersonal)
  // Dedupe repos by full_name; /user/repos already includes org repos with proper affiliation
  const allRepos: GithubRepo[] = useMemo(() => {
    const map = new Map<string, GithubRepo>()
    for (const r of userRepos) {
      if (!map.has(r.full_name)) map.set(r.full_name, r)
    }
    return Array.from(map.values())
  }, [userRepos])

  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <header className="fixed top-0 z-10 w-full border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 p-4">
          <h1 className="text-lg font-semibold">GitHub PR Dashboard</h1>

          <div className="flex gap-2">
            <div className="border-border flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="cursor-pointer rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-fg)] hover:bg-[color:var(--color-surface)]/70"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-screen-2xl">
        <RepoSidebar
          repos={allRepos}
          selectedFullNames={selected}
          onToggle={toggleRepo}
          headerExtras={<span className="text-muted text-xs">{allRepos.length}</span>}
          scope={scope}
          onScopeChange={setScope}
        />
        <section className="flex-1 pt-24">
          {isUserError && <div className="text-danger p-6">{(userError as Error)?.message}</div>}
          {isLoadingUser && token && <div className="text-muted p-6">Loading repositories…</div>}
          <PRList token={token} selectedRepoFullNames={selected} />
        </section>
      </main>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        includePersonal={includePersonal}
        onIncludePersonalChange={setIncludePersonal}
        token={token}
        onTokenChange={setToken}
      />
    </div>
  )
}

export default App
