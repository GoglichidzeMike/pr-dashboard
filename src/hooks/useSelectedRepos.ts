import { useLocalStorage } from './useLocalStorage'

const STORAGE_SELECTED = 'gh-pr-dashboard:selected-repos'

export function useSelectedRepos() {
  const [selected, setSelected] = useLocalStorage<string[]>(STORAGE_SELECTED, [])

  const toggleRepo = (fullName: string) => {
    setSelected((prev) =>
      prev.includes(fullName) ? prev.filter((f) => f !== fullName) : [...prev, fullName],
    )
  }

  return { selected, setSelected, toggleRepo }
}
