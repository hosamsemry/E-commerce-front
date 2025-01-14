window.addEventListener('load', () => {
   
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'admin') {
      
      window.location.href = './home.html'; 
    }
  });

const userList = document.getElementById('userList');
const productList = document.getElementById('productList');
const orderList = document.getElementById('orderList');
const addUserForm = document.getElementById('addUserForm');
const addProductForm = document.getElementById('addProductForm');

const API_URL_USERS = 'http://localhost:3000/users';
const API_URL_PRODUCTS = 'http://localhost:3000/products';
const API_URL_ORDERS = 'http://localhost:3000/orders';

// Show and hide sections
function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
}

// Fetch and display users
async function fetchUsers() {
    const res = await fetch(API_URL_USERS);
    const users = await res.json();
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="user-info">
                <strong><a href="user-details.html?id=${user.id}" target="_blank">${user.username}</a></strong>
                <span style="margin-left:20px;"><em>${user.role}</em></span>
            </div>
            <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
        `;
        userList.appendChild(li);
    });
}


// Fetch and display products
async function fetchProducts() {
    const res = await fetch(API_URL_PRODUCTS);
    const products = await res.json();
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - $${product.price}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteProduct(product.id);
        li.appendChild(deleteBtn);
        productList.appendChild(li);
    });
}

// Fetch and display orders
async function fetchOrders() {
    const res = await fetch(API_URL_ORDERS);
    const orders = await res.json();
    orderList.innerHTML = '';
    orders.forEach(order => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Order-number: ${order.id}</strong><br>
            CustomerId: ${order.customerId}<br>
            Total: $${order.total}<br>
            Status: ${order.status}<br>
            
            
        `;
        li.classList.add("order-list-admin")
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteOrder(order.id);
        li.appendChild(deleteBtn);
        orderList.appendChild(li);
    });
}

// Add user
// Add user with role
// addUserForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value; // Assuming password handling is needed
//     const role = document.getElementById('role').value;

//     await fetch(API_URL_USERS, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password, role }),
//     });

//     addUserForm.reset();
//     fetchUsers();
// });


// Add product
// addProductForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const name = document.getElementById('productName').value;
//     const price = document.getElementById('productPrice').value;

//     await fetch(API_URL_PRODUCTS, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, price })
//     });

//     addProductForm.reset();
//     fetchProducts();
// });

// Delete functions
// Delete User with confirmation
async function deleteUser(id) {
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
            await fetch(`${API_URL_USERS}/${id}`, { method: 'DELETE' });
            fetchUsers(); // Refresh user list
            Swal.fire("Deleted!", "User has been deleted.", "success");
        }
    });
}

// Delete Product with confirmation
async function deleteProduct(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "This product will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${API_URL_PRODUCTS}/${id}`, { method: 'DELETE' });
            fetchProducts(); // Refresh product list
            Swal.fire("Deleted!", "Product has been deleted.", "success");
        }
    });
}

// Delete Order with confirmation
async function deleteOrder(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "This order will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${API_URL_ORDERS}/${id}`, { method: 'DELETE' });
            fetchOrders(); // Refresh order list
            Swal.fire("Deleted!", "Order has been deleted.", "success");
        }
    });
}


// Initialize
fetchUsers();
fetchProducts();
fetchOrders();
