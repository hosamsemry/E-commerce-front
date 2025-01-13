const API_URL_ORDERS = 'http://localhost:3000/orders';  // Your backend API URL
const addOrderForm = document.getElementById('addOrderForm');

// Example products and their prices
const productsData = {
    1: { name: "Mobile", price: 50 },
    2: { name: "Laptop", price: 500 },
    3: { name: "Tablet", price: 200 },
};

// Automatically calculate total price when quantity changes
document.getElementById("quantity").addEventListener("input", function() {
    const productId = document.getElementById("productId").value;
    const quantity = this.value;
    const totalInput = document.getElementById("total");

    if (productsData[productId] && quantity) {
        const totalPrice = productsData[productId].price * quantity;
        totalInput.value = totalPrice;
    } else {
        totalInput.value = 0;
    }
});

// Handle form submission
addOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect the form data
    const customerId = document.getElementById('customerId').value;
    const productId = document.getElementById('productId').value;
    const quantity = document.getElementById('quantity').value;
    const totalPrice = document.getElementById('total').value;
    const status = document.getElementById('status').value;

    // Construct the order data in the desired format
    const orderData = {
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

    try {
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
