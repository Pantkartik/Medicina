document.addEventListener("DOMContentLoaded", function () {
    const emergencyLoginForm = document.getElementById("emergency-login-form");

    // Emergency Login Functionality
    emergencyLoginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("emergency-username").value;
        const password = document.getElementById("emergency-password").value;

        console.log("Username:", username); // Debugging statement
        console.log("Password:", password); // Debugging statement

        if (username === "emergency" && password === "password") {
            window.open("main.html", "_blank");
        } else {
            alert("Invalid username or password.");
        }
    });
});
