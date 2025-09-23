import { useMemo, useState } from 'react'
import { getState, listKits, getAvailableKits, getTakenKits, setTotalKits, releaseKit } from '../data/adkits.js'

export default function InstructorHello() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [totalInput, setTotalInput] = useState(getState().total)
  const kits = useMemo(() => listKits(), [refreshKey])
  const available = useMemo(() => getAvailableKits(), [refreshKey])
  const taken = useMemo(() => getTakenKits(), [refreshKey])

  function applyTotal(e) {
    e?.preventDefault?.()
    setTotalKits(totalInput)
    setRefreshKey((k) => k + 1)
  }

  function handleRelease(num) {
    const res = releaseKit(num)
    if (res.ok) setRefreshKey((k) => k + 1)
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-200">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">AD Kit Management</h1>
              <p className="mt-2 text-sm text-neutral-400">Monitor and manage Analog/Digital kit allocation</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-300">Available: <span className="text-emerald-400 font-semibold">{available.length}</span> / {getState().total}</p>
              <p className="text-xs text-neutral-500">Taken: {taken.length}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
          <form onSubmit={applyTotal} className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-neutral-300">Total AD Kits</label>
            <input
              type="number"
              min={1}
              max={200}
              value={totalInput}
              onChange={(e) => setTotalInput(e.target.value)}
              className="w-28 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-primary-600 outline-none"
            />
            <button type="submit" className="rounded-md bg-primary-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-primary-500">Apply</button>
          </form>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-auto rounded-xl border border-neutral-800">
          <table className="min-w-full bg-neutral-900/60">
            <thead className="bg-neutral-800/60">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-neutral-300">Kit</th>
                <th className="text-left p-3 text-sm font-medium text-neutral-300">Status</th>
                <th className="text-left p-3 text-sm font-medium text-neutral-300">USN</th>
                <th className="text-left p-3 text-sm font-medium text-neutral-300">Taken At</th>
                <th className="text-left p-3 text-sm font-medium text-neutral-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {kits.map(k => (
                <tr key={k.number} className="hover:bg-neutral-800/30">
                  <td className="p-3"><span className="text-white font-medium">AD Kit {k.number}</span></td>
                  <td className="p-3">
                    {k.usn ? (
                      <span className="text-amber-300 text-sm">Taken</span>
                    ) : (
                      <span className="text-emerald-300 text-sm">Available</span>
                    )}
                  </td>
                  <td className="p-3"><span className="text-neutral-200 text-sm">{k.usn || '-'}</span></td>
                  <td className="p-3"><span className="text-neutral-400 text-sm">{k.takenAt ? new Date(k.takenAt).toLocaleString() : '-'}</span></td>
                  <td className="p-3">
                    {k.usn ? (
                      <button onClick={() => handleRelease(k.number)} className="text-sm rounded-md bg-neutral-800 hover:bg-neutral-700 px-3 py-1 text-white">Release</button>
                    ) : (
                      <span className="text-neutral-600 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
