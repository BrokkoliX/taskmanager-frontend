/**
 * Main application entry point
 * Orchestrates all views and components
 */

import * as tasksView from './views/tasksView.js';
import * as usersView from './views/usersView.js';
import { setupModalClickOutside } from './components/modal.js';

// DOM Elements - Tasks
const taskElements = {
    taskForm: document.getElementById('taskForm'),
    taskTitle: document.getElementById('taskTitle'),
    taskDescription: document.getElementById('taskDescription'),
    tasksList: document.getElementById('tasksList'),
    searchQuery: document.getElementById('searchQuery'),
    onlyIncomplete: document.getElementById('onlyIncomplete'),
    searchBtn: document.getElementById('searchBtn'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    exportBtn: document.getElementById('exportBtn'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    taskCount: document.getElementById('taskCount'),
    editModal: document.getElementById('editModal'),
    editForm: document.getElementById('editForm'),
    editTaskId: document.getElementById('editTaskId'),
    editTaskTitle: document.getElementById('editTaskTitle'),
    editTaskDescription: document.getElementById('editTaskDescription'),
    editTaskCompleted: document.getElementById('editTaskCompleted'),
    taskAssignee: document.getElementById('taskAssignee'),
    taskPriority: document.getElementById('taskPriority'),
    taskDueDate: document.getElementById('taskDueDate'),
    taskCategory: document.getElementById('taskCategory'),
    editTaskAssignee: document.getElementById('editTaskAssignee'),
    editTaskPriority: document.getElementById('editTaskPriority'),
    editTaskDueDate: document.getElementById('editTaskDueDate'),
    editTaskCategory: document.getElementById('editTaskCategory'),
    
    // Task details modal
    taskDetailsModal: document.getElementById('taskDetailsModal'),
    taskDetailsTitle: document.getElementById('taskDetailsTitle'),
    taskDetailsInfo: document.getElementById('taskDetailsInfo'),
    commentsList: document.getElementById('commentsList'),
    commentCount: document.getElementById('commentCount'),
    addCommentForm: document.getElementById('addCommentForm'),
    commentTaskId: document.getElementById('commentTaskId'),
    commentContent: document.getElementById('commentContent'),
    commentUser: document.getElementById('commentUser')
};

// DOM Elements - Users
const userElements = {
    userForm: document.getElementById('userForm'),
    userName: document.getElementById('userName'),
    userEmail: document.getElementById('userEmail'),
    userDepartment: document.getElementById('userDepartment'),
    usersList: document.getElementById('usersList'),
    userSearchQuery: document.getElementById('userSearchQuery'),
    onlyActiveUsers: document.getElementById('onlyActiveUsers'),
    userSearchBtn: document.getElementById('userSearchBtn'),
    clearUserSearchBtn: document.getElementById('clearUserSearchBtn'),
    userCount: document.getElementById('userCount'),
    editUserModal: document.getElementById('editUserModal'),
    editUserForm: document.getElementById('editUserForm'),
    editUserId: document.getElementById('editUserId'),
    editUserName: document.getElementById('editUserName'),
    editUserEmail: document.getElementById('editUserEmail'),
    editUserDepartment: document.getElementById('editUserDepartment'),
    editUserActive: document.getElementById('editUserActive')
};

// View switching elements
const menuItems = document.querySelectorAll('.menu-item');
const views = document.querySelectorAll('.view');

/**
 * Initialize the application
 */
function init() {
    // Initialize views
    usersView.initUsersView(userElements);
    tasksView.initTasksView(taskElements);
    
    // Load initial data
    usersView.loadActiveUsers().then(() => {
        tasksView.updateUserDropdowns();
    });
    
    // Attach event listeners
    attachEventListeners();
    
    // Setup global action handlers (for onclick in HTML)
    setupGlobalActions();
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
    // View switching
    menuItems.forEach(item => {
        item.addEventListener('click', () => switchView(item.dataset.view));
    });
    
    // Task management
    taskElements.taskForm.addEventListener('submit', tasksView.handleAddTask);
    taskElements.editForm.addEventListener('submit', tasksView.handleEditTask);
    taskElements.searchBtn.addEventListener('click', tasksView.handleSearch);
    taskElements.clearSearchBtn.addEventListener('click', tasksView.handleClearSearch);
    taskElements.exportBtn.addEventListener('click', tasksView.handleExport);
    taskElements.exportCsvBtn.addEventListener('click', tasksView.handleExportCsv);
    
    // User management
    userElements.userForm.addEventListener('submit', usersView.handleAddUser);
    userElements.editUserForm.addEventListener('submit', usersView.handleEditUser);
    userElements.userSearchBtn.addEventListener('click', usersView.handleUserSearch);
    userElements.clearUserSearchBtn.addEventListener('click', usersView.handleClearUserSearch);
    
    // Comment management
    taskElements.addCommentForm.addEventListener('submit', tasksView.handleAddComment);
    
    // Enter key in search
    taskElements.searchQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            tasksView.handleSearch();
        }
    });
    
    userElements.userSearchQuery.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            usersView.handleUserSearch();
        }
    });
    
    // Close modals on outside click
    setupModalClickOutside(taskElements.editModal, tasksView.closeEditModal);
    setupModalClickOutside(userElements.editUserModal, usersView.closeEditUserModal);
    setupModalClickOutside(taskElements.taskDetailsModal, tasksView.closeTaskDetailsModal);
}

/**
 * Switch between views
 * @param {string} viewName - Name of the view to switch to
 */
function switchView(viewName) {
    // Update active menu item
    menuItems.forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update active view
    views.forEach(view => {
        if (view.id === `${viewName}View`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });
    
    // Load data for the view
    if (viewName === 'users') {
        usersView.loadUsersForDisplay();
    } else if (viewName === 'tasks') {
        tasksView.loadTasks();
    }
}

/**
 * Setup global action handlers accessible from HTML onclick attributes
 */
function setupGlobalActions() {
    // Task actions
    window.taskActions = {
        openEdit: tasksView.openEditModal,
        closeEdit: tasksView.closeEditModal,
        delete: tasksView.deleteTask,
        toggleComplete: tasksView.toggleComplete,
        openDetails: tasksView.openTaskDetailsModal,
        closeDetails: tasksView.closeTaskDetailsModal
    };
    
    // User actions
    window.userActions = {
        openEdit: usersView.openEditUserModal,
        closeEdit: usersView.closeEditUserModal,
        delete: usersView.deleteUser,
        toggleActive: usersView.toggleUserActive
    };
    
    // Comment actions
    window.commentActions = {
        delete: tasksView.deleteComment
    };
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
