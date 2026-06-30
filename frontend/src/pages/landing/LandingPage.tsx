import { Link } from 'react-router-dom'
import Navbar from '../../components/layouts/Navbar'
import Footer from '../../components/layouts/Footer'
import PillTag from '../../components/common/PillTag'
import PrimaryButton from '../../components/common/PrimaryButton'
import GhostButton from '../../components/common/GhostButton'
import DarkButton from '../../components/common/DarkButton'
import FeatureCard from '../../components/common/FeatureCard'
import StatCallout from '../../components/common/StatCallout'

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'POS Offline-First',
    description:
      'Tetap mencatat transaksi meskipun internet terputus. Data otomatis tersinkronisasi saat koneksi kembali.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Manajemen Stok',
    description:
      'Pantau stok bahan baku secara real-time. Dapatkan notifikasi otomatis saat stok menipis.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'HR & Shift',
    description:
      'Atur jadwal shift karyawan, absensi clock-in/out, dan pengajuan cuti dalam satu dashboard.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'Payroll Otomatis',
    description:
      'Hitung gaji berdasarkan shift, absensi, dan overtime secara otomatis. Slip gaji digital siap unduh.',
  },
]

const stats = [
  { number: '50+', label: 'Kafe Terdaftar' },
  { number: '< 1.5dtk', label: 'Kecepatan Transaksi' },
  { number: '99.5%', label: 'Uptime Server' },
]

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ===== HERO ===== */}
        <section
          className="section-padding"
          style={{
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `
                radial-gradient(20vw circle at 10% 70%, rgba(255,100,150,0.2) 0%, transparent 70%),
                radial-gradient(20vw circle at 30% 70%, rgba(100,150,255,0.2) 0%, transparent 70%),
                radial-gradient(20vw circle at 65% 70%, rgba(100,255,150,0.15) 0%, transparent 70%),
                radial-gradient(20vw circle at 90% 70%, rgba(255,255,100,0.15) 0%, transparent 70%)
              `,
            }}
          />

          <div className="container" style={{ position: 'relative' }}>
            <div style={{ marginBottom: 'var(--spacing-24)' }}>
              <PillTag>Sistem Manajemen Kafe #1 di Indonesia</PillTag>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-display)',
                fontWeight: 700,
                lineHeight: 'var(--leading-display)',
                letterSpacing: 'var(--tracking-display)',
                color: 'var(--color-midnight-plum)',
                maxWidth: 900,
                margin: '0 auto var(--spacing-24)',
              }}
            >
              Kelola Kafe Anda,{' '}
              <span
                style={{
                  background: 'var(--gradient-ember-to-violet)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Semakin Cerdas
              </span>
            </h1>

            <p
              style={{
                fontSize: 'var(--text-subheading)',
                lineHeight: 'var(--leading-subheading)',
                color: 'var(--color-graphite)',
                maxWidth: 600,
                margin: '0 auto var(--spacing-32)',
              }}
            >
              Dari POS offline-first hingga payroll otomatis — kelola seluruh
              operasional kafe Anda dalam satu platform terintegrasi.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-16)',
                flexWrap: 'wrap',
              }}
            >
              <a href="#cta">
                <PrimaryButton>Coba Gratis</PrimaryButton>
              </a>
              <Link to="/login">
                <GhostButton>Masuk</GhostButton>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== LOGO CLOUD ===== */}
        <section className="section-padding-sm" style={{ textAlign: 'center' }}>
          <div className="container">
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.057em',
                textTransform: 'uppercase',
                color: 'var(--color-fog)',
                marginBottom: 'var(--spacing-24)',
              }}
            >
              Dipercaya oleh puluhan kafe di Indonesia
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--spacing-40)',
                flexWrap: 'wrap',
                opacity: 0.5,
              }}
            >
              {['Kopi Nusantara', 'Espresso Bar', 'Brew & Co', 'Java House', 'Kafe Kita'].map(
                (name) => (
                  <span
                    key={name}
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-graphite)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {name}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* ===== PRODUCT SCREENSHOT ===== */}
        <section className="section-padding">
          <div className="container">
            <div
              style={{
                background: 'var(--surface-pure-white)',
                borderRadius: 'var(--radius-cards)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
                maxWidth: 1000,
                margin: '0 auto',
              }}
            >
              {/* Simulasi browser chrome */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  background: '#f5f3f5',
                  borderBottom: '1px solid var(--color-ash)',
                }}
              >
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
                <span
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'var(--color-fog)',
                    background: 'var(--color-pure-white)',
                    borderRadius: 4,
                    padding: '4px 12px',
                    maxWidth: 300,
                    margin: '0 auto',
                  }}
                >
                  caffe.app/dashboard
                </span>
              </div>

              {/* Simulasi dashboard POS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr 240px',
                  minHeight: 400,
                  background: 'var(--color-pure-white)',
                }}
              >
                {/* Sidebar */}
                <div
                  style={{
                    background: 'var(--color-plum-deep)',
                    padding: 'var(--spacing-16)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                    CAFFE
                  </div>
                  {['Dashboard', 'POS', 'Menu', 'Stok', 'Karyawan', 'Laporan'].map(
                    (item) => (
                      <div
                        key={item}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 4,
                          fontSize: 14,
                          color: item === 'POS' ? 'white' : 'rgba(255,255,255,0.6)',
                          background: item === 'POS' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        }}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>

                {/* Daftar Menu */}
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-midnight-plum)', marginBottom: 8 }}>
                    Menu Populer
                  </div>
                  {[
                    { name: 'Espresso', price: 'Rp 25.000' },
                    { name: 'Cappuccino', price: 'Rp 35.000' },
                    { name: 'Latte', price: 'Rp 35.000' },
                    { name: 'Mocha', price: 'Rp 40.000' },
                    { name: 'Matcha Latte', price: 'Rp 38.000' },
                  ].map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 4,
                        background: 'var(--color-ash)',
                        fontSize: 14,
                        color: 'var(--color-midnight-plum)',
                      }}
                    >
                      <span>{item.name}</span>
                      <span style={{ fontWeight: 600 }}>{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Keranjang */}
                <div
                  style={{
                    padding: 16,
                    borderLeft: '1px solid var(--color-ash)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-midnight-plum)', marginBottom: 8 }}>
                    Pesanan
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-steel)' }}>2 Espresso</div>
                  <div style={{ fontSize: 13, color: 'var(--color-steel)' }}>1 Cappuccino</div>
                  <div style={{ borderTop: '1px solid var(--color-ash)', marginTop: 8, paddingTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                      <span>Total</span>
                      <span>Rp 85.000</span>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 'auto',
                      padding: '12px',
                      background: 'var(--color-aubergine-core)',
                      color: 'white',
                      textAlign: 'center',
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Bayar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section
          id="features"
          className="section-padding"
        >
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-40)' }}>
              <PillTag>Fitur Unggulan</PillTag>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-display)',
                  fontWeight: 700,
                  lineHeight: 'var(--leading-display)',
                  letterSpacing: 'var(--tracking-display)',
                  color: 'var(--color-midnight-plum)',
                  marginTop: 'var(--spacing-24)',
                }}
              >
                Semua yang Anda Butuhkan
              </h2>
              <p
                style={{
                  fontSize: 'var(--text-subheading)',
                  color: 'var(--color-graphite)',
                  marginTop: 'var(--spacing-12)',
                }}
              >
                Platform all-in-one untuk operasional kafe modern
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--spacing-24)',
              }}
            >
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== DARK STORYTELLING SECTION ===== */}
        <section
          className="section-padding"
          style={{
            background: 'var(--surface-plum-deep)',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {/* Radial gradient washes on dark */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `
                radial-gradient(20vw circle at 15% 50%, rgba(255,100,150,0.15) 0%, transparent 70%),
                radial-gradient(20vw circle at 85% 50%, rgba(100,150,255,0.15) 0%, transparent 70%)
              `,
            }}
          />

          {/* Decorative sparkle dots */}
          {[
            { top: '15%', left: '10%' },
            { top: '25%', right: '15%' },
            { bottom: '20%', left: '20%' },
            { bottom: '30%', right: '10%' },
          ].map((pos, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.3)',
                ...pos,
              }}
            />
          ))}

          <div className="container" style={{ position: 'relative' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '58px',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.004em',
                color: 'var(--color-pure-white)',
                maxWidth: 700,
                margin: '0 auto var(--spacing-24)',
              }}
            >
              Siap Mengubah Cara Anda Mengelola Kafe?
            </h2>
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.4,
                color: 'rgba(255,255,255,0.8)',
                maxWidth: 500,
                margin: '0 auto var(--spacing-32)',
              }}
            >
              Bergabung dengan puluhan kafe di Indonesia yang sudah merasakan
              kemudahan operasional harian bersama CAFFE.
            </p>
            <DarkButton>Mulai Gratis Sekarang</DarkButton>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="section-padding">
          <div
            className="container"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-40)',
            }}
          >
            {stats.map((stat) => (
              <StatCallout key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section id="cta" className="section-padding" style={{ textAlign: 'center' }}>
          <div className="container">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-heading-lg)',
                fontWeight: 700,
                lineHeight: 'var(--leading-heading-lg)',
                color: 'var(--color-midnight-plum)',
                marginBottom: 'var(--spacing-16)',
              }}
            >
              Mulai Kelola Kafe Anda Sekarang
            </h2>
            <p
              style={{
                fontSize: 'var(--text-subheading)',
                color: 'var(--color-graphite)',
                marginBottom: 'var(--spacing-32)',
                maxWidth: 500,
                margin: '0 auto var(--spacing-32)',
              }}
            >
              Gratis setup. Tidak perlu kartu kredit. Konsultan implementasi siap
              membantu.
            </p>
            <PrimaryButton style={{ fontSize: '16px', padding: '20px 32px' }}>
              Mulai Gratis
            </PrimaryButton>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
