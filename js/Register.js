import {
  getDb,
  insertDb,
  validatePassword,
  validateUsername,
  validateToken,
  generateToken,
  alertMessage,
} from "./Utils.js";

let db = getDb();

async function submitForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { username, email, password } = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const avatarBase = sessionStorage.getItem("avatarBase");
  let token = generateToken(password.length + Math.floor(Math.random() + 10));
  try {
    if (!validatePassword(password)) {
      return alertMessage(
        "Password must contain a capital and lowercase letter, a symbol, and at least 1 digit.",
        "red"
      );
    }
    if (!validateUsername(username)) {
      return alertMessage(
        "Username already been taken or the length is between 4 & 30 characters.",
        "red"
      );
    }
    while (validateToken(token)) {
      token = generateToken(password.length + Math.floor(Math.random() + 10));
    }
    localStorage.setItem("token", token);
    alertMessage("Success!", "#4371f0");
    db = insertDb({ username, email, password, avatarBase, token });
    setTimeout(() => {
      window.location.href = "/profile.html";
    }, 1500);
  } catch (e) {
    alertMessage(e.message, "#ff4f4f");
  }
}

export { submitForm };
