import React from 'react'

export type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border-border bg-surface text-fg placeholder:text-muted focus:border-border focus:ring-accent/20 w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none focus:ring-2"
    />
  )
}

export default SearchInput
