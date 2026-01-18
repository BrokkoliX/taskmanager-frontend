/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format a date string to local date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

/**
 * Format a date string to local date and time string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date and time
 */
export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * Check if a date is overdue
 * @param {string} dateString - ISO date string
 * @param {boolean} isCompleted - Whether the task is completed
 * @returns {boolean} True if overdue
 */
export function isOverdue(dateString, isCompleted) {
    if (!dateString || isCompleted) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
}

/**
 * Get priority label and class
 * @param {number} priority - Priority level (0, 1, 2)
 * @returns {object} Object with label and class
 */
export function getPriorityInfo(priority) {
    const priorityLabels = ['Low', 'Medium', 'High'];
    const priorityClasses = ['priority-low', 'priority-medium', 'priority-high'];
    return {
        label: priorityLabels[priority] || 'Medium',
        class: priorityClasses[priority] || 'priority-medium'
    };
}
