window.addEventListener('DOMContentLoaded', () => {

    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const currentUser = sessionStorage.getItem('currentUser');

    // Fetch products from db.json
    fetch('../db.json') // Adjust the path as needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let products = data.products;

            // Function to render products
            const renderProducts = (products) => {
                // Clear existing products (if any)
                productsContainer.innerHTML = '';

                // Generate product cards
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');

                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>Category: ${product.category}</p>
                        <p>Price: $${product.price}</p>
                        ${currentUser ? '<button class="add-to-cart-btn">Add to Cart</button>' : ''}
                    `;

                    productsContainer.appendChild(productCard);
                });
            };

            // Initial rendering of all products
            renderProducts(products);

            // Add search functionality
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();

                // Filter products by name or category
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) || 
                    product.category.toLowerCase().includes(searchTerm)
                );

                // Render filtered products
                renderProducts(filteredProducts);
            });

            // Optional: Re-render products when user types in the search input
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
});

document.addEventListener("DOMContentLoaded", () => {
    const categoryGrid = document.getElementById("category-grid");
    const currentUser = sessionStorage.getItem('currentUser');

    // Fetch data from the JSON server
    fetch("http://localhost:3000/products")
        .then((response) => response.json())
        .then((products) => {
            // Group products by category
            const groupedProducts = products.reduce((acc, product) => {
                if (!acc[product.category]) acc[product.category] = [];
                acc[product.category].push(product);
                return acc;
            }, {});

            // Render categories
            Object.keys(groupedProducts).forEach((category) => {
                const categoryDiv = document.createElement("div");
                categoryDiv.classList.add("category-item");
                categoryDiv.id = `${category}`;

                // Category title
                const categoryTitle = document.createElement("h3");
                categoryTitle.textContent = category;
                categoryDiv.appendChild(categoryTitle);

                // Product list
                const productList = document.createElement("ul");
                groupedProducts[category].forEach((product) => {
                    const productItem = document.createElement("li");
                    productItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-name-category">${product.name}</div>
                        <span class="price">$${product.price}</span> 
                        ${currentUser ? '<button class="add-to-cart-btn">Add to Cart</button>' : ''}
                    `;
                    productList.appendChild(productItem);
                });
                categoryDiv.appendChild(productList);

                // Append to grid
                categoryGrid.appendChild(categoryDiv);
            });
        })
        .catch((error) => console.error("Error fetching products:", error));
});
