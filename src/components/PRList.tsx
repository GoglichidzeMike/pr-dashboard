import React, { useMemo, useState } from 'react'
import { usePullRequests } from '../api/usePullRequests'
import type { GithubPullRequest } from '../types/github'
import PRListItem from './PRListItem'
import PRListControls from './PRListControls'

export type PRListProps = {
  token: string
  selectedRepoFullNames: string[]
}

export const PRList: React.FC<PRListProps> = ({ token, selectedRepoFullNames }) => {
  const [stateFilter, setStateFilter] = useState<'open' | 'closed' | 'all'>('open')
  const [hideDrafts, setHideDrafts] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')

  const dedupSelected = useMemo(() => Array.from(new Set(selectedRepoFullNames)), [selectedRepoFullNames])
  const queries = usePullRequests(token, dedupSelected, stateFilter)

  const isLoading = queries.some((q) => q.isLoading)
  const isError = queries.some((q) => q.isError)
  const error = queries.find((q) => q.error)?.error as Error | undefined
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
      <PRListControls
        stateFilter={stateFilter}
        onStateChange={setStateFilter}
        hideDrafts={hideDrafts}
        onHideDraftsChange={setHideDrafts}
        query={query}
        onQueryChange={setQuery}
      />
      <ul className="divide-y divide-slate-200 dark:divide-slate-800">
        {filteredPrs.map((pr) => (
          <PRListItem key={pr.id} pr={pr} />
        ))}
      </ul>
    </div>
  )
}

export default PRList


