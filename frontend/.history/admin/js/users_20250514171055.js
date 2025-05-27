function initUsersPage() {
  redirectIfNotAdmin(); // Role check
  fetchUsers();
}

function fetchUsers() {
  const token = localStorage.getItem("authToken");

  fetch("http://localhost:8080/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then(users => {
      const tbody = document.querySelector("#userTable tbody");
      tbody.innerHTML = "";

      users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>
            ${user.role !== "ADMIN" ? `<button onclick="deleteUser(${user.id})">Delete</button>` : "Protected"}
          </td>
        `;

        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      alert("Failed to load users.");
    });
}

// function deleteUser(userId) {
//   const token = localStorage.getItem("authToken");

//   if (confirm("Are you sure you want to delete this user?")) {
//     fetch(`http://localhost:8080/admin/users/${userId}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(res => {
//         if (res.ok) {
//           alert("User deleted.");
//           fetchUsers();
//         } else {
//           return res.text().then(text => { throw new Error(text); });
//         }
//       })
//       .catch(err => {
//         alert("Error: " + err.message);
//       });
//   }
// }
