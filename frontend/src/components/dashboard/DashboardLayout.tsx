import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { Toaster } from '../ui/Toast'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile drawer

  // Default: collapsed (icon-only) like reference image on desktop
  // On large screens start collapsed, user can expand
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      // Tablet: always collapsed, Desktop: start collapsed (like reference)
      return window.innerWidth < 1280
    }
    return true
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // Mobile: no collapse state (uses drawer)
        setIsCollapsed(false)
      }
      // On resize above mobile, we keep user preference
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#f4f0f8' }}
    >
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header onSidebarOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-page p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster />
    </div>
  )
}
