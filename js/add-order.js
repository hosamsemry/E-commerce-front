const ORDERS = 'http://localhost:3000/orders';  
const PRODUCTS = 'http://localhost:3000/products';
const addOrderForm = document.getElementById('addOrderForm');

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(PRODUCTS);
        const products = await response.json();
        
        const productSelect = document.getElementById("productId");
        products.forEach(product => {
            const option = document.createElement("option");
            option.value = product.id;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });

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

addOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const ordersResponse = await fetch(ORDERS);
        const orders = await ordersResponse.json();
        const orderId = orders.length + 1;
        const newOrderId = orderId.toString();

        const customerId = document.getElementById('customerId').value;
        const productId = document.getElementById('productId').value;
        const quantity = document.getElementById('quantity').value;
        const totalPrice = document.getElementById('total').value;
        const status = document.getElementById('status').value;


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

        const response = await fetch(ORDERS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            Swal.fire('Success', 'Order added successfully!', 'success');
            addOrderForm.reset();
            window.location.href = 'admin-dashboard.html';  
        } else {
            Swal.fire('Error', 'Failed to add the order. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'An error occurred while adding the order. Please try again.', 'error');
    }
});
