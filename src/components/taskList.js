import { escapeHtml, formatDate, isOverdue, getPriorityInfo } from '../utils/helpers.js';

/**
 * Render the tasks list
 * @param {Array} tasks - Array of tasks
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} countElement - Element to display task count
 */
export function renderTasksList(tasks, container, countElement) {
    countElement.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
    
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state">No tasks found. Add your first task above!</div>';
        return;
    }
    
    container.innerHTML = tasks.map(task => renderTaskItem(task)).join('');
}

/**
 * Render a single task item
 * @param {Object} task - Task object
 * @returns {string} HTML string for task item
 */
function renderTaskItem(task) {
    const metadata = buildTaskMetadata(task);
    
    return `
    <div class="task-item ${task.isCompleted ? 'completed' : ''}">
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="task-status ${task.isCompleted ? 'completed' : 'pending'}">
                ${task.isCompleted ? '✓ Completed' : '○ Pending'}
            </span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        ${metadata.length > 0 ? `<div class="task-metadata">${metadata.join('')}</div>` : ''}
        <div class="task-footer">
            <span class="task-id">ID: ${task.id}</span>
            <div class="task-actions">
                <button class="btn btn-info" onclick='window.taskActions.openDetails(${JSON.stringify(task).replace(/'/g, "&apos;")})'>
                    💬 View Details
                </button>
                <button class="btn btn-secondary" onclick='window.taskActions.toggleComplete(${JSON.stringify(task).replace(/'/g, "&apos;")})'>
                    ${task.isCompleted ? '↶ Mark Incomplete' : '✓ Mark Complete'}
                </button>
                <button class="btn btn-edit" onclick='window.taskActions.openEdit(${JSON.stringify(task).replace(/'/g, "&apos;")})'>
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="window.taskActions.delete(${task.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Build task metadata array
 * @param {Object} task - Task object
 * @returns {Array} Array of metadata HTML strings
 */
function buildTaskMetadata(task) {
    const metadata = [];
    
    if (task.assignee?.name) {
        metadata.push(`<span class="task-meta-item">👤 ${escapeHtml(task.assignee.name)}</span>`);
    }
    
    if (task.category) {
        metadata.push(`<span class="task-meta-item">🏷️ ${escapeHtml(task.category)}</span>`);
    }
    
    const priorityInfo = getPriorityInfo(task.priority);
    metadata.push(`<span class="task-meta-item ${priorityInfo.class}">⚡ ${priorityInfo.label}</span>`);
    
    if (task.dueDate) {
        const overdue = isOverdue(task.dueDate, task.isCompleted);
        const dueDateStr = formatDate(task.dueDate);
        metadata.push(`<span class="task-meta-item ${overdue ? 'overdue' : ''}">📅 ${dueDateStr}${overdue ? ' (Overdue)' : ''}</span>`);
    }
    
    if (task.createdAt) {
        const createdDate = formatDate(task.createdAt);
        metadata.push(`<span class="task-meta-item">🕒 Created: ${createdDate}</span>`);
    }
    
    return metadata;
}

/**
 * Show loading state
 * @param {HTMLElement} container - Container element
 */
export function showTasksLoading(container) {
    container.innerHTML = '<div class="loading">Loading tasks...</div>';
}

/**
 * Show error state
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 */
export function showTasksError(container, message) {
    container.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}
