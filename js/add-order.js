const API_URL_ORDERS = 'http://localhost:3000/orders';  
const API_URL_PRODUCTS = 'http://localhost:3000/products';
const addOrderForm = document.getElementById('addOrderForm');

// Fetch products data from the API
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(API_URL_PRODUCTS);
        const products = await response.json();
        
        const productSelect = document.getElementById("productId");
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });

        // Automatically calculate total price when quantity changes
        document.getElementById("quantity").addEventListener("input", function() {
            const productId = document.getElementById("productId").value;
            const quantity = this.value;
            const totalInput = document.getElementById("total");

            const selectedProduct = products.find(p => p.id == productId);
            if (selectedProduct && quantity) {
                const totalPrice = selectedProduct.price * quantity;
                totalInput.value = totalPrice;
            } else {
                totalInput.value = 0;
            }
        });

    } catch (error) {
        console.error("Error fetching products:", error);
    }
});

// Handle form submission
addOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        // Fetch existing orders to determine the next order ID
        const ordersResponse = await fetch(API_URL_ORDERS);
        const orders = await ordersResponse.json();
        const orderId = orders.length + 1;
        const newOrderId = orderId.toString();

        // Collect the form data
        const customerId = document.getElementById('customerId').value;
        const productId = document.getElementById('productId').value;
        const quantity = document.getElementById('quantity').value;
        const totalPrice = document.getElementById('total').value;
        const status = document.getElementById('status').value;

        // Construct the order data in the desired format
        const orderData = {
            id: newOrderId,
            customerId,
            products: [
                {
                    productId,
                    quantity
                }
            ],
            total: totalPrice,
            status
        };

        // Send the data to the backend API
        const response = await fetch(API_URL_ORDERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        // Handle the response from the server
        if (response.ok) {
            Swal.fire('Success', 'Order added successfully!', 'success');
            addOrderForm.reset();
            window.location.href = 'admin-dashboard.html';  // Redirect back to the dashboard
        } else {
            Swal.fire('Error', 'Failed to add the order. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred while adding the order. Please try again.', 'error');
    }
});
