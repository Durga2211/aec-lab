import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
)

// Initialize Firebase (guard against double init in HMR)
let app
try {
  if (isConfigured) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  }
} catch (e) {
  // swallow to avoid crashing the UI; functions will guard on isConfigured
}

export const auth = app ? getAuth(app) : null
export const googleProvider = app ? new GoogleAuthProvider() : null
export { signOut, onAuthStateChanged }

export async function signInWithGoogle() {
  if (!app || !auth || !googleProvider) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys to .env and restart the dev server.')
  }
  return await signInWithPopup(auth, googleProvider)
}
