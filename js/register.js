import FormValidator from './form-validation.js';

window.addEventListener('load', () => {
    const registerBtn = document.getElementById('register-btn');

    registerBtn.addEventListener('click', function (event) {
        event.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const role = document.getElementById('reg-role').value;

        if (!username || !password || !role) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all fields.'
            });
            return;
        }

        const usernameValidation = FormValidator.validateUsername(username);
        if (!usernameValidation.valid) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Username',
                text: usernameValidation.message
            });
            return;
        }

        const passwordValidation = FormValidator.validatePassword(password);
        if (!passwordValidation.valid) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Password',
                text: passwordValidation.message
            });
            return;
        }

        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => {
                const usernameExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
                const Id = users.length + 1;
                const userId = Id.toString();

                if (usernameExists) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Username already exists. Please choose a different username.'
                    });
                } else {
                    const newUser = {
                        id: userId,
                        username: username,
                        password: password,
                        role: role
                    };

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
                            Swal.fire({
                                icon: 'success',
                                title: 'Registration Successful!',
                                text: 'Redirecting to login page...'
                            });
                            setTimeout(() => {
                                window.location.href = './login.html';
                            }, 2000);
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Failed to register. Please try again.'
                            });
                            console.error('Error:', error);
                        });
                }
            });
    });
});
