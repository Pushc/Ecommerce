const apiUrl = "http://localhost:8081/api/payment"; // Change to your actual backend base URL

let allOrders = [];

function initOrdersPage() {
  fetchOrders();
}

function fetchOrders() {
  fetch(`${apiUrl}/getAllOrders`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("authToken")}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Unauthorized or server error");
    return res.json();
  })
  .then(data => {
    allOrders = data;
    console.log(data);
    
    renderOrders(data);
  })
  .catch(err => {
    alert("Failed to load orders.");
    console.error(err);
  });
}

function renderOrders(orders) {
  const tbody = document.querySelector("#orderTable tbody");
  tbody.innerHTML = "";

  orders.forEach(order => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.name}</td>
      <td>${order.email}</td>
      <td>${order.phone}</td>
      <td>${order.address}</td>
      <td>₹${order.amount}</td>
      <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
      <td>${order.orderId}</td>
      <td>${order.paymentId || "-"}</td>
      <td>${new Date(order.createdAt).toLocaleString()}</td>
      <td>
        <button onclick="viewOrderDetails(${order.id})">🔍 View</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function viewOrderDetails(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById("viewOrderModal");
  const content = document.getElementById("orderDetailsContent");

  content.innerHTML = `
    <p><strong>ID:</strong> ${order.id}</p>
    <p><strong>Name:</strong> ${order.name}</p>
    <p><strong>Email:</strong> ${order.email}</p>
    <p><strong>Phone:</strong> ${order.phone}</p>
    <p><strong>Address:</strong> ${order.address}</p>
    <p><strong>Amount:</strong> ₹${order.amount}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Payment ID:</strong> ${order.paymentId || "N/A"}</p>
    <p><strong>Created At:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
  `;

  modal.style.display = "block";
}

function closeViewOrderModal() {
  document.getElementById("viewOrderModal").style.display = "none";
}

function filterOrders() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;

  const filtered = allOrders.filter(order =>
    (!status || order.status === status) &&
    (
      order.name.toLowerCase().includes(search) ||
      order.email.toLowerCase().includes(search) ||
      order.orderId.toLowerCase().includes(search)
    )
  );

  renderOrders(filtered);
}

function exportOrdersToCSV() {
  let csv = "ID,Name,Email,Phone,Address,Amount,Status,Order ID,Payment ID,Created At\n";

  allOrders.forEach(order => {
    csv += `"${order.id}","${order.name}","${order.email}","${order.phone}","${order.address}","${order.amount}","${order.status}","${order.order_id}","${order.payment_id || ""}","${order.created_at}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "orders.csv";
  link.click();
}
