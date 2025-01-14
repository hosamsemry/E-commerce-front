// Retrieve the cart data from sessionStorage
const cart = JSON.parse(localStorage.getItem('cart')) || { products: [], total: 0 };

// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let total = 0;

    // Clear any existing cart items
    cartItemsContainer.innerHTML = '';

    // Loop through cart products and add them to the cart-items container
    cart.products.forEach(productInCart => {
        // Fetch the product details from the server
        fetch(`http://localhost:3000/products/${productInCart.productId}`)
            .then(response => response.json())
            .then(product => {
                // Create product display elements
                const productElement = document.createElement('div');
                productElement.classList.add('cart-item');
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Quantity: ${productInCart.quantity}</p>
                    <p>Price: $${product.price}</p>
                    <p>Total: $${product.price * productInCart.quantity}</p>
                    <button class="remove-button" data-product-id="${product.id}">Remove</button>
                `;

                // Add event listener to the remove button
                const removeButton = productElement.querySelector('.remove-button');
                removeButton.addEventListener('click', () => {
                    const productId = parseInt(removeButton.getAttribute('data-product-id'));

                    // Remove the product from the cart
                    const updatedProducts = cart.products.filter(product => product.productId !== productId);
                    cart.products = updatedProducts;

                    // Update the cart data in localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));

                    // Re-render the cart items
                    renderCartItems();
                });

                cartItemsContainer.appendChild(productElement);

                // Update the total price
                total += product.price * productInCart.quantity;
                totalPriceElement.textContent = `Total Price: $${total}`;
            })
            .catch(error => console.error("Error fetching product:", error));
    });

    // Update the total price after all products are rendered
    totalPriceElement.textContent = `Total Price: $${total}`;
}

// Call the function to render the cart items on page load
renderCartItems();

// Add functionality for the checkout button
const checkoutButton = document.getElementById('checkout-button');
checkoutButton.addEventListener('click', () => {
    if (cart.products.length === 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Add products first!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Post the cart data to the orders endpoint
    fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    })
    .then(response => response.json())
    .then(() => {
        
        // Clear the cart data from localStorage
        localStorage.removeItem('cart');

        Swal.fire({
            title: 'Success!',
            text: 'Order placed!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 2000
        });

        // Clear the cart items from the page
        document.getElementById('cart-items').innerHTML = '';
        document.getElementById('total-price').textContent = 'Total Price: $0';
    })
    .catch(error => console.error('Error placing order:', error));
});
