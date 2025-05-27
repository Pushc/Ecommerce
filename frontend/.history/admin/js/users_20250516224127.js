function redirectIfNotAdmin() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("Not logged in!");
    window.location.href = "login.html";
    return;
  }

  // Decode the JWT payload to extract the role
  const payloadBase64 = token.split('.')[1];
  const payload = JSON.parse(atob(payloadBase64));

  if (payload.role !== "ADMIN") {
    alert("Access denied! Only admins can view this page.");
    window.location.href = "index.html"; // Redirect to safe page
  }
}

// This function runs when the page loads
function initUsersPage() {
  redirectIfNotAdmin();  // Step 1: Ensure only admins can view this page
  fetchUsers();          // Step 2: Get and display all users in the table
}

// Fetch all users from the backend
function fetchUsers() {
  const token = localStorage.getItem("authToken");  // Get token from browser storage

  // Check if the token is available
  if (!token) {
    alert("You are not logged in.");
    window.location.href = "../login.html";  // Redirect to login page
    return;
  }

  // Make a GET request to your Spring Boot API
  fetch("http://localhost:8080/admin/users", {
    headers: {
      Authorization: `Bearer ${token}` // Send token for authentication
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to fetch users"); // Catch failed requests
    }
    return response.json(); // Convert the response to JSON
  })
  .then(users => {
    const tbody = document.querySelector("#userTable tbody"); // Find the <tbody> in the table
    tbody.innerHTML = ""; // Clear previous content

    // Loop through the list of users received from backend
    users.forEach(user => {
      const row = document.createElement("tr"); // Create a new row for each user

      // Fill the row with user details
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          ${
            user.role !== "ADMIN"  // Prevent delete button for users with ADMIN role
              ? `<td>
          <button onclick="deleteProduct(${p.id})">
            <i class="fas fa-trash"></i>
          </button>
          <button style="color: white; background: #23ab23;" onclick="openEditModal(${user.id})">
              <i class="fas fa-edit"></i>
          </button>
        </td>`
              : "Cannot Delete or Update (Admin)"
          }
        </td>
      `;

      // Add the row to the table
      tbody.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error fetching users:", error);
    alert("Failed to load users.");
  });
}

// Function to delete a user
function deleteUser(userId) {
  const token = localStorage.getItem("authToken");  // Get token from local storage

  if (!token) {
    alert("You are not logged in.");
    window.location.href = "../login.html";  // Redirect to login page
    return;
  }

  // Confirm delete action
  const confirmation = confirm("Are you sure you want to delete this user?");
  if (!confirmation) return;  // Do nothing if user cancels

  // Make a DELETE request to the backend
  fetch(`http://localhost:8080/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}` // Send token for authentication
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    // Reload the users table after successful deletion
    alert("User deleted successfully.");
    fetchUsers();  // Re-fetch the users to update the table
  })
  .catch(error => {
    console.error("Error deleting user:", error);
    alert("Failed to delete user.");
  });
}

// Call fetchUsers() when the page is loaded to display the users
document.addEventListener("DOMContentLoaded", fetchUsers);





// modal functionality

let currentUserEditId = null;

// Open edit modal and prefill with user data
function openEditUserModal(userId) {
  fetch(`${API_BASE}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  })
  .then(user => {
    currentUserEditId = user.id;
    document.getElementById("editUsername").value = user.username;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editUserModal").style.display = "block";
  })
  .catch(err => {
    alert("Failed to load user data.");
    console.error(err);
  });
}

// Close modal
function closeEditUserModal() {
  document.getElementById("editUserModal").style.display = "none";
  currentUserEditId = null;
}

// Handle form submit to update user
document.getElementById("editUserForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const updatedUser = {
    username: document.getElementById("editUsername").value.trim(),
    email: document.getElementById("editEmail").value.trim()
  };

  fetch(`${API_BASE}/admin/users/${currentUserEditId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatedUser)
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to update user");
    alert("User updated successfully.");
    closeEditUserModal();
    fetchUsers(); // Refresh user table if you have this function
  })
  .catch(err => {
    alert("Error updating user.");
    console.error(err);
  });
});
