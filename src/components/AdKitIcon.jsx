import { useEffect, useMemo, useState } from 'react'
import { Wrench, X } from 'lucide-react'
import { getState, getAvailableKits, reserveKit, validateUSN } from '../data/adkits.js'

export default function AdKitIcon({ defaultUSN = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [usn, setUsn] = useState(defaultUSN)
  const [selectedKit, setSelectedKit] = useState('')
  const [status, setStatus] = useState(null) // {type:'ok'|'error'|'info', text}
  const [refreshKey, setRefreshKey] = useState(0)

  const state = useMemo(() => getState(), [refreshKey])
  const available = useMemo(() => getAvailableKits(), [refreshKey])

  useEffect(() => {
    setSelectedKit(available[0]?.number || '')
  }, [isOpen, refreshKey])

  function submitReserve(e) {
    e?.preventDefault?.()
    setStatus(null)
    const sUSN = String(usn).trim().toUpperCase()
    if (!validateUSN(sUSN)) {
      setStatus({ type: 'error', text: 'Enter valid USN like 1SI24ET0XX (01-60)' })
      return
    }
    if (!selectedKit) {
      setStatus({ type: 'error', text: 'Choose an AD kit' })
      return
    }
    const res = reserveKit(selectedKit, sUSN)
    if (!res.ok) {
      setStatus({ type: 'error', text: res.reason || 'Could not reserve kit' })
      return
    }
    setStatus({ type: 'ok', text: `Reserved AD Kit ${selectedKit} for ${sUSN}` })
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="relative">
      {/* Icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        title="AD Kit Availability"
      >
        <Wrench className="h-6 w-6" />
        {available.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-medium text-white">
            {available.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-lg border border-neutral-800 bg-neutral-900 shadow-lg z-50">
          <div className="flex items-center justify-between border-b border-neutral-800 p-4">
            <div>
              <h3 className="font-semibold text-white">AD Kits</h3>
              <p className="text-xs text-neutral-400">Available: {available.length} / {state.total}</p>
            </div>
            <button className="text-neutral-400 hover:text-white" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={submitReserve} className="p-4 space-y-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">USN (1SI24ET0XX)</label>
              <input
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="1SI24ET0XX"
                className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-primary-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Select AD Kit</label>
              <select
                value={selectedKit}
                onChange={(e) => setSelectedKit(e.target.value)}
                className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-primary-600 outline-none"
              >
                {available.length === 0 ? (
                  <option value="">No kits available</option>
                ) : (
                  available.map(k => (
                    <option key={k.number} value={k.number}>AD Kit {k.number}</option>
                  ))
                )}
              </select>
            </div>
            {status && (
              <div className={`rounded p-2 text-sm ${
                status.type === 'ok' ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-800/40' :
                status.type === 'error' ? 'bg-red-500/10 text-red-300 ring-1 ring-red-800/40' :
                'bg-blue-500/10 text-blue-300 ring-1 ring-blue-800/40'
              }`}>
                {status.text}
              </div>
            )}
            <button
              type="submit"
              disabled={available.length === 0}
              className={`w-full rounded-md px-3 py-2 text-sm font-medium ${available.length > 0 ? 'bg-primary-600 text-white hover:bg-primary-500' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
            >
              Reserve AD Kit
            </button>
          </form>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
