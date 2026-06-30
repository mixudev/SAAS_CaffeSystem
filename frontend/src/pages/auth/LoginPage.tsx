import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import InputField from '../../components/common/InputField'
import PrimaryButton from '../../components/common/PrimaryButton'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Silakan isi email dan kata sandi')
      return
    }
    setError('')
    // TODO: Integrate with API
  }

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-32)' }}>
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--color-aubergine-core)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: 'var(--spacing-16)',
          }}
        >
          CAFFE
        </Link>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-heading)',
            fontWeight: 700,
            lineHeight: 'var(--leading-heading)',
            letterSpacing: 'var(--tracking-heading)',
            color: 'var(--color-midnight-plum)',
          }}
        >
          Masuk ke CAFFE
        </h1>
        <p
          style={{
            fontSize: 'var(--text-body-sm)',
            lineHeight: 'var(--leading-body-sm)',
            color: 'var(--color-steel)',
            marginTop: 'var(--spacing-8)',
          }}
        >
          Masukkan akun Anda untuk melanjutkan
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-20)',
        }}
      >
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: '#fff5f5',
              border: '1px solid #feb2b2',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              color: '#c53030',
            }}
          >
            {error}
          </div>
        )}

        <InputField
          label="Email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Kata Sandi"
          type="password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-8)',
              fontSize: '14px',
              color: 'var(--color-graphite)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{
                width: 16,
                height: 16,
                accentColor: 'var(--color-aubergine-core)',
              }}
            />
            Ingat saya
          </label>
          <a
            href="#"
            style={{
              fontSize: '14px',
              color: 'var(--color-iris-mid)',
            }}
          >
            Lupa kata sandi?
          </a>
        </div>

        <PrimaryButton type="submit" fullWidth style={{ padding: '14px 24px' }}>
          Masuk
        </PrimaryButton>
      </form>

      <p
        style={{
          textAlign: 'center',
          fontSize: '14px',
          color: 'var(--color-steel)',
          marginTop: 'var(--spacing-24)',
        }}
      >
        Belum punya akun?{' '}
        <a
          href="#"
          style={{
            color: 'var(--color-iris-mid)',
            fontWeight: 600,
          }}
        >
          Hubungi admin
        </a>
      </p>
    </AuthLayout>
  )
}
