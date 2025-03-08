document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordForm = document.getElementById("forgot-password-form");

    // Forgot Password Functionality
    forgotPasswordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("forgot-username").value;
        const name = document.getElementById("forgot-name").value;
        const dob = document.getElementById("forgot-dob").value;
        const country = document.getElementById("forgot-country").value;
        const state = document.getElementById("forgot-state").value;
        const age = document.getElementById("forgot-age").value;
        const gender = document.getElementById("forgot-gender").value;
        const newPassword = document.getElementById("forgot-password").value;

        // Here you would typically send this data to the server to update the password
        console.log("Username:", username);
        console.log("Name:", name);
        console.log("Date of Birth:", dob);
        console.log("Country:", country);
        console.log("State:", state);
        console.log("Age:", age);
        console.log("Gender:", gender);
        console.log("New Password:", newPassword);

        alert("Password reset successfully!");
        window.location.href = "index.html";
    });
});
