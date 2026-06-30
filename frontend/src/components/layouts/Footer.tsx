export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-iris-edge)',
        padding: 'var(--spacing-40) 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-16)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--color-aubergine-core)',
          }}
        >
          CAFFE
        </div>

        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-24)',
            fontSize: '14px',
            color: 'var(--color-steel)',
          }}
        >
          <a href="#features" style={{ color: 'inherit' }}>Fitur</a>
          <a href="#solutions" style={{ color: 'inherit' }}>Solusi</a>
          <a href="#pricing" style={{ color: 'inherit' }}>Harga</a>
          <a href="#contact" style={{ color: 'inherit' }}>Kontak</a>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-fog)',
          }}
        >
          &copy; {new Date().getFullYear()} CAFFE. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
