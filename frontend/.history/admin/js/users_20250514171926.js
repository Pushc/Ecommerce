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

  // Make a GET request to your Spring Boot API
  fetch("http://localhost:8080/admin/users", {
    headers: {
      Authorization: `Bearer ${token}` // Send token for authentication
    },
  })
  .then(response => response.json()) // Convert the response to JSON
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
            user.role !== "ADMIN"
              ? `<button onclick="deleteUser(${user.id})">Delete</button>`
              : "Protected"
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

// This function deletes a user (only if not an admin)
function deleteUser(userId) {
  const token = localStorage.getItem("authToken");

  // Confirm deletion with the admin
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`http://localhost:8080/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.ok) {
        alert("User deleted.");
        fetchUsers(); // Refresh the table after deletion
      } else {
        return res.text().then(text => {
          throw new Error(text); // Show error from server
        });
      }
    })
    .catch(err => {
      alert("Error: " + err.message);
    });
  }
}
