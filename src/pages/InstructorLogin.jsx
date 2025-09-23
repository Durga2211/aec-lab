import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function InstructorLogin() {
  const navigate = useNavigate()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ok = passcode === 'lab'
    if (ok) {
      setError('')
      navigate('/instructor/hello')
    } else {
      setError('Invalid passcode. Please type "lab" to continue.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-24 text-neutral-200">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-white">Instructor Login</h1>
        <p className="mt-2 text-center text-sm text-neutral-400">Enter your passcode</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-300" htmlFor="passcode">Passcode</label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="******"
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-primary-600 focus:outline-none"
              required
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-500/10 p-2 text-sm text-red-300 ring-1 ring-red-800/40">
              {error}
            </div>
          )}
          <button type="submit" className="w-full rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-500">
            Continue
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          <Link to="/login" className="hover:text-neutral-300">Choose another role</Link>
        </div>
      </div>
    </div>
  )
}
