document.addEventListener("DOMContentLoaded", function () {
    loadUserOrders();
});

async function loadUserOrders() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert("You are not logged in. Please log in first.");
        window.location.href = "/login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8081/api/payment/user-orders", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orders = await response.json();
        renderOrdersTable(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        document.getElementById("orders-container").innerHTML =
            "<p class='text-danger'>Failed to load orders. Try again later.</p>";
    }
}

function renderOrdersTable(orders) {
    const tableBody = document.getElementById("orders-body");
    tableBody.innerHTML = "";

    if (orders.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='6' class='text-center'>No orders found.</td></tr>";
        return;
    }

    orders.forEach(order => {
        const row = `
            <tr>
                <td>${order.name}</td>
                <td>${order.email}</td>
                <td>${order.amount}</td>
                <td>${order.status}</td>
                <td>${order.orderId}</td>
                <td>${new Date(order.createdAt).toLocaleString()}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
