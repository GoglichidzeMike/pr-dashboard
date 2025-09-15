import { useQueries } from '@tanstack/react-query'
import { fetchRepoPRs } from '../services/repos'

export function usePullRequests(token: string, repoFullNames: string[], state: 'open' | 'closed' | 'all') {
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


