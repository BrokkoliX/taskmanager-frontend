const COMMENTS_API_BASE = 'http://localhost:5000/api/comments';

/**
 * Fetch comments for a specific task
 * @param {number} taskId - Task ID
 * @returns {Promise<Array>} Array of comments
 */
export async function getCommentsByTaskId(taskId) {
    const response = await fetch(`${COMMENTS_API_BASE}/task/${taskId}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Create a new comment
 * @param {Object} comment - Comment object
 * @returns {Promise<Object>} Created comment
 */
export async function createComment(comment) {
    const response = await fetch(COMMENTS_API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Delete a comment
 * @param {number} id - Comment ID
 * @returns {Promise<void>}
 */
export async function deleteComment(id) {
    const response = await fetch(`${COMMENTS_API_BASE}/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}
