window.addEventListener('DOMContentLoaded', () => {

    if (!sessionStorage.getItem('currentUser')) {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.style.display = 'none';
        });

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.clear();
        });
    }}

    const productsContainer = document.getElementById('products-container');
    const categoryGrid = document.getElementById('category-grid');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const currentUser = sessionStorage.getItem('currentUser');
    
    
    if (!productsContainer || !categoryGrid) {
        console.error('Missing container elements');
        return;
    }

    fetch('../db.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let products = data.products;

            
            const renderProducts = (products) => {
                
                productsContainer.innerHTML = '';

                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');

                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>Category: ${product.category}</p>
                        <p>Price: $${product.price}</p>
                        <p class="rating-product">Rate: ${product.rating}/5</p> 
                        ${currentUser ? `<button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>` : ''}
                    `;

                    productsContainer.appendChild(productCard);
                });
            };

            renderProducts(products);

            
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();

               
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.category.toLowerCase().includes(searchTerm)
                );

                renderProducts(filteredProducts);
            });

            
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();

                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.category.toLowerCase().includes(searchTerm)
                );

                renderProducts(filteredProducts);
            });
        })
        .catch(error => console.error("Error fetching products:", error));

    
    fetch("http://localhost:3000/products")
        .then((response) => response.json())
        .then((products) => {
            
            const groupedProducts = products.reduce((acc, product) => {
                if (!acc[product.category]) acc[product.category] = [];
                acc[product.category].push(product);
                return acc;
            }, {});

            Object.keys(groupedProducts).forEach((category) => {
                const categoryDiv = document.createElement("div");
                categoryDiv.classList.add("category-item");
                categoryDiv.id = `${category}`;

                const categoryTitle = document.createElement("h3");
                categoryTitle.textContent = category;
                categoryDiv.appendChild(categoryTitle);

                const productList = document.createElement("ul");
                groupedProducts[category].forEach((product) => {
                    const productItem = document.createElement("li");
                    productItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-name-category">${product.name}</div>
                        <span class="price">Price: $${product.price}</span> 
                        <p class="rating-category">Rate: ${product.rating}/5</p> 
                        ${currentUser ? '<button class="add-to-cart-btn" data-id="' + product.id + '">Add to Cart</button>' : ''}
                    `;
                    productList.appendChild(productItem);
                });
                categoryDiv.appendChild(productList);

                categoryGrid.appendChild(categoryDiv);
            });
        })
        .catch((error) => console.error("Error fetching products:", error));

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-id');
            addToCart(parseInt(productId));
        }
    });

    function addToCart(productId) {
        fetch(`http://localhost:3000/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                let cart = JSON.parse(localStorage.getItem('cart')) || { products: [], total: 0 };
                const productInCart = cart.products.find(p => p.productId === productId);
    
                if (productInCart) {
                    productInCart.quantity += 1;
                } else {
                    cart.products.push({ productId, quantity: 1 });
                }
    
                cart.total += Number(product.price);
                localStorage.setItem('cart', JSON.stringify(cart));
    
                Swal.fire({
                    title: 'Success!',
                    text: 'Product added to cart!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            });
    }
    

});


