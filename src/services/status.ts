import { GithubClient } from '../lib/github'

export async function fetchPrStatusColor(
  token: string,
  owner: string,
  repo: string,
  sha: string,
): Promise<'green' | 'red' | 'yellow' | 'gray'> {
  const client = new GithubClient({ token })
  try {
    const checks = await client.listCheckRuns(owner, repo, sha)
    if (checks.total_count > 0) {
      const anyInProgress = checks.check_runs.some((c) => c.status !== 'completed')
      if (anyInProgress) return 'yellow'
      const anyFailure = checks.check_runs.some(
        (c) =>
          c.conclusion !== null &&
          c.conclusion !== 'success' &&
          c.conclusion !== 'skipped' &&
          c.conclusion !== 'neutral',
      )
      return anyFailure ? 'red' : 'green'
    }
  } catch {
    return 'gray'
  }
  try {
    const status = await client.getCombinedStatus(owner, repo, sha)
    if (status.state === 'pending') return 'yellow'
    if (status.state === 'success') return 'green'
    if (status.state === 'failure' || status.state === 'error') return 'red'
  } catch {
    return 'gray'
  }
  return 'gray'
}
