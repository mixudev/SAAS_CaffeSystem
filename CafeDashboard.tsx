import { useState } from "react";
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
  Settings,
  LogOut,
  ChevronLeft,
  Search,
  Bell,
  Moon,
  Sun,
  Calendar,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  LayoutGrid,
  AlertTriangle,
  PlusCircle,
  ClipboardList,
  UserPlus,
  FileBarChart,
  Coffee,
  IceCreamCone,
  Sandwich,
  Cookie,
  Flame,
  Droplets,
  Wheat,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronDown,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type MenuItem = {
  label: string;
  icon: React.ElementType;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: Receipt },
  { label: "Menu", icon: UtensilsCrossed },
  { label: "Inventory", icon: Package },
  { label: "Kitchen", icon: ChefHat },
  { label: "Customers", icon: Users },
  { label: "Transactions", icon: CreditCard },
  { label: "Reports", icon: BarChart3 },
  { label: "Employees", icon: UserCog },
];

type StatCard = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  accent: string;
};

const statCards: StatCard[] = [
  {
    title: "Today's Sales",
    value: "Rp 8.250.000",
    change: "+12.4%",
    trend: "up",
    icon: TrendingUp,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Orders Today",
    value: "142",
    change: "+8.1%",
    trend: "up",
    icon: ShoppingBag,
    accent: "text-amber-600 bg-amber-50",
  },
  {
    title: "Active Tables",
    value: "18 / 24",
    change: "+3 tables",
    trend: "up",
    icon: LayoutGrid,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    title: "Low Stock Items",
    value: "6",
    change: "-2 since yday",
    trend: "down",
    icon: AlertTriangle,
    accent: "text-red-600 bg-red-50",
  },
];

type OrderStatus = "Completed" | "Preparing" | "Pending" | "Cancelled";

type Order = {
  id: string;
  customer: string;
  table: string;
  status: OrderStatus;
  total: string;
  time: string;
};

const recentOrders: Order[] = [
  { id: "#ORD-2291", customer: "Dwi Lestari", table: "T-04", status: "Completed", total: "Rp 145.000", time: "09:42 AM" },
  { id: "#ORD-2292", customer: "Bayu Pratama", table: "T-11", status: "Preparing", total: "Rp 92.000", time: "09:51 AM" },
  { id: "#ORD-2293", customer: "Citra Wulandari", table: "T-02", status: "Pending", total: "Rp 58.000", time: "10:03 AM" },
  { id: "#ORD-2294", customer: "Eka Saputra", table: "T-09", status: "Completed", total: "Rp 210.000", time: "10:12 AM" },
  { id: "#ORD-2295", customer: "Fitri Handayani", table: "T-06", status: "Cancelled", total: "Rp 75.000", time: "10:20 AM" },
  { id: "#ORD-2296", customer: "Galih Nugroho", table: "T-15", status: "Preparing", total: "Rp 130.000", time: "10:27 AM" },
];

const statusStyles: Record<OrderStatus, string> = {
  Completed: "bg-green-50 text-green-700 border-green-200",
  Preparing: "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-slate-100 text-slate-600 border-slate-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

type QuickAction = {
  label: string;
  description: string;
  icon: React.ElementType;
};

const quickActions: QuickAction[] = [
  { label: "New Order", description: "Start a new ticket", icon: PlusCircle },
  { label: "Add Menu", description: "Create a menu item", icon: ClipboardList },
  { label: "Add Employee", description: "Onboard staff member", icon: UserPlus },
  { label: "Generate Report", description: "Export daily report", icon: FileBarChart },
];

type MenuPopular = {
  name: string;
  category: string;
  price: string;
  sales: string;
  icon: React.ElementType;
};

const popularMenu: MenuPopular[] = [
  { name: "Cappuccino", category: "Coffee", price: "Rp 28.000", sales: "312 sold", icon: Coffee },
  { name: "Caramel Latte", category: "Coffee", price: "Rp 32.000", sales: "287 sold", icon: Coffee },
  { name: "Croissant", category: "Bakery", price: "Rp 22.000", sales: "201 sold", icon: Cookie },
  { name: "Cheese Burger", category: "Main Course", price: "Rp 45.000", sales: "176 sold", icon: Sandwich },
  { name: "Affogato", category: "Dessert", price: "Rp 35.000", sales: "154 sold", icon: IceCreamCone },
];

type InventoryAlert = {
  name: string;
  level: string;
  icon: React.ElementType;
};

const inventoryAlerts: InventoryAlert[] = [
  { name: "Fresh Milk", level: "8% remaining", icon: Droplets },
  { name: "Coffee Beans", level: "15% remaining", icon: Coffee },
  { name: "Sugar", level: "12% remaining", icon: Wheat },
  { name: "Chocolate Syrup", level: "20% remaining", icon: Flame },
];

type ActivityItem = {
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
};

const activityTimeline: ActivityItem[] = [
  { title: "Order #ORD-2294 completed", description: "Table T-09 payment received", time: "2 min ago", icon: CheckCircle2 },
  { title: "New order placed", description: "Table T-15 — Galih Nugroho", time: "9 min ago", icon: Receipt },
  { title: "Stock alert triggered", description: "Fresh Milk below threshold", time: "24 min ago", icon: AlertTriangle },
  { title: "Order #ORD-2295 cancelled", description: "Table T-06 — customer request", time: "32 min ago", icon: XCircle },
  { title: "Shift started", description: "Fitri Handayani clocked in", time: "1 hr ago", icon: Clock },
];

export default function CafeDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <TooltipProvider delayDuration={200}>
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
        @keyframes alertPulse {
          0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.30); }
          70% { box-shadow: 0 0 0 9px rgba(220,38,38,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
        }
        .alert-icon-pulse { animation: alertPulse 2s ease-out infinite; }
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
        .content-scroll::-webkit-scrollbar { width: 6px; }
        .content-scroll::-webkit-scrollbar-track { background: transparent; }
        .content-scroll::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.15); border-radius: 9999px; }
        .content-scroll::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.28); }
        .content-scroll { scrollbar-width: thin; scrollbar-color: rgba(15,23,42,0.15) transparent; }
      `}</style>
      <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`relative flex flex-col border-r-2 border-stone-800 bg-gradient-to-b from-stone-950 via-neutral-900 to-stone-950 shadow-[2px_0_12px_0_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out ${
            collapsed ? "w-[88px]" : "w-[336px]"
          }`}
        >
          <div
            className={`flex items-center h-16 border-b-2 border-white/10 transition-all duration-300 ${
              collapsed ? "justify-center gap-0 px-0" : "gap-3 px-5"
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20">
              <Coffee className="h-5 w-5" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              <p className="text-sm font-semibold whitespace-nowrap text-white">Kopi Senja</p>
              <p className="text-xs text-stone-400 whitespace-nowrap">Cafe Management</p>
            </div>
          </div>

          <nav
            className={`${
              collapsed ? "sidebar-scroll-collapsed px-2.5" : "sidebar-scroll px-3"
            } flex-1 overflow-y-auto py-4 transition-all duration-300`}
          >
            <div className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.label;
                const button = (
                  <button
                    key={item.label}
                    onClick={() => setActiveMenu(item.label)}
                    className={`group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                      collapsed ? "justify-center gap-0 px-0" : "gap-3 px-2.5"
                    } ${
                      isActive && !collapsed
                        ? "bg-white/15 text-white"
                        : isActive && collapsed
                        ? "text-white"
                        : "text-stone-300/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {!collapsed && (
                      <span
                        className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400 transition-opacity duration-200 ${
                          isActive ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    )}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive && collapsed
                          ? "bg-emerald-500 text-white shadow-sm shadow-black/30"
                          : ""
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                        collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );

                return collapsed ? (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  button
                );
              })}
            </div>
          </nav>

          <div className="border-t-2 border-white/10 p-3 bg-black/10">
            <button
              className={`flex w-full items-center rounded-xl py-3 text-sm font-medium text-stone-300/70 transition-all duration-200 hover:bg-white/10 hover:text-white ${
                collapsed ? "justify-center gap-0 px-0" : "gap-3 px-3.5"
              }`}
            >
              <Settings className="h-[18px] w-[18px] shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Settings
              </span>
            </button>
            <button
              onClick={() => setLogoutOpen(true)}
              className={`flex w-full items-center rounded-xl py-3 text-sm font-medium text-red-400/90 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300 ${
                collapsed ? "justify-center gap-0 px-0" : "gap-3 px-3.5"
              }`}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Logout
              </span>
            </button>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute -right-4 top-16 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-stone-800 text-emerald-300 shadow-md transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-200 active:scale-95"
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-transform duration-300 ${
                    collapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b-2 border-slate-200 bg-white/80 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search orders, menu, customers..."
                  className="pl-9 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <Calendar className="h-4 w-4" />
                {today}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDarkMode(!darkMode)}
                    className="rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  >
                    {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-8 mx-1" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-xl pl-2 pr-2.5 py-1.5 hover:bg-slate-100 transition-colors duration-200 group">
                    <Avatar className="h-9 w-9 ring-2 ring-emerald-100">
                      <AvatarImage src="" alt="Admin" />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-stone-800 text-white text-sm font-semibold">
                        AW
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold leading-tight text-slate-900">Admin Wijaya</span>
                      <span className="text-[11px] text-slate-500 leading-tight">Cashier Owner</span>
                    </div>
                    <ChevronDown className="hidden md:block h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl p-0 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-br from-emerald-50 to-white">
                    <Avatar className="h-11 w-11 ring-2 ring-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-stone-800 text-white font-semibold">
                        AW
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-semibold text-slate-900 truncate">Admin Wijaya</span>
                      <span className="text-xs text-slate-500 truncate">admin@kopisenja.id</span>
                      <Badge
                        variant="outline"
                        className="mt-1 w-fit text-[10px] px-1.5 py-0 h-4 border-emerald-200 text-emerald-700 bg-emerald-50"
                      >
                        Owner
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
                      onClick={() => setLogoutOpen(true)}
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

          {/* Scrollable content */}
          <div className="content-scroll flex-1 overflow-y-auto">
            <div className="p-8 flex flex-col gap-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Cafe</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{activeMenu}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Good Morning, Admin 👋
                </h1>
                <p className="text-slate-500 mt-1">
                  Welcome back, here is what's happening at Kopi Senja today.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat) => {
                  const Icon = stat.icon;
                  const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
                  return (
                    <Card
                      key={stat.title}
                      className="rounded-2xl border-slate-200 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.accent}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1 rounded-full text-xs font-medium ${
                              stat.trend === "up"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-red-200 text-red-700 bg-red-50"
                            }`}
                          >
                            <TrendIcon className="h-3 w-3" />
                            {stat.change}
                          </Badge>
                        </div>
                        <p className="mt-5 text-sm text-slate-500">{stat.title}</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="xl:col-span-2 rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between p-6 pb-0">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                      <p className="text-sm text-slate-500">Latest tickets from the floor</p>
                    </div>
                    <Button variant="ghost" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl">
                      View all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 text-left text-slate-500">
                            <th className="px-4 py-3 font-medium">Order ID</th>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Table</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order, idx) => (
                            <tr
                              key={order.id}
                              className={`transition-colors duration-200 hover:bg-slate-50 ${
                                idx !== recentOrders.length - 1 ? "border-b border-slate-100" : ""
                              }`}
                            >
                              <td className="px-4 py-3 font-medium text-slate-900">{order.id}</td>
                              <td className="px-4 py-3 text-slate-600">{order.customer}</td>
                              <td className="px-4 py-3 text-slate-600">{order.table}</td>
                              <td className="px-4 py-3">
                                <Badge
                                  variant="outline"
                                  className={`rounded-full font-medium ${statusStyles[order.status]}`}
                                >
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-slate-900 font-medium">{order.total}</td>
                              <td className="px-4 py-3 text-slate-500">{order.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader className="p-6 pb-0">
                    <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                    <p className="text-sm text-slate-500">Frequently used shortcuts</p>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-2 gap-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 p-4 text-left transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200 hover:bg-emerald-50/40"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <Icon className="h-[18px] w-[18px]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{action.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Popular Menu */}
                <Card className="xl:col-span-2 rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader className="p-6 pb-0">
                    <h2 className="text-lg font-semibold text-slate-900">Popular Menu</h2>
                    <p className="text-sm text-slate-500">Best performing items this week</p>
                  </CardHeader>
                  <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {popularMenu.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.category}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-semibold text-slate-900">{item.price}</span>
                              <Badge
                                variant="outline"
                                className="rounded-full text-[11px] border-emerald-200 text-emerald-700 bg-emerald-50"
                              >
                                {item.sales}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Inventory Alert */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader className="p-6 pb-0">
                    <h2 className="text-lg font-semibold text-slate-900">Inventory Alert</h2>
                    <p className="text-sm text-slate-500">Items running low</p>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col gap-3">
                    {inventoryAlerts.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 p-3 transition-all duration-300 ease-in-out hover:shadow-md"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <Icon className="h-[18px] w-[18px]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                            <p className="text-xs text-red-600">{item.level}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader className="p-6 pb-0">
                  <h2 className="text-lg font-semibold text-slate-900">Activity Timeline</h2>
                  <p className="text-sm text-slate-500">Recent events across the cafe</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    {activityTimeline.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                              <Icon className="h-4 w-4" />
                            </div>
                            {idx !== activityTimeline.length - 1 && (
                              <div className="w-px flex-1 bg-slate-200 my-1" />
                            )}
                          </div>
                          <div className="pb-6 flex-1">
                            <p className="text-sm font-medium text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-500">{item.description}</p>
                            <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
              onClick={() => setLogoutOpen(false)}
              className="h-11 flex-1 bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-emerald-700"
            >
              Ya, Logout
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
