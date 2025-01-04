window.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');

    // Fetch products from db.json
    fetch('../db.json') // Adjust the path as needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const products = data.products;

            // Clear existing products (if any)
            productsContainer.innerHTML = '';

            // Generate product cards
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                productCard.innerHTML = `
                    <a href="product-detail.html?id=${product.id}">
                        <img src="../${product.image}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>Category: ${product.category}</p>
                        <p>Price: $${product.price}</p>
                    </a>
                    <button class="add-to-cart-btn">Add to Cart</button>
                `;

                productsContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error fetching products:", error));
});


document.addEventListener("DOMContentLoaded", () => {
    const categoryGrid = document.getElementById("category-grid");

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

                // Category title
                const categoryTitle = document.createElement("h3");
                categoryTitle.textContent = category;
                categoryDiv.appendChild(categoryTitle);

                // Product list
                const productList = document.createElement("ul");
                groupedProducts[category].forEach((product) => {
                    const productItem = document.createElement("li");
                    productItem.innerHTML = `
                        <a href="product-detail.html?id=${product.id}">
                            <img src="../${product.image}" alt="${product.name}">
                            <strong>${product.name}</strong>
                            <span class="price">$${product.price}</span> 
                        </a>
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


document.addEventListener("DOMContentLoaded", () => {
    const productDetailContainer = document.getElementById("product-detail-container");

    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        productDetailContainer.innerHTML = `<p>Product ID is missing!</p>`;
        return;
    }

    // Fetch the product data from db.json
    fetch("../db.json") // Adjust the path if needed
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const product = data.products.find(p => p.id === parseInt(productId));

            if (!product) {
                productDetailContainer.innerHTML = `<p>Product not found!</p>`;
                return;
            }

            // Populate the product details
            productDetailContainer.innerHTML = `
                <div class="product-detail">
                    <img src="../${product.image}" alt="${product.name}" class="product-image">
                    <h1>${product.name}</h1>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non erat a libero commodo venenatis.</p>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
            productDetailContainer.innerHTML = `<p>Error loading product details. Please try again later.</p>`;
        });
});
