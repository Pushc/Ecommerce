const BASE_URL = "http://localhost:8080";

// 🛒 Load Products on Home Page
async function loadProducts() {
    try {
        const raw = await fetch(`${BASE_URL}/products`);
        const response = await raw.json();

        let trendingList = document.getElementById("trending-products");
        let clothingList = document.getElementById("clothing-products");
        let electronicsList = document.getElementById("electronics-products");
        let gadgets = document.getElementById("gadgets");

        trendingList.innerHTML = "";
        clothingList.innerHTML = "";
        electronicsList.innerHTML = "";
        gadgets.innerHTML = "";

        response.forEach((element) => {
            let productCard = `
                <div class="col-lg-4 col-md-6 mb-5">
                    <div class="card h-100">
                        <img src="${element.imageUrl}" class="card-img-top" alt="${element.name}">
                        <div class="card-body">
                            <h5 class="card-title">${element.name}</h5>
                            <p class="card-text">${element.description}</p>
                            <p class="card-text"><strong>₹${element.price}</strong></p>
                            <button class="btn btn-primary w-100" onclick="addToCart(${element.id},'${element.name}',${element.price},'${element.imageUrl}')">Add To Cart</button>
                            <button class="btn btn-warning w-100 mt-2" onclick="addToWishlist(${element.id},'${element.name}',${element.price},'${element.imageUrl}')">Add To Wishlist</button>
                            <a href="product-details.html?id=${element.id}" class="btn btn-secondary w-100 mt-3">View Details</a>
                        </div>
                    </div>
                </div>`;

            // Categorize the products
            if (element.category === "Clothing" || element.category === "Sweatshirt" || element.category === "Jacket") {
                clothingList.innerHTML += productCard;
            } else if (element.category === "Electronics" || element.category === "Television" || element.category === "Washing Machine" || element.category === "Smart Watch" || element.category === "Printer" || element.category === "Tab" || element.category === "Refrigerator") {
                electronicsList.innerHTML += productCard;
            } else if (element.category === "Bluetooth Speaker" || element.category === "Camera" || element.category === "Vr headset" || element.category === "Gadgets") {
                gadgets.innerHTML += productCard;
            } else {
                trendingList.innerHTML += productCard;
            }
        });

        console.log(response);
    } catch (error) {
        console.log("Error Fetching Products.....");
        console.log(error);
    }
}

// 🛒 Add Product to Cart
function addToCart(id, name, price, imageUrl) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(item => item.id === id);
    if (existingProductIndex === -1) {
        cart.push({ id, name, price, imageUrl, quantity: 1 });
    } else {
        cart[existingProductIndex].quantity += 1;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    loadCart(); // Update cart UI
}

// 💖 Add Product to Wishlist
async function addToWishlist(id, name, price, imageUrl) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Please login to add items to your wishlist.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/wishlist`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(id)
        });

        if (response.ok) {
            alert("Product added to wishlist!");
            loadWishlist(); // Reload the wishlist UI
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'Something went wrong!'}`);
        }
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        alert("Error adding product to wishlist.");
    }
}


// 💖 Load User's Wishlist
async function loadWishlist() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Please login to view your wishlist.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/wishlist`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        const wishlist = await response.json();
        const wishlistContainer = document.getElementById("wishlist-products");
        wishlistContainer.innerHTML = "";

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
        } else {
            wishlist.forEach(item => {
                const wishlistItem = `
                    <div class="col-lg-4 col-md-6 mb-5">
                        <div class="card h-100">
                            <img src="${item.product.imageUrl}" class="card-img-top" alt="${item.product.name}">
                            <div class="card-body">
                                <h5 class="card-title">${item.product.name}</h5>
                                <p class="card-text">${item.product.description}</p>
                                <p class="card-text"><strong>₹${item.product.price}</strong></p>
                                <button class="btn btn-danger w-100" onclick="removeFromWishlist(${item.product.id})">Remove from Wishlist</button>
                            </div>
                        </div>
                    </div>`;

                wishlistContainer.innerHTML += wishlistItem;
            });
        }
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        alert("Error loading wishlist.");
    }
}

// 💖 Remove Product from Wishlist
async function removeFromWishlist(productId) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert("Please login to remove items from your wishlist.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/wishlist/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (response.ok) {
            alert("Product removed from wishlist!");
            loadWishlist(); // Reload wishlist after removing item
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        alert("Error removing product from wishlist.");
    }
}


// 🛒 Update Cart Counter (e.g., in the navbar or page header)
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCounter = document.getElementById("cart-counter");
    cartCounter.textContent = cart.length;
}

document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
    loadWishlist(); // Load wishlist when the page loads
});
