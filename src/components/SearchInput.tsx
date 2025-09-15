import React from 'react'

export type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search' }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg shadow-sm outline-none placeholder:text-muted focus:border-border focus:ring-2 focus:ring-accent/20"
    />
  )
}

export default SearchInput


