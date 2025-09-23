import { useEffect, useState } from 'react'
import { auth, db } from '../firebase.js'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const SLOTS = [
  '8:00-9:00',
  '9:00-10:00',
  '10:00-10:30',
  '10:30-11:30',
  '11:30-12:30',
  '1:00-2:00',
  '2:00-3:00',
  '3:00-4:00',
  '4:00-5:00',
]

export default function InstructorHello() {
  const [day, setDay] = useState(DAYS[0])
  const [slot, setSlot] = useState(SLOTS[0])
  const [available, setAvailable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  // Load current value for selected day/slot when either changes
  useEffect(() => {
    async function load() {
      try {
        const id = `${day}_${slot}`
        const ref = doc(db, 'labSlots', id)
        const snap = await getDoc(ref)
        const data = snap.exists() ? snap.data() : null
        setAvailable(Boolean(data?.available))
      } catch (e) {
        console.error(e)
        setMsg({ type: 'error', text: 'Failed to load slot status' })
      }
    }
    load()
  }, [day, slot])

  async function saveAvailability() {
    try {
      setSaving(true)
      setMsg(null)
      const id = `${day}_${slot}`
      const ref = doc(db, 'labSlots', id)
      await setDoc(ref, {
        available,
        updatedAt: serverTimestamp(),
        updatedBy: auth?.currentUser?.uid || 'instructor',
        day,
        slot,
      }, { merge: true })
      setMsg({ type: 'ok', text: 'Saved availability' })
    } catch (e) {
      console.error(e)
      setMsg({ type: 'error', text: e?.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-200">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h1 className="text-2xl font-semibold text-white">Hello sir</h1>
          <p className="mt-1 text-sm text-neutral-400">Set lab slot availability visible to students in real-time.</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <label className="mb-2 block text-xs uppercase tracking-wide text-neutral-400">Day</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:border-primary-600">
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <label className="mb-2 block text-xs uppercase tracking-wide text-neutral-400">Time Slot</label>
            <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm focus:border-primary-600">
              {SLOTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <label className="mb-2 block text-xs uppercase tracking-wide text-neutral-400">Availability</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAvailable(true)}
                className={`flex-1 rounded-md px-3 py-2 text-sm ${available ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}
              >Available</button>
              <button
                type="button"
                onClick={() => setAvailable(false)}
                className={`flex-1 rounded-md px-3 py-2 text-sm ${!available ? 'bg-amber-600 text-white' : 'bg-neutral-800 text-neutral-300'}`}
              >Not Available</button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {msg && (
              <div className={`rounded-md px-3 py-2 text-sm ${msg.type === 'ok' ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-800/40' : 'bg-red-500/10 text-red-300 ring-1 ring-red-800/40'}`}>
                {msg.text}
              </div>
            )}
          </div>
          <button
            onClick={saveAvailability}
            disabled={saving}
            className={`rounded-md px-4 py-2 text-sm font-medium ${saving ? 'bg-neutral-800 text-neutral-400' : 'bg-primary-600 text-white hover:bg-primary-500'}`}
          >
            {saving ? 'Saving…' : 'Save' }
          </button>
        </div>
      </div>
    </div>
  )
}
