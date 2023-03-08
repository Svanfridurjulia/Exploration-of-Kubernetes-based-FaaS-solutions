
const loginForm = document.getElementById("login-form");


          
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const requestData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const response = await fetch("http://localhost:3005/function/nodetest", {
    method: "POST",
    headers: {
        'Content-type': 'application/json'

    },
    body: JSON.stringify(requestData),
  }).then(response => response.json())
  .then(data => {
    if (data.statusCode == 200){
      console.log("YOU ARE AUTHENTICATED");
    }
    else {
      console.log("YOU ARE NOT AUTHENTICATED");
    }
  })
  .catch(error => {
    console.error(error);
  });;

  // console.log(data);
  // if (response.status == 200) {
  //   // Redirect to dashboard or other authenticated pages
  //   // window.location.href = "/dashboard";
  // } else {
  //   // Handle login error
  //   console.error("Login failed");
  // }
});