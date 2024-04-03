// Function to handle form submission
async function handleLogin(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Select the input elements and get their values
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  // Check if both fields have values before making the fetch request
  if (email && password) {
    try {
      // Send a POST request to the server with email and password
      const response = await fetch('/login', { 
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      // If the response is OK, the login was successful
      if (response.ok) {
        console.log('Login successful');
        // Redirect the user to the profile page
        window.location.href = '/profile'; 
      } else {
        // If the server responds with an error, display it
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to log in:', error);
      alert('Failed to log in. Please try again later.');
    }
  } else {
    // If one or both fields are empty, alert the user
    alert('Please enter both email and password.');
  }
}

// Add the event listener to the login form
document.querySelector('.login-form').addEventListener('submit', handleLogin);
