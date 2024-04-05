async function handleWhiskySearch(event) {
    event.preventDefault(); // Prevent default form submission if you wrap your input in a form

    // Select the input element and get its value
    const searchTerm = document.querySelector('.whisky-search').value.trim();
    // Check if the search term is not empty
    if (searchTerm) {
        try {
            // Send a GET request to the server with the search term
            const response = await fetch(`/api/whiskeys/name/${encodeURIComponent(searchTerm)}`, {
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

async function getProfileWhiskeys() {
    console.log("Fetching whiskeys ratings for user ID:", userId);
    try {
        const response = await fetch(`/api/ratings/user/${userId}`);
        if (response.ok) {
            const whiskeyRatingsData = await response.json();
            console.log("Whiskey Ratings Data:", whiskeyRatingsData);
            // Process the whiskey ratings data here
            // For example, display it on the page
        } else {
            // Handle the case where the server responds with an error status code
            console.error("Failed to fetch whiskey ratings for user ID:", userId);
            alert("Failed to load whiskey ratings.");
        }
    } catch (error) {
        console.error("Error fetching whiskey ratings:", error);
        alert("An error occurred while trying to fetch whiskey ratings.");
    }
}



async function getFeedWhiskeys() {
    try {
        const response = await fetch(`/api/whiskeys/averages`);
        if (response.ok) {
            const whiskeyDataSummary = await response.json();
            console.log("Averages Whiskey Data:", whiskeyDataSummary);

            // Select the container
            const whiskeyFeedContainer = document.querySelector('.my-whisky-feed-content-container');

            // Clear existing content
            whiskeyFeedContainer.innerHTML = '';

            // Iterate over the whiskey data and create HTML for each
            whiskeyDataSummary.forEach(whiskey => {
                const whiskeyElement = document.createElement('div');
                whiskeyElement.classList.add('card');

                // Handle multiple comments
                const commentsHTML = whiskey.comments.map(comment => `<p class="comment-text border">${comment}</p>`).join('');

                whiskeyElement.innerHTML = `
                     <div class="img-container">
    
                        <img class="card-img-top" src="http://localhost:3001/api/whiskeys/${whiskey.id}" alt="Card image cap"> 
                    </div>
                    <div class="card-body">
                    <div class="card-header">
                    <h5 class="card-title feed-whiskey-name">Name: ${whiskey.name}</h5>
                    <h5 class="card-title">Average Rating: ${whiskey.avgRating}</h5>
                    </div>
                    <h5 class="card-title">Comments:</h5>
                    <div class="comment-section">
                        
                        <div>${commentsHTML}</div>
                       
                       </div>
                    </div>
                `;

                whiskeyFeedContainer.appendChild(whiskeyElement);
            });
        } else {
            console.error("Failed to get average whiskey data");
        }
    } catch (error) {
        console.error("Error fetching whiskey averages", error);
    }
}






async function handleAddRating() {
    console.log("Add Rating/Comment for User ID: " + userId + " and Whiskey ID: " + whiskeyId);
    // try {
    //     const response = await fetch(`/api/ratings/user/${userId}`);
    //     if (response.ok) {
    //         const whiskeyRatingsData = await response.json();
    //         console.log("Whiskey Ratings Data:", whiskeyRatingsData);
    //         // Process the whiskey ratings data here
    //         // For example, display it on the page
    //     } else {
    //         // Handle the case where the server responds with an error status code
    //         console.error("Failed to fetch whiskey ratings for user ID:", userId);
    //         alert("Failed to load whiskey ratings.");
    //     }
    // } catch (error) {
    //     console.error("Error fetching whiskey ratings:", error);
    //     alert("An error occurred while trying to fetch whiskey ratings.");
    // }
}

document.querySelector('.whisky-search').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        handleWhiskySearch(event);
    }
});
// document.querySelector('#add-rating').addEventListener('click', handleAddRating);

getProfileWhiskeys()
getFeedWhiskeys()