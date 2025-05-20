const API_URL = "http://localhost:5006";

// Login / Signup Handler
async function authenticate(event, type) {
    event.preventDefault();

    const usernameInput = document.getElementById(`${type}-username`);
    const passwordInput = document.getElementById(`${type}-password`);
    const errorMessage = document.getElementById(`${type}-error-message`);

    if (!usernameInput || !passwordInput || !errorMessage) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        errorMessage.textContent = "Please fill in all fields!";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert(`${type === "login" ? "Login" : "Signup"} successful!`);
            window.location.href = "bot.html";
        } else {
            errorMessage.textContent = data.message;
        }
    } catch (error) {
        console.error(`${type} error:`, error);
        errorMessage.textContent = "Something went wrong. Please try again.";
    }
}

// Attach form events
document.getElementById("login-form")?.addEventListener("submit", (e) => authenticate(e, "login"));
document.getElementById("signup-form")?.addEventListener("submit", (e) => authenticate(e, "signup"));

document.addEventListener('DOMContentLoaded', function () {
    const forgotPasswordLink = document.getElementById('forgot-password');
    const forgotModal = document.getElementById('forgot-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const forgotForm = document.getElementById('forgot-password-form');
    const resetUsernameInput = document.getElementById('reset-email'); // Username or Email
    const forgotErrorMsg = document.getElementById('forgot-error-message');

    if (!forgotPasswordLink || !forgotModal) return;

    // Show forgot password modal
    forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        forgotModal.style.display = 'block';
        forgotErrorMsg.textContent = '';
        resetUsernameInput.value = '';
    });

    // Close modal
    closeModalBtn?.addEventListener('click', () => forgotModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === forgotModal) forgotModal.style.display = 'none';
    });

    // Handle forgot password form submission
    forgotForm?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = resetUsernameInput.value.trim();

        if (!username) {
            forgotErrorMsg.textContent = "Please enter your username or email";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })  // <-- this matches your backend!
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password reset link has been sent!");
                forgotModal.style.display = 'none';
            } else {
                forgotErrorMsg.textContent = data.message || "Failed to send reset link";
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            forgotErrorMsg.textContent = "Network error. Try again later.";
        }
    });
});
