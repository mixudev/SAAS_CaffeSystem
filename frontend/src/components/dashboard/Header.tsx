import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu'
import {
  Alert,
  AlertAction,
  AlertCancel,
  AlertContent,
  AlertDescription,
  AlertFooter,
  AlertHeader,
  AlertTitle,
  AlertTrigger,
} from '../ui/Alert'
import { LogOut, Menu, User, Bell, ChevronDown, Clock, Store } from 'lucide-react'

const routeLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/pos': 'Point of Sale',
  '/dashboard/inventory': 'Inventaris',
  '/dashboard/hr': 'Manajemen Karyawan',
  '/dashboard/reports': 'Laporan & Analitik',
  '/dashboard/users': 'Pengguna',
}

// Determine greeting by hour
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

// Get current shift
function getShift() {
  const hour = new Date().getHours()
  if (hour >= 7 && hour < 15) return { label: 'Shift Pagi', color: '#F59E0B', bg: '#FEF3C7' }
  if (hour >= 15 && hour < 23) return { label: 'Shift Siang', color: '#6D28D9', bg: '#EDE9FE' }
  return { label: 'Shift Malam', color: '#6B7280', bg: '#F3F4F6' }
}

// Format date in Indonesian
function formatDate() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const outlets = ['Outlet Utama', 'Outlet Selatan', 'Outlet Timur']

interface Props {
  onSidebarOpen: () => void
}

export default function Header({ onSidebarOpen }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedOutlet, setSelectedOutlet] = useState(outlets[0])
  const [notifOpen, setNotifOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U'

  const shift = getShift()
  const isOverview = location.pathname === '/dashboard'

  return (
    <header
      className="shrink-0 border-b"
      style={{
        background: '#ffffff',
        borderColor: '#E5E7EB',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Main Header Row ── */}
      <div className="flex h-[64px] items-center justify-between px-6 lg:px-8">

        {/* Left: Hamburger + Greeting (Overview) or Page Title */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onSidebarOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors lg:hidden"
            style={{ background: '#F6F7FB' }}
            aria-label="Buka sidebar"
          >
            <Menu className="h-5 w-5 text-neutral-600" />
          </button>

          {isOverview ? (
            /* Greeting section */
            <div className="min-w-0">
              <h1
                className="font-display font-bold leading-tight truncate"
                style={{ fontSize: 20, color: '#111827' }}
              >
                {getGreeting()}, {user?.name?.split(' ')[0]} ☕
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Clock className="h-3 w-3 text-neutral-400" />
                <p className="text-[12px] text-neutral-400">{formatDate()}</p>
              </div>
            </div>
          ) : (
            <h1
              className="font-display font-bold truncate"
              style={{ fontSize: 20, color: '#111827' }}
            >
              {routeLabels[location.pathname] ?? 'Dashboard'}
            </h1>
          )}
        </div>

        {/* Right: Outlet + Shift + Notif + User */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Current Shift Badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 rounded-full px-3 h-8"
            style={{ background: shift.bg }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: shift.color }}
            />
            <span className="text-[12px] font-semibold" style={{ color: shift.color }}>
              {shift.label}
            </span>
          </div>

          {/* Outlet Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="hidden md:flex items-center gap-1.5 rounded-xl px-3 h-9 text-[13px] font-medium transition-colors focus:outline-none"
              style={{ background: '#F6F7FB', color: '#374151', border: '1px solid #E5E7EB' }}
            >
              <Store className="h-3.5 w-3.5 text-neutral-400" />
              <span>{selectedOutlet}</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {outlets.map((o) => (
                <DropdownMenuItem
                  key={o}
                  onClick={() => setSelectedOutlet(o)}
                  className={selectedOutlet === o ? 'bg-primary-light text-primary' : ''}
                >
                  <Store className="h-4 w-4" />
                  {o}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px mx-1" style={{ background: '#E5E7EB' }} />

          {/* Notifications */}
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors focus:outline-none"
            style={{ background: notifOpen ? '#F6F7FB' : 'transparent' }}
            title="Notifikasi"
          >
            <Bell className="h-5 w-5" style={{ color: '#6B7280' }} />
            {/* Notification dot */}
            <span
              className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full"
              style={{ background: '#EF4444', boxShadow: '0 0 0 2px white' }}
            />
          </button>

          {/* User menu */}
          <Alert open={alertOpen} onOpenChange={setAlertOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2.5 rounded-xl px-2.5 h-10 transition-colors focus:outline-none"
                style={{ background: '#F6F7FB', border: '1px solid #E5E7EB' }}
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
                </Avatar>
                <span
                  className="hidden sm:block text-[13px] font-semibold leading-none max-w-[100px] truncate"
                  style={{ color: '#111827' }}
                >
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown className="hidden sm:block h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-3">
                  <p className="text-[13px] font-bold" style={{ color: '#111827' }}>{user?.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <User className="h-4 w-4" />
                  Profil Saya
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-danger focus:text-danger focus:bg-danger-light"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </AlertTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertContent>
              <AlertHeader>
                <AlertTitle>Konfirmasi Keluar</AlertTitle>
                <AlertDescription>
                  Apakah Anda yakin ingin keluar? Sesi aktif Anda akan diakhiri.
                </AlertDescription>
              </AlertHeader>
              <AlertFooter>
                <AlertCancel>Batal</AlertCancel>
                <AlertAction onClick={handleLogout}>Ya, Keluar</AlertAction>
              </AlertFooter>
            </AlertContent>
          </Alert>
        </div>
      </div>
    </header>
  )
}
