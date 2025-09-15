import React, { useEffect, useMemo, useState } from 'react'
import type { GithubRepo } from '../types/github'
import RepoListItem from './RepoListItem'
import RepoSidebarHeader from './RepoSidebarHeader'
import RepoScopeToggle from './RepoScopeToggle'
import SearchInput from './SearchInput'

export type RepoScope = 'all' | 'orgs' | 'personal'

export type RepoSidebarProps = {
  repos: GithubRepo[]
  selectedFullNames: string[]
  onToggle: (fullName: string) => void
  headerExtras?: React.ReactNode
  scope: RepoScope
  onScopeChange: (scope: RepoScope) => void
}

export const RepoSidebar: React.FC<RepoSidebarProps> = ({ repos, selectedFullNames, onToggle, headerExtras, scope, onScopeChange }) => {
  const selected = new Set(selectedFullNames)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Dedupe by full_name first
    const deduped: GithubRepo[] = []
    const seen = new Set<string>()
    for (const r of repos) {
      if (!seen.has(r.full_name)) {
        seen.add(r.full_name)
        deduped.push(r)
      }
    }
    const scoped = deduped.filter((r) => {
      const isOrg = r.owner.type === 'Organization'
      if (scope === 'orgs') return isOrg
      if (scope === 'personal') return !isOrg
      return true
    })
    if (!q) return scoped
    return scoped.filter((r) => {
      // const owner = r.owner.login.toLowerCase()
      const name = r.name.toLowerCase()
      // const full = r.full_name.toLowerCase()
      return name.includes(q)
    })
  }, [repos, query, scope])

  const groups = useMemo(() => {
    const byOwner = new Map<string, GithubRepo[]>()
    for (const r of filtered) {
      const key = r.owner.type === 'Organization' ? r.owner.login : 'Personal'
      const arr = byOwner.get(key) ?? []
      arr.push(r)
      byOwner.set(key, arr)
    }
    return Array.from(byOwner.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev }
      for (const [group] of groups) if (!(group in next)) next[group] = true
      return next
    })
  }, [groups])

  const setAllGroups = (value: boolean) => {
    const next: Record<string, boolean> = {}
    for (const [group] of groups) next[group] = value
    setExpanded(next)
  }

  return (
    <aside className="h-full w-72 shrink-0 border-r border-border bg-surface/50 p-4">
      <RepoSidebarHeader right={headerExtras} />

      <div className="mb-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Search repos" />
      </div>

      <RepoScopeToggle scope={scope} onChange={onScopeChange} onExpandAll={() => setAllGroups(true)} onCollapseAll={() => setAllGroups(false)} />

      <div className="flex max-h-[calc(100vh-14rem)] flex-col gap-2 overflow-auto pr-2">
        {groups.map(([group, repos]) => (
          <div key={group}>
            <button
              type="button"
              className="mb-1 mt-2 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wide text-muted hover:text-fg"
              onClick={() => setExpanded((prev) => ({ ...prev, [group]: !(prev[group] ?? true) }))}
              aria-expanded={expanded[group] ?? true}
            >
              <span>{group}</span>
              <span className="text-[10px]">{(expanded[group] ?? true) ? '−' : '+'}</span>
            </button>
            {(expanded[group] ?? true) && (
              <div>
                {repos.map((r) => (
                  <RepoListItem key={r.id} repo={r} isSelected={selected.has(r.full_name)} onToggle={onToggle} />
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-muted">No repositories match.</div>
        )}
      </div>
    </aside>
  )
}

export default RepoSidebar


