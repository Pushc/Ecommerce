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
  