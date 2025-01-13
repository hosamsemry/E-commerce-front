const API_URL_USERS = 'http://localhost:3000/users';
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

const editUserForm = document.getElementById('editUserForm');
const deleteUserBtn = document.getElementById('deleteUserBtn');
const editUsername = document.getElementById('editUsername');
const editPassword = document.getElementById('editPassword');
const editRole = document.getElementById('editRole');

// Fetch and display user data
async function fetchUserDetails() {
    const res = await fetch(`${API_URL_USERS}/${userId}`);
    const user = await res.json();

    editUsername.value = user.username;
    editPassword.value = user.password;
    editRole.value = user.role;
}

// Update user data
editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedUser = {
        username: editUsername.value,
        password: editPassword.value,
        role: editRole.value
    };

    await fetch(`${API_URL_USERS}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
    });

    alert('User updated successfully!');
    window.location.href = 'admin-dashboard.html';
});

// Delete user
deleteUserBtn.addEventListener('click', async () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${API_URL_USERS}/${userId}`, { method: 'DELETE' });
            Swal.fire("Deleted!", "User has been deleted.", "success");
            window.location.href = 'admin-dashboard.html'; // Redirect after deletion
        }
    });
});


// Initialize
fetchUserDetails();
