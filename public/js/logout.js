const logout = async () => {
  console.log("POST logout!")
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
};

document.querySelectorAll('.logout, .navbar-brand').forEach(function(element) {
  element.addEventListener('click', logout);
});
