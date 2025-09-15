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
  head: { ref: string; sha?: string }
  base: { ref: string; sha?: string }
  updated_at: string
  repository?: { name: string; full_name: string }
}

export type GithubCombinedStatus = {
  state: 'success' | 'failure' | 'error' | 'pending'
  statuses: Array<{ state: 'success' | 'failure' | 'error' | 'pending'; context: string }>
}

export type GithubCheckRun = {
  status: 'queued' | 'in_progress' | 'completed'
  conclusion:
    | null
    | 'success'
    | 'failure'
    | 'neutral'
    | 'cancelled'
    | 'skipped'
    | 'timed_out'
    | 'action_required'
}

export type GithubCheckRunsResponse = {
  total_count: number
  check_runs: GithubCheckRun[]
}
