import React, { useMemo, useState } from 'react'
import RepoLinks from './RepoLinks'
import { usePullRequests, usePrStatuses } from '../api/usePullRequests'
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

  const dedupSelected = useMemo(
    () => Array.from(new Set(selectedRepoFullNames)),
    [selectedRepoFullNames],
  )
  const queries = usePullRequests(token, dedupSelected, stateFilter)

  const isLoading = queries.some((q) => q.isLoading)
  const isError = queries.some((q) => q.isError)
  const error = queries.find((q) => q.error)?.error as Error | undefined
  const allPrs: GithubPullRequest[] = queries.flatMap((q, idx) =>
    (q.data || []).map((pr: GithubPullRequest) => ({
      ...pr,
      repository: { name: dedupSelected[idx].split('/')[1], full_name: dedupSelected[idx] },
    })),
  )

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

  const statusQueries = usePrStatuses(token, allPrs)
  const idToStatus = useMemo(() => {
    const map = new Map<number, 'green' | 'red' | 'yellow' | 'gray'>()
    statusQueries.forEach((q, idx) => {
      const pr = allPrs[idx]
      const color = (q.data as 'green' | 'red' | 'yellow' | 'gray' | undefined) || 'gray'
      if (pr) map.set(pr.id, color)
    })
    return map
  }, [statusQueries, allPrs])

  const groupedByRepo = useMemo(() => {
    const groups = new Map<string, GithubPullRequest[]>()
    for (const pr of filteredPrs) {
      const repoFullName = pr.repository?.full_name || 'unknown/unknown'
      const arr = groups.get(repoFullName) ?? []
      arr.push(pr)
      groups.set(repoFullName, arr)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredPrs])

  if (!token) {
    return <div className="text-muted p-6">Enter a token to load data.</div>
  }

  if (selectedRepoFullNames.length === 0) {
    return <div className="text-muted p-6">Select repositories to view pull requests.</div>
  }

  if (isLoading) {
    return <div className="text-muted p-6">Loading pull requests…</div>
  }

  if (isError) {
    return (
      <div className="text-danger p-6">Error loading PRs: {error?.message || 'Unknown error'}</div>
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
      <div>
        {groupedByRepo.map(([repoFullName, prs]) => (
          <section key={repoFullName} className="mb-6">
            <h3 className="text-accent mb-2 flex items-center gap-2 px-2 text-sm font-medium tracking-wide uppercase">
              <span className="leading-none">{repoFullName}</span>
              <RepoLinks repoFullName={repoFullName} />
            </h3>
            <ul className="divide-border/70 space-y-3 divide-y">
              {prs.map((pr) => (
                <PRListItem
                  key={pr.id}
                  pr={pr}
                  statusColor={idToStatus.get(pr.id) || 'gray'}
                  token={token}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export default PRList
