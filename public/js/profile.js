// async function handleWhiskySearchOld(event) {
//     event.preventDefault(); // Prevent default form submission if you wrap your input in a form

//     // Select the input element and get its value
//     const searchTerm = document.querySelector('.whisky-search').value.trim();
//     // Check if the search term is not empty
//     if (searchTerm) {
//         try {
//             // Send a GET request to the server with the search term
//             const response = await fetch(`/api/whiskeys/name/${encodeURIComponent(searchTerm)}`, {
//                 method: 'GET', // GET request for searching
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             });

//             // If the response is OK, process the search results
//             if (response.ok) {
//                 const searchResults = await response.json();
//                 console.log('Search Results:', searchResults);
//                 // Here you can call a function to render search results on the page
//             } else {
//                 // If the server responds with an error, display it
//                 const data = await response.json();
//                 alert(data.message);
//             }
//         } catch (error) {
//             console.error('Failed to perform search:', error);
//             alert('Failed to search. Please try again later.');
//         }
//     } else {
//         alert('Please enter a search term.');
//     }
// }

// async function handleWhiskySearch() {
//     try {
//         const searchTerm = document.querySelector('.whisky-search').value.trim();
//         // Check if the search term is not empty
//         if (searchTerm) {

//             // Send a GET request to the server with the search term
//             const response = await fetch(`/api/whiskeys/averages/search/${encodeURIComponent(searchTerm)}`, {
//                 method: 'GET', // GET request for searching
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             });


//             if (response.ok) {
//                 const whiskeyDataSummary = await response.json();
//                 console.log("Search Results:", whiskeyDataSummary);
//                 // Select the container
//                 const whiskeyFeedContainer = document.querySelector('.my-search-results-container');


//                 // Clear existing content
//                 whiskeyFeedContainer.innerHTML = '';

//                 // Iterate over the whiskey data and create HTML for each
//                 whiskeyDataSummary.forEach(whiskey => {
//                     const whiskeyElement = document.createElement('div');
//                     whiskeyElement.classList.add('card');

//                     // Handle multiple comments
//                     const commentsHTML = whiskey.comments.map(comment => `<p class="comment-text border">${comment}</p>`).join('');

//                     whiskeyElement.innerHTML = `
//                      <div class="img-container">

//                         <img class="card-img-top" src="/api/whiskeys/${whiskey.id}" alt="Card image cap"> 
//                     </div>
//                     <div class="card-body">
//                     <div class="card-header">
//                     <h5 class="card-title feed-whiskey-name">${whiskey.name}</h5>
//                     <div class="add-rating-section">
//                     <h5 class="card-title">Average Rating: ${whiskey.avgRating}</h5>

//                     <button class="add-rating-button btn btn-primary" data-whiskey-id="${whiskey.id}">+</button>

//                     </div>
//                     </div>
//                     <h5 class="card-title">Comments:</h5>
//                     <div class="comment-section">

//                         <div>${commentsHTML}</div>

//                        </div>
//                     </div>
//                 `;

//                     whiskeyFeedContainer.appendChild(whiskeyElement);





//                 });
//                 // add rating event listener
//                 whiskeyFeedContainer.addEventListener('click', function (e) {
//                     if (e.target && e.target.matches('.add-rating-button')) {
//                         const whiskeyId = e.target.getAttribute('data-whiskey-id');
//                         console.log('Add rating for whiskey ID:', whiskeyId);

//                         const cardElement = e.target.closest('.card');
//                         let ratingSection = cardElement.querySelector('.rating-section');
//                         if (!ratingSection) {
//                             ratingSection = document.createElement('div');
//                             ratingSection.className = 'rating-section';
//                             ratingSection.style.display = 'block'; // Explicitly set display to block
//                             ratingSection.innerHTML = `
//                             <div class="mt-3">
//                                 <label for="rating-${whiskeyId}" class="form-label">Rating (1-5):</label>
//                                 <input type="number" class="form-control" id="rating-${whiskeyId}" min="1" max="5">
//                             </div>
//                             <div class="mt-3">
//                                 <label for="comment-${whiskeyId}" class="form-label">Comment:</label>
//                                 <textarea class="form-control" id="comment-${whiskeyId}" rows="3"></textarea>
//                             </div>
//                             <button class="btn btn-primary mt-3 save-rating-btn" data-whiskey-id="${whiskeyId}">Save Rating</button>
//                         `;

//                             cardElement.appendChild(ratingSection);
//                         } else {
//                             // Toggle visibility
//                             ratingSection.style.display = ratingSection.style.display === 'none' ? 'block' : 'none';
//                         }
//                     }
//                     // If the save rating button was clicked, send the data to the server
//                     if (e.target && e.target.matches('.save-rating-btn')) {
//                         e.preventDefault(); // Prevent form submission if wrapped in a form

//                         // Async function to handle submission
//                         (async () => {
//                             const whiskeyId = e.target.getAttribute('data-whiskey-id');
//                             const ratingInput = document.querySelector(`#rating-${whiskeyId}`);
//                             const ratingValue = parseInt(ratingInput.value, 10); // Parse the rating value to an integer
//                             const commentInput = document.querySelector(`#comment-${whiskeyId}`);
//                             const commentValue = commentInput.value.trim(); // Trim whitespace from comment

//                             // Check for valid rating and presence of a comment
//                             if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
//                                 alert("Please enter a valid rating between 1 and 5.");
//                                 return; // Stop the function execution
//                             }

//                             if (!commentValue) {
//                                 alert("Please enter a comment.");
//                                 return; // Stop the function execution
//                             }

//                             // Prepare the data for submission
//                             const postData = {
//                                 userId: userId,
//                                 whiskyId: whiskeyId,
//                                 rating: ratingValue,
//                                 comment: commentValue,
//                             };

//                             try {
//                                 const response = await fetch('/api/ratings', {
//                                     method: 'POST',
//                                     headers: {
//                                         'Content-Type': 'application/json',
//                                     },
//                                     body: JSON.stringify(postData),
//                                 });

//                                 if (response.ok) {
//                                     const result = await response.json();
//                                     console.log('Rating submitted successfully', result);
//                                     // Close the rating section
//                                     const cardElement = e.target.closest('.card');
//                                     let ratingSection = cardElement.querySelector('.rating-section');
//                                     if (ratingSection) {
//                                         ratingSection.style.display = 'none';
//                                     }
//                                     // Optionally, reset the form fields or give feedback to the user
//                                     document.querySelector(`#rating-${whiskeyId}`).value = '';
//                                     document.querySelector(`#comment-${whiskeyId}`).value = '';
//                                     // Reload the page to reflect changes
//                                     window.location.reload();

//                                 } else {
//                                     console.error('Failed to submit rating');
//                                     // Handle server errors or show feedback to the user
//                                 }
//                             } catch (error) {
//                                 console.error('Error submitting rating:', error);
//                                 // Handle network errors or show feedback to the user
//                             }
//                         })();
//                     }
//                 });
//                 window.location.href = '/seach-results';
//             } else {
//                 console.error("Failed to get average whiskey data");
//             }
//         }
//     } catch (error) {
//         console.error("Error fetching whiskey averages", error);
//     }
// }


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
    
                        <img class="card-img-top" src="/api/whiskeys/${whiskey.id}" alt="Card image cap"> 
                    </div>
                    <div class="card-body">
                    <div class="card-header">
                    <h5 class="card-title feed-whiskey-name m-0">${whiskey.name}</h5>
                    <div class="add-rating-section">
                    <h5 class="card-title average-rating-title-feed m-0">Average Rating: ${whiskey.avgRating}</h5>
                    
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
    } catch (error) {
        console.error("Error fetching whiskey averages", error);
    }
}





async function removeRating(ratingId) {
    // Display confirmation dialog
    //const isConfirmed = confirm("Are you sure you want to delete this rating?");
    const isConfirmed = true;
    
    if (isConfirmed) {
        try {
            const response = await fetch(`/api/ratings/${ratingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Rating deleted successfully');
                window.location.reload();
            } else {
                console.error('Failed to delete rating');
            }
        } catch (error) {
            console.error('Error deleting rating:', error);
        }
    } else {
        console.log('Rating deletion cancelled.'); // Optionally, log cancellation
    }
}








document.querySelector('.whisky-search').addEventListener('keypress', function (event) {
    const searchTerm = document.querySelector('.whisky-search').value.trim();
    if (event.key === 'Enter' && searchTerm) {
        window.location.href = `/search-results?search=${encodeURIComponent(searchTerm)}&userId=${userId}`;
    }
});

// document.querySelector('#add-rating').addEventListener('click', handleAddRating);

getProfileWhiskeys()
getFeedWhiskeys()