// Notification system for lab submission requests
// Stores notifications in localStorage for now, can be upgraded to Firebase later

let NOTIFICATIONS = []

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('lab_notifications')
    if (raw) NOTIFICATIONS = JSON.parse(raw) || []
  } catch (_) {
    NOTIFICATIONS = []
  }
}

function saveToStorage() {
  try {
    localStorage.setItem('lab_notifications', JSON.stringify(NOTIFICATIONS))
  } catch (_) {}
}

/**
 * Get all notifications
 * @returns {Array} Array of notification objects
 */
export function getNotifications() {
  loadFromStorage()
  return NOTIFICATIONS
}

/**
 * Get notifications for instructor (all unread notifications)
 * @returns {Array} Array of notification objects for instructor
 */
export function getInstructorNotifications() {
  loadFromStorage()
  return NOTIFICATIONS.filter(n => !n.resolved)
}

/**
 * Get notifications for a specific student
 * @param {string} studentName - Student name/email
 * @returns {Array} Array of notification objects for the student
 */
export function getStudentNotifications(studentName) {
  loadFromStorage()
  return NOTIFICATIONS.filter(n => n.studentName === studentName)
}

/**
 * Add a new notification request
 * @param {string} studentName - Student name/email
 * @param {string} description - Description of the incomplete experiment
 * @returns {Object} The created notification object
 */
export function addNotificationRequest(studentName, description = 'Request to submit incomplete experiment') {
  loadFromStorage()
  
  const notification = {
    id: Date.now().toString(),
    studentName,
    description,
    timestamp: new Date().toISOString(),
    resolved: false,
    resolvedAt: null,
    resolvedBy: null
  }
  
  NOTIFICATIONS.push(notification)
  saveToStorage()
  return notification
}

/**
 * Mark a notification as resolved
 * @param {string} notificationId - ID of the notification to resolve
 * @param {string} resolvedBy - Name of the instructor who resolved it
 * @returns {boolean} Success status
 */
export function resolveNotification(notificationId, resolvedBy = 'Instructor') {
  loadFromStorage()
  
  const notification = NOTIFICATIONS.find(n => n.id === notificationId)
  if (!notification) return false
  
  notification.resolved = true
  notification.resolvedAt = new Date().toISOString()
  notification.resolvedBy = resolvedBy
  
  saveToStorage()
  return true
}

/**
 * Delete a notification
 * @param {string} notificationId - ID of the notification to delete
 * @returns {boolean} Success status
 */
export function deleteNotification(notificationId) {
  loadFromStorage()
  
  const index = NOTIFICATIONS.findIndex(n => n.id === notificationId)
  if (index === -1) return false
  
  NOTIFICATIONS.splice(index, 1)
  saveToStorage()
  return true
}

/**
 * Clear all notifications
 */
export function clearAllNotifications() {
  NOTIFICATIONS = []
  saveToStorage()
}

/**
 * Get count of unread notifications for instructor
 * @returns {number} Count of unread notifications
 */
export function getUnreadCount() {
  loadFromStorage()
  return NOTIFICATIONS.filter(n => !n.resolved).length
}
