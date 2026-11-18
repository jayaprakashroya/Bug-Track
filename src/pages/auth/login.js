const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");
const forgotPasswordLink = document.getElementById("forgotPassword");

function showMessage(text, type) {
  loginMessage.textContent = text;
  loginMessage.className = `message ${type}`;
  loginMessage.hidden = false;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username) {
    showMessage("Please enter your username.", "error");
    usernameInput.focus();
    return;
  }

  if (!password.trim()) {
    showMessage("Please enter your password.", "error");
    passwordInput.focus();
    return;
  }

  if (username.length < 4) {
    showMessage("Username must contain at least 4 characters.", "error");
    usernameInput.focus();
    return;
  }

  if (password.length < 6) {
    showMessage("Password must contain at least 6 characters.", "error");
    passwordInput.focus();
    return;
  }

  if (username === "admin" && password === "admin123") {
    showMessage("Login successful! Welcome to BugTrack.", "success");
    return;
  }

  showMessage("Invalid username or password.", "error");
});

togglePasswordButton.addEventListener("click", () => {
  const shouldShowPassword = passwordInput.type === "password";
  passwordInput.type = shouldShowPassword ? "text" : "password";
  togglePasswordButton.textContent = shouldShowPassword ? "Hide" : "Show";
  togglePasswordButton.setAttribute("aria-pressed", String(shouldShowPassword));
});

forgotPasswordLink.addEventListener("click", (event) => {
  event.preventDefault();
  showMessage(
    "Please contact your administrator to reset your password.",
    "info",
  );
});
