// Run the code after the DOM (HTML) is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); // Fetch and display all products when the page loads

  // Attach form submission event to add new product
  const form = document.getElementById("addProductForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default page reload
    addProduct(); // Call function to send product to backend
  });
});

// Base URL of your backend API
const API_BASE = "http://localhost:8080";

// Get the JWT token from browser local storage
const token = localStorage.getItem("authToken");

// 🔽 Function to fetch and display all products in table
function fetchProducts() {
  fetch(`${API_BASE}/admin/products`, {
    headers: {
      Authorization: `Bearer ${token}` // Send token to backend for authentication
    }
  })
  .then(res => res.json()) // Parse the response as JSON
  .then(products => {
    const tbody = document.querySelector("#productTable tbody"); // Get <tbody> of table
    tbody.innerHTML = ""; // Clear old table rows

    // Loop through all products returned from backend
    products.forEach(p => {
      const row = document.createElement("tr"); // Create a row for each product

      // Add columns with product data and delete button
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>₹${p.price}</td>
        <td>${p.category}</td>
        <td>
          <button onclick="deleteProduct(${p.id})">
            <i class="fas fa-trash"></i>
          </button>
          <button style="color: white; background: #23ab23;" onclick="openEditModal(${p.id})">
              <i class="fas fa-edit"></i>
          </button>
        </td>
      `;

      // Add the row to the table body
      tbody.appendChild(row);
    });
  })
  .catch(err => {
    alert("Failed to fetch products."); // Show alert if fetch fails
    console.error(err); // Log error for debugging
  });
}

// ➕ Function to add a new product to backend
function addProduct() {

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const imageUrl = document.getElementById("imageUrl").value.trim();
    const category = document.getElementById("category").value.trim();

    // ✅ Basic validation
    if (!name || !description || !category || isNaN(price) || price <= 0) {
        alert("Please fill in all required fields with valid data.");
        return;
    }
    // Read values from the form fields
    const product = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: parseFloat(document.getElementById("price").value),
        imageUrl: document.getElementById("imageUrl").value,
        category: document.getElementById("category").value
    };

  // Send POST request to backend to create the product
  fetch(`${API_BASE}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` // Auth token for backend security
    },
    body: JSON.stringify(product) // Convert JS object to JSON string
  })
  .then(res => {
    if (!res.ok) throw new Error("Add failed"); // Handle errors
    return res.json(); // Parse successful response
  })
  .then(() => {
    alert("Product added!"); // Notify user
    document.getElementById("addProductForm").reset(); // Clear form
    fetchProducts(); // Refresh product list
  })
  .catch(err => {
    alert("Failed to add product."); // Show error message
    console.error(err); // Log error
  });
}

// ❌ Function to delete a product
function deleteProduct(productId) {
  // Ask for confirmation before deleting
  if (!confirm("Are you sure you want to delete this product?")) return;

  // Send DELETE request to backend with product ID
  fetch(`${API_BASE}/admin/products/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}` // Auth token
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Delete failed"); // If backend returns error
    alert("Product deleted."); // Notify user
    fetchProducts(); // Refresh product list
  })
  .catch(err => {
    alert("Failed to delete product."); // Show error message
    console.error(err); // Log error
  });
}
