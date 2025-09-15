import React from 'react'
import type { RepoScope } from './RepoSidebar'

export type RepoScopeToggleProps = {
  scope: RepoScope
  onChange: (scope: RepoScope) => void
  onExpandAll?: () => void
  onCollapseAll?: () => void
}

export const RepoScopeToggle: React.FC<RepoScopeToggleProps> = ({ scope, onChange, onExpandAll, onCollapseAll }) => {
  return (
    <div className="mb-3 flex items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1">
          <input type="radio" name="scope" className="accent-slate-700" checked={scope === 'all'} onChange={() => onChange('all')} />
          All
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="scope" className="accent-slate-700" checked={scope === 'orgs'} onChange={() => onChange('orgs')} />
          Orgs
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="scope" className="accent-slate-700" checked={scope === 'personal'} onChange={() => onChange('personal')} />
          Personal
        </label>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onExpandAll} className="text-slate-500 hover:underline">Expand all</button>
        <button type="button" onClick={onCollapseAll} className="text-slate-500 hover:underline">Collapse all</button>
      </div>
    </div>
  )
}

export default RepoScopeToggle


