import React, { useEffect, useState } from 'react'

export type TokenInputProps = {
  value?: string
  onChange: (token: string) => void
}

const LOCAL_STORAGE_KEY = 'gh_token'

export const TokenInput: React.FC<TokenInputProps> = ({ value, onChange }) => {
  const [token, setToken] = useState<string>(value ?? '')

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!value && saved) {
      setToken(saved)
      onChange(saved)
    }
  }, [value, onChange])

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, token)
    onChange(token)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="password"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
        placeholder="GitHub Personal Access Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 active:bg-slate-950 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Save
      </button>
    </div>
  )
}

export default TokenInput
