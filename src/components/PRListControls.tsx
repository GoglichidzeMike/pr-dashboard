import React from 'react'

export type PRListControlsProps = {
  stateFilter: 'open' | 'closed' | 'all'
  onStateChange: (v: 'open' | 'closed' | 'all') => void
  hideDrafts: boolean
  onHideDraftsChange: (v: boolean) => void
  query: string
  onQueryChange: (v: string) => void
}

export const PRListControls: React.FC<PRListControlsProps> = ({
  stateFilter,
  onStateChange,
  hideDrafts,
  onHideDraftsChange,
  query,
  onQueryChange,
}) => {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-muted text-sm"></div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={stateFilter}
          onChange={(e) => onStateChange(e.target.value as 'open' | 'closed' | 'all')}
          className="border-border bg-surface rounded-md border px-2 py-1 text-sm"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
        <label className="text-fg flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="accent-accent h-4 w-4"
            checked={hideDrafts}
            onChange={(e) => onHideDraftsChange(e.target.checked)}
          />
          Hide drafts
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search PRs (title, author, branch, repo)"
          className="border-border bg-surface text-fg placeholder:text-muted focus:border-border focus:ring-accent/20 w-72 rounded-md border px-3 py-1.5 text-sm shadow-sm outline-none focus:ring-2"
        />
      </div>
    </div>
  )
}

export default PRListControls
