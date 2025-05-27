document.addEventListener("DOMContentLoaded", function() {
  loadCart(); // Load the cart contents
  updateCartCounter(); // Update the cart badge on page load
  
  // Check if cart-icon exists before adding event listener
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', async function(event) {
      // Prevent the default action of opening the cart page
      event.preventDefault();

      // First, check if token exists before calling validateToken()
      const token = localStorage.getItem("authToken");
      if(!token) {
        console.log("No token found. Redirecting to login...");
        window.location.href = "/login.html";
        return;
      }


      try {
        // Validate the token before allowing access to the cart      
        const isValid = await validateToken();

        if (isValid) {
          // If token is valid, proceed to the cart page
          window.location.href = "cart.html"; // Redirect to the cart page
        } else {
          // If the token is invalid, the redirection is handled within validateToken
          console.log("Invalid token, redirecting to login...");
        }
      } catch (error) {
        console.error('Error validating token:', error);
      }
    });
  }
  
  // Check if we have a checkout button and add its event listener if needed
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', prepareCheckout);
  }
  
  validateToken();
});


let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalAmount;

function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = document.getElementById("cart-items");
  
  // Check if cartItems exists (we might be on the main page, not the cart page)
  if (!cartItems) return;
  
  totalAmount = 0;
  cartItems.innerHTML = "";

  cart.forEach((items, index) => {
    let itemTotal = items.price * items.quantity;
    totalAmount += itemTotal;
    cartItems.innerHTML += `<tr>
    <td style="padding: 30px;">${items.name}</td>
    <td style="padding: 30px;">${items.price}</td>
    <td style="padding: 20px;"><img src="${items.imageURL}" style="width: 40%; height: 30%;" alt="product_image"></td>
    <td style="padding: 25px; width:20%;"><button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index},-1)">-</button>  ${items.quantity}    <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index},1)">+</button></td>
    <td style="padding-top: 30px;">₹${itemTotal}</td>
    <td style="padding: 30px;"><button onclick="removeFromCart(${index})" class="btn btn-dark"><i class="fa-solid fa-trash" style="color: #ff0000; border: 2px solid black; padding: 8px; border-radius: 5px; background-color: black;"></i></button></td>
</tr>`;
  });

  const gstAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + gstAmount;
  
  const totalAmountElement = document.getElementById("totalamount");
  if (totalAmountElement) {
    totalAmountElement.innerHTML = `
      Subtotal: ₹${totalAmount.toFixed(2)} <br>
      GST (18%): ₹${gstAmount.toFixed(2)} <br>
      <strong>Grand Total: ₹${grandTotal.toFixed(2)}</strong>
    `;
  }

   // Save grandTotal to localStorage for checkout use
  localStorage.setItem("checkoutTotal", grandTotal.toFixed(2));
}

function addToCart(id, name, price, imageURL) {
  console.log("Adding Product to Cart : ", id, name, price, imageURL);

  // First, validate the JWT token before proceeding with the cart operation
  validateToken().then(isValid => {
    if (isValid) {
      console.log("Token is valid. Adding product to cart:", id, name, price, imageURL);

      price = parseFloat(price);

      let itemIndex = cart.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        // If item exists, update the quantity
        cart[itemIndex].quantity += 1;
      } else {
        // If item doesn't exist, add it to the cart
        cart.push({
          id: id,
          name: name,
          price: price,
          imageURL: imageURL,
          quantity: 1
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Update cart item counter
      updateCartCounter();
    } else {
      console.log("Token is invalid. Cart operation aborted.");
    }
  });
}

function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartBadge = document.getElementById("cart-badge");
    if (cartBadge) {
        cartBadge.innerText = cart.length;
    }
}

function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}

function prepareCheckout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  if (cart.length === 0 || totalAmount === 0) {
    alert("Your cart is empty... Please add items to your cart to proceed.");
    window.location.href = "index.html";
    return;
  } else {
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    localStorage.setItem("checkoutTotal", totalAmount.toFixed(2));
    window.location.href = "checkout.html";
  }
}

// Update the validateToken function to return a Promise properly:
function validateToken() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("Token is missing, redirecting to login...");
    localStorage.removeItem("authToken"); 
    window.location.href = "/login.html"; // Redirect to login page
    return Promise.resolve(false); // Ensure Promise resolves as false when no token is found
  }

  // If token exists, proceed with the validation request
  return axios
    .get("https://ecommerce-service-niko.onrender.com/login/validate", {
      headers: {
        Authorization: "Bearer " + token
      }
    })
    .then((response) => {
      console.log("Token is valid:", response.data);
      return true; // Resolves true if the token is valid
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        console.log("Token is invalid or expired. Redirecting to login page.");
        localStorage.removeItem("authToken");
        window.location.href = "/login.html"; // Redirect to login page
      } else {
        console.error("Error validating token:", error);
      }
      return false; // Resolves false if the token is invalid
    });
}