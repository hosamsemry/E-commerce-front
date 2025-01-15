const cart = JSON.parse(localStorage.getItem('cart')) || { products: [], total: 0 };

fetch('http://localhost:3000/orders')
        .then(response => response.json())
        .then(orders => {
            const newOrderId = (orders.length + 1).toString();
            cart.id = newOrderId;
         })

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let total = 0;

    
    cartItemsContainer.innerHTML = '';

    
    cart.products.forEach(productInCart => {
        fetch(`http://localhost:3000/products/${productInCart.productId}`)
            .then(response => response.json())
            .then(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('cart-item');
                productElement.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Quantity: ${productInCart.quantity}</p>
                    <p>Price: $${product.price}</p>
                    <p>Total: $${product.price * productInCart.quantity}</p>
                    <button class="remove-button" data-product-id="${product.id}">Remove</button>
                `;

                const removeButton = productElement.querySelector('.remove-button');
                removeButton.addEventListener('click', () => {
                    const productId = parseInt(removeButton.getAttribute('data-product-id'));
                    const updatedProducts = cart.products.filter(product => product.productId !== productId);
                    cart.products = updatedProducts;

                    localStorage.setItem('cart', JSON.stringify(cart));

                    renderCartItems();
                });

                cartItemsContainer.appendChild(productElement);
                total += product.price * productInCart.quantity;
                totalPriceElement.textContent = `Total Price: $${total}`;
            })
            .catch(error => console.error("Error fetching product:", error));
    });

    totalPriceElement.textContent = `Total Price: $${total}`;
}

renderCartItems();

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

    fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    })
    .then(response => response.json())
    .then(() => {
        localStorage.removeItem('cart');

        Swal.fire({
            title: 'Success!',
            text: 'Order placed!',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 2000
        });

        document.getElementById('cart-items').innerHTML = '';
        document.getElementById('total-price').textContent = 'Total Price: $0';
    })
    .catch(error => console.error('Error placing order:', error));
});
