const API_BASE = import.meta.env.VITE_API_BASE || 'https://cptmbackend-production.up.railway.app'

async function request(path, { method = 'GET', body, headers = {}, isForm = false } = {}) {
  const opts = { method, headers: { Accept: 'application/json', ...headers } }
  if (body !== undefined) {
    if (isForm) {
      opts.body = body
    } else {
      opts.headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(body)
    }
  }
  const res = await fetch(`${API_BASE}${path}`, opts)
  if (!res.ok) {
    let detail = ''
    try { detail = await res.text() } catch {}
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${detail}`)
  }
  if (res.status === 204) return null
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.blob()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path) => request(path, { method: 'PATCH' }),
  del: (path) => request(path, { method: 'DELETE' }),
  postForm: (path, form) => request(path, { method: 'POST', body: form, isForm: true }),
}

export { API_BASE }
