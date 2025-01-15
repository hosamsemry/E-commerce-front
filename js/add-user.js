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
        body: JSON.stringify({username, password, role })
    });
    const response = await fetch(API_URL_USERS);
    const users = await response.json();
    const user = users.length + 1;
    const userId = user.toString();

    await fetch(API_URL_USERS, {
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
    window.location.href = 'admin-dashboard.html';  // Redirect back to the dashboard
});
