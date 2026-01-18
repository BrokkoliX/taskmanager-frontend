import { escapeHtml, formatDate, getPriorityInfo } from '../utils/helpers.js';

/**
 * Render task details card
 * @param {Object} task - Task object
 * @param {HTMLElement} container - Container element
 */
export function renderTaskDetails(task, container) {
    const priorityInfo = getPriorityInfo(task.priority);
    
    container.innerHTML = `
        <div class="task-detail-card">
            <div class="task-header">
                <h3>${escapeHtml(task.title)}</h3>
                <span class="task-status ${task.isCompleted ? 'completed' : 'pending'}">
                    ${task.isCompleted ? '✓ Completed' : '○ Pending'}
                </span>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-metadata">
                ${task.assignee?.name ? `<span class="task-meta-item">👤 ${escapeHtml(task.assignee.name)}</span>` : ''}
                <span class="task-meta-item ${priorityInfo.class}">⚡ ${priorityInfo.label}</span>
                ${task.category ? `<span class="task-meta-item">🏷️ ${escapeHtml(task.category)}</span>` : ''}
                ${task.dueDate ? `<span class="task-meta-item">📅 ${formatDate(task.dueDate)}</span>` : ''}
            </div>
        </div>
    `;
}
