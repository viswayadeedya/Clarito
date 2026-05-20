const DB_NAME = 'clarito-image-cache'
const DB_VERSION = 1
const STORE = 'files'
const TTL_MS = 7 * 24 * 60 * 60 * 1000  // 7 days

// Layer 1: memory — module-level Map, lives for the browser session
const memoryCache = new Map()  // fileId → base64 dataURL

// ── IndexedDB helpers ────────────────────────────────────────────────────────

let _db = null

function openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE, { keyPath: 'fileId' })
    }
    req.onsuccess = e => {
      _db = e.target.result
      resolve(_db)
    }
    req.onerror = () => reject(req.error)
  })
}

// Returns base64 string if entry exists, is not expired, and r2Url matches.
// Returns null on any miss or error (graceful degradation).
async function idbGet(fileId, r2Url) {
  try {
    const db = await openDB()
    return new Promise(resolve => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(fileId)
      req.onsuccess = () => {
        const rec = req.result
        if (!rec) return resolve(null)
        if (rec.expiresAt < Date.now()) return resolve(null)  // expired
        if (rec.r2Url !== r2Url) return resolve(null)         // URL changed (re-uploaded)
        resolve(rec.base64)
      }
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

// Fire-and-forget write — never throws, never blocks the caller.
async function idbPut(fileId, base64, r2Url) {
  try {
    const db = await openDB()
    const now = Date.now()
    await new Promise(resolve => {
      const req = db.transaction(STORE, 'readwrite').objectStore(STORE).put({
        fileId,
        base64,
        r2Url,
        cachedAt: now,
        expiresAt: now + TTL_MS,
      })
      req.onsuccess = resolve
      req.onerror = resolve  // swallow — memory cache still works
    })
  } catch {
    // IndexedDB unavailable (private browsing, quota exceeded, etc.) — silently skip
  }
}

// ── R2 fetch ─────────────────────────────────────────────────────────────────

async function fetchBase64(r2Url) {
  const resp = await fetch(r2Url)
  if (!resp.ok) throw new Error(`R2 ${resp.status}`)
  const blob = await resp.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Convert a files dict (fileId → BinaryFileData with possible R2 dataURLs) into
 * a version safe to pass to Excalidraw — all dataURLs are base64 data: strings.
 *
 * Cache lookup order for each R2 URL:
 *   1. Memory Map  → hit: use immediately
 *   2. IndexedDB   → hit (fresh, same r2Url): promote to memory, use
 *   3. Fetch R2    → convert to base64, write to IndexedDB + memory, use
 *
 * Falls back to the raw R2 URL on any fetch/CORS error so the caller always
 * gets a complete dict (Excalidraw may not render the image in that case).
 *
 * cdnFilesRef is NOT touched here — callers keep the R2 URL for saves.
 */
export async function resolveFilesWithCache(files) {
  const entries = await Promise.all(
    Object.entries(files).map(async ([fileId, fileData]) => {
      const r2Url = fileData.dataURL

      // Already base64 (newly pasted image not yet synced to R2)
      if (!r2Url?.startsWith('https://')) return [fileId, fileData]

      // Layer 1: memory
      const mem = memoryCache.get(fileId)
      if (mem) return [fileId, { ...fileData, dataURL: mem }]

      // Layer 2: IndexedDB
      const cached = await idbGet(fileId, r2Url)
      if (cached) {
        memoryCache.set(fileId, cached)
        return [fileId, { ...fileData, dataURL: cached }]
      }

      // Layer 3: R2 fetch — requires CORS headers on the R2 bucket
      try {
        const base64 = await fetchBase64(r2Url)
        memoryCache.set(fileId, base64)
        idbPut(fileId, base64, r2Url)  // fire-and-forget, don't await
        return [fileId, { ...fileData, dataURL: base64 }]
      } catch (err) {
        console.warn('[imageCache] fetch failed for', fileId, '—', err?.message ?? err)
        return [fileId, fileData]
      }
    })
  )
  return Object.fromEntries(entries)
}
