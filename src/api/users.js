const USERS_API_BASE = 'http://localhost:5000/api/users';

/**
 * Fetch all users
 * @returns {Promise<Array>} Array of users
 */
export async function getAllUsers() {
    const response = await fetch(USERS_API_BASE);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Fetch only active users
 * @returns {Promise<Array>} Array of active users
 */
export async function getActiveUsers() {
    const response = await fetch(`${USERS_API_BASE}/active`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Create a new user
 * @param {Object} user - User object
 * @returns {Promise<Object>} Created user
 */
export async function createUser(user) {
    const response = await fetch(USERS_API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Update a user
 * @param {number} id - User ID
 * @param {Object} user - Updated user object
 * @returns {Promise<Object>} Updated user
 */
export async function updateUser(id, user) {
    const response = await fetch(`${USERS_API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
    const response = await fetch(`${USERS_API_BASE}/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}
