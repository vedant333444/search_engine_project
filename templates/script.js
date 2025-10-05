// Wait for the entire HTML document to be fully loaded and parsed before running any script.
document.addEventListener('DOMContentLoaded', () => {

    // Select the key HTML elements we need to interact with.
    // Make sure your HTML has these exact IDs!
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');

    // Add an event listener to the form for when the user submits a search.
    searchForm.addEventListener('submit', async (event) => {
        // Prevent the default form submission behavior which reloads the page. This is crucial.
        event.preventDefault(); 
        
        // Get the user's query from the input box and remove any extra whitespace.
        const query = searchInput.value.trim();

        // If the query is empty, show a message and stop.
        if (!query) {
            resultsContainer.innerHTML = '<p class="text-center text-warning">Please enter a search term.</p>';
            return;
        }

        // Display a loading spinner to provide user feedback while we fetch results.
        resultsContainer.innerHTML = `
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Searching for "<strong>${query}</strong>"...</p>
            </div>`;

        // Use a try...catch block to handle potential network errors.
        try {
            // Send the search query to our Flask backend API endpoint.
            const response = await fetch('http://127.0.0.1:5000/search', {
                method: 'POST', // We use POST to send data in the request body.
                headers: {
                    'Content-Type': 'application/json', // Tell the server we are sending JSON data.
                },
                body: JSON.stringify({ query: query }), // Convert our JS object to a JSON string.
            });

            // If the server responds with an error status (like 404 or 500), throw an error.
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response from the server.
            const data = await response.json();
            
            // Call the function to render the results on the page.
            displayResults(data.results);

        } catch (error) {
            console.error('Error fetching search results:', error);
            resultsContainer.innerHTML = '<p class="text-center text-danger">An error occurred while searching. Please check if the backend server is running and try again.</p>';
        }
    });

    /**
     * Takes an array of result objects and renders them as HTML cards.
     * @param {Array<Object>} results - The array of search results from the backend.
     */
    function displayResults(results) {
        // Clear the "Searching..." message.
        resultsContainer.innerHTML = '';

        // If there are no results, display a friendly message.
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center">No results found.</p>';
            return;
        }

        // Loop through each result object and create an HTML card for it.
        results.forEach(result => {
            // Use a placeholder image if the result's image URL is missing or invalid.
            const imageUrl = result.image && String(result.image).startsWith('http') 
                           ? result.image 
                           : 'https://via.placeholder.com/400x200.png?text=No+Image';

            // Create the HTML for a single result card using a template literal.
            const resultCardHTML = `
                <div class="col-md-6 col-lg-4 d-flex align-items-stretch mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${imageUrl}" class="card-img-top" alt="${result.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${result.title}</h5>
                            <p class="card-text flex-grow-1">${result.snippet || 'No summary available.'}</p>
                            <a href="${result.url}" target="_blank" class="btn btn-primary mt-auto">Read More</a>
                        </div>
                        <div class="card-footer text-muted">
                            Relevance Score: ${result.score}
                        </div>
                    </div>
                </div>
            `;

            // Add the newly created card HTML to the end of our container.
            resultsContainer.insertAdjacentHTML('beforeend', resultCardHTML);
        });
    }
});