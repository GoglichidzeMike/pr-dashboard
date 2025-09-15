import type {
  GithubRepo,
  GithubPullRequest,
  GithubUser,
  GithubOrg,
  GithubCombinedStatus,
  GithubCheckRunsResponse,
} from '../types/github'

const GITHUB_API_BASE = 'https://api.github.com'

export type GithubClientOptions = {
  token: string
}

export class GithubClient {
  private readonly token: string

  constructor(options: GithubClientOptions) {
    this.token = options.token
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(`GitHub ${response.status}: ${body || response.statusText}`)
    }
    return (await response.json()) as T
  }

  async getViewer(): Promise<GithubUser> {
    return this.request<GithubUser>('/user')
  }

  async listUserRepos(params?: {
    visibility?: 'all' | 'public' | 'private'
    includePersonal?: boolean
  }): Promise<GithubRepo[]> {
    const visibility = params?.visibility ?? 'all'
    const includePersonal = params?.includePersonal ?? true
    const per_page = 100
    const repos: GithubRepo[] = []
    let page = 1
    while (true) {
      const affiliation = includePersonal
        ? 'owner,collaborator,organization_member'
        : 'organization_member'
      const pageData = await this.request<GithubRepo[]>(
        `/user/repos?visibility=${visibility}&affiliation=${affiliation}&per_page=${per_page}&page=${page}`,
      )
      repos.push(
        ...pageData.map((r) => {
          const ownerType = (r as { owner?: { type?: 'User' | 'Organization' } }).owner?.type as
            | 'User'
            | 'Organization'
            | undefined
          return {
            id: r.id,
            name: r.name,
            full_name: r.full_name,
            owner: { login: r.owner.login, type: ownerType },
            private: r.private,
          }
        }),
      )
      if (pageData.length < per_page) break
      page += 1
    }
    return repos
  }

  async listOrgRepos(org: string): Promise<GithubRepo[]> {
    const per_page = 100
    const repos: GithubRepo[] = []
    let page = 1
    while (true) {
      const pageData = await this.request<GithubRepo[]>(
        `/orgs/${org}/repos?type=all&per_page=${per_page}&page=${page}`,
      )
      repos.push(
        ...pageData.map((r) => ({
          id: r.id,
          name: r.name,
          full_name: r.full_name,
          owner: { login: r.owner.login, type: 'Organization' as const },
          private: r.private,
        })),
      )
      if (pageData.length < per_page) break
      page += 1
    }
    return repos
  }

  async listViewerOrgs(): Promise<GithubOrg[]> {
    const per_page = 100
    const orgs: GithubOrg[] = []
    let page = 1
    while (true) {
      const pageData = await this.request<GithubOrg[]>(
        `/user/orgs?per_page=${per_page}&page=${page}`,
      )
      orgs.push(...pageData)
      if (pageData.length < per_page) break
      page += 1
    }
    return orgs
  }

  async listPullRequests(
    owner: string,
    repo: string,
    state: 'open' | 'closed' | 'all' = 'open',
  ): Promise<GithubPullRequest[]> {
    const per_page = 100
    const prs: GithubPullRequest[] = []
    let page = 1
    while (true) {
      const pageData = await this.request<GithubPullRequest[]>(
        `/repos/${owner}/${repo}/pulls?state=${state}&per_page=${per_page}&page=${page}`,
      )
      prs.push(...pageData)
      if (pageData.length < per_page) break
      page += 1
    }
    return prs
  }

  async getCombinedStatus(owner: string, repo: string, ref: string): Promise<GithubCombinedStatus> {
    return this.request(`/repos/${owner}/${repo}/commits/${ref}/status`)
  }

  async listCheckRuns(owner: string, repo: string, ref: string): Promise<GithubCheckRunsResponse> {
    return this.request(`/repos/${owner}/${repo}/commits/${ref}/check-runs`)
  }
}
