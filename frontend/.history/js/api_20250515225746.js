const BASE_URL="http://localhost:8080";

async function loadProducts()
{
    try {
        const raw = await fetch(`${BASE_URL}/products`);
        const response = await raw.json();

        let trendingList = document.getElementById("trending-products");
        let clothingList = document.getElementById("clothing-products");
        let electronicsList = document.getElementById("electronics-products");
        let gadgets = document.getElementById("gadgets");

        trendingList.innerHTML="";
        clothingList.innerHTML="";
        electronicsList.innerHTML="";
        gadgets.innerHTML="";

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

                                 
                                 <button class="btn btn-success w-100 mt-3" onclick="addToWishlist(${element.id},'${element.name}',${element.price},'${element.imageUrl}')">Add to Wishlist</button>
                               
                                <a href="product-details.html?id=${element.id}" class="btn btn-secondary w-100 mt-3">View Details</a>
                            </div>
                        </div>
                    </div> `;


            if(element.category === "Clothing" || element.category === "Sweatshirt" || element.category === "Jacket")
            {
                clothingList.innerHTML+=productCard;
            }else if(element.category === "Electronics" || element.category === "Television" || element.category === "Washing Machine" || element.category === "Smart Watch" || element.category === "Printer" || element.category === "Tab" || element.category === "Refrigerator"){
                electronicsList.innerHTML+=productCard;
            }else if(element.category === "Bluetooth Speaker" || element.category === "Camera" || element.category === "Vr headset" || element.category === "Gadgets")
            {
                gadgets.innerHTML+=productCard;
            }
            else{
                trendingList.innerHTML+=productCard;
            }
        });

        console.log(response);   
    } catch (error) {
        console.log("Error Fetching Products.....");
        console.log(error); 
    }  
}

// 🛒 Add Product to Wishlist (Using localStorage)
function addToWishlist(id, name, price, imageUrl) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Check if the product already exists in the wishlist
    const existingProductIndex = wishlist.findIndex(item => item.id === id);
    if (existingProductIndex === -1) {
        // Add product if not already in wishlist
        wishlist.push({ id, name, price, imageUrl });
    } else {
        alert("This product is already in your wishlist.");
    }

    // Save the updated wishlist back to localStorage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    loadWishlist();  // Update UI after adding to wishlist
}

// 💖 Load User's Wishlist from localStorage
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistContainer = document.getElementById("wishlist-container");
    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    } else {
        wishlist.forEach(item => {
            const wishlistItem = `
                <div class="col-lg-6 col-md-6 mb-5">
                    <div class="card h-100">
                        <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><strong>₹${item.price}</strong></p>
                            <button class="btn btn-danger w-100" onclick="removeFromWishlist(${item.id})">Remove from Wishlist</button>
                        </div>
                    </div>
                </div>`;

            wishlistContainer.innerHTML += wishlistItem;
        });
    }
}

// 💖 Remove Product from Wishlist
function removeFromWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const updatedWishlist = wishlist.filter(item => item.id !== productId);

    // Save the updated wishlist back to localStorage
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    loadWishlist();  // Update UI after removing from wishlist
}

// 🛒 Check if a Product is in the Wishlist
function isProductInWishlist(id) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some(item => item.id === id);
}

document.addEventListener("DOMContentLoaded", function () {
    loadWishlist();  // Load wishlist when the page loads
});
