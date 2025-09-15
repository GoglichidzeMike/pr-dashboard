import React from 'react'
import type { GithubPullRequest } from '../types/github'

export type PRListItemProps = {
  pr: GithubPullRequest
}

export const PRListItem: React.FC<PRListItemProps> = ({ pr }) => {
  return (
    <li className="py-3">
      <a
        href={pr.html_url}
        target="_blank"
        rel="noreferrer"
        className="group block"
      >
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-base font-medium text-fg group-hover:underline">
              {pr.title}
            </div>
            <div className="mt-1 truncate text-xs text-muted">
              {pr.repository?.full_name} • #{pr.number} • {pr.user.login} • {pr.draft ? 'draft' : pr.state}
            </div>
          </div>
          <div className="shrink-0 text-xs text-muted">
            {new Date(pr.updated_at).toLocaleString()}
          </div>
        </div>
      </a>
    </li>
  )
}

export default PRListItem


