/**
 * @file script.js
 * @description This script handles all frontend logic, including shortcut management with an edit modal.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const API_BASE_URL = 'http://127.0.0.1:5000';
    const SHORTCUTS_STORAGE_KEY = 'vrSearchShortcutsV3'; // New key for the new data format

    // --- Element Selection ---
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const shortcutsContainer = document.getElementById('shortcuts-container');
    const shortcutsButtonContainer = document.getElementById('shortcuts-button-container');
    const editShortcutModalEl = document.getElementById('editShortcutModal');
    const editShortcutForm = document.getElementById('editShortcutForm');
    const saveShortcutChangesBtn = document.getElementById('saveShortcutChangesBtn');

    // Get a JavaScript instance of the Bootstrap modal
    const editModal = new bootstrap.Modal(editShortcutModalEl);
    
    let shortcuts = []; // Now an array of objects: {id: number, name: string, url: string}

    // ======================================================
    //  UPDATED: Shortcut Management Logic
    // ======================================================

    function loadShortcuts() {
        const storedShortcuts = localStorage.getItem(SHORTCUTS_STORAGE_KEY);
        if (storedShortcuts) {
            shortcuts = JSON.parse(storedShortcuts);
        } else {
            shortcuts = [
                { id: Date.now() + 1, name: 'Beat Saber', url: 'https://beatsaber.com/' },
                { id: Date.now() + 2, name: 'VRChat', url: 'https://hello.vrchat.com/' },
                { id: Date.now() + 3, name: 'Meta Quest', url: 'https://www.meta.com/quest/' },
            ];
        }
        renderShortcuts();
    }

    function saveShortcuts() {
        localStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
    }

    function renderShortcuts() {
        shortcutsButtonContainer.querySelectorAll('.shortcut-item').forEach(item => item.remove());
        const addShortcutBtn = shortcutsButtonContainer.querySelector('.btn-add-shortcut');

        shortcuts.forEach(shortcut => {
            const shortcutItemHTML = `
                <div class="shortcut-item dropdown">
                    <a href="${shortcut.url}" target="_blank" class="shortcut-btn-text" title="Open ${shortcut.url}">${shortcut.name}</a>
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

        // *** FIX: Manually initialize Bootstrap dropdowns for dynamically created elements ***
        shortcutsButtonContainer.querySelectorAll('.dropdown-toggle').forEach(dropdownToggleEl => {
            new bootstrap.Dropdown(dropdownToggleEl);
        });
    }

    shortcutsButtonContainer.querySelector('.btn-add-shortcut').addEventListener('click', () => {
        const name = prompt('Enter a name for the new shortcut:', '');
        if (!name || name.trim() === '') return;

        const url = prompt('Enter the URL for the shortcut:', 'https://');
        if (!url || url.trim() === '') return;

        shortcuts.push({ id: Date.now(), name: name.trim(), url: url.trim() });
        saveShortcuts();
        renderShortcuts();
    });

    shortcutsContainer.addEventListener('click', (event) => {
        const target = event.target;
        // Use `closest` to find the action item, as user might click the icon inside
        const editButton = target.closest('.edit-shortcut');
        const removeButton = target.closest('.remove-shortcut');
        
        if (editButton) {
            event.preventDefault();
            const shortcutId = parseInt(editButton.dataset.shortcutId);
            const shortcut = shortcuts.find(s => s.id === shortcutId);
            if (shortcut) {
                // Populate the modal with current data
                document.getElementById('modalShortcutId').value = shortcut.id;
                document.getElementById('modalShortcutName').value = shortcut.name;
                document.getElementById('modalShortcutUrl').value = shortcut.url;
                // Show the modal
                editModal.show();
            }
        }

        if (removeButton) {
            event.preventDefault();
            const shortcutId = parseInt(removeButton.dataset.shortcutId);
            if (confirm('Are you sure you want to remove this shortcut?')) {
                shortcuts = shortcuts.filter(s => s.id !== shortcutId);
                saveShortcuts();
                renderShortcuts();
            }
        }
    });

    // Add a single listener for the "Save Changes" button on the modal
    saveShortcutChangesBtn.addEventListener('click', () => {
        const shortcutId = parseInt(document.getElementById('modalShortcutId').value);
        const newName = document.getElementById('modalShortcutName').value.trim();
        const newUrl = document.getElementById('modalShortcutUrl').value.trim();

        if (newName && newUrl) {
            const shortcut = shortcuts.find(s => s.id === shortcutId);
            if (shortcut) {
                shortcut.name = newName;
                shortcut.url = newUrl;
                saveShortcuts();
                renderShortcuts();
                editModal.hide(); // Hide the modal after saving
            }
        } else {
            alert('Name and URL cannot be empty.');
        }
    });
    
    // Right-click functionality (remains the same and now works!)
    shortcutsContainer.addEventListener('contextmenu', (event) => {
        const shortcutItem = event.target.closest('.shortcut-item');
        if (shortcutItem) {
            event.preventDefault();
            shortcutItem.querySelector('.shortcut-btn-menu').click();
        }
    });

    // ======================================================
    //  Existing Search and Autocomplete Logic (Unchanged)
    // ======================================================
    // (All of your existing search logic from the previous step goes here, it needs no changes)
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchAutocompleteContainer = document.getElementById('autocomplete-suggestions');
    searchForm.addEventListener('submit', async (e) => { e.preventDefault(); /* ... your search logic ... */ });
    searchInput.addEventListener('input', () => { /* ... your autocomplete logic ... */ });
    function displayResults(results) { /* ... */ } // etc.
    // ...

    // --- Initializer ---
    loadShortcuts();
});