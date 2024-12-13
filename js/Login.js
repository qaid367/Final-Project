import {
  getDb,
  insertDb,
  findDb,
  validatePassword,
  validateUsername,
  validateToken,
  generateToken,
  alertMessage,
  editAccount,
  getIndexes,
} from "./Utils.js";

let db = getDb();
const token = localStorage.getItem("token");
if (token) {
  const exists = findDb(["token"], [token]);
  if (exists.length > 0) {
    window.location.href = "./profile.html";
  }
}

async function loginForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { email, password } = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  if (!password || !email) {
    return alertMessage(
      "Invalid credentials provided. Please fill out every input!",
      "red"
    );
  }

  try {
    const account = findDb(["email", "password"], [email, password])[0];
    if (account.email != email || account.password != password) {
      return alertMessage("Incorrect email OR password!", "Red");
    }
    if (account.length == 0) {
      return alertMessage("Incorrect email OR password!", "Red");
    }
    let token = generateToken(password.length + Math.floor(Math.random() + 10));
    while (validateToken(token)) {
      token = generateToken(password.length + Math.floor(Math.random() + 10));
    }
    // Edits the account's token with the new one!
    console.log(account);
    editAccount(getIndexes("token", account.token)[0], ["token"], [token]);
    localStorage.setItem("token", token);
    alertMessage("Logged in! Redirecting to profile..", "#4371f0");
    setTimeout(() => {
      window.location.href = "./profile.html";
    }, 1500);
  } catch (e) {
    console.error(e);
    alertMessage(e.message, "#ff4f4f");
  }
}

export { loginForm };
