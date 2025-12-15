import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
        <nav>
          <Link href="/">Admin Home</Link> | <Link href="/users">Users</Link> | <Link href="/settings">Settings</Link>
        </nav>
      </header>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  )
}
