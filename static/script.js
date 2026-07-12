/**
 * script.js
 * Handles shortcuts + real Flask search request + result rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------
    // Configuration
    // ----------------------------
    const SEARCH_ENDPOINT = '/search';
    const SHORTCUTS_STORAGE_KEY = 'vrSearchShortcutsV3';

    // ----------------------------
    // Element Selection
    // ----------------------------
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results-container');

    const shortcutsContainer = document.getElementById('shortcuts-container');
    const shortcutsButtonContainer = document.getElementById('shortcuts-button-container');
    const editShortcutModalEl = document.getElementById('editShortcutModal');
    const editShortcutForm = document.getElementById('editShortcutForm');
    const saveShortcutChangesBtn = document.getElementById('saveShortcutChangesBtn');

    // Bootstrap modal only if it exists on the page
    const editModal = editShortcutModalEl ? new bootstrap.Modal(editShortcutModalEl) : null;

    let shortcuts = [];

    // ----------------------------
    // Utility
    // ----------------------------
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ----------------------------
    // Shortcut Management
    // ----------------------------
    function saveShortcuts() {
        localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
    }

    function loadShortcuts() {
        const storedShortcuts = localStorage.getItem(SHORTCUTS_STORAGE_KEY);

        if (storedShortcuts) {
            shortcuts = JSON.parse(storedShortcuts);
        } else {
            shortcuts = [
                { id: 1, name: 'Google', url: 'https://www.google.com' },
                { id: 2, name: 'YouTube', url: 'https://www.youtube.com' },
                { id: 3, name: 'Wikipedia', url: 'https://www.wikipedia.org' }
            ];
            saveShortcuts();
        }

        renderShortcuts();
    }

    function renderShortcuts() {
        if (!shortcutsButtonContainer) return;

        // Remove old shortcut items
        shortcutsButtonContainer.querySelectorAll('.shortcut-item').forEach(item => item.remove());

        const addShortcutBtn = shortcutsButtonContainer.querySelector('.btn-add-shortcut');
        if (!addShortcutBtn) return;

        shortcuts.forEach(shortcut => {
            const shortcutItemHTML = `
                <div class="shortcut-item dropdown">
                    <a href="${escapeHtml(shortcut.url)}" target="_blank" class="shortcut-btn-text" title="${escapeHtml(shortcut.url)}">
                        ${escapeHtml(shortcut.name)}
                    </a>
                    <button class="shortcut-btn-menu dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-shortcut-id="${shortcut.id}">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item edit-shortcut" href="#" data-shortcut-id="${shortcut.id}">Edit</a></li>
                        <li><a class="dropdown-item text-danger remove-shortcut" href="#" data-shortcut-id="${shortcut.id}">Remove</a></li>
                    </ul>
                </div>
            `;
            addShortcutBtn.insertAdjacentHTML('beforebegin', shortcutItemHTML);
        });

        // Initialize Bootstrap dropdowns for dynamically created buttons
        shortcutsButtonContainer.querySelectorAll('.dropdown-toggle').forEach(dropdownToggleEl => {
            new bootstrap.Dropdown(dropdownToggleEl);
        });
    }

    if (shortcutsButtonContainer) {
        const addBtn = shortcutsButtonContainer.querySelector('.btn-add-shortcut');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const name = prompt('Enter a name for the new shortcut:', '');
                if (!name || name.trim() === '') return;

                const url = prompt('Enter the URL for the shortcut:', 'https://');
                if (!url || url.trim() === '') return;

                shortcuts.push({
                    id: Date.now(),
                    name: name.trim(),
                    url: url.trim()
                });

                saveShortcuts();
                renderShortcuts();
            });
        }
    }

    if (shortcutsContainer) {
        shortcutsContainer.addEventListener('click', (event) => {
            const editButton = event.target.closest('.edit-shortcut');
            const removeButton = event.target.closest('.remove-shortcut');

            if (editButton) {
                event.preventDefault();
                const shortcutId = parseInt(editButton.dataset.shortcutId, 10);
                const shortcut = shortcuts.find(s => s.id === shortcutId);

                if (shortcut && editModal) {
                    document.getElementById('modalShortcutId').value = shortcut.id;
                    document.getElementById('modalShortcutName').value = shortcut.name;
                    document.getElementById('modalShortcutUrl').value = shortcut.url;
                    editModal.show();
                }
            }

            if (removeButton) {
                event.preventDefault();
                const shortcutId = parseInt(removeButton.dataset.shortcutId, 10);

                if (confirm('Are you sure you want to remove this shortcut?')) {
                    shortcuts = shortcuts.filter(s => s.id !== shortcutId);
                    saveShortcuts();
                    renderShortcuts();
                }
            }
        });

        shortcutsContainer.addEventListener('contextmenu', (event) => {
            const shortcutItem = event.target.closest('.shortcut-item');
            if (shortcutItem) {
                event.preventDefault();
                const menuBtn = shortcutItem.querySelector('.shortcut-btn-menu');
                if (menuBtn) menuBtn.click();
            }
        });
    }

    if (saveShortcutChangesBtn) {
        saveShortcutChangesBtn.addEventListener('click', () => {
            const shortcutId = parseInt(document.getElementById('modalShortcutId').value, 10);
            const newName = document.getElementById('modalShortcutName').value.trim();
            const newUrl = document.getElementById('modalShortcutUrl').value.trim();

            if (!newName || !newUrl) {
                alert('Name and URL cannot be empty.');
                return;
            }

            const shortcut = shortcuts.find(s => s.id === shortcutId);
            if (shortcut) {
                shortcut.name = newName;
                shortcut.url = newUrl;
                saveShortcuts();
                renderShortcuts();
                if (editModal) editModal.hide();
            }
        });
    }

    // ----------------------------
    // Search Logic
    // ----------------------------
    function displayResults(results) {
        if (!searchResultsContainer) return;

        if (!results || results.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning text-center mb-0">
                        No results found.
                    </div>
                </div>
            `;
            return;
        }

        searchResultsContainer.innerHTML = results.map(result => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${escapeHtml(result.title)}</h5>
                        <p class="card-text">${escapeHtml(result.snippet)}</p>
                        <p class="mb-0">
                            <small class="text-muted">Score: ${result.score}</small>
                        </p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (searchForm && searchInput && searchResultsContainer) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const query = searchInput.value.trim();
            if (!query) {
                searchResultsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info text-center mb-0">
                            Please enter a query.
                        </div>
                    </div>
                `;
                return;
            }

            searchResultsContainer.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-4">
                        Searching...
                    </div>
                </div>
            `;

            try {
                const response = await fetch(SEARCH_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Search failed');
                }

                if (data.message && (!data.results || data.results.length === 0)) {
                    searchResultsContainer.innerHTML = `
                        <div class="col-12">
                            <div class="alert alert-info text-center mb-0">
                                ${escapeHtml(data.message)}
                            </div>
                        </div>
                    `;
                    return;
                }

                displayResults(data.results);

            } catch (error) {
                console.error('Search error:', error);
                searchResultsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger text-center mb-0">
                            Error while searching. Check Flask console and browser console.
                        </div>
                    </div>
                `;
            }
        });
    }

    // Optional: clear results message while typing
    if (searchInput && searchResultsContainer) {
        searchInput.addEventListener('input', () => {
            if (searchResultsContainer.innerHTML.includes('Please enter a query.')) {
                searchResultsContainer.innerHTML = '';
            }
        });
    }

    // ----------------------------
    // Start
    // ----------------------------
    loadShortcuts();
});