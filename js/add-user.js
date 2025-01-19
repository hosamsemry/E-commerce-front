import FormValidator from './FormValidator'; 

const USERS = 'http://localhost:3000/users';
const addUserForm = document.getElementById('addUserForm');

addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const usernameValidation = FormValidator.validateUsername(username);
    const passwordValidation = FormValidator.validatePassword(password);
    if (!usernameValidation.valid) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid username',
            text: usernameValidation.message
        });
        return;  
    }

    if (!passwordValidation.valid) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid password',
            text: passwordValidation.message
        });
        return;
    }

    const response = await fetch(USERS);
    const users = await response.json();
    const user = users.length + 1;
    const userId = user.toString();

    await fetch(USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, username, password, role })
    });

    Swal.fire({
        icon: 'success',
        title: 'User added successfully!',
        showConfirmButton: false,
        timer: 1500
    });
    addUserForm.reset();
    window.location.href = 'admin-dashboard.html';
});
