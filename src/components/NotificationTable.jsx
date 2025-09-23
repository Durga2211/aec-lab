import { useState, useEffect } from 'react'
import { CheckCircle, Clock, User, X, Trash2, RefreshCw } from 'lucide-react'
import { 
  getNotifications, 
  resolveNotification, 
  deleteNotification,
  clearAllNotifications 
} from '../data/notifications.js'

export default function NotificationTable({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'resolved'
  const [sortBy, setSortBy] = useState('timestamp') // 'timestamp', 'studentName', 'status'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'

  const loadNotifications = () => {
    const allNotifications = getNotifications()
    setNotifications(allNotifications)
  }

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const handleResolve = (notificationId) => {
    if (resolveNotification(notificationId, 'Instructor')) {
      loadNotifications()
    }
  }

  const handleDelete = (notificationId) => {
    if (deleteNotification(notificationId)) {
      loadNotifications()
    }
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      clearAllNotifications()
      loadNotifications()
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'pending') return !notification.resolved
    if (filter === 'resolved') return notification.resolved
    return true
  })

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'studentName':
        aValue = a.studentName.toLowerCase()
        bValue = b.studentName.toLowerCase()
        break
      case 'status':
        aValue = a.resolved ? 1 : 0
        bValue = b.resolved ? 1 : 0
        break
      case 'timestamp':
      default:
        aValue = new Date(a.timestamp)
        bValue = new Date(b.timestamp)
        break
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingCount = notifications.filter(n => !n.resolved).length
  const resolvedCount = notifications.filter(n => n.resolved).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-4 bg-neutral-900 rounded-lg border border-neutral-800 shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-white">Lab Request Notifications</h2>
            <p className="text-sm text-neutral-400 mt-1">
              {pendingCount} pending • {resolvedCount} resolved • {notifications.length} total
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-300">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-sm text-white"
              >
                <option value="all">All ({notifications.length})</option>
                <option value="pending">Pending ({pendingCount})</option>
                <option value="resolved">Resolved ({resolvedCount})</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded px-3 py-1 text-sm text-white"
              >
                <option value="timestamp">Date</option>
                <option value="studentName">Student Name</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="text-neutral-400 hover:text-white p-1"
                title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
              >
                <RefreshCw className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={loadNotifications}
                className="flex items-center gap-2 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {sortedNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-neutral-400">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications found</p>
                <p className="text-sm mt-1">
                  {filter === 'pending' ? 'No pending requests' : 
                   filter === 'resolved' ? 'No resolved requests' : 
                   'No requests have been submitted yet'}
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-neutral-800/50 sticky top-0">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-300">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-300">Student</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-300">Description</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-300">Submitted</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-300">Resolved</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {sortedNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-neutral-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {notification.resolved ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-400" />
                        )}
                        <span className={`text-sm ${notification.resolved ? 'text-green-400' : 'text-amber-400'}`}>
                          {notification.resolved ? 'Resolved' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-white font-medium">
                          {notification.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-neutral-300">
                        {notification.description}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-neutral-400">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </td>
                    <td className="p-4">
                      {notification.resolved ? (
                        <div className="text-sm">
                          <div className="text-neutral-400">
                            {formatTimestamp(notification.resolvedAt)}
                          </div>
                          <div className="text-xs text-neutral-500">
                            by {notification.resolvedBy}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {!notification.resolved && (
                          <button
                            onClick={() => handleResolve(notification.id)}
                            className="text-green-400 hover:text-green-300 p-1 rounded"
                            title="Mark as resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded"
                          title="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
