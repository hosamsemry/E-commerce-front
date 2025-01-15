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
        
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => {
                const usernameExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
                const Id= users.length + 1;
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
                            
                            window.location.href = './login.html';
                        })
                        
                }
            })
            
    });
});