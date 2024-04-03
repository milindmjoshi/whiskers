async function handleWhiskySearch(event) {
    event.preventDefault(); // Prevent default form submission if you wrap your input in a form

    // Select the input element and get its value
    const searchTerm = document.querySelector('.whisky-search').value.trim();
    // Check if the search term is not empty
    if (searchTerm) {
        try {
            // Send a GET request to the server with the search term
            const response = await fetch(`/api/whiskys/${encodeURIComponent(searchTerm)}`, {
                method: 'GET', // GET request for searching
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // If the response is OK, process the search results
            if (response.ok) {
                const searchResults = await response.json();
                console.log('Search Results:', searchResults);
                // Here you can call a function to render search results on the page
            } else {
                // If the server responds with an error, display it
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Failed to perform search:', error);
            alert('Failed to search. Please try again later.');
        }
    } else {
        alert('Please enter a search term.');
    }
}

document.querySelector('.whisky-search').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        handleWhiskySearch(event);
    }
});
