import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthProvider, useAuth } from '../components/AuthContext'

function AuthGate({ children }) {
  const { loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // allow public login page
    if (loading) return
    if (router.pathname === '/login') return
    if (!isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  // while we check auth, don't render children to avoid flicker
  if (loading) return null
  return children
}

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthGate>
        <Component {...pageProps} />
      </AuthGate>
    </AuthProvider>
  )
}
