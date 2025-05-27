// 🛒 Load cart items and calculate totals
const checkoutCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
const ORIGINAL_PRICE = parseFloat(localStorage.getItem("checkoutTotal")) || 0;

const cartTable = document.getElementById("checkout-cart-items");
let actualTotal = 0;

// Populate cart table
function orderSummary(){
  let subtotal = 0;

  checkoutCart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>₹${itemSubtotal.toFixed(2)}</td>
    `;
    cartTable.appendChild(row);
  });

  // ✅ Add GST
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;


   // Save final amount in localStorage
  localStorage.setItem("checkoutFinalAmount", grandTotal.toFixed(2));


  // Update total shown on page
  const totalElement = document.querySelector(".total-row span:last-child");
  totalElement.textContent = `₹${grandTotal.toFixed(2)}`;

  // Update pay button text
  const payButtonElement = document.querySelector(".pay-button");
  payButtonElement.innerHTML = `<i class="fas fa-lock"></i> Pay ₹${Math.round(grandTotal)}`;

}


document.addEventListener("DOMContentLoaded", function () {
  setupTokenExpiryLogout();
  validateToken().then(isValid => {
    if (!isValid) {
      // Token is invalid, handle logout logic here
      window.location.href = "/login.html"; // Redirect to login if token is expired
    }
  });
  orderSummary();
  // const totalElement = document.querySelector(".total-row span:last-child");
  // const payButtonElement = document.querySelector(".pay-button");

  // // Show total price and update button text
  // totalElement.textContent = `₹${ORIGINAL_PRICE.toFixed(2)}`;
  // payButtonElement.innerHTML = `<i class="fas fa-lock"></i> Pay ₹${Math.round(ORIGINAL_PRICE)}`;

  // Pay button click handler
  const payButton = document.querySelector(".pay-button");
  payButton.addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    

    // Reset validation
    document.querySelectorAll(".form-group").forEach((group) => {
      group.classList.remove("error");
    });

    let hasError = false;
    if (!name) {
      document.getElementById("name").parentElement.classList.add("error");
      hasError = true;
    }
    if (!email || !isValidEmail(email)) {
      document.getElementById("email").parentElement.classList.add("error");
      hasError = true;
    }
    if (!phone || !isValidPhone(phone)) {
      document.getElementById("phone").parentElement.parentElement.classList.add("error");
      hasError = true;
    }

    if (!address || !isValidAddress(address)) {
      document.getElementById("address").parentElement.parentElement.classList.add("error");
      hasError = true;
    }

    if (hasError) {
      shakeButton();
      alert("Please fill all required fields correctly.");
      return;
    }

    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    payButton.disabled = true;

    // Create Razorpay order
    fetch("http://localhost:8081/api/payment/createOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        address,
        amount: Math.round(parseFloat(localStorage.getItem("checkoutFinalAmount")) || 0),
      }),
    })
      .then(res => res.json())
      .then(data => {
        const options = {
          key: "rzp_test_xkOwjqo4DvOAJd",
          amount: Math.round(ORIGINAL_PRICE) * 100,
          currency: "INR",
          name: "Pushkar Ecommerce Store",
          description: "Product Purchase",
          image: "https://cdn.pixabay.com/photo/2021/03/19/13/40/online-6107598_1280.png",
          order_id: data.id,
          prefill: { name, email, contact: phone },
          theme: { color: "#0f766e" },
          handler: function (response) {
            fetch("http://localhost:8081/api/payment/updateOrder", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                status: "SUCCESS",
                items: JSON.stringify(checkoutCart),
              }),
            })
              .then(() => {
                payButton.innerHTML = '<i class="fas fa-check"></i> Payment Successful!';
                payButton.style.background = "linear-gradient(to right, #10b981, #059669)";
                alert(`🎉 Thank you for purchasing products\nYour payment of ₹${Math.round(ORIGINAL_PRICE)} was successful.`);
                window.location.href = "/";
                emptyCart();
              })
              .catch(() => {
                alert("Payment succeeded but failed to update backend.");
              });
          },
          modal: {
            ondismiss: function () {
              payButton.innerHTML = `Pay ₹${Math.round(ORIGINAL_PRICE)}`;
              payButton.disabled = false;
            },
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
        payButton.disabled = false;
        payButton.innerHTML = "Pay Now";
      });
  });

  // Validation helpers
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  function isValidAddress(address) {
    // Check if the address is not empty and is at least 10 characters long (can be adjusted based on your requirements)
    return address && address.trim().length >= 10;
}

  function shakeButton() {
    payButton.classList.add("shake");
    setTimeout(() => payButton.classList.remove("shake"), 500);
  }

  function emptyCart() {
    // Remove cart from localStorage
    localStorage.removeItem("cart");
  
    // Optionally, update the cart badge and reload the cart display
    updateCartCounter(); // To reset cart badge count
    loadCart(); // To clear cart items from the page
  }
});


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
    .get("http://localhost:8080/login/validate", {
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