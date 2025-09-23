// Student registry mapping REG_NO/USN -> DOB in ISO format (YYYY-MM-DD)
// You can either statically fill it, or import a CSV at runtime.
let REGISTRY = {}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('student_registry')
    if (raw) REGISTRY = JSON.parse(raw) || {}
  } catch (_) {}
}

function saveToStorage() {
  try {
    localStorage.setItem('student_registry', JSON.stringify(REGISTRY))
  } catch (_) {}
}

export function getRegistry() {
  loadFromStorage()
  return REGISTRY
}

export function setRegistry(obj) {
  REGISTRY = obj || {}
  saveToStorage()
}

/**
 * Import from CSV/TSV text. Auto-detects headers for REG_NO/USN and DOB.
 * Returns { count, errors: string[] }
 */
export function importFromCSV(text) {
  if (!text) return { count: 0, errors: ['No input'] }
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length === 0) return { count: 0, errors: ['No rows found'] }

  // parse header
  const sep = lines[0].includes('\t') ? '\t' : ','
  const headers = lines[0].split(new RegExp(sep)).map((h) => h.trim().toUpperCase())
  const regIdx = headers.findIndex((h) => ['REG_NO', 'REGNO', 'USN', 'REGISTRATION_NO'].includes(h))
  const dobIdx = headers.findIndex((h) => ['DOB', 'DATE_OF_BIRTH', 'DATEOFBIRTH'].includes(h))
  if (regIdx === -1 || dobIdx === -1) {
    return { count: 0, errors: ['Could not find REG_NO/USN and DOB columns in header'] }
  }

  const next = { ...getRegistry() }
  const errors = []
  let count = 0
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(new RegExp(sep))
    if (cols.length <= Math.max(regIdx, dobIdx)) continue
    const usn = (cols[regIdx] || '').trim().toUpperCase()
    const dobRaw = (cols[dobIdx] || '').trim()
    const iso = normalizeDobToISO(dobRaw)
    if (!usn || !iso) {
      errors.push(`Row ${i + 1}: invalid USN/DOB`)
      continue
    }
    next[usn] = iso
    count++
  }
  setRegistry(next)
  return { count, errors }
}

/**
 * Normalize a user-entered DOB string into ISO format (YYYY-MM-DD),
 * supporting common formats such as:
 * - DD-MM-YYYY
 * - DD/MM/YYYY
 * - YYYY-MM-DD (already ISO)
 * - DD.MM.YYYY
 */
export function normalizeDobToISO(input) {
  if (!input) return null
  const s = String(input).trim()
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  // DD-MM-YYYY or DD/MM/YYYY or DD.MM.YYYY
  const m = s.match(/^(\d{2})[\/\.\-](\d{2})[\/\.\-](\d{4})$/)
  if (m) {
    const [_, dd, mm, yyyy] = m
    return `${yyyy}-${mm}-${dd}`
  }
  return null
}

/**
 * Validate a given USN/REG_NO and DOB against the registry.
 * Returns an object with { ok: boolean, reason?: string }
 */
export function validateStudent(usn, dobInput) {
  if (!usn) return { ok: false, reason: 'USN is required' }
  const key = String(usn).trim().toUpperCase()
  const iso = normalizeDobToISO(dobInput)
  if (!iso) return { ok: false, reason: 'Invalid DOB format. Use YYYY-MM-DD or DD-MM-YYYY' }

  const expected = STUDENT_REGISTRY[key]
  if (!expected) return { ok: false, reason: 'USN not found in registry' }
  if (expected !== iso) return { ok: false, reason: 'DOB does not match our records' }
  return { ok: true }
}
