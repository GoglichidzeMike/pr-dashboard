import { useQueries } from '@tanstack/react-query'
import { fetchRepoPRs } from '../services/repos'
import { fetchPrStatusColor } from '../services/status'

export function usePullRequests(
  token: string,
  repoFullNames: string[],
  state: 'open' | 'closed' | 'all',
) {
  return useQueries({
    queries: repoFullNames.map((full) => {
      const [owner, repo] = full.split('/')
      return {
        queryKey: ['prs', token, owner, repo, state] as const,
        queryFn: async () => fetchRepoPRs(token, owner, repo, state),
        enabled: Boolean(token) && repoFullNames.length > 0,
        staleTime: 30_000,
      }
    }),
  })
}

export function usePrStatuses(
  token: string,
  prs: { repository?: { full_name: string }; head: { sha?: string } }[],
) {
  return useQueries({
    queries: prs.map((pr) => {
      const full = pr.repository?.full_name || ''
      const [owner, repo] = full.split('/')
      const sha = pr.head.sha || ''
      return {
        queryKey: ['pr-status', token, owner, repo, sha] as const,
        queryFn: async () =>
          token && owner && repo && sha ? fetchPrStatusColor(token, owner, repo, sha) : 'gray',
        enabled: Boolean(token) && Boolean(owner && repo && sha),
        staleTime: 15_000,
      }
    }),
  })
}
