import { escapeHtml, formatDate } from '../utils/helpers.js';

/**
 * Render the users list
 * @param {Array} users - Array of users
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} countElement - Element to display user count
 */
export function renderUsersList(users, container, countElement) {
    countElement.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;
    
    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state">No users found. Add your first user above!</div>';
        return;
    }
    
    container.innerHTML = users.map(user => renderUserItem(user)).join('');
}

/**
 * Render a single user item
 * @param {Object} user - User object
 * @returns {string} HTML string for user item
 */
function renderUserItem(user) {
    return `
    <div class="task-item ${!user.isActive ? 'completed' : ''}">
        <div class="task-header">
            <div>
                <h3 class="task-title">${escapeHtml(user.name)}</h3>
                <span class="task-status ${user.isActive ? 'pending' : 'completed'}">
                    ${user.isActive ? '✓ Active' : '✗ Inactive'}
                </span>
            </div>
        </div>
        <div class="task-description">
            📧 ${escapeHtml(user.email)}
        </div>
        ${user.department ? `
        <div class="task-metadata">
            <span class="task-meta-item">🏢 ${escapeHtml(user.department)}</span>
        </div>
        ` : ''}
        <div class="task-metadata">
            <span class="task-meta-item">📅 Created: ${formatDate(user.createdAt)}</span>
            <span class="task-meta-item">🎯 Assigned Tasks: ${user.assignedTasks?.length || 0}</span>
        </div>
        <div class="task-footer">
            <span class="task-id">ID: ${user.id}</span>
            <div class="task-actions">
                <button class="btn btn-secondary" onclick="window.userActions.toggleActive(${escapeHtml(JSON.stringify(user))})">
                    ${user.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                </button>
                <button class="btn btn-edit" onclick="window.userActions.openEdit(${escapeHtml(JSON.stringify(user))})">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger" onclick="window.userActions.delete(${user.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    </div>
    `;
}

/**
 * Show loading state
 * @param {HTMLElement} container - Container element
 */
export function showUsersLoading(container) {
    container.innerHTML = '<div class="loading">Loading users...</div>';
}

/**
 * Show error state
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 */
export function showUsersError(container, message) {
    container.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
}

/**
 * Populate user dropdown with options
 * @param {Array} users - Array of users
 * @param {HTMLSelectElement} dropdown - Dropdown element
 */
export function populateUserDropdown(users, dropdown) {
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // Add user options
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        dropdown.appendChild(option);
    });
}
