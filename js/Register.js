import {
  getDb,
  insertDb,
  findDb,
  validatePassword,
  validateUsername,
  validateToken,
  generateToken,
  alertMessage,
} from "./Utils.js";

let db = getDb();
const token = localStorage.getItem("token");
if (token) {
  const exists = findDb(["token"], [token]);
  if (exists.length > 0) {
    window.location.href = "./profile.html";
  }
}

async function submitForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { username, email, password } = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  if (!username || !password || !email) {
    return alertMessage(
      "Invalid credentials provided. Please fill out every input!",
      "red"
    );
  }
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
        "Username already been taken or the length isn't between 4 & 30 characters.",
        "red"
      );
    }
    while (validateToken(token)) {
      token = generateToken(password.length + Math.floor(Math.random() + 10));
    }
    const Todos = [
      {
        id: 0,
        title: "Example Todo Header",
        description: "Example Todo Description.",
        createdAt: Date.now(),
      },
    ];
    localStorage.setItem("token", token);
    alertMessage("Success!", "#4371f0");
    db = insertDb({ username, email, password, avatarBase, token, Todos });
    setTimeout(() => {
      window.location.href = "/profile.html";
    }, 1500);
  } catch (e) {
    alertMessage(e.message, "#ff4f4f");
  }
}

export { submitForm };
