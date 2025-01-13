window.addEventListener('load', () => {
    // Get the current user from sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  
    // Check if the user exists and has the 'seller' role
    if (!currentUser || currentUser.role !== 'seller') {
      window.location.href = './home.html'; // Redirect if not a seller
    }
  
    // Set up event listeners
    document.getElementById('addProductBtn').addEventListener('click', showProductForm);
    document.getElementById('cancelBtn').addEventListener('click', hideProductForm);
    document.getElementById('addProductForm').addEventListener('submit', addProduct);
  
    fetchProducts();
  });
  
  // Fetch and display products for the current seller
  async function fetchProducts() {
    const res = await fetch('http://localhost:3000/products');
    const products = await res.json();
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    // Filter products by seller ID
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const sellerProducts = products.filter(product => product.sellerId == currentUser.id);
    
    sellerProducts.forEach(product => {
      const li = document.createElement('li');
      li.classList.add('product-item');
      li.innerHTML = `
        <span>${product.name} - $${product.price}  <img style="width:70px;" src="../${product.image}"></span>
        <div>
          <button onclick="editProduct(${product.id})">Edit</button>
          <button onclick="deleteProduct(${product.id})">Delete</button>
        </div>
      `;
      productList.appendChild(li);
    });
  }
  
  // Show product form
  function showProductForm() {
    document.getElementById('productForm').classList.remove('hidden');
    document.getElementById('formTitle').textContent = 'Add Product';
    document.getElementById('addProductForm').reset();
  }
  
  // Hide product form
  function hideProductForm() {
    document.getElementById('productForm').classList.add('hidden');
  }
  
  // Add new product
  async function addProduct(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;
    const productImage = document.getElementById('productImage').files[0];
    
    if (!productImage) {
      alert("Please upload an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('category', productCategory);
    formData.append('image', productImage);
  
    // Send the new product to the server
    const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      body: formData
    });
  
    if (res.ok) {
      alert('Product added successfully');
      hideProductForm();
      fetchProducts();
    } else {
      alert('Failed to add product');
    }
  }
  
  // Edit product
  async function editProduct(id) {
    // Get product details and pre-fill the form for editing
    const res = await fetch(`http://localhost:3000/products/${id}`);
    const product = await res.json();
    showProductForm();
  
    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
  
    document.getElementById('addProductForm').onsubmit = async (event) => {
      event.preventDefault();
      const updatedProduct = {
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        category: document.getElementById('productCategory').value,
      };
  
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedProduct),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (res.ok) {
        alert('Product updated successfully');
        hideProductForm();
        fetchProducts();
      } else {
        alert('Failed to update product');
      }
    };
  }
  
  // Delete product
  async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
  
      if (res.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    }
  }
  