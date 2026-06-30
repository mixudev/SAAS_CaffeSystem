import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        background: 'var(--surface-cream-canvas)',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-heading)',
          color: 'var(--color-midnight-plum)',
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: 'var(--color-graphite)' }}>
        Selamat datang, {user?.name} — halaman ini sedang dalam pengembangan.
      </p>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 24px',
          border: 'none',
          borderRadius: 8,
          background: '#b32d2d',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  )
}
