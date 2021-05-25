const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const registerEmail = document.getElementById("registerEmail");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");

document.getElementById("loginButton").addEventListener("click", async () => {
    const response = await login(loginEmail.value, loginPassword.value);
    if (response.status === 200) {
        window.localStorage.setItem("token", response.data.token);
        // alert("Logged In");
        window.location = "index.html";
    } else {
        console.log(response);
        alert("Something went wrong. Please try again")
    }
})

document.getElementById("registerButton").addEventListener("click", async () => {
    const response = await axios.post("http://localhost:5000/users/register", {
        email: registerEmail.value,
        password: registerPassword.value,
        userName: registerUsername.value
    });
    if (response.status === 200) {
        const res = await login(registerEmail.value, registerPassword.value);
        window.localStorage.setItem("token", res.data.token);
        alert("Logged In");
        window.location = "index.html";
    } else {
        console.log(res);
        alert("Something went wrong. Please try again")
    }
})

async function login(email, password) {
    return await axios.post("http://localhost:5000/users/login", {
        email: email,
        password: password
    });
}