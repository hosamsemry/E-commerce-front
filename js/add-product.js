const API_URL_PRODUCTS = 'http://localhost:3000/products';
const addProductForm = document.getElementById('addProductForm');

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const imagee = document.getElementById('imageLink').value;
    const product = await response.json();
    const productImage = document.createElement('img');
    productImage.src = imagee;

    const response = await fetch(API_URL_PRODUCTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, category, productImage })
    });

    
    
    document.body.appendChild(productImage);

    Swal.fire({
        icon: 'success',
        title: 'Product added successfully!',
        showConfirmButton: false,
        timer: 2000
    });
    addProductForm.reset();
    window.location.href = 'admin-dashboard.html';  // Redirect back to the dashboard
});
