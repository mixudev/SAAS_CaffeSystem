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
