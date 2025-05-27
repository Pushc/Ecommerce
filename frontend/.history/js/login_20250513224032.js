document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    axios.post("http://localhost:8080/login/generate-token", {
      email,
      password
    })
    .then(response => {
      const token = response.data;
      console.log("Token received:", token);
      localStorage.setItem("authToken", token);

      // Decode the JWT to get role
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const role = payload.role;

      console.log("User role:", role); // Debug line

      setupTokenExpiryLogout();

      // Role-based redirection
      if (role === "ADMIN") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    })
     .catch(error => {
      alert("Invalid credentials. Please try again.");
    });
  });
  

  function setupTokenExpiryLogout() {
    const token = localStorage.getItem("authToken");
    if (!token) return;
  
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;
  
    const expiryTime = exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeout = expiryTime - now;
  
    if (timeout <= 0) {
      // Token already expired
      localStorage.removeItem("authToken");
      alert("Session expired. Please log in again.");
      window.location.href = "/login.html";
      return;
    }
  
    // Set auto logout timer    
    setTimeout(() => {
      localStorage.removeItem("authToken");
      alert("Session expired. Please log in again.");
      window.location.href = "/login.html";
    }, timeout);
  
    console.log(`Auto logout in ${(timeout / 1000 / 60).toFixed(2)} minutes`);
  
  }
  