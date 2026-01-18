/**
 * Open a modal
 * @param {HTMLElement} modal - Modal element
 */
export function openModal(modal) {
    modal.classList.add('show');
}

/**
 * Close a modal
 * @param {HTMLElement} modal - Modal element
 * @param {HTMLFormElement} form - Optional form to reset
 */
export function closeModal(modal, form = null) {
    modal.classList.remove('show');
    if (form) {
        form.reset();
    }
}

/**
 * Setup modal close on outside click
 * @param {HTMLElement} modal - Modal element
 * @param {Function} closeCallback - Callback function to close modal
 */
export function setupModalClickOutside(modal, closeCallback) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCallback();
        }
    });
}
