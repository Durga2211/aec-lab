// AD Kit store - localStorage backed
// Schema: { total:number, kits: { [kitNumber:string]: { usn:null|string, takenAt:null|string } } }

const STORAGE_KEY = 'ad_kits_state'

let STATE = {
  total: 60,
  kits: {}
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) STATE = JSON.parse(raw)
  } catch (_) {}
  // Initialize kits if empty
  if (!STATE.kits || Object.keys(STATE.kits).length === 0) {
    const kits = {}
    for (let i = 1; i <= STATE.total; i++) {
      const num = String(i).padStart(2, '0')
      kits[num] = { usn: null, takenAt: null }
    }
    STATE.kits = kits
    save()
  }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)) } catch(_) {}
}

export function getState() {
  load()
  return STATE
}

export function setTotalKits(n) {
  load()
  const total = Math.max(1, Number(n) || 1)
  const kits = { ...STATE.kits }
  // Ensure 01..total exist
  for (let i = 1; i <= total; i++) {
    const num = String(i).padStart(2, '0')
    if (!kits[num]) kits[num] = { usn: null, takenAt: null }
  }
  // Remove beyond total
  Object.keys(kits).forEach(k => {
    if (Number(k) > total) delete kits[k]
  })
  STATE.total = total
  STATE.kits = kits
  save()
  return STATE
}

export function listKits() {
  load()
  return Object.keys(STATE.kits).sort((a,b) => Number(a)-Number(b)).map(k => ({ number: k, ...STATE.kits[k] }))
}

export function getAvailableKits() {
  return listKits().filter(k => !k.usn)
}

export function getTakenKits() {
  return listKits().filter(k => !!k.usn)
}

export function validateUSN(usn) {
  if (!usn) return false
  const s = String(usn).trim().toUpperCase()
  // Pattern: 1SI24ET0XX where XX=01..60 (len 10)
  const m = s.match(/^1SI24ET0(\d{2})$/i)
  if (!m) return false
  const n = Number(m[1])
  return n >= 1 && n <= 60
}

export function reserveKit(kitNumber, usn) {
  load()
  const k = String(kitNumber).padStart(2, '0')
  if (!STATE.kits[k]) return { ok:false, reason:'Invalid kit number' }
  if (!validateUSN(usn)) return { ok:false, reason:'Invalid USN format. Use 1SI24ET0XX (01-60).' }
  if (STATE.kits[k].usn) return { ok:false, reason:'Kit already taken' }
  STATE.kits[k] = { usn: String(usn).trim().toUpperCase(), takenAt: new Date().toISOString() }
  save()
  return { ok:true }
}

export function releaseKit(kitNumber) {
  load()
  const k = String(kitNumber).padStart(2, '0')
  if (!STATE.kits[k]) return { ok:false, reason:'Invalid kit number' }
  STATE.kits[k] = { usn: null, takenAt: null }
  save()
  return { ok:true }
}

export function clearAllKits() {
  STATE = { total: STATE.total, kits: {} }
  load() // will re-init kits
  save()
}
