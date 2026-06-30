import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'
import api from '../lib/api'
import type { User } from '../lib/api'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => Promise<void>
  can: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    api.get<{ data: User }>('/auth/me')
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem('auth_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (login: string, password: string) => {
    const res = await api.post<{ message: string; data: { user: User; token: string; token_type: string } }>(
      '/auth/login',
      { login, password },
    )
    const { token, user: userData } = res.data.data
    localStorage.setItem('auth_token', token)
    setUser(userData)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // proceed anyway
    }
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const can = (permission: string) => user?.permissions?.includes(permission) ?? false

  const hasRole = (role: string) => user?.roles?.includes(role) ?? false

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
