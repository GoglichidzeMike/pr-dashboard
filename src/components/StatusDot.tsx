import React from 'react'

export type StatusDotProps = {
  color: 'green' | 'red' | 'yellow' | 'gray'
}

const COLOR_CLASS: Record<StatusDotProps['color'], string> = {
  green: 'bg-emerald-500',
  red: 'bg-red-500',
  yellow: 'bg-amber-400',
  gray: 'bg-gray-400',
}

export const StatusDot: React.FC<StatusDotProps> = ({ color }) => {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${COLOR_CLASS[color]}`} />
}

export default StatusDot
