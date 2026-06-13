const DB_NAME = 'cptm-offline'
const DB_VERSION = 1
const STORE = 'pending_reports'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function withStore(mode, fn) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const store = tx.objectStore(STORE)
    const result = fn(store)
    tx.oncomplete = () => resolve(result?.value !== undefined ? result.value : result)
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function enqueueReport(payload, photos = []) {
  const photoBlobs = photos.filter(Boolean).map((f) => ({
    name: f.name,
    type: f.type,
    blob: f,
  }))
  return withStore('readwrite', (store) => {
    const req = store.add({
      payload,
      photos: photoBlobs,
      createdAt: new Date().toISOString(),
    })
    return new Promise((res, rej) => {
      req.onsuccess = () => res(req.result)
      req.onerror = () => rej(req.error)
    })
  })
}

export async function listPending() {
  return withStore('readonly', (store) => {
    return new Promise((res, rej) => {
      const req = store.getAll()
      req.onsuccess = () => res(req.result || [])
      req.onerror = () => rej(req.error)
    })
  })
}

export async function removePending(id) {
  return withStore('readwrite', (store) => store.delete(id))
}

export async function countPending() {
  const all = await listPending()
  return all.length
}
