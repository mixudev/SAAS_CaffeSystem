import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  UserCog,
  LogOut,
  X,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

// ── Navigation sections ──────────────────────────────────
const navItems: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[] = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/pos', label: 'Point of Sale', icon: ShoppingCart },
  { to: '/dashboard/inventory', label: 'Inventaris', icon: Package },
  { to: '/dashboard/hr', label: 'Karyawan', icon: Users },
  { to: '/dashboard/reports', label: 'Laporan', icon: BarChart3 },
  { to: '/dashboard/users', label: 'Pengguna', icon: UserCog },
]

const navSections = [
  { label: 'MAIN', items: [navItems[0]] },
  { label: 'OPERATIONS', items: [navItems[1], navItems[2]] },
  { label: 'HR & PEOPLE', items: [navItems[3]] },
  { label: 'ANALYTICS', items: [navItems[4]] },
  { label: 'SYSTEM', items: [navItems[5]] },
]

// Coffee cup SVG logo
const CaffeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

interface Props {
  open: boolean
  onClose: () => void
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
}

export default function Sidebar({ open, onClose, isCollapsed, setIsCollapsed }: Props) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Sidebar background — deep dark purple
  const sidebarBg = {
    background: 'linear-gradient(180deg, #0F001A 0%, #1A0030 60%, #220040 100%)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={sidebarBg}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'lg:w-[76px]' : 'lg:w-[232px]',
          'w-[232px]',
        )}
      >
        {/* ── Brand Header ── */}
        <div
          className={cn(
            'flex shrink-0 items-center px-4 transition-all duration-300',
            'border-b border-white/[0.06]',
            isCollapsed ? 'lg:justify-center lg:px-0 h-[64px]' : 'gap-3 h-[64px]',
          )}
        >
          {/* Logo mark */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',
              boxShadow: '0 4px 16px rgba(109,40,217,0.45)',
            }}
          >
            <CaffeIcon />
          </div>

          {/* Brand text */}
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100',
            )}
          >
            <p className="font-display text-[15px] font-bold tracking-[0.14em] text-white whitespace-nowrap">
              CAFFE
            </p>
            <p className="text-[10px] font-medium tracking-widest text-white/30 whitespace-nowrap uppercase">
              Management
            </p>
          </div>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-white/30 hover:text-white/70 transition-colors lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Desktop collapse toggle — in header */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'hidden lg:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
              'text-white/20 hover:text-white/60 hover:bg-white/8',
              isCollapsed ? 'mx-auto' : 'ml-auto',
            )}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed
              ? <ChevronsRight className="h-4 w-4" />
              : <ChevronsLeft className="h-4 w-4" />
            }
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-3">
          {navSections.map((section, si) => (
            <div key={section.label} className={cn(si > 0 && 'mt-1')}>
              {/* Section label (hidden when collapsed) */}
              {!isCollapsed && (
                <p
                  className="px-4 pb-1 pt-3 text-[10px] font-semibold tracking-[0.1em] text-white/20 uppercase transition-all duration-200"
                >
                  {section.label}
                </p>
              )}
              {isCollapsed && si > 0 && (
                <div className="mx-auto my-2 h-px w-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
              )}

              {/* Nav items */}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className="block px-3"
                >
                  {({ isActive }) => (
                    <span
                      className={cn(
                        'group relative flex items-center rounded-xl transition-all duration-200 select-none cursor-pointer',
                        'h-[48px]',
                        isCollapsed ? 'lg:justify-center lg:px-0 gap-3 px-3' : 'gap-3 px-3',
                        isActive
                          ? 'text-white'
                          : 'text-white/40 hover:text-white/75',
                      )}
                      style={isActive ? {
                        background: 'rgba(109,40,217,0.25)',
                        boxShadow: 'inset 0 0 0 1px rgba(109,40,217,0.35)',
                      } : undefined}
                    >
                      {/* Active left bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                          style={{ background: 'linear-gradient(180deg, #A78BFA, #7C3AED)' }}
                        />
                      )}

                      {/* Icon — 22px */}
                      <item.icon
                        style={{ width: 22, height: 22 }}
                        className={cn(
                          'shrink-0 transition-all duration-200',
                          !isActive && 'group-hover:scale-110',
                        )}
                      />

                      {/* Label */}
                      {!isCollapsed && (
                        <span className="text-[13.5px] font-medium tracking-tight whitespace-nowrap">
                          {item.label}
                        </span>
                      )}

                      {/* Tooltip (collapsed) */}
                      {isCollapsed && (
                        <span
                          className={cn(
                            'pointer-events-none absolute left-full z-50 ml-3',
                            'hidden lg:block',
                            'rounded-lg px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap',
                            'opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg',
                          )}
                          style={{
                            background: '#1A0030',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Bottom: Settings + Logout ── */}
        <div className="shrink-0 border-t px-3 py-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          {/* Settings */}
          <button
            title="Settings"
            className={cn(
              'group mb-0.5 flex w-full items-center rounded-xl transition-all duration-200',
              'h-[44px] text-white/30 hover:text-white/70',
              isCollapsed ? 'lg:justify-center lg:px-0 gap-3 px-3' : 'gap-3 px-3',
            )}
          >
            <Settings style={{ width: 20, height: 20 }} className="shrink-0 transition-transform duration-200 group-hover:rotate-45" />
            {!isCollapsed && <span className="text-[13px] font-medium">Pengaturan</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Keluar"
            className={cn(
              'group flex w-full items-center rounded-xl transition-all duration-200',
              'h-[44px] text-white/30 hover:text-red-400',
              isCollapsed ? 'lg:justify-center lg:px-0 gap-3 px-3' : 'gap-3 px-3',
            )}
          >
            <LogOut style={{ width: 20, height: 20 }} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            {!isCollapsed && <span className="text-[13px] font-medium">Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
