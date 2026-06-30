import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  Package,
  ChefHat,
  Users,
  CreditCard,
  BarChart3,
  UserCog,
  LogOut,
  Settings,
  ChevronLeft,
  Coffee,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/Tooltip'

const navItems: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'Orders', icon: Receipt },
  { to: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { to: '/dashboard/kitchen', label: 'Kitchen', icon: ChefHat },
  { to: '/dashboard/customers', label: 'Customers', icon: Users },
  { to: '/dashboard/transactions', label: 'Transactions', icon: CreditCard },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/employees', label: 'Employees', icon: UserCog },
]

interface Props {
  open: boolean
  onClose: () => void
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
  onLogoutOpen: () => void
}

export default function Sidebar({ open, onClose, isCollapsed, setIsCollapsed, onLogoutOpen }: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 5px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 9999px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.32); }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.18) transparent; }
        .sidebar-scroll-collapsed::-webkit-scrollbar { width: 2px; }
        .sidebar-scroll-collapsed::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll-collapsed::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 9999px; }
        .sidebar-scroll-collapsed { scrollbar-width: none; }
        .sidebar-scroll-collapsed { -ms-overflow-style: none; }
      `}</style>

      <aside
        className={cn(
          'relative flex flex-col border-r-2 border-stone-800 bg-gradient-to-b from-stone-950 via-neutral-900 to-stone-950 shadow-[2px_0_12px_0_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out',
          'fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'w-[88px]' : 'w-[260px]',
        )}
      >
        {/* Brand Header */}
        <div
          className={cn(
            'flex items-center h-16 border-b-2 border-white/10 transition-all duration-300',
            isCollapsed ? 'justify-center gap-0 px-0' : 'gap-3 px-5',
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20">
            <Coffee className="h-5 w-5" />
          </div>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
            )}
          >
            <p className="text-sm font-semibold whitespace-nowrap tracking-wider text-white">CAFFE</p>
            <p className="text-xs text-stone-400 whitespace-nowrap">Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto py-4 transition-all duration-300',
            isCollapsed ? 'sidebar-scroll-collapsed px-2.5' : 'sidebar-scroll px-3',
          )}
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
              >
                {({ isActive }) => {
                  const linkContent = (
                    <span
                      className={cn(
                        'group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
                        isCollapsed ? 'justify-center gap-0 px-0' : 'gap-3 px-2.5',
                        isActive && !isCollapsed
                          ? 'bg-white/15 text-white'
                          : isActive && isCollapsed
                          ? 'text-white'
                          : 'text-stone-300/70 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      {!isCollapsed && (
                        <span
                          className={cn(
                            'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400 transition-opacity duration-200',
                            isActive ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                          isActive && isCollapsed
                            ? 'bg-emerald-500 text-white shadow-sm shadow-black/30'
                            : '',
                        )}
                      >
                        <item.icon className="h-[18px] w-[18px]" />
                      </span>
                      <span
                        className={cn(
                          'overflow-hidden whitespace-nowrap transition-all duration-300',
                          isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                  )

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.to}>
                        <TooltipTrigger asChild>
                          {linkContent}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return linkContent
                }}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom: Settings + Logout */}
        <div className="border-t-2 border-white/10 p-3 bg-black/10">
          <button
            className={cn(
              'flex w-full items-center rounded-xl py-3 text-sm font-medium text-stone-300/70 transition-all duration-200 hover:bg-white/10 hover:text-white',
              isCollapsed ? 'justify-center gap-0 px-0' : 'gap-3 px-3.5',
            )}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap transition-all duration-300',
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
              )}
            >
              Settings
            </span>
          </button>
          <button
            onClick={onLogoutOpen}
            className={cn(
              'flex w-full items-center rounded-xl py-3 text-sm font-medium text-red-400/90 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300',
              isCollapsed ? 'justify-center gap-0 px-0' : 'gap-3 px-3.5',
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap transition-all duration-300',
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
              )}
            >
              Logout
            </span>
          </button>
        </div>

        {/* Collapse toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="absolute -right-4 top-16 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-stone-800 text-emerald-300 shadow-md transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-200 active:scale-95"
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform duration-300',
                  isCollapsed ? 'rotate-180' : '',
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </TooltipContent>
        </Tooltip>
      </aside>
    </>
  )
}
