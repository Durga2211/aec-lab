import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, Clock, User } from 'lucide-react'
import { 
  getInstructorNotifications, 
  getStudentNotifications, 
  getUnreadCount,
  resolveNotification,
  deleteNotification 
} from '../data/notifications.js'

export default function NotificationIcon({ userType, userName }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = () => {
    if (userType === 'instructor') {
      const instructorNotifs = getInstructorNotifications()
      setNotifications(instructorNotifs)
      setUnreadCount(getUnreadCount())
    } else {
      const studentNotifs = getStudentNotifications(userName)
      setNotifications(studentNotifs)
      setUnreadCount(studentNotifs.filter(n => !n.resolved).length)
    }
  }

  useEffect(() => {
    loadNotifications()
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [userType, userName])

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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-neutral-800 bg-neutral-900 shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 p-4">
            <h3 className="font-semibold text-white">
              {userType === 'instructor' ? 'Lab Requests' : 'My Requests'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-neutral-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${notification.resolved ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {notification.resolved ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <Clock className="h-5 w-5 text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-neutral-400" />
                          <p className="text-sm font-medium text-white truncate">
                            {notification.studentName}
                          </p>
                        </div>
                        <p className="text-sm text-neutral-300 mb-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                        {notification.resolved && (
                          <p className="text-xs text-green-400 mt-1">
                            Resolved by {notification.resolvedBy} on {formatTimestamp(notification.resolvedAt)}
                          </p>
                        )}
                      </div>
                      {userType === 'instructor' && !notification.resolved && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleResolve(notification.id)}
                            className="text-green-400 hover:text-green-300 p-1"
                            title="Mark as resolved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {userType === 'instructor' && (
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer for instructor with table view option */}
          {userType === 'instructor' && notifications.length > 0 && (
            <div className="border-t border-neutral-800 p-3">
              <button
                onClick={() => {
                  setIsOpen(false)
                  // This will be handled by parent component
                  if (window.showNotificationTable) {
                    window.showNotificationTable()
                  }
                }}
                className="w-full text-sm text-primary-400 hover:text-primary-300"
              >
                View detailed table →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
