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
      <div className="text-sm text-slate-500"></div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={stateFilter}
          onChange={(e) => onStateChange(e.target.value as 'open' | 'closed' | 'all')}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-slate-700" checked={hideDrafts} onChange={(e) => onHideDraftsChange(e.target.checked)} />
          Hide drafts
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search PRs (title, author, branch, repo)"
          className="w-72 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  )
}

export default PRListControls


