const USERS = 'http://localhost:3000/users';
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
const editUserForm = document.getElementById('editUserForm');
const deleteUserBtn = document.getElementById('deleteUserBtn');
const editUsername = document.getElementById('editUsername');
const editPassword = document.getElementById('editPassword');
const editRole = document.getElementById('editRole');


async function fetchUserDetails() {
    const res = await fetch(`${USERS}/${userId}`);
    const user = await res.json();

    editUsername.value = user.username;
    editPassword.value = user.password;
    editRole.value = user.role;
}


editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedUser = {
        username: editUsername.value,
        password: editPassword.value,
        role: editRole.value
    };

    await fetch(`${USERS}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
    });

    Swal.fire({
        title: 'Success!',
        text: 'User updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    window.location.href = 'admin-dashboard.html';
});


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
            await fetch(`${USERS}/${userId}`, { method: 'DELETE' });
            Swal.fire("Deleted!", "User has been deleted.", "success");
            window.location.href = 'admin-dashboard.html';
        }
    });
});



fetchUserDetails();
