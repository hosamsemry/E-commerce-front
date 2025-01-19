window.addEventListener('load', () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  if (!currentUser || currentUser.role !== 'seller') {
      window.location.href = './home.html';
  }

  document.getElementById('manageProductsBtn').addEventListener('click', () => {
    showProductView();
  });

  document.getElementById('manageOrdersBtn').addEventListener('click', () => {
    showOrderView();
  });

  document.getElementById('addProductBtn').addEventListener('click', () => {
    showProductForm();
  });

  document.getElementById('cancelBtn').addEventListener('click', hideProductForm);
  document.getElementById('addProductForm').addEventListener('submit', handleFormSubmit);

  fetchProducts();
  
  document.getElementById('orderList').classList.add('hidden');

});
  
function showProductView() {
  document.getElementById('productList').classList.remove('hidden');
  document.getElementById('addProductBtn').classList.remove('hidden');
  document.getElementById('productForm').classList.add('hidden');
  document.getElementById('orderList').classList.add('hidden');

  fetchProducts();
}

function showOrderView() {
  document.getElementById('productList').classList.add('hidden');
  document.getElementById('addProductBtn').classList.add('hidden');
  document.getElementById('productForm').classList.add('hidden');
  document.getElementById('orderList').classList.remove('hidden');

  fetchOrders();
}

document.getElementById('manageOrdersBtn').addEventListener('click', () => {
  document.getElementById('productForm').classList.add('hidden');
  document.getElementById('productList').classList.add('hidden');
  fetchOrders();
});


document.getElementById('productList').addEventListener('click', (event) => {
  if (event.target.classList.contains('edit-btn')) {
      const productId = event.target.dataset.id;
      editProduct(productId);
  } else if (event.target.classList.contains('delete-btn')) {
      const productId = event.target.dataset.id;
      deleteProduct(productId);
  }
});


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
            <div class="product-li-seller">
          <span><font style="font-weight:bold; font-size:20px;color:#d14d07;">Product Name:</font> ${product.name}</span>
          <span><font style="font-weight:bold; font-size:20px;color:#d14d07;">Product Price:</font> $${product.price} </span> 
          <span><font style="font-weight:bold; font-size:20px;color:#d14d07;">Status:</font> ${product.approved ? 'Approved' : 'Pending Approval'}</span>
            </div>  
          
          <img style="width:120px;margin-left:20px" src="${product.image}">
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
  const approved = false;
  const rating = "1";
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  if (!image) {
    Swal.fire({
        icon: 'warning',
        title: 'Missing Image',
        text: 'Please provide an image link.'
    });
    return;
  }

  const res = await fetch('http://localhost:3000/products');
  const products = await res.json();
  const productId = (products.length + 1);
  const newProductId = productId.toString()

  const newProduct = {
      id: newProductId,
      name,
      price,
      category,
      image,
      sellerId: currentUser.id,
      rating,
      approved: false
  };

  const resPost = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
  });

  if (resPost.ok) {
    Swal.fire({
        icon: 'success',
        title: 'Product added successfully',
        showConfirmButton: false,
        timer: 1500
    });
    hideProductForm();
    fetchProducts();
  } else {
    Swal.fire({
        icon: 'error',
        title: 'Failed to add product',
        showConfirmButton: false,
        timer: 1500
    });
  }
}

async function fetchOrders() {
  const resOrders = await fetch('http://localhost:3000/orders');
  const orders = await resOrders.json();

  const resProducts = await fetch('http://localhost:3000/products');
  const products = await resProducts.json();

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const orderList = document.getElementById('orderList');
  orderList.innerHTML = '';

  
  const sellerProducts = products.filter(product => product.sellerId == currentUser.id);

  
  const sellerOrders = orders.filter(order =>
    order.products.some(orderProduct =>
      sellerProducts.some(product => product.id == orderProduct.productId)
    )
  );

  if (sellerOrders.length === 0) {
    orderList.innerHTML = '<p>No orders found for your products.</p>';
    return;
  }

  
  sellerOrders.forEach(order => {
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order-item');

    
    const sellerOrderProducts = order.products.map(orderProduct => {
        const product = sellerProducts.find(p => p.id == orderProduct.productId);
        if (product) {
          return `
            
              <li><strong>Product Name:</strong> ${product.name} <br></li>
              <li><strong>Price:</strong> $${product.price} <br></li>
              <li><strong>Quantity:</strong> ${orderProduct.quantity} <br></li>
              <li><strong>Total Price:</strong> ${orderProduct.quantity *product.price} <br></li>
              <li><strong>Status:</strong> ${order.status}</li>
            
          `;
        }
        return '';
      })
      .join('');

    orderDiv.innerHTML = `
      <h3>Order ID: ${order.id}</h3>
      <p><strong>Customer ID:</strong> ${order.customerId}</p>
      
      <ul class="order-details">${sellerOrderProducts}</ul>
      <select class="status-dropdown" data-id="${order.id}">
        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>pending</option>
        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>shipped</option>
        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>delivered</option>
      </select>
      <button class="update-status-btn" data-id="${order.id}">Update Status</button>
      
    `;

    orderList.appendChild(orderDiv);
  });
}



document.getElementById('orderList').addEventListener('click', async (event) => {
  event.preventDefault();
  
  if (event.target.classList.contains('update-status-btn')) {
    const orderId = event.target.dataset.id;
    const statusSelect = event.target.previousElementSibling;
    const newStatus = statusSelect.value;

    const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Order status updated',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        
        fetchOrders();
      });

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update status',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  }
);


let isEditing = false;  
let editingProductId = null;  

async function editProduct(id) {
    const res = await fetch(`http://localhost:3000/products/${id}`);
    const product = await res.json();
    showProductForm();

    isEditing = true;  
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
        Swal.fire({
            icon: 'success',
            title: 'Product updated successfully',
            showConfirmButton: false,
            timer: 1500
        });
        hideProductForm();
        fetchProducts();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Failed to update product',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    if (isEditing) {
        updateProduct(editingProductId);  
        isEditing = false;
        editingProductId = null;
    } else {
        addProduct(event);  
    }
}

async function deleteProduct(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Product deleted successfully',
          showConfirmButton: false,
          timer: 1500
        });
        fetchProducts();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete product',
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  });
}
document.getElementById('addProductForm').addEventListener('submit', handleFormSubmit);