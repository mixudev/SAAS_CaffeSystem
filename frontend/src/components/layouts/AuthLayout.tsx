import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-cream-canvas)',
        padding: 'var(--spacing-24)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--surface-pure-white)',
          borderRadius: 'var(--radius-cards)',
          padding: 'var(--card-padding)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
