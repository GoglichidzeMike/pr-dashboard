import React from 'react'

export type RepoLinksProps = {
  repoFullName: string
}

interface RepoLinkProps {
  href: string
  children: string
}

const RepoLink: React.FC<RepoLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="border-border hoverLbg-surface hover:bg-accent text-accent hover:text-accent-fg rounded-md border px-2 py-0.5 transition-colors"
    >
      {children}
    </a>
  )
}

export const RepoLinks: React.FC<RepoLinksProps> = ({ repoFullName }) => {
  return (
    <div className="text-muted flex items-center gap-1 text-[11px] font-normal tracking-normal normal-case">
      <RepoLink href={`https://github.com/${repoFullName}`}>Code</RepoLink>
      <RepoLink href={`https://github.com/${repoFullName}/pulls`}>PRs</RepoLink>
      <RepoLink href={`https://github.com/${repoFullName}/actions`}>Actions</RepoLink>
    </div>
  )
}

export default RepoLinks
