import React, { useEffect, useMemo, useState } from 'react'
import type { GithubRepo } from '../types/github'

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
    <aside className="h-full w-72 shrink-0 border-r border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-500">Repositories</h2>
        {headerExtras}
      </div>

      <div className="mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repos"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="scope"
              className="accent-slate-700"
              checked={scope === 'all'}
              onChange={() => onScopeChange('all')}
            />
            All
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="scope"
              className="accent-slate-700"
              checked={scope === 'orgs'}
              onChange={() => onScopeChange('orgs')}
            />
            Orgs
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="scope"
              className="accent-slate-700"
              checked={scope === 'personal'}
              onChange={() => onScopeChange('personal')}
            />
            Personal
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setAllGroups(true)} className="text-slate-500 hover:underline">Expand all</button>
          <button type="button" onClick={() => setAllGroups(false)} className="text-slate-500 hover:underline">Collapse all</button>
        </div>
      </div>

      <div className="flex max-h-[calc(100vh-14rem)] flex-col gap-2 overflow-auto pr-2">
        {groups.map(([group, repos]) => (
          <div key={group}>
            <button
              type="button"
              className="mb-1 mt-2 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              onClick={() => setExpanded((prev) => ({ ...prev, [group]: !(prev[group] ?? true) }))}
              aria-expanded={expanded[group] ?? true}
            >
              <span>{group}</span>
              <span className="text-[10px]">{(expanded[group] ?? true) ? '−' : '+'}</span>
            </button>
            {(expanded[group] ?? true) && (
              <div>
                {repos.map((r) => {
                  const full = r.full_name
                  const nameOnly = r.name
                  const isChecked = selected.has(full)
                  return (
                    <label key={r.id} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                      <input
                        type="checkbox"
                        className="h-4 w-4 shrink-0 accent-slate-700"
                        checked={isChecked}
                        onChange={() => onToggle(full)}
                      />
                      <span className="truncate text-sm">{nameOnly}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-slate-500">No repositories match.</div>
        )}
      </div>
    </aside>
  )
}

export default RepoSidebar


