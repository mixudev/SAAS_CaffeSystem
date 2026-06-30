import { useAuth } from '../../contexts/AuthContext'
import {
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
  Receipt,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/Breadcrumb'

type StatCard = {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  accent: string
}

const statCards: StatCard[] = [
  {
    title: "Today's Sales",
    value: 'Rp 8.250.000',
    change: '+12.4%',
    trend: 'up',
    icon: TrendingUp,
    accent: 'text-emerald-600 bg-emerald-50',
  },
  {
    title: 'Orders Today',
    value: '142',
    change: '+8.1%',
    trend: 'up',
    icon: ShoppingBag,
    accent: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Active Tables',
    value: '18 / 24',
    change: '+3 tables',
    trend: 'up',
    icon: LayoutGrid,
    accent: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Low Stock Items',
    value: '6',
    change: '-2 since yday',
    trend: 'down',
    icon: AlertTriangle,
    accent: 'text-red-600 bg-red-50',
  },
]

type OrderStatus = 'Completed' | 'Preparing' | 'Pending' | 'Cancelled'

type Order = {
  id: string
  customer: string
  table: string
  status: OrderStatus
  total: string
  time: string
}

const recentOrders: Order[] = [
  { id: '#ORD-2291', customer: 'Dwi Lestari', table: 'T-04', status: 'Completed', total: 'Rp 145.000', time: '09:42 AM' },
  { id: '#ORD-2292', customer: 'Bayu Pratama', table: 'T-11', status: 'Preparing', total: 'Rp 92.000', time: '09:51 AM' },
  { id: '#ORD-2293', customer: 'Citra Wulandari', table: 'T-02', status: 'Pending', total: 'Rp 58.000', time: '10:03 AM' },
  { id: '#ORD-2294', customer: 'Eka Saputra', table: 'T-09', status: 'Completed', total: 'Rp 210.000', time: '10:12 AM' },
  { id: '#ORD-2295', customer: 'Fitri Handayani', table: 'T-06', status: 'Cancelled', total: 'Rp 75.000', time: '10:20 AM' },
  { id: '#ORD-2296', customer: 'Galih Nugroho', table: 'T-15', status: 'Preparing', total: 'Rp 130.000', time: '10:27 AM' },
]

const statusStyles: Record<OrderStatus, string> = {
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Preparing: 'bg-amber-50 text-amber-700 border-amber-200',
  Pending: 'bg-slate-100 text-slate-600 border-slate-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
}

type QuickAction = {
  label: string
  description: string
  icon: React.ElementType
}

const quickActions: QuickAction[] = [
  { label: 'New Order', description: 'Start a new ticket', icon: PlusCircle },
  { label: 'Add Menu', description: 'Create a menu item', icon: ClipboardList },
  { label: 'Add Employee', description: 'Onboard staff member', icon: UserPlus },
  { label: 'Generate Report', description: 'Export daily report', icon: FileBarChart },
]

type MenuPopular = {
  name: string
  category: string
  price: string
  sales: string
  icon: React.ElementType
}

const popularMenu: MenuPopular[] = [
  { name: 'Cappuccino', category: 'Coffee', price: 'Rp 28.000', sales: '312 sold', icon: Coffee },
  { name: 'Caramel Latte', category: 'Coffee', price: 'Rp 32.000', sales: '287 sold', icon: Coffee },
  { name: 'Croissant', category: 'Bakery', price: 'Rp 22.000', sales: '201 sold', icon: Cookie },
  { name: 'Cheese Burger', category: 'Main Course', price: 'Rp 45.000', sales: '176 sold', icon: Sandwich },
  { name: 'Affogato', category: 'Dessert', price: 'Rp 35.000', sales: '154 sold', icon: IceCreamCone },
]

type InventoryAlert = {
  name: string
  level: string
  icon: React.ElementType
}

const inventoryAlerts: InventoryAlert[] = [
  { name: 'Fresh Milk', level: '8% remaining', icon: Droplets },
  { name: 'Coffee Beans', level: '15% remaining', icon: Coffee },
  { name: 'Sugar', level: '12% remaining', icon: Wheat },
  { name: 'Chocolate Syrup', level: '20% remaining', icon: Flame },
]

type ActivityItem = {
  title: string
  description: string
  time: string
  icon: React.ElementType
}

const activityTimeline: ActivityItem[] = [
  { title: 'Order #ORD-2294 completed', description: 'Table T-09 payment received', time: '2 min ago', icon: CheckCircle2 },
  { title: 'New order placed', description: 'Table T-15 — Galih Nugroho', time: '9 min ago', icon: Receipt },
  { title: 'Stock alert triggered', description: 'Fresh Milk below threshold', time: '24 min ago', icon: AlertTriangle },
  { title: 'Order #ORD-2295 cancelled', description: 'Table T-06 — customer request', time: '32 min ago', icon: XCircle },
  { title: 'Shift started', description: 'Fitri Handayani clocked in', time: '1 hr ago', icon: Clock },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Cafe</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Good Morning, {user?.name?.split(' ')[0] ?? 'Admin'} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back, here is what&apos;s happening at your cafe today.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
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
                        stat.trend === 'up'
                          ? 'border-green-200 text-green-700 bg-green-50'
                          : 'border-red-200 text-red-700 bg-red-50'
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
            )
          })}
        </div>

        {/* Recent Orders + Quick Actions */}
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
                          idx !== recentOrders.length - 1 ? 'border-b border-slate-100' : ''
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
                const Icon = action.icon
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
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Popular Menu + Inventory Alert */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Popular Menu */}
          <Card className="xl:col-span-2 rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="p-6 pb-0">
              <h2 className="text-lg font-semibold text-slate-900">Popular Menu</h2>
              <p className="text-sm text-slate-500">Best performing items this week</p>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularMenu.map((item) => {
                const Icon = item.icon
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
                )
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
                const Icon = item.icon
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
                )
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
                const Icon = item.icon
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
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
