import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/layouts/ProtectedRoute'
import DashboardLayout from './components/dashboard/DashboardLayout'
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<DashboardPage />} />
            <Route path="menu" element={<DashboardPage />} />
            <Route path="inventory" element={<DashboardPage />} />
            <Route path="kitchen" element={<DashboardPage />} />
            <Route path="customers" element={<DashboardPage />} />
            <Route path="transactions" element={<DashboardPage />} />
            <Route path="reports" element={<DashboardPage />} />
            <Route path="employees" element={<DashboardPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
