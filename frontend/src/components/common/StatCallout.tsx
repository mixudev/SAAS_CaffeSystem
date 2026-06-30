interface Props {
  number: string
  label: string
  dark?: boolean
}

export default function StatCallout({ number, label, dark }: Props) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '76px',
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.61px',
          color: dark ? 'var(--color-pure-white)' : 'var(--color-midnight-plum)',
        }}
      >
        {number}
      </div>
      <p
        style={{
          marginTop: '8px',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--leading-body)',
          color: dark ? 'rgba(255,255,255,0.7)' : 'var(--color-steel)',
        }}
      >
        {label}
      </p>
    </div>
  )
}
