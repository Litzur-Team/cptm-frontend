import { listPending, removePending } from './offlineQueue'
import { createEfluente, uploadAnexo, reportToDto } from './efluentes'

let syncing = false

export async function syncPending({ onProgress } = {}) {
  if (syncing) return { synced: 0, failed: 0, skipped: true }
  if (!navigator.onLine) return { synced: 0, failed: 0, offline: true }
  syncing = true
  let synced = 0
  let failed = 0
  try {
    const pending = await listPending()
    for (const item of pending) {
      try {
        const dto = item.payload.__isDto ? item.payload : reportToDto(item.payload)
        const created = await createEfluente(dto)
        const id = created.pkCdMeioAmbienteCptm
        for (const p of item.photos || []) {
          try {
            const file = new File([p.blob], p.name || 'foto.jpg', { type: p.type || 'image/jpeg' })
            await uploadAnexo(id, file)
          } catch (e) {
            // foto falhou mas o efluente foi criado: registramos e seguimos
            console.warn('Falha ao subir foto offline:', e)
          }
        }
        await removePending(item.id)
        synced++
        onProgress?.({ synced, failed, item, created })
      } catch (err) {
        failed++
        onProgress?.({ synced, failed, item, error: err })
      }
    }
  } finally {
    syncing = false
  }
  return { synced, failed }
}
