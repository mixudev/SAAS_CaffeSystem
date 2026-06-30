import axios from 'axios'
import type { AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api

export interface User {
  id: number
  name: string
  username: string | null
  email: string
  phone: string | null
  outlet_id: number | null
  is_active: boolean
  roles: string[]
  permissions: string[]
}

export interface LoginResponse {
  message: string
  data: {
    user: User
    token: string
    token_type: string
  }
}

export interface MeResponse {
  message: string
  data: User
}
