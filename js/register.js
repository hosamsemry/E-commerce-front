window.addEventListener('load', () => {
    const registerBtn = document.getElementById('register-btn');
  
    registerBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        // Get form data
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const role = document.getElementById('reg-role').value;

        if (!username || !password || !role) {
            alert('Please fill in all fields.');
            return;
        }
        
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => {
                const usernameExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());

                if (usernameExists) {
                    alert('Username already exists. Please choose a different username.');
                } else {
                    // New user object
                    const newUser = {
                        id : users.length + 2,
                        username: username,
                        password: password,
                        role: role
                    };

                    // Add the new user to db.json
                    fetch('http://localhost:3000/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newUser)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(() => {
                            
                            window.location.href = './login.html';
                        })
                        
                }
            })
            
    });
});