import React from 'react'

export type SettingsModalProps = {
  open: boolean
  onClose: () => void
  includePersonal: boolean
  onIncludePersonalChange: (value: boolean) => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, includePersonal, onIncludePersonalChange }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-xl">
        <h2 className="mb-3 text-base font-semibold">Settings</h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={includePersonal}
            onChange={(e) => onIncludePersonalChange(e.target.checked)}
            className="accent-[color:var(--color-accent)]"
          />
          Include personal repositories
        </label>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-[color:var(--color-accent)] px-3 py-2 text-sm font-medium text-[color:var(--color-accent-fg)] hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal


