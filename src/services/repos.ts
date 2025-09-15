import { GithubClient } from '../lib/github'
import type { GithubPullRequest, GithubRepo } from '../types/github'

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
