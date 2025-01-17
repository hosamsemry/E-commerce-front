export function addToWishlist(productId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        document.querySelectorAll('wishlist').forEach(button => {
            button.style.display = 'none';
        });
        return;
    }

    fetch(`http://localhost:3000/users/${currentUser.id}`)
        .then(response => response.json())
        .then(user => {
            user.wishlist = user.wishlist || [];  

            if (!user.wishlist.includes(productId)) {
                user.wishlist.push(productId);

                fetch(`http://localhost:3000/users/${currentUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wishlist: user.wishlist })
                })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Product added to your wishlist!'
                    });
                })
                .catch(err => console.error('Error updating wishlist:', err));
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Info',
                    text: 'This product is already in your wishlist.'
                });
            }
        })
        .catch(err => console.error('Error fetching user data:', err));
}

function loadWishlist() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const wishlistContainer = document.getElementById('wishlist-items');

    if (!wishlistContainer) {
        console.error('Wishlist container not found.');
        return;
    }

    fetch(`http://localhost:3000/users/${currentUser.id}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch user data.');
            return response.json();
        })
        .then(user => {
            if (!user.wishlist || user.wishlist.length === 0) {
                wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
                return;
            }

            wishlistContainer.innerHTML = ''; // Clear previous content

            user.wishlist.forEach(productId => {
                fetch(`http://localhost:3000/products/${productId}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Failed to fetch product data.');
                        return response.json();
                    })
                    .then(product => {
                        const productDiv = document.createElement('div');
                        productDiv.classList.add('product-card');
                        productDiv.innerHTML = `
                            <img src="${product.image}" alt="${product.name}">
                            <h3>Product name: ${product.name}</h3>
                            <p>Product Price: $${product.price}</p>
                            <button class="remove-wish" data-id="${product.id}">Remove from Wishlist</button>
                        `;
                        wishlistContainer.appendChild(productDiv);
                    })
                    .catch(err => console.error('Error loading product:', err));
            });
        })
        .catch(err => console.error('Error loading wishlist:', err));

    // Attach event listener to the wishlist container using event delegation
    wishlistContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-wish')) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            removeWishlist(productId);
        }
    });
}
function removeWishlist(productId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    fetch(`http://localhost:3000/users/${currentUser.id}`)
        .then(response => response.json())
        .then(user => {
            user.wishlist = user.wishlist || [];

            const index = user.wishlist.indexOf(productId);
            if (index !== -1) {
                user.wishlist.splice(index, 1);

                fetch(`http://localhost:3000/users/${currentUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wishlist: user.wishlist })
                })
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Removed',
                        text: 'Product removed from your wishlist!'
                    });
                    loadWishlist(); // Reload the wishlist
                })
                .catch(err => console.error('Error updating wishlist:', err));
            }
        })
        .catch(err => console.error('Error fetching user data:', err));
}


function loadOrders() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const ordersContainer = document.getElementById('order-items');

    if (!ordersContainer) {
        console.error('Orders container not found.');
        return;
    }

    fetch("http://localhost:3000/orders") 
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch orders.');
            return response.json();
        })
        .then(orders => {
            const userOrders = orders.filter(order => order.customerId == currentUser.id);

            if (userOrders.length === 0) {
                ordersContainer.innerHTML = '<p>You have no recent orders.</p>';
                return;
            }

            userOrders.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-card');
                const orderHeader = document.createElement('h3');
                orderHeader.textContent = `Order ID: ${order.id}`;
                const orderStatus = document.createElement('p');
                orderStatus.textContent = `Status: ${order.status}`;

                orderDiv.appendChild(orderHeader);
                

                // Create a section to list the products in the order
                const productsList = document.createElement('div');
                productsList.classList.add('order-products');

                order.products.forEach(product => {
                    // Fetch product details for each product in the order
                    fetch(`http://localhost:3000/products/${product.productId}`)
                        .then(response => {
                            if (!response.ok) throw new Error('Failed to fetch product details.');
                            return response.json();
                        })
                        .then(productDetails => {
                            const productDiv = document.createElement('div');
                            productDiv.classList.add('order-product-item');
                            productDiv.innerHTML = `
                                <p>Product: ${productDetails.name}</p>
                                <p>Price: $${productDetails.price}</p>
                                <p>Quantity: ${product.quantity}</p>
                                <p>Total: $${product.quantity * productDetails.price}</p>
                            `;
                            productsList.appendChild(productDiv);
                        })
                        .catch(err => console.error('Error loading product:', err));
                });

                orderDiv.appendChild(productsList);
                orderDiv.appendChild(orderStatus);

                // Display the total amount for the order
                const totalAmount = document.createElement('p');
                totalAmount.textContent = `Total Amount: $${order.total}`;
                orderDiv.appendChild(totalAmount);

                // Append the order div to the orders container
                ordersContainer.appendChild(orderDiv);
            });
        })
        .catch(err => console.error('Error loading orders:', err));
}



window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const protectedPages = ["../html/profile.html","../html/checkout.html"];
    if (!currentUser && protectedPages.includes(window.location.pathname)) {
        Swal.fire({
            icon: 'warning',
            title: 'No user is logged in.',
            text: 'Please log in to continue.',
            confirmButtonText: 'OK'
        });
        window.location.href = "login.html";
        return;
    }

    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');

    if (userNameElement) userNameElement.textContent = currentUser.username;
    if (userRoleElement) userRoleElement.textContent = currentUser.role;

    loadWishlist();
    loadOrders();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            window.location.href = "login.html";
        });
    }
    
    
});
