import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { auth, googleProvider } from '../firebase.js'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'

export default function StudentLogin() {
  const navigate = useNavigate()
  const [status, setStatus] = useState(null) // {type: 'error'|'success'|'info', msg: string}

  async function handleGoogle() {
    try {
      setStatus({ type: 'info', msg: 'Opening Google sign-in…' })
      const result = await signInWithPopup(auth, googleProvider)
      const user = result?.user
      setStatus({ type: 'success', msg: `Signed in as ${user?.displayName || user?.email}` })
      navigate('/hello', { state: { usn: user?.displayName || user?.email } })
    } catch (err) {
      console.error(err)
      // Fallback to redirect if popup is blocked
      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/cancelled-popup-request') {
        setStatus({ type: 'info', msg: 'Popup blocked. Redirecting to Google…' })
        try {
          await signInWithRedirect(auth, googleProvider)
          return
        } catch (e2) {
          console.error(e2)
          setStatus({ type: 'error', msg: e2?.message || 'Google sign-in failed (redirect)' })
          return
        }
      }
      setStatus({ type: 'error', msg: err?.message || 'Google sign-in failed' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-24 text-neutral-200">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-white">Student Login</h1>
        <p className="mt-2 text-center text-sm text-neutral-400">Sign in with your Google account</p>

        <div className="mt-8 space-y-4">
          {status && (
            <div className={`rounded-md p-3 text-sm ${status.type === 'error' ? 'bg-red-500/10 text-red-300 ring-1 ring-red-800/40' : status.type === 'info' ? 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-800/40' : 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-800/40'}`}>
              {status.msg}
            </div>
          )}
          <button onClick={handleGoogle} className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100">
            Continue with Google
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          <Link to="/login" className="hover:text-neutral-300">Choose another role</Link>
        </div>
      </div>
    </div>
  )
}
