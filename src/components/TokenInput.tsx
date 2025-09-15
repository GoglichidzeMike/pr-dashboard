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
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg shadow-sm outline-none placeholder:text-muted focus:border-border focus:ring-2 focus:ring-accent/20"
        placeholder="GitHub Personal Access Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg hover:opacity-90 active:opacity-100"
      >
        Save
      </button>
    </div>
  )
}

export default TokenInput
