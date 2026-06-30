import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
}

export default function DarkButton({
  children,
  fullWidth,
  style,
  ...rest
}: Props) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-8)',
        padding: '18px 24px',
        background: 'var(--color-pure-white)',
        color: 'var(--color-midnight-plum)',
        fontSize: '15px',
        fontWeight: 600,
        letterSpacing: '0.012em',
        lineHeight: 1.2,
        borderRadius: 'var(--radius-buttons)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'background 0.2s ease',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-lavender-wash)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-pure-white)'
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
