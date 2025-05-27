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
        alert(response.data); // Optional: show success message
        window.location.href = "login.html?registered=true";
      })      
    .catch(error => {
        if (error.response && error.response.data) {
          alert(error.response.data);
        } else {
          alert("An error occurred. Please try again.");
        }
      });
      
  });
  

 
  