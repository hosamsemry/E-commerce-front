window.addEventListener('load', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  if (!currentUser || currentUser.role !== 'seller') {
      window.location.href = './home.html';
  }

  document.getElementById('addProductBtn').addEventListener('click', showProductForm);
  document.getElementById('cancelBtn').addEventListener('click', hideProductForm);
  document.getElementById('addProductForm').addEventListener('submit', handleFormSubmit);

  fetchProducts();
});

// Delegated event listener for Edit and Delete buttons
document.getElementById('productList').addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-btn')) {
      const productId = event.target.dataset.id;
      editProduct(productId);
  } else if (event.target.classList.contains('delete-btn')) {
      const productId = event.target.dataset.id;
      deleteProduct(productId);
  }
});

// Fetch and display products for the current seller
async function fetchProducts() {
  const res = await fetch('http://localhost:3000/products');
  const products = await res.json();
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const sellerProducts = products.filter(product => product.sellerId == currentUser.id);

  sellerProducts.forEach(product => {
      const li = document.createElement('li');
      li.classList.add('product-item');
      li.innerHTML = `
          <span>${product.name} - $${product.price}  
              <img style="width:90px;margin-left:20px" src="${product.image}">
          </span>
          <div>
              <button class="edit-btn" data-id="${product.id}">Edit</button>
              <button class="delete-btn" data-id="${product.id}">Delete</button>
          </div>
      `;
      productList.appendChild(li);
  });
}


function showProductForm() {
  document.getElementById('productForm').classList.remove('hidden');
  document.getElementById('formTitle').textContent = 'Add Product';
  document.getElementById('addProductForm').reset();
}

function hideProductForm() {
  document.getElementById('productForm').classList.add('hidden');
}

async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const category = document.getElementById('productCategory').value;
  const image = document.getElementById('imageLink').value;
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  if (!image) {
      alert("Please provide an image link.");
      return;
  }

  const newProduct = {
      name,
      price,
      category,
      image,
      sellerId: currentUser.id
  };

  const res = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
  });

  if (res.ok) {
      alert('Product added successfully');
      hideProductForm();
      fetchProducts();
  } else {
      alert('Failed to add product');
  }
}

let isEditing = false;  // Flag to track form mode
let editingProductId = null;  // Track product being edited

async function editProduct(id) {
    const res = await fetch(`http://localhost:3000/products/${id}`);
    const product = await res.json();
    showProductForm();

    isEditing = true;  // Set flag to editing mode
    editingProductId = id;

    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('imageLink').value = product.image;
}

async function updateProduct(id) {
    const updatedProduct = {
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        category: document.getElementById('productCategory').value,
        image: document.getElementById('imageLink').value,
        sellerId: JSON.parse(sessionStorage.getItem('currentUser')).id
    };

    const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
    });

    if (res.ok) {
        alert('Product updated successfully');
        hideProductForm();
        fetchProducts();
    } else {
        alert('Failed to update product');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (isEditing) {
        updateProduct(editingProductId);  // Update if editing
        isEditing = false;
        editingProductId = null;
    } else {
        addProduct(event);  // Add if not editing
    }
}


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
document.getElementById('addProductForm').addEventListener('submit', handleFormSubmit);