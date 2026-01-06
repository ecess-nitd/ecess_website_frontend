export async function apiFetch(path, { method = 'GET', body, token, headers = {} } = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL || ''
  const url = `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`

  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  const t = token || (typeof window !== 'undefined' && localStorage.getItem('ecess_admin_token'))
  if (t) opts.headers['Authorization'] = `Bearer ${t}`

  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(url, opts)
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch (e) { data = text }
  if (!res.ok) {
    const err = (data && (data.detail || data.error)) || res.statusText || `HTTP ${res.status}`
    const e = new Error(err)
    e.status = res.status
    e.data = data
    throw e
  }
  return data
}

export default apiFetch
