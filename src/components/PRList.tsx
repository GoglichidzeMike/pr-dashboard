import React, { useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { GithubClient } from '../lib/github'
import type { GithubPullRequest } from '../types/github'

export type PRListProps = {
  token: string
  selectedRepoFullNames: string[]
}

export const PRList: React.FC<PRListProps> = ({ token, selectedRepoFullNames }) => {
  const client = useMemo(() => new GithubClient({ token }), [token])
  const [stateFilter, setStateFilter] = useState<'open' | 'closed' | 'all'>('open')
  const [hideDrafts, setHideDrafts] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')

  const queries = useQueries({
    queries: selectedRepoFullNames.map((full) => {
      const [owner, repo] = full.split('/')
      return {
        queryKey: ['prs', token, owner, repo, stateFilter] as const,
        queryFn: async () => client.listPullRequests(owner, repo, stateFilter),
        enabled: Boolean(token) && selectedRepoFullNames.length > 0,
        staleTime: 30_000,
      }
    }),
  })

  const isLoading = queries.some((q) => q.isLoading)
  const isError = queries.some((q) => q.isError)
  const error = queries.find((q) => q.error)?.error as Error | undefined
  const dedupSelected = useMemo(() => Array.from(new Set(selectedRepoFullNames)), [selectedRepoFullNames])
  const allPrs: GithubPullRequest[] = queries
    .flatMap((q, idx) => (q.data || []).map((pr) => ({ ...pr, repository: { name: dedupSelected[idx].split('/')[1], full_name: dedupSelected[idx] } })))

  const filteredPrs: GithubPullRequest[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = allPrs
    if (hideDrafts) list = list.filter((p) => !p.draft)
    if (q) {
      list = list.filter((p) => {
        const title = p.title.toLowerCase()
        const author = p.user.login.toLowerCase()
        const head = p.head.ref.toLowerCase()
        const base = p.base.ref.toLowerCase()
        const repo = (p.repository?.full_name || '').toLowerCase()
        return (
          title.includes(q) ||
          author.includes(q) ||
          head.includes(q) ||
          base.includes(q) ||
          repo.includes(q)
        )
      })
    }
    return list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  }, [allPrs, hideDrafts, query])

  if (!token) {
    return <div className="p-6 text-slate-500">Enter a token to load data.</div>
  }

  if (selectedRepoFullNames.length === 0) {
    return <div className="p-6 text-slate-500">Select repositories to view pull requests.</div>
  }

  if (isLoading) {
    return <div className="p-6 text-slate-500">Loading pull requests…</div>
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">Error loading PRs: {error?.message || 'Unknown error'}</div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500">{filteredPrs.length} pull requests</div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value as 'open' | 'closed' | 'all')}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="all">All</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-slate-700"
              checked={hideDrafts}
              onChange={(e) => setHideDrafts(e.target.checked)}
            />
            Hide drafts
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search PRs (title, author, branch, repo)"
            className="w-72 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {filteredPrs.map((pr) => (
          <li key={`${pr.id}`} className="py-3">
            <a
              href={pr.html_url}
              target="_blank"
              rel="noreferrer"
              className="group block"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-base font-medium group-hover:underline">
                    {pr.title}
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-500">
                    {pr.repository?.full_name} • #{pr.number} • {pr.user.login} • {pr.draft ? 'draft' : pr.state}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-slate-500">
                  {new Date(pr.updated_at).toLocaleString()}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PRList


