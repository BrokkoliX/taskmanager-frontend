/**
 * Application state management
 */
class AppState {
    constructor() {
        this.users = [];
        this.currentView = 'tasks';
    }

    /**
     * Set the users list
     * @param {Array} users - Array of users
     */
    setUsers(users) {
        this.users = users;
    }

    /**
     * Get the users list
     * @returns {Array} Array of users
     */
    getUsers() {
        return this.users;
    }

    /**
     * Set the current view
     * @param {string} view - View name
     */
    setCurrentView(view) {
        this.currentView = view;
    }

    /**
     * Get the current view
     * @returns {string} Current view name
     */
    getCurrentView() {
        return this.currentView;
    }
}

// Export singleton instance
export const appState = new AppState();
