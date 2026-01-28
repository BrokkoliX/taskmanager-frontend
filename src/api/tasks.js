const API_BASE = 'http://localhost:5050/api/tasks';

/**
 * Fetch all tasks
 * @returns {Promise<Array>} Array of tasks
 */
export async function getAllTasks() {
    const response = await fetch(API_BASE);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Search tasks with filters
 * @param {string} query - Search query
 * @param {boolean} onlyIncomplete - Filter for incomplete tasks only
 * @returns {Promise<Array>} Array of filtered tasks
 */
export async function searchTasks(query, onlyIncomplete) {
    let url = `${API_BASE}/search?onlyIncomplete=${onlyIncomplete}`;
    
    if (query) {
        url += `&query=${encodeURIComponent(query)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Create a new task
 * @param {Object} task - Task object
 * @returns {Promise<Object>} Created task
 */
export async function createTask(task) {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Update a task
 * @param {number} id - Task ID
 * @param {Object} task - Updated task object
 * @returns {Promise<Object>} Updated task
 */
export async function updateTask(id, task) {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}

/**
 * Get export URL for tasks
 * @param {string} query - Search query
 * @param {boolean} onlyIncomplete - Filter for incomplete tasks only
 * @param {string} format - Export format ('excel' or 'csv')
 * @returns {string} Export URL
 */
export function getExportUrl(query, onlyIncomplete, format = 'excel') {
    const endpoint = format === 'csv' ? '/export/csv' : '/export';
    let url = `${API_BASE}${endpoint}?onlyIncomplete=${onlyIncomplete}`;
    
    if (query) {
        url += `&query=${encodeURIComponent(query)}`;
    }
    
    return url;
}
