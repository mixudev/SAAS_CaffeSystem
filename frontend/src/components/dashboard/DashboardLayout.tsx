import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'
import { Toaster } from '../ui/Toast'
import { TooltipProvider } from '../ui/Tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/Modal'
import { LogOut } from 'lucide-react'

export default function DashboardLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1280
    }
    return true
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <TooltipProvider delayDuration={200}>
      <style>{`
        @keyframes rippleWave {
          0% { transform: scale(0.9); opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .ripple-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1.5px solid rgba(220,38,38,0.45);
          animation: rippleWave 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .ripple-ring-delay-1 { animation-delay: 0.7s; }
        .ripple-ring-delay-2 { animation-delay: 1.4s; }
        @keyframes alertSlideUp {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .alert-slide-up { animation: alertSlideUp 0.35s ease-out 0.05s both; }
      `}</style>
      <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onLogoutOpen={() => setLogoutOpen(true)}
        />

        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Header
            onSidebarOpen={() => setSidebarOpen(true)}
            onLogoutOpen={() => setLogoutOpen(true)}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-page p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>

        <Toaster />
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="!rounded-none p-0 gap-0 border border-slate-200 border-t-4 border-t-emerald-600 overflow-hidden sm:max-w-[360px] shadow-2xl [&>button]:hidden data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
          <div className="flex flex-col items-center text-center px-7 pt-8 pb-6 alert-slide-up">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <span className="ripple-ring" />
              <span className="ripple-ring ripple-ring-delay-1" />
              <span className="ripple-ring ripple-ring-delay-2" />
              <LogOut className="relative h-8 w-8 text-red-600" />
            </div>
            <DialogHeader className="space-y-1.5 mt-5">
              <DialogTitle className="text-base font-semibold text-slate-900">
                Keluar dari akun?
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 leading-relaxed">
                Sesi kasir akan diakhiri dan kamu perlu login kembali
                untuk melanjutkan transaksi.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="flex-row gap-3 m-0 px-6 pb-6 pt-0 sm:flex-row">
            <button
              onClick={() => setLogoutOpen(false)}
              className="h-11 flex-1 border border-slate-200 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              onClick={handleLogout}
              className="h-11 flex-1 bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-emerald-700"
            >
              Ya, Logout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
