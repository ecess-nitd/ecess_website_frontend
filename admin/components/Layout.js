import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useAuth } from './AuthContext'
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <img src="/logo.jpeg" alt="ECESS Admin" className={styles.logoImage} />
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link href="/" className={`${styles.navLink} ${router.pathname === '/' ? styles.navLinkActive : ''}`}>Access List</Link>
          <Link href="/events" className={`${styles.navLink} ${router.pathname === '/events' ? styles.navLinkActive : ''}`}>Events</Link>
          <Link href="/team" className={`${styles.navLink} ${router.pathname === '/team' ? styles.navLinkActive : ''}`}>Team</Link>
        </nav>

        <div className={styles.userMenu}>
          {isAuthenticated ? (
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          ) : (
            <Link href="/login" className={styles.loginLink}>Login</Link>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 ECESS Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  )
}

