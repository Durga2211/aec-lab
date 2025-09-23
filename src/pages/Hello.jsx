// Student Dashboard

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import NotificationIcon from '../components/NotificationIcon.jsx'
import { addNotificationRequest } from '../data/notifications.js'

export default function Hello() {
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [dashMsg, setDashMsg] = useState(null)
  const [requestDesc, setRequestDesc] = useState('Request to submit incomplete experiment - lab slot needed')

  // Prefer Firebase user; fall back to value passed during navigate
  const fallbackName = location.state?.usn || ''

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  // Mock data for dashboard widgets
  const labsTotal = 5
  const labsAvailable = 2 // change to 0 to see the request button enabled
  const kitsAvailable = 24
  const labsEmpty = labsAvailable === 0

  function handleRequestSlot() {
    if (!labsEmpty) {
      setDashMsg({ type: 'info', text: 'Labs are currently available. Request is only needed when labs are empty.' })
      return
    }
    
    // Add notification request
    const studentName = displayName || 'Unknown Student'
    const description = requestDesc?.trim() || 'Request to submit incomplete experiment - lab slot needed'
    
    try {
      addNotificationRequest(studentName, description)
      setDashMsg({ type: 'ok', text: 'Request submitted successfully! The instructor will be notified and you will receive an update when a slot becomes available.' })
      setRequestDesc('Request to submit incomplete experiment - lab slot needed')
    } catch (error) {
      setDashMsg({ type: 'error', text: 'Failed to submit request. Please try again.' })
    }
  }

  const displayName = user?.displayName || user?.email || fallbackName || ''

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-200">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header with Greeting and Notifications */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Hello{displayName ? `, ${displayName}` : ''}
              </h1>
              <p className="mt-1 text-sm text-neutral-400">Here is a quick overview of the lab status.</p>
            </div>
            <NotificationIcon userType="student" userName={displayName} />
          </div>
        </div>

        {/* Dashboard widgets */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            <textarea
              value={requestDesc}
              onChange={(e) => setRequestDesc(e.target.value)}
              className={`mt-3 w-full rounded-md border px-3 py-2 text-sm bg-neutral-900 text-neutral-100 placeholder:text-neutral-500 focus:outline-none ${labsEmpty ? 'border-neutral-800 focus:border-primary-600' : 'border-neutral-800/50 text-neutral-500'}`}
              placeholder="Add a short description for your request"
              rows={3}
              disabled={!labsEmpty}
            />
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
          <div className={`mt-4 rounded-md p-3 text-sm ${
            dashMsg.type === 'ok' ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-800/40' : 
            dashMsg.type === 'error' ? 'bg-red-500/10 text-red-300 ring-1 ring-red-800/40' :
            'bg-blue-500/10 text-blue-300 ring-1 ring-blue-800/40'
          }`}>
            {dashMsg.text}
          </div>
        )}
      </div>
    </div>
  )
}
