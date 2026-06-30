import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '12px',
          border: '1px solid #eac8fe',
          background: '#fff',
          color: '#1d1c1d',
          fontSize: '14px',
        },
      }}
    />
  )
}

export { toast } from 'sonner'
