const PRODUCTS = 'http://localhost:3000/products';
const addProductForm = document.getElementById('addProductForm');

addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const category = document.getElementById('category').value;
    const imagee = document.getElementById('imageLink').value;
    const response = await fetch(PRODUCTS);
    const products = await response.json();
    const id = products.length + 1;
    const productId = id.toString();
    const productImage = document.createElement('img');
    productImage.src = imagee;

     await fetch(PRODUCTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id:productId, name, price, category, productImage })
    });

    
    
    document.body.appendChild(productImage);

    Swal.fire({
        icon: 'success',
        title: 'Product added successfully!',
        showConfirmButton: false,
        timer: 2000
    });
    addProductForm.reset();
    window.location.href = 'admin-dashboard.html'; 
});
