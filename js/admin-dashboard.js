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
const USERS = 'http://localhost:3000/users';
const PRODUCTS = 'http://localhost:3000/products';
const ORDERS = 'http://localhost:3000/orders';


function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
}

async function fetchUsers() {
    const res = await fetch(USERS);
    const users = await res.json();
    userList.innerHTML = '';
    users.forEach(user => {
        if (user.role !== 'admin') {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="user-li-admin">
                    <span><font style="font-weight:bold; font-size:20px;color:#d14d07;">User Name:</font> ${user.username}</span>
              <span><font style="font-weight:bold; font-size:20px;color:#d14d07;">User Role:</font> ${user.role} </span> 
                </div>
                <div class="btns">
                <button class="btn""><a style="text-decoration:none; color:white;" href="user-details.html?id=${user.id}">Edit</a></button>
                <button class="btn" onclick="deleteUser(${user.id})">Delete</button>
                </div>
                `;
            userList.appendChild(li);
        }
    });
}

async function fetchProducts() {
    const res = await fetch(PRODUCTS);
    const products = await res.json();
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `<div class="product-li-admin">
          <span><font style="font-weight:bold; font-size:20px;color:#d14d07;">Product Name:</font> ${product.name}</span>
          <span><font style="font-weight:bold; font-size:20px;color:#d14d07;">Product Price:</font> $${product.price} </span> 
            </div>
            <img style="width:120px;margin-left:20px" src="${product.image}">`
            ;
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteProduct(product.id);
        li.appendChild(deleteBtn);
        productList.appendChild(li);
    });
}

async function fetchOrders() {
    const res = await fetch(ORDERS);
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
        deleteBtn.classList.add('btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteOrder(order.id);
        li.appendChild(deleteBtn);
        orderList.appendChild(li);
    });
}

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
            await fetch(`${USERS}/${id}`, { method: 'DELETE' });
            fetchUsers(); 
            Swal.fire("Deleted!", "User has been deleted.", "success");
        }
    });
}

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
            await fetch(`${PRODUCTS}/${id}`, { method: 'DELETE' });
            fetchProducts(); 
            Swal.fire("Deleted!", "Product has been deleted.", "success");
        }
    });
}

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
            await fetch(`${ORDERS}/${id}`, { method: 'DELETE' });
            fetchOrders(); 
            Swal.fire("Deleted!", "Order has been deleted.", "success");
        }
    });
}

fetchUsers();
fetchProducts();
fetchOrders();
