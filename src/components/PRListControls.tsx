import React from 'react'

export type PRListControlsProps = {
  stateFilter: 'open' | 'closed' | 'all'
  onStateChange: (v: 'open' | 'closed' | 'all') => void
  hideDrafts: boolean
  onHideDraftsChange: (v: boolean) => void
  query: string
  onQueryChange: (v: string) => void
}

export const PRListControls: React.FC<PRListControlsProps> = ({ stateFilter, onStateChange, hideDrafts, onHideDraftsChange, query, onQueryChange }) => {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-muted"></div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={stateFilter}
          onChange={(e) => onStateChange(e.target.value as 'open' | 'closed' | 'all')}
          className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-fg">
          <input type="checkbox" className="h-4 w-4 accent-accent" checked={hideDrafts} onChange={(e) => onHideDraftsChange(e.target.checked)} />
          Hide drafts
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search PRs (title, author, branch, repo)"
          className="w-72 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-fg shadow-sm outline-none placeholder:text-muted focus:border-border focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>
  )
}

export default PRListControls


