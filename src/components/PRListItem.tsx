import React from 'react'
import type { GithubPullRequest } from '../types/github'
import StatusDot from './StatusDot'

export type PRListItemProps = {
  pr: GithubPullRequest
  statusColor?: 'green' | 'red' | 'yellow' | 'gray'
}

export const PRListItem: React.FC<PRListItemProps> = ({ pr, statusColor = 'gray' }) => {
  return (
    <li className="border-border rounded-2xl border px-4 py-3">
      <a href={pr.html_url} target="_blank" rel="noreferrer" className="group block">
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <div className="text-fg truncate text-base font-medium group-hover:underline">
              {pr.title}
            </div>
            <div className="text-muted mt-1 truncate text-xs">
              {pr.repository?.full_name} • #{pr.number} • {pr.user.login} •{' '}
              {pr.draft ? 'draft' : pr.state}
            </div>
          </div>
          <div className="text-muted flex shrink-0 items-center gap-2 text-xs">
            <StatusDot color={statusColor} />
            {new Date(pr.updated_at).toLocaleString()}
          </div>
        </div>
      </a>
    </li>
  )
}

export default PRListItem
