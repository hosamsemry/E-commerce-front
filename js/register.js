window.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
  
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
  
        // Get form data
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const role = document.getElementById('reg-role').value;
  
        // Check if username already exists
        const users = JSON.parse(sessionStorage.getItem('users')) || [];
        if (users.some(user => user.username === username)) {
            alert('Username already exists. Please choose another one.');
            return;
        }
  
        // Create new user object
        const newUser = {
            id: Date.now(), // Unique ID
            username: username,
            password: password,
            role: role
        };
  
        // Save to sessionStorage
        users.push(newUser);
        sessionStorage.setItem('users', JSON.stringify(users));
  
        // Simulate saving to db.json by logging it to the console
        console.log('Updated db.json users:', users);
  
        // Redirect to login page
        alert('Registration successful! Redirecting to login page.');
        window.location.href = 'login.html';
    });
  });
  
  window.addEventListener('load', function () {
    // Initialize users in sessionStorage if not already done
    if (!sessionStorage.getItem('users')) {
        fetch('../db.json')
            .then(response => response.json())
            .then(data => {
                sessionStorage.setItem('users', JSON.stringify(data.users));
            })
            .catch(error => console.error("Error initializing users:", error));
    }
  });