document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
  
    axios.post("http://localhost:8080/users/register", {
      name,
      email,
      password
    })
    .then(response => {
      const token = response.data;
      window.location.href = "login.html";
    })
    .catch(error => {
      alert("Invalid credentials. Please try again.");
    });
  });
  

 
  