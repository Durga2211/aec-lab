// Blank Hello page

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { auth, db } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'

export default function Hello() {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [dashMsg, setDashMsg] = useState(null)
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
  const [day, setDay] = useState(DAYS[0])
  const [slot, setSlot] = useState(SLOTS[0])
  const [labsAvailable, setLabsAvailable] = useState(0)
  const [labsTotal] = useState(1) // display as 0/1 for availability state
  const [kitsAvailable] = useState(24) // placeholder; can be wired later

  // Prefer Firebase user; fall back to value passed during navigate
  const fallbackName = location.state?.usn || ''

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  // Subscribe to Firestore for real-time availability of selected slot
  useEffect(() => {
    const id = `${day}_${slot}`
    const ref = doc(db, 'labSlots', id)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? snap.data() : null
      const isAvailable = Boolean(data?.available)
      setLabsAvailable(isAvailable ? 1 : 0)
    }, (err) => {
      console.error(err)
      setDashMsg({ type: 'info', text: 'Unable to load live availability. Retrying…' })
    })
    return () => unsub()
  }, [day, slot])

  const labsEmpty = labsAvailable === 0

  function handleRequestSlot() {
    if (!labsEmpty) {
      setDashMsg({ type: 'info', text: 'Labs are currently available. Request is only needed when labs are empty.' })
      return
    }
    setDashMsg({ type: 'ok', text: 'Request submitted for an incomplete experiment slot. You will be notified when a slot opens.' })
  }

  const displayName = user?.displayName || user?.email || fallbackName || ''

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-200">
      <div className="mx-auto w-full max-w-5xl">
        {/* Greeting */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h1 className="text-2xl font-semibold text-white">
            Hello{displayName ? `, ${displayName}` : ''}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">Here is a quick overview of the lab status.</p>
        </div>

        {/* Slot selectors */}
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
        </div>

        {/* Dashboard widgets */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Lab Availability */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Lab Availability</p>
            <p className="mt-2 text-3xl font-semibold text-white">{labsAvailable}/{labsTotal}</p>
            <span className={`mt-3 inline-flex items-center rounded px-2 py-0.5 text-[10px] ${labsAvailable > 0 ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-800/40' : 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-800/40'}`}>
              {labsAvailable > 0 ? 'Slots Available' : 'Labs Full'}
            </span>
          </div>

          {/* Kit Availability */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Kit Availability</p>
            <p className="mt-2 text-3xl font-semibold text-white">{kitsAvailable}</p>
            <span className="mt-3 inline-flex items-center rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300">In stock</span>
          </div>

          {/* Incomplete Experiment Request */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <p className="text-xs uppercase tracking-wide text-neutral-400">Incomplete Experiment</p>
            <p className="mt-2 text-sm text-neutral-300">Request a slot when labs are empty.</p>
            <button
              onClick={handleRequestSlot}
              className={`mt-4 w-full rounded-md px-3 py-2 text-sm font-medium ${labsEmpty ? 'bg-primary-600 text-white hover:bg-primary-500' : 'bg-neutral-800 text-neutral-400 cursor-not-allowed'}`}
              disabled={!labsEmpty}
            >
              {labsEmpty ? 'Request Slot' : 'Slots available — no request needed'}
            </button>
          </div>
        </div>

        {dashMsg && (
          <div className={`mt-4 rounded-md p-3 text-sm ${dashMsg.type === 'ok' ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-800/40' : 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-800/40'}`}>
            {dashMsg.text}
          </div>
        )}
      </div>
    </div>
  )
}
