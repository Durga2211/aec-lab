import { FlaskConical, ShieldCheck } from 'lucide-react'
import { Link, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import StudentLogin from './pages/StudentLogin.jsx'
import InstructorLogin from './pages/InstructorLogin.jsx'
import Hello from './pages/Hello.jsx'
import InstructorHello from './pages/InstructorHello.jsx'

function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-600/20 ring-1 ring-primary-500/30">
            <FlaskConical className="h-5 w-5 text-primary-400" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Lab Zen</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-md bg-primary-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-500">Get started</Link>
        </div>
      </Container>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>
      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-xs text-neutral-300">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-400" />
            Trusted by modern colleges
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Manage college labs effortlessly
          </h1>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            A modern lab management system to handle equipment, bookings, students, and faculty—all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/login" className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-500">
              Get started
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <NavBar />
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/instructor" element={<InstructorLogin />} />
      <Route path="/hello" element={<Hello />} />
      <Route path="/instructor/hello" element={<InstructorHello />} />
    </Routes>
  )
}


