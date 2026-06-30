import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-12)',
        padding: 'var(--card-padding)',
        background: 'var(--surface-pure-white)',
        borderRadius: 'var(--radius-cards)',
        border: '1px solid var(--color-iris-edge)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-iris-mid)',
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-heading-sm)',
          fontWeight: 700,
          lineHeight: 'var(--leading-heading-sm)',
          letterSpacing: 'var(--tracking-heading-sm)',
          color: 'var(--color-midnight-plum)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--leading-body)',
          color: 'var(--color-graphite)',
        }}
      >
        {description}
      </p>
    </div>
  )
}
