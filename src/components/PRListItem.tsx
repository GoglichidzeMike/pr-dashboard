import React, { useCallback, useState } from 'react'
import type { GithubPullRequest } from '../types/github'
import StatusDot from './StatusDot'
import { useMergePullRequest } from '../api/usePullRequests'

export type PRListItemProps = {
  pr: GithubPullRequest
  statusColor?: 'green' | 'red' | 'yellow' | 'gray'
  token: string
}

export const PRListItem: React.FC<PRListItemProps> = ({ pr, statusColor = 'gray', token }) => {
  const mergeMutation = useMergePullRequest(token)
  const [isMerging, setIsMerging] = useState(false)

  const handleMerge = useCallback(async () => {
    const full = pr.repository?.full_name || ''
    const [owner, repo] = full.split('/')
    if (!token || !owner || !repo) {
      alert('Missing repository information or token')
      return
    }
    try {
      setIsMerging(true)
      await mergeMutation.mutateAsync({
        owner,
        repo,
        number: pr.number,
        sha: pr.head.sha,
        options: { merge_method: 'merge' },
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      alert(`Merge failed: ${msg}`)
    } finally {
      setIsMerging(false)
    }
  }, [mergeMutation, pr.head.sha, pr.number, pr.repository?.full_name, token])

  const canMerge = pr.state === 'open' && !pr.draft

  return (
    <li className="border-border hover:bg-surface rounded-2xl border px-4 py-3">
      <div className="flex items-baseline justify-between gap-4">
        <a
          href={pr.html_url}
          target="_blank"
          rel="noreferrer"
          className="group block min-w-0 flex-1"
        >
          <div className="min-w-0">
            <div className="text-fg truncate text-base font-medium group-hover:underline">
              {pr.title}
            </div>
            <div className="text-muted mt-1 truncate text-xs">
              {pr.repository?.full_name} • #{pr.number} • {pr.user.login} •{' '}
              {pr.draft ? 'draft' : pr.state}
            </div>
          </div>
        </a>
        <div className="text-muted flex shrink-0 items-center gap-2 text-xs">
          <StatusDot color={statusColor} />
          {new Date(pr.updated_at).toLocaleString()}
          <button
            type="button"
            onClick={handleMerge}
            disabled={!canMerge || isMerging}
            className="border-border text-fg hover:bg-accent hover:text-accent-fg ml-2 cursor-pointer rounded-md border px-2 py-1 text-xs"
            title={canMerge ? 'Merge pull request' : 'Cannot merge'}
          >
            {isMerging ? 'Merging…' : 'Merge'}
          </button>
        </div>
      </div>
    </li>
  )
}

export default PRListItem
