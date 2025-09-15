import React from 'react'
import type { GithubRepo } from '../types/github'

export type RepoListItemProps = {
  repo: GithubRepo
  isSelected: boolean
  onToggle: (fullName: string) => void
}

export const RepoListItem: React.FC<RepoListItemProps> = ({ repo, isSelected, onToggle }) => {
  const fullName = repo.full_name
  const nameOnly = repo.name

  return (
    <label className="hover:bg-surface flex w-full items-center gap-2 rounded-md px-2 py-1.5">
      <input
        type="checkbox"
        className="accent-accent h-4 w-4 shrink-0"
        checked={isSelected}
        onChange={() => onToggle(fullName)}
      />
      <span className="text-fg truncate text-sm">{nameOnly}</span>
    </label>
  )
}

export default RepoListItem
