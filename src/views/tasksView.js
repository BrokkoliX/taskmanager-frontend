import * as tasksApi from '../api/tasks.js';
import { renderTasksList, showTasksLoading, showTasksError } from '../components/taskList.js';
import { renderTaskDetails } from '../components/taskDetails.js';
import { renderCommentsList, showCommentsLoading, showCommentsError } from '../components/commentList.js';
import { populateUserDropdown } from '../components/userList.js';
import * as commentsApi from '../api/comments.js';
import { showSuccessMessage, showErrorAlert } from '../utils/notifications.js';
import { openModal, closeModal } from '../components/modal.js';
import { appState } from '../state/appState.js';

// DOM Elements
let elements = {};

/**
 * Initialize tasks view
 * @param {Object} domElements - DOM elements object
 */
export function initTasksView(domElements) {
    elements = domElements;
    loadTasks();
}

/**
 * Load all tasks
 */
export async function loadTasks() {
    try {
        showTasksLoading(elements.tasksList);
        const tasks = await tasksApi.getAllTasks();
        renderTasksList(tasks, elements.tasksList, elements.taskCount);
    } catch (error) {
        showTasksError(elements.tasksList, 'Failed to load tasks. Please try again.');
        console.error('Error loading tasks:', error);
    }
}

/**
 * Handle search
 */
export async function handleSearch() {
    const query = elements.searchQuery.value.trim();
    const incomplete = elements.onlyIncomplete.checked;
    
    try {
        showTasksLoading(elements.tasksList);
        const tasks = await tasksApi.searchTasks(query, incomplete);
        renderTasksList(tasks, elements.tasksList, elements.taskCount);
    } catch (error) {
        showTasksError(elements.tasksList, 'Failed to search tasks. Please try again.');
        console.error('Error searching tasks:', error);
    }
}

/**
 * Handle clear search
 */
export function handleClearSearch() {
    elements.searchQuery.value = '';
    elements.onlyIncomplete.checked = false;
    loadTasks();
}

/**
 * Handle export to Excel
 */
export function handleExport() {
    const query = elements.searchQuery.value.trim();
    const incomplete = elements.onlyIncomplete.checked;
    const url = tasksApi.getExportUrl(query, incomplete, 'excel');
    window.location.href = url;
    showSuccessMessage('Exporting tasks to Excel...');
}

/**
 * Handle export to CSV
 */
export function handleExportCsv() {
    const query = elements.searchQuery.value.trim();
    const incomplete = elements.onlyIncomplete.checked;
    const url = tasksApi.getExportUrl(query, incomplete, 'csv');
    window.location.href = url;
    showSuccessMessage('Exporting tasks to CSV...');
}

/**
 * Handle add task
 */
export async function handleAddTask(e) {
    e.preventDefault();
    
    const title = elements.taskTitle.value.trim();
    const description = elements.taskDescription.value.trim();
    const assigneeId = elements.taskAssignee.value ? parseInt(elements.taskAssignee.value) : null;
    const priority = parseInt(elements.taskPriority.value);
    const dueDate = elements.taskDueDate.value;
    const category = elements.taskCategory.value.trim();
    
    if (!title) {
        showErrorAlert('Please enter a task title');
        return;
    }
    
    const newTask = {
        title: title,
        description: description || null,
        isCompleted: false,
        assigneeId: assigneeId,
        priority: priority,
        dueDate: dueDate || null,
        category: category || null
    };
    
    try {
        await tasksApi.createTask(newTask);
        elements.taskForm.reset();
        await loadTasks();
        showSuccessMessage('Task added successfully!');
    } catch (error) {
        showErrorAlert('Failed to add task. Please try again.');
        console.error('Error adding task:', error);
    }
}

/**
 * Handle edit task
 */
export async function handleEditTask(e) {
    e.preventDefault();
    
    const id = parseInt(elements.editTaskId.value);
    const title = elements.editTaskTitle.value.trim();
    const description = elements.editTaskDescription.value.trim();
    const isCompleted = elements.editTaskCompleted.checked;
    const assigneeId = elements.editTaskAssignee.value ? parseInt(elements.editTaskAssignee.value) : null;
    const priority = parseInt(elements.editTaskPriority.value);
    const dueDate = elements.editTaskDueDate.value;
    const category = elements.editTaskCategory.value.trim();
    
    if (!title) {
        showErrorAlert('Please enter a task title');
        return;
    }
    
    const updatedTask = {
        id: id,
        title: title,
        description: description || null,
        isCompleted: isCompleted,
        assigneeId: assigneeId,
        priority: priority,
        dueDate: dueDate || null,
        category: category || null
    };
    
    try {
        await tasksApi.updateTask(id, updatedTask);
        closeEditModal();
        await loadTasks();
        showSuccessMessage('Task updated successfully!');
    } catch (error) {
        showErrorAlert('Failed to update task. Please try again.');
        console.error('Error updating task:', error);
    }
}

/**
 * Handle delete task
 */
export async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        await tasksApi.deleteTask(id);
        await loadTasks();
        showSuccessMessage('Task deleted successfully!');
    } catch (error) {
        showErrorAlert('Failed to delete task. Please try again.');
        console.error('Error deleting task:', error);
    }
}

/**
 * Open edit modal
 */
export function openEditModal(task) {
    elements.editTaskId.value = task.id;
    elements.editTaskTitle.value = task.title;
    elements.editTaskDescription.value = task.description || '';
    elements.editTaskCompleted.checked = task.isCompleted;
    elements.editTaskAssignee.value = task.assigneeId || '';
    elements.editTaskPriority.value = task.priority || 1;
    elements.editTaskDueDate.value = task.dueDate ? task.dueDate.split('T')[0] : '';
    elements.editTaskCategory.value = task.category || '';
    openModal(elements.editModal);
}

/**
 * Close edit modal
 */
export function closeEditModal() {
    closeModal(elements.editModal, elements.editForm);
}

/**
 * Toggle task completion
 */
export async function toggleComplete(task) {
    const updatedTask = {
        id: task.id,
        title: task.title,
        description: task.description,
        isCompleted: !task.isCompleted,
        assigneeId: task.assigneeId,
        priority: task.priority,
        dueDate: task.dueDate,
        category: task.category
    };
    
    try {
        await tasksApi.updateTask(task.id, updatedTask);
        await loadTasks();
    } catch (error) {
        showErrorAlert('Failed to update task. Please try again.');
        console.error('Error toggling task completion:', error);
    }
}

/**
 * Open task details modal with comments
 */
export async function openTaskDetailsModal(task) {
    elements.commentTaskId.value = task.id;
    elements.taskDetailsTitle.textContent = `Task: ${task.title}`;
    
    // Display task info
    renderTaskDetails(task, elements.taskDetailsInfo);
    
    // Populate comment user dropdown
    const users = appState.getUsers();
    populateUserDropdown(users, elements.commentUser);
    
    // Load comments
    await loadComments(task.id);
    
    // Show modal
    openModal(elements.taskDetailsModal);
}

/**
 * Close task details modal
 */
export function closeTaskDetailsModal() {
    closeModal(elements.taskDetailsModal, elements.addCommentForm);
}

/**
 * Load comments for a task
 */
async function loadComments(taskId) {
    try {
        showCommentsLoading(elements.commentsList);
        const comments = await commentsApi.getCommentsByTaskId(taskId);
        renderCommentsList(comments, elements.commentsList, elements.commentCount);
    } catch (error) {
        showCommentsError(elements.commentsList);
        console.error('Error loading comments:', error);
    }
}

/**
 * Handle add comment
 */
export async function handleAddComment(e) {
    e.preventDefault();
    
    const content = elements.commentContent.value.trim();
    const taskId = parseInt(elements.commentTaskId.value);
    const userId = elements.commentUser.value ? parseInt(elements.commentUser.value) : null;
    
    if (!content) {
        showErrorAlert('Please enter a comment');
        return;
    }
    
    const newComment = {
        content: content,
        taskItemId: taskId,
        createdByUserId: userId
    };
    
    try {
        await commentsApi.createComment(newComment);
        elements.commentContent.value = '';
        await loadComments(taskId);
        showSuccessMessage('💬 Comment added successfully!');
    } catch (error) {
        showErrorAlert('Failed to add comment. Please try again.');
        console.error('Error adding comment:', error);
    }
}

/**
 * Delete comment
 */
export async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    try {
        await commentsApi.deleteComment(commentId);
        const taskId = parseInt(elements.commentTaskId.value);
        await loadComments(taskId);
        showSuccessMessage('💬 Comment deleted successfully!');
    } catch (error) {
        showErrorAlert('Failed to delete comment. Please try again.');
        console.error('Error deleting comment:', error);
    }
}

/**
 * Update user dropdowns when users change
 */
export function updateUserDropdowns() {
    const users = appState.getUsers();
    populateUserDropdown(users, elements.taskAssignee);
    populateUserDropdown(users, elements.editTaskAssignee);
}
