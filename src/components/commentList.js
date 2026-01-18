import { escapeHtml, formatDateTime } from '../utils/helpers.js';

/**
 * Render comments list
 * @param {Array} comments - Array of comments
 * @param {HTMLElement} container - Container element
 * @param {HTMLElement} countElement - Element to display comment count
 */
export function renderCommentsList(comments, container, countElement) {
    countElement.textContent = comments.length;
    
    if (comments.length === 0) {
        container.innerHTML = '<div class="empty-state">No comments yet. Be the first to comment!</div>';
        return;
    }
    
    container.innerHTML = comments.map(comment => renderCommentItem(comment)).join('');
}

/**
 * Render a single comment item
 * @param {Object} comment - Comment object
 * @returns {string} HTML string for comment item
 */
function renderCommentItem(comment) {
    const formattedDate = formatDateTime(comment.createdAt);
    const userName = comment.createdByUserName || 'Anonymous';
    const isEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt;
    
    return `
        <div class="comment-item">
            <div class="comment-header">
                <span class="comment-author">👤 ${escapeHtml(userName)}</span>
                <span class="comment-date">${formattedDate}${isEdited ? ' (edited)' : ''}</span>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
            <div class="comment-actions">
                <button class="btn-link btn-danger-link" onclick="window.commentActions.delete(${comment.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
}

/**
 * Show loading state for comments
 * @param {HTMLElement} container - Container element
 */
export function showCommentsLoading(container) {
    container.innerHTML = '<div class="loading">Loading comments...</div>';
}

/**
 * Show error state for comments
 * @param {HTMLElement} container - Container element
 */
export function showCommentsError(container) {
    container.innerHTML = '<div class="error">Failed to load comments.</div>';
}
