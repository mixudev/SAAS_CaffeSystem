import { type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function InputField({ label, error, id, ...rest }: Props) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={inputId}
        style={{
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 1.56,
          letterSpacing: '0.17px',
          color: 'var(--color-midnight-plum)',
        }}
      >
        {label}
      </label>
      <input
        id={inputId}
        style={{
          padding: '14px 16px',
          fontSize: '16px',
          lineHeight: 1.38,
          color: 'var(--color-midnight-plum)',
          background: 'var(--color-ash)',
          borderRadius: 'var(--radius-inputs)',
          border: error ? '1px solid #e53e3e' : '1px solid transparent',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          outline: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-aubergine-core)'
          e.currentTarget.style.boxShadow = 'var(--shadow-subtle)'
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
        {...rest}
      />
      {error && (
        <span
          style={{
            fontSize: '12px',
            lineHeight: 1.2,
            color: '#e53e3e',
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
}
