import { useState, useEffect } from 'react'
import { Users, Clock, CheckCircle, BookOpen } from 'lucide-react'
import NotificationIcon from '../components/NotificationIcon.jsx'
import NotificationTable from '../components/NotificationTable.jsx'
import { getNotifications, getUnreadCount } from '../data/notifications.js'

export default function InstructorHello() {
  const [showTable, setShowTable] = useState(false)
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    resolvedRequests: 0
  })

  const loadStats = () => {
    const notifications = getNotifications()
    const pending = notifications.filter(n => !n.resolved).length
    const resolved = notifications.filter(n => n.resolved).length
    
    setStats({
      totalRequests: notifications.length,
      pendingRequests: pending,
      resolvedRequests: resolved
    })
  }

  useEffect(() => {
    loadStats()
    // Set up global function for notification icon to call
    window.showNotificationTable = () => setShowTable(true)
    
    // Cleanup
    return () => {
      delete window.showNotificationTable
    }
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-10 text-neutral-200">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Instructor Dashboard</h1>
              <p className="mt-2 text-sm text-neutral-400">Manage lab requests and monitor student activities</p>
            </div>
            <NotificationIcon userType="instructor" userName="Instructor" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Total Requests */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">Total Requests</p>
                <p className="text-2xl font-semibold text-white">{stats.totalRequests}</p>
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">Pending</p>
                <p className="text-2xl font-semibold text-white">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          {/* Resolved Requests */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">Resolved</p>
                <p className="text-2xl font-semibold text-white">{stats.resolvedRequests}</p>
              </div>
            </div>
          </div>

          {/* Active Students */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-400">Active Students</p>
                <p className="text-2xl font-semibold text-white">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => setShowTable(true)}
              className="flex items-center gap-3 p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50 transition-colors text-left"
            >
              <div className="rounded-lg bg-primary-500/10 p-2">
                <BookOpen className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="font-medium text-white">View All Requests</p>
                <p className="text-sm text-neutral-400">Manage student lab requests</p>
              </div>
            </button>

            <button
              onClick={loadStats}
              className="flex items-center gap-3 p-4 rounded-lg border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50 transition-colors text-left"
            >
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-white">Refresh Data</p>
                <p className="text-sm text-neutral-400">Update dashboard statistics</p>
              </div>
            </button>

            <div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-700 bg-neutral-800/30 text-left opacity-60">
              <div className="rounded-lg bg-neutral-500/10 p-2">
                <Users className="h-5 w-5 text-neutral-400" />
              </div>
              <div>
                <p className="font-medium text-white">Manage Students</p>
                <p className="text-sm text-neutral-400">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {stats.totalRequests > 0 && (
          <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <button
                onClick={() => setShowTable(true)}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                View all →
              </button>
            </div>
            <div className="text-sm text-neutral-400">
              {stats.pendingRequests > 0 ? (
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {stats.pendingRequests} request{stats.pendingRequests !== 1 ? 's' : ''} waiting for your attention
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  All requests have been handled
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Table Modal */}
      <NotificationTable 
        isOpen={showTable} 
        onClose={() => {
          setShowTable(false)
          loadStats() // Refresh stats when table is closed
        }} 
      />
    </div>
  )
}
