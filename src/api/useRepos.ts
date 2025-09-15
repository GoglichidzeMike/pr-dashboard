import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { GithubRepo } from '../types/github'
import { fetchUserRepos } from '../services/repos'

export function useRepos(token: string, includePersonal: boolean) {
  return useQuery<GithubRepo[]>({
    queryKey: ['repos', 'user', token, includePersonal],
    queryFn: async () => (token ? fetchUserRepos(token, includePersonal) : []),
    enabled: Boolean(token),
    staleTime: 60_000,
    select: (repos) => {
      // Dedupe by full_name
      const map = new Map<string, GithubRepo>()
      for (const r of repos) if (!map.has(r.full_name)) map.set(r.full_name, r)
      return Array.from(map.values())
    },
  })
}

export function useSelectedDedup(selectedFullNames: string[]) {
  return useMemo(() => Array.from(new Set(selectedFullNames)), [selectedFullNames])
}


