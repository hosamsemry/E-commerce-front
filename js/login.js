

window.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Get form data
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      // Retrieve users from sessionStorage
      const users = JSON.parse(sessionStorage.getItem('users')) || [];

      // Authenticate user
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
          alert(`Welcome, ${user.username}! Redirecting to homepage.`);
          sessionStorage.setItem('currentUser', JSON.stringify(user)); // Store logged-in user
          window.location.href = 'home.html';
      } else {
          alert('Invalid username or password. Please try again.');
      }
  });
});


