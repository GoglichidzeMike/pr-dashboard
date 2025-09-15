import React from 'react'
import type { RepoScope } from './RepoSidebar'
import { NavArrowDown, NavArrowUp } from 'iconoir-react'

export type RepoScopeToggleProps = {
  scope: RepoScope
  onChange: (scope: RepoScope) => void
  toggleCollapse: () => void
}

export const RepoScopeToggle: React.FC<RepoScopeToggleProps> = ({
  scope,
  onChange,
  toggleCollapse,
}) => {
  return (
    <div className="text-fg mb-3 flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="scope"
            className="accent-accent"
            checked={scope === 'all'}
            onChange={() => onChange('all')}
          />
          All
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="scope"
            className="accent-accent"
            checked={scope === 'orgs'}
            onChange={() => onChange('orgs')}
          />
          Orgs
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="scope"
            className="accent-accent"
            checked={scope === 'personal'}
            onChange={() => onChange('personal')}
          />
          Personal
        </label>
      </div>
      <div className="flex items-center gap-2">
        <div
          onClick={toggleCollapse}
          className="text-muted flex cursor-pointer gap-2 hover:underline"
        >
          <NavArrowUp className="h-4 w-4" />
          <NavArrowDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

export default RepoScopeToggle
