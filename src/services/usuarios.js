import { api } from './api'

export const listUsuarios = (params = {}) => {
  const q = new URLSearchParams()
  if (params.nivelAcesso != null) q.set('nivelAcesso', params.nivelAcesso)
  if (params.status) q.set('status', params.status)
  const qs = q.toString()
  return api.get(`/api/Usuario${qs ? '?' + qs : ''}`)
}

export const getUsuario = (id) => api.get(`/api/Usuario/${id}`)
export const createUsuario = (input) => api.post('/api/Usuario', input)
export const updateUsuario = (id, input) => api.put(`/api/Usuario/${id}`, input)
export const deleteUsuario = (id) => api.del(`/api/Usuario/${id}`)
export const reativarUsuario = (id) => api.patch(`/api/Usuario/${id}/reativar`)
