import { Link } from 'react-router-dom'
import GhostButton from '../common/GhostButton'
import PrimaryButton from '../common/PrimaryButton'
import { useAuth } from '../../contexts/AuthContext'

const navLinks = [
  { label: 'Fitur', href: '#features' },
  { label: 'Solusi', href: '#solutions' },
  { label: 'Harga', href: '#pricing' },
  { label: 'Kontak', href: '#contact' },
]

export default function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(254, 251, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-iris-edge)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-aubergine-core)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          CAFFE
        </Link>

        {/* Nav Links + CTAs (right side) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-32)',
          }}
        >
          {/* Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-24)',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: 'var(--color-midnight-plum)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-aubergine-core)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-midnight-plum)'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)' }}>
            {user ? (
              <>
                <Link to="/dashboard">
                  <PrimaryButton style={{ padding: '10px 20px', fontSize: '14px' }}>
                    Dashboard
                  </PrimaryButton>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    border: '1px solid #b32d2d',
                    borderRadius: 8,
                    background: '#fff',
                    color: '#b32d2d',
                    cursor: 'pointer',
                  }}
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <GhostButton style={{ padding: '10px 20px', fontSize: '14px' }}>
                    Masuk
                  </GhostButton>
                </Link>
                <a href="#cta">
                  <PrimaryButton style={{ padding: '10px 20px', fontSize: '14px' }}>
                    Coba Gratis
                  </PrimaryButton>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
