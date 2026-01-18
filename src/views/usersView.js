import * as usersApi from '../api/users.js';
import { renderUsersList, showUsersLoading, showUsersError } from '../components/userList.js';
import { showSuccessMessage, showErrorAlert } from '../utils/notifications.js';
import { openModal, closeModal } from '../components/modal.js';
import { appState } from '../state/appState.js';

// DOM Elements
let elements = {};

/**
 * Initialize users view
 * @param {Object} domElements - DOM elements object
 */
export function initUsersView(domElements) {
    elements = domElements;
}

/**
 * Load users for display
 */
export async function loadUsersForDisplay() {
    try {
        showUsersLoading(elements.usersList);
        const endpoint = elements.onlyActiveUsers.checked ? usersApi.getActiveUsers : usersApi.getAllUsers;
        const users = await endpoint();
        renderUsersList(users, elements.usersList, elements.userCount);
    } catch (error) {
        showUsersError(elements.usersList, 'Failed to load users. Please try again.');
        console.error('Error loading users:', error);
    }
}

/**
 * Load active users and update state (for dropdowns)
 */
export async function loadActiveUsers() {
    try {
        const users = await usersApi.getActiveUsers();
        appState.setUsers(users);
        return users;
    } catch (error) {
        console.error('Error loading users:', error);
        appState.setUsers([]);
        return [];
    }
}

/**
 * Handle add user
 */
export async function handleAddUser(e) {
    e.preventDefault();
    
    const user = {
        name: elements.userName.value.trim(),
        email: elements.userEmail.value.trim(),
        department: elements.userDepartment.value.trim() || null,
        isActive: true
    };
    
    try {
        await usersApi.createUser(user);
        elements.userForm.reset();
        await loadUsersForDisplay();
        await loadActiveUsers(); // Refresh dropdown
        showSuccessMessage('✅ User added successfully!');
    } catch (error) {
        showUsersError(elements.usersList, 'Failed to add user. Please try again.');
        console.error('Error adding user:', error);
    }
}

/**
 * Handle edit user
 */
export async function handleEditUser(e) {
    e.preventDefault();
    
    const id = parseInt(elements.editUserId.value);
    const user = {
        id: id,
        name: elements.editUserName.value.trim(),
        email: elements.editUserEmail.value.trim(),
        department: elements.editUserDepartment.value.trim() || null,
        isActive: elements.editUserActive.checked
    };
    
    try {
        await usersApi.updateUser(id, user);
        closeEditUserModal();
        await loadUsersForDisplay();
        await loadActiveUsers(); // Refresh dropdown
        showSuccessMessage('✅ User updated successfully!');
    } catch (error) {
        showUsersError(elements.usersList, 'Failed to update user. Please try again.');
        console.error('Error updating user:', error);
    }
}

/**
 * Delete user
 */
export async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        await usersApi.deleteUser(id);
        await loadUsersForDisplay();
        await loadActiveUsers(); // Refresh dropdown
        showSuccessMessage('✅ User deleted successfully!');
    } catch (error) {
        showUsersError(elements.usersList, 'Failed to delete user. Please try again.');
        console.error('Error deleting user:', error);
    }
}

/**
 * Toggle user active status
 */
export async function toggleUserActive(user) {
    const updatedUser = {
        ...user,
        isActive: !user.isActive
    };
    
    try {
        await usersApi.updateUser(user.id, updatedUser);
        await loadUsersForDisplay();
        await loadActiveUsers(); // Refresh dropdown
        showSuccessMessage(`✅ User ${updatedUser.isActive ? 'activated' : 'deactivated'}!`);
    } catch (error) {
        showUsersError(elements.usersList, 'Failed to update user status. Please try again.');
        console.error('Error toggling user active:', error);
    }
}

/**
 * Handle user search
 */
export async function handleUserSearch() {
    const query = elements.userSearchQuery.value.trim();
    
    try {
        showUsersLoading(elements.usersList);
        
        // Get all users or only active
        const endpoint = elements.onlyActiveUsers.checked ? usersApi.getActiveUsers : usersApi.getAllUsers;
        let allUsers = await endpoint();
        
        // Filter by search query
        if (query) {
            allUsers = allUsers.filter(user => 
                user.name.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase()) ||
                (user.department && user.department.toLowerCase().includes(query.toLowerCase()))
            );
        }
        
        renderUsersList(allUsers, elements.usersList, elements.userCount);
    } catch (error) {
        showUsersError(elements.usersList, 'Failed to search users. Please try again.');
        console.error('Error searching users:', error);
    }
}

/**
 * Handle clear user search
 */
export function handleClearUserSearch() {
    elements.userSearchQuery.value = '';
    elements.onlyActiveUsers.checked = true;
    loadUsersForDisplay();
}

/**
 * Open edit user modal
 */
export function openEditUserModal(user) {
    elements.editUserId.value = user.id;
    elements.editUserName.value = user.name;
    elements.editUserEmail.value = user.email;
    elements.editUserDepartment.value = user.department || '';
    elements.editUserActive.checked = user.isActive;
    openModal(elements.editUserModal);
}

/**
 * Close edit user modal
 */
export function closeEditUserModal() {
    closeModal(elements.editUserModal, elements.editUserForm);
}
