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
        li.textContent = `${user.username}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteUser(user.id);
        li.appendChild(deleteBtn);
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
        li.textContent = `Order #${order.id} - ${order.status}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteProduct(product.id);
        li.appendChild(deleteBtn);
        productList.appendChild(li);
        orderList.appendChild(li);
    });
}

// Add user
addUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;

    await fetch(API_URL_USERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });

    addUserForm.reset();
    fetchUsers();
});

// Add product
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;

    await fetch(API_URL_PRODUCTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
    });

    addProductForm.reset();
    fetchProducts();
});

// Delete functions
async function deleteUser(id) {
    await fetch(`${API_URL_USERS}/${id}`, { method: 'DELETE' });
    fetchUsers();
}

async function deleteProduct(id) {
    await fetch(`${API_URL_PRODUCTS}/${id}`, { method: 'DELETE' });
    fetchProducts();
}
async function deleteOrder(id) {
    await fetch(`${API_URL_ORDERS}/${id}`, { method: 'DELETE' });
    fetchOrders();
}

// Initialize
fetchUsers();
fetchProducts();
fetchOrders();
