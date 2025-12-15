import Head from 'next/head'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>ECESS Admin</title>
      </Head>

      <main>
        <h1>ECESS Admin Panel</h1>
        <p>Welcome to the admin panel. Build your admin pages under <code>pages/</code>.</p>
      </main>
    </Layout>
  )
}
