import { addToWishlist } from "./profile.js";
window.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('currentUser')) {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.style.display = 'none';
        });
        document.getElementById('login').style.display = 'block';
        document.getElementById('check-out').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
    }else{
        document.getElementById('login').style.display = 'none';
    }

    const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                sessionStorage.clear();
            });
        }
    
    const productsContainer = document.getElementById('products-container');
    const categoryGrid = document.getElementById('category-grid');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const currentUser = sessionStorage.getItem('currentUser');

    if (!productsContainer || !categoryGrid) {
        console.error('Missing container elements');
        return;
    }

   
    fetch("http://localhost:3000/products") 
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
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
                        ${currentUser ? `<button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                                        <button class="add-to-wishlist-btn" data-id="${product.id}">Add to Wishlist</button>` : ''}
                    `;
                    productsContainer.appendChild(productCard);
                });

                
                const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
                addToCartButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = parseInt(button.getAttribute('data-id'));
                        addToCart(productId);
                    });
                });

                document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = parseInt(button.getAttribute('data-id'));
                        addToWishlist(productId);  
                    });
                });
            };

            
            const renderCategories = (products) => {
                categoryGrid.innerHTML = '';
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
                            ${currentUser ? `<button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                                        <button class="add-to-wishlist-btn" data-id="${product.id}">Add to Wishlist</button>` : ''}
                        `;
                        productList.appendChild(productItem);
                    });
                    categoryDiv.appendChild(productList);
                    categoryGrid.appendChild(categoryDiv);
                });
                document.querySelectorAll('.add-to-wishlist-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        const productId = parseInt(button.getAttribute('data-id'));
                        addToWishlist(productId);  
                    });
                });
            };

            
            renderProducts(products);
            renderCategories(products);

            
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredProducts = products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                );
                renderProducts(filteredProducts);
                renderCategories(filteredProducts);
            });

            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredProducts = products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                );
                renderProducts(filteredProducts);
                renderCategories(filteredProducts);
            });
        })
        .catch((error) => console.error("Error fetching products:", error));

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
