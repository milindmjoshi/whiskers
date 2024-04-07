async function handleWhiskySearch() {
    // alert(`Searchterm= ${search}`)
    try {
        // const searchTerm = document.querySelector('.whisky-search').value.trim();
        // Check if the search term is not empty
        if (searchTerm) {

            // Send a GET request to the server with the search term
            const response = await fetch(`/api/whiskeys/averages/search/${encodeURIComponent(searchTerm)}`, {
                method: 'GET', // GET request for searching
                headers: {
                    'Content-Type': 'application/json'
                },
            });


            if (response.ok) {
                const whiskeyDataSummary = await response.json();
                console.log("Search Results:", whiskeyDataSummary);
                const backToProfileLink = document.querySelector('.back-to-profile');
                if (backToProfileLink) {
                    backToProfileLink.classList.remove('hidden');
                }


                if (whiskeyDataSummary.length === 0) {
                    alert("No Search Results Were Found");
                    // Optionally, you could also display this message directly in the page instead of using an alert
                    const whiskeyFeedContainer = document.querySelector('.my-search-results-container');
                    whiskeyFeedContainer.innerHTML = '<p class="no-search-results">No Search Results Were Found.</p>';
                    return; // Exit the function early since there's no data to display
                }

                // Select the container
                const profileElements = document.getElementsByClassName('back-to-profile');

                for (let i = 0; i < profileElements.length; i++) {
                    profileElements[i].classList.remove('hidden');
                }

                const whiskeyFeedContainer = document.querySelector('.my-search-results-container');


                // Clear existing content
                whiskeyFeedContainer.innerHTML = '';

                // Iterate over the whiskey data and create HTML for each
                whiskeyDataSummary.forEach(whiskey => {
                    const whiskeyElement = document.createElement('div');
                    whiskeyElement.classList.add('card', 'search-results-card');

                    // Handle multiple comments
                    const commentsHTML = whiskey.comments.map(comment => `<p class="comment-text border">${comment}</p>`).join('');

                    whiskeyElement.innerHTML = `
                     <div class="img-container">
    
                        <img class="card-img-top" src="http://localhost:3001/api/whiskeys/${whiskey.id}" alt="Card image cap"> 
                    </div>
                    <div class="card-body">
                    <div class="card-header">
                    <h5 class="card-title feed-whiskey-name">${whiskey.name}</h5>
                    <div class="add-rating-section">
                    <h5 class="card-title">Average Rating: ${whiskey.avgRating}</h5>
                    
                    <button class="add-rating-button btn" data-whiskey-id="${whiskey.id}">+</button>
    
                    </div>
                    </div>
                    <h5 class="card-title">Comments:</h5>
                    <div class="comment-section">
                        
                        <div>${commentsHTML}</div>
                       
                       </div>
                    </div>
                `;

                    whiskeyFeedContainer.appendChild(whiskeyElement);





                });
                // add rating event listener
                whiskeyFeedContainer.addEventListener('click', function (e) {
                    if (e.target && e.target.matches('.add-rating-button')) {
                        const whiskeyId = e.target.getAttribute('data-whiskey-id');
                        console.log('Add rating for whiskey ID:', whiskeyId);

                        const cardElement = e.target.closest('.card');
                        let ratingSection = cardElement.querySelector('.rating-section');
                        if (!ratingSection) {
                            ratingSection = document.createElement('div');
                            ratingSection.className = 'rating-section';
                            ratingSection.style.display = 'block'; // Explicitly set display to block
                            ratingSection.innerHTML = `
                            <div class="mt-3">
                                <label for="rating-${whiskeyId}" class="form-label">Rating (1-5):</label>
                                <input type="number" class="form-control" id="rating-${whiskeyId}" min="1" max="5">
                            </div>
                            <div class="mt-3">
                                <label for="comment-${whiskeyId}" class="form-label">Comment:</label>
                                <textarea class="form-control" id="comment-${whiskeyId}" rows="3"></textarea>
                            </div>
                            <button class="btn btn-primary mt-3 save-rating-btn" data-whiskey-id="${whiskeyId}">Save Rating</button>
                        `;

                            cardElement.appendChild(ratingSection);
                        } else {
                            // Toggle visibility
                            ratingSection.style.display = ratingSection.style.display === 'none' ? 'block' : 'none';
                        }
                    }
                    // If the save rating button was clicked, send the data to the server
                    if (e.target && e.target.matches('.save-rating-btn')) {
                        e.preventDefault(); // Prevent form submission if wrapped in a form

                        // Async function to handle submission
                        (async () => {
                            const whiskeyId = e.target.getAttribute('data-whiskey-id');
                            const ratingInput = document.querySelector(`#rating-${whiskeyId}`);
                            const ratingValue = parseInt(ratingInput.value, 10); // Parse the rating value to an integer
                            const commentInput = document.querySelector(`#comment-${whiskeyId}`);
                            const commentValue = commentInput.value.trim(); // Trim whitespace from comment

                            // Check for valid rating and presence of a comment
                            if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
                                alert("Please enter a valid rating between 1 and 5.");
                                return; // Stop the function execution
                            }

                            if (!commentValue) {
                                alert("Please enter a comment.");
                                return; // Stop the function execution
                            }

                            // Prepare the data for submission
                            const postData = {
                                userId: userId,
                                whiskyId: whiskeyId,
                                rating: ratingValue,
                                comment: commentValue,
                            };

                            try {
                                const response = await fetch('/api/ratings', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(postData),
                                });

                                if (response.ok) {
                                    const result = await response.json();
                                    console.log('Rating submitted successfully', result);
                                    // Close the rating section
                                    const cardElement = e.target.closest('.card');
                                    let ratingSection = cardElement.querySelector('.rating-section');
                                    if (ratingSection) {
                                        ratingSection.style.display = 'none';
                                    }
                                    // Optionally, reset the form fields or give feedback to the user
                                    document.querySelector(`#rating-${whiskeyId}`).value = '';
                                    document.querySelector(`#comment-${whiskeyId}`).value = '';
                                    // Reload the page to reflect changes
                                    window.location.reload();

                                } else {
                                    console.error('Failed to submit rating');
                                    // Handle server errors or show feedback to the user
                                }
                            } catch (error) {
                                console.error('Error submitting rating:', error);
                                // Handle network errors or show feedback to the user
                            }
                        })();
                    }
                });
            } else {
                console.error("Failed to get average whiskey data");
            }
        }
    } catch (error) {
        console.error("Error fetching whiskey averages", error);
    }
}

// document.querySelector('.whisky-search').addEventListener('keypress', function (event) {
//     if (event.key === 'Enter') {
//         handleWhiskySearch(event);
//     }
// });


handleWhiskySearch();