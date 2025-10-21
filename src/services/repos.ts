import { GithubClient } from '../lib/github'
import type { GithubPullRequest, GithubRepo, GithubMergeResult } from '../types/github'

export async function fetchUserRepos(
  token: string,
  includePersonal: boolean,
): Promise<GithubRepo[]> {
  const client = new GithubClient({ token })
  return client.listUserRepos({ visibility: 'all', includePersonal })
}

export async function fetchRepoPRs(
  token: string,
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all',
): Promise<GithubPullRequest[]> {
  const client = new GithubClient({ token })
  return client.listPullRequests(owner, repo, state)
}

export async function mergePullRequest(
  token: string,
  owner: string,
  repo: string,
  pullNumber: number,
  options?: {
    merge_method?: 'merge' | 'squash' | 'rebase'
    commit_title?: string
    commit_message?: string
  },
): Promise<GithubMergeResult> {
  const client = new GithubClient({ token })
  return client.mergePullRequest(owner, repo, pullNumber, options)
}
