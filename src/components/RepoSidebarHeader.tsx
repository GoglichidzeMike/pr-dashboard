import React from 'react'

export type RepoSidebarHeaderProps = {
  title?: string
  right?: React.ReactNode
}

export const RepoSidebarHeader: React.FC<RepoSidebarHeaderProps> = ({ title = 'Repositories', right }) => {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold text-slate-500">{title}</h2>
      {right}
    </div>
  )
}

export default RepoSidebarHeader


