import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import { fetchRepoPRs, mergePullRequest } from '../services/repos'
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

export type MergePullRequestVariables = {
  owner: string
  repo: string
  number: number
  sha?: string
  options?: {
    merge_method?: 'merge' | 'squash' | 'rebase'
    commit_title?: string
    commit_message?: string
  }
}

export function useMergePullRequest(token: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['merge-pr', token],
    mutationFn: async (vars: MergePullRequestVariables) =>
      mergePullRequest(token, vars.owner, vars.repo, vars.number, vars.options),
    onSuccess: async (_data, vars) => {
      await queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === 'prs' &&
          q.queryKey[2] === vars.owner &&
          q.queryKey[3] === vars.repo,
      })
      await queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === 'pr-status' &&
          q.queryKey[2] === vars.owner &&
          q.queryKey[3] === vars.repo &&
          (!vars.sha || q.queryKey[4] === vars.sha),
      })
    },
  })
}
