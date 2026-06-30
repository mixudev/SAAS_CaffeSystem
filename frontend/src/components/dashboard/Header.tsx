import { useAuth } from '../../contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu'
import { Input } from '../ui/Input'
import { Separator } from '../ui/Separator'
import { Badge } from '../ui/Badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/Tooltip'
import { useState } from 'react'
import {
  Search,
  Calendar,
  Moon,
  Sun,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'

interface Props {
  onSidebarOpen: () => void
  onLogoutOpen: () => void
}

export default function Header({ onSidebarOpen, onLogoutOpen }: Props) {
  const { user } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] backdrop-blur-sm">
      {/* Left: mobile hamburger + search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onSidebarOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors lg:hidden hover:bg-slate-100"
          aria-label="Buka sidebar"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search orders, menu, customers..."
            className="pl-9 pr-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500 h-10"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-400 shadow-sm">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: date, theme, notif, user */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <Calendar className="h-4 w-4" />
          {today}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-8 mx-1" />

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 rounded-xl pl-2 pr-2.5 py-1.5 hover:bg-slate-100 transition-colors duration-200 group">
                <div className="relative shrink-0">
                  <Avatar className="h-9 w-9 ring-2 ring-emerald-100">
                    <AvatarImage src="" alt={user?.name ?? 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-stone-800 text-white text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold leading-tight text-slate-900">
                    {user?.name ?? 'User'}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight">{user?.roles?.[0] ?? 'Owner'}</span>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 rounded-xl p-0 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-br from-emerald-50 to-white">
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-stone-800 text-white font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 ring-1 ring-emerald-300" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 truncate">{user?.name}</span>
                  <span className="text-xs text-slate-500 truncate">{user?.email}</span>
                  <Badge
                    variant="outline"
                    className="mt-1 w-fit text-[10px] px-1.5 py-0 h-4 border-emerald-200 text-emerald-700 bg-emerald-50"
                  >
                    {user?.roles?.[0] ?? 'Owner'}
                  </Badge>
              </div>
            </div>
              <DropdownMenuSeparator className="m-0" />
              <div className="p-1.5">
                <DropdownMenuItem className="gap-2.5 py-2.5 rounded-lg cursor-pointer">
                  <User className="h-4 w-4 text-slate-500" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2.5 py-2.5 rounded-lg cursor-pointer">
                  <Settings className="h-4 w-4 text-slate-500" />
                  Account Settings
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="m-0" />
              <div className="p-1.5">
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); onLogoutOpen() }}
                  className="gap-2.5 py-2.5 rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  )
}
