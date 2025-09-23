import { Link } from 'react-router-dom'
import { useState } from 'react'
import { importFromCSV } from '../data/studentRegistry.js'

export default function Login() {
  const [importMsg, setImportMsg] = useState(null)
  async function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const res = importFromCSV(text)
    const summary = `Imported ${res.count} rows${res.errors?.length ? `, ${res.errors.length} errors` : ''}`
    setImportMsg({ type: res.errors?.length ? 'warn' : 'ok', text: summary })
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-24 text-neutral-200">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-white">Choose your role</h1>
        <p className="mt-2 text-center text-sm text-neutral-400">
          Continue as a student or an instructor
        </p>

        <div className="mt-8 space-y-3">
          <Link to="/login/student" className="block w-full rounded-md bg-primary-600 px-4 py-3 text-center text-sm font-medium text-white shadow-sm hover:bg-primary-500">
            Login as Student
          </Link>
          <Link to="/login/instructor" className="block w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-neutral-200 hover:bg-neutral-800/60">
            Login as Instructor
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          <Link to="/" className="hover:text-neutral-300">
            Back to home
          </Link>
        </div>

        <div className="mt-8 rounded-md border border-neutral-800 bg-neutral-900/40 p-4">
          <p className="text-xs text-neutral-400">Have a CSV of students? Import to enable USN/DOB verification.</p>
          <input
            type="file"
            accept=".csv,text/csv,.tsv,text/tab-separated-values"
            onChange={handleImportFile}
            className="mt-3 w-full cursor-pointer rounded-md border border-neutral-800 bg-neutral-900 p-2 text-xs file:mr-3 file:rounded file:border-0 file:bg-neutral-800 file:px-3 file:py-1 file:text-neutral-200"
          />
          {importMsg && (
            <div className={`mt-3 rounded-md p-2 text-xs ${importMsg.type === 'ok' ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-800/40' : 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-800/40'}`}>
              {importMsg.text}
            </div>
          )}
          <details className="mt-3 text-xs text-neutral-400">
            <summary className="cursor-pointer text-neutral-300">CSV format help</summary>
            <div className="mt-2 space-y-1">
              <p>Headers must include <code>REG_NO</code> (or <code>USN</code>) and <code>DOB</code>.</p>
              <p>Examples of DOB formats accepted: <code>YYYY-MM-DD</code> or <code>DD-MM-YYYY</code>.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
