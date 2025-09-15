export type GithubUser = {
  login: string
  name: string | null
  avatar_url: string
}

export type GithubOrg = {
  login: string
  avatar_url: string
  description?: string | null
}

export type GithubRepo = {
  id: number
  name: string
  full_name: string
  owner: { login: string; type?: 'User' | 'Organization' }
  private: boolean
}

export type GithubPullRequest = {
  id: number
  number: number
  title: string
  html_url: string
  state: 'open' | 'closed'
  draft: boolean
  user: { login: string }
  head: { ref: string }
  base: { ref: string }
  updated_at: string
  repository?: { name: string; full_name: string }
}


