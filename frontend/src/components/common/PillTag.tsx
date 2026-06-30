import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PillTag({ children }: Props) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 16px',
        background: 'var(--color-lavender-wash)',
        color: 'var(--color-midnight-plum)',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: 1.56,
        letterSpacing: '0.17px',
        borderRadius: 'var(--radius-tags)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}
