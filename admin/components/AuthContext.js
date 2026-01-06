import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('ecess_admin_token') : null
    if (t) setToken(t)
    setLoading(false)
  }, [])

  const login = async ({ email, password }) => {
    // NOTE: we assume the backend exposes a JSON login endpoint at
    // `${NEXT_PUBLIC_API_URL}/admin/login` that accepts {email, password}
    // and returns an object containing an access token in `access_token` or `token`.
    const base = process.env.NEXT_PUBLIC_API_URL || ''
    const url = `${base.replace(/\/$/, '')}/admin/login`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const message = body.detail || body.error || `HTTP ${res.status}`
      throw new Error(message)
    }

    const data = await res.json()
    const t = data.access_token || data.token || null
    if (!t) throw new Error('Login response did not include access token')

    localStorage.setItem('ecess_admin_token', t)
    setToken(t)
    return data
  }

  const logout = () => {
    localStorage.removeItem('ecess_admin_token')
    setToken(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
