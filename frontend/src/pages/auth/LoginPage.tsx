import { useState, type FormEvent } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import InputField from '../../components/common/InputField'
import PrimaryButton from '../../components/common/PrimaryButton'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const [loginInput, setLoginInput] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!loginInput || !password) {
      setError('Silakan isi email/username dan kata sandi')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await login(loginInput, password)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setError(axiosErr.response?.data?.message || 'Terjadi kesalahan')
      } else {
        setError('Terjadi kesalahan')
      }
    } finally {
      setSubmitting(false)
    }
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
          label="Email atau Username"
          type="text"
          placeholder="nama@email.com atau username"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
        />

        <InputField
          label="Kata Sandi"
          type="password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PrimaryButton
          type="submit"
          fullWidth
          style={{ padding: '14px 24px' }}
          disabled={submitting}
        >
          {submitting ? 'Memproses...' : 'Masuk'}
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
