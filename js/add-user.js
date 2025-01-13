const API_URL_USERS = 'http://localhost:3000/users';
const addUserForm = document.getElementById('addUserForm');

addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    await fetch(API_URL_USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
    });

    alert('User added successfully!');
    addUserForm.reset();
    window.location.href = 'admin-dashboard.html';  // Redirect back to the dashboard
});
