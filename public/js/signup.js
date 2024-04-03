// Function to handle form submission
async function handleSignup(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Select the input elements and get their values
  const name = document.querySelector('#name-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  // Check if all fields have values before making the fetch request
  if (email && password && name) {
    try {
      // alert(name, email, password)
      // Send a POST request to the server with email and password
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      // If the response is OK, the login was successful
      if (response.ok) {
        console.log('Signup successful');
        // Redirect the user to the profile page
        window.location.href = '/login';
      } else {
        // If the server responds with an error, display it
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to signup:', error);
      alert('Failed to sign up. Please try again later.');
    }
  } else {
    // If one or both fields are empty, alert the user
    alert('Please enter name, email and password.');
  }
}

// Add the event listener to the login form
document.querySelector('.signup-form').addEventListener('submit', handleSignup);
