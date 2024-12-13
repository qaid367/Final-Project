import {
  getIndexes,
  findDb,
  alertMessage,
  validatePassword,
  validateUsername,
  validateToken,
  editAccount,
  deleteDb,
} from "./Utils.js";
const token = localStorage.getItem("token");
try {
  const account = findDb(["token"], [token])[0];
  if (!account) {
    alertMessage("Session expired, please relogin. Redirecting..", "#FF0000");
    setTimeout(() => {
      return (window.location.href = "/register.html");
    }, 2000);
  } else {
    document.querySelector("#container").classList.remove("hidden");
    document.querySelector("#container").classList.add("container");
    updateAccount(account);
    console.log(account);
  }
} catch (e) {
  console.error(e);
  alertMessage(e.message, "#FF0000");
}

function editProfile() {
  const deleteBtn = document.querySelector("#deleteBtn");
  const editBtn = document.querySelector("#editBtn");
  const submitBtn = document.querySelector("#submitBtn");

  if (deleteBtn) {
    deleteBtn.classList.add("hidden");
    editBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  }
}

function submitEdit() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const email = document.querySelector("#email").value;
  const account = findDb(["token"], [token]);

  if (!account) {
    return alertMessage(
      "Couldn't find your account, please try again later.",
      "Red"
    );
  }

  if (!username || !password || !email) {
    return alertMessage(
      "Invalid credentials provided. Keep the inputs filled!",
      "red"
    );
  }

  try {
    if (!validatePassword(password)) {
      return alertMessage(
        "Password must contain a capital and lowercase letter, a symbol, and at least 1 digit.",
        "red"
      );
    }
    if (!validateUsername(username, token)) {
      return alertMessage(
        "Username already been taken or the length isn't between 4 & 30 characters.",
        "red"
      );
    }

    editAccount(
      getIndexes(["token", token])[0],
      ["username", "password", "email"],
      [username, password, email]
    );

    alertMessage("Success! Refreshing...", "#4371f0");

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (e) {
    console.error(e);
    alertMessage(e.message, "#ff4f4f");
  }
}

function deleteAccount() {
  const account = findDb(["token"], [token]);
  const index = getIndexes("token", token)[0];
  console.log(account);

  if (!account || index == -1) {
    return alertMessage(
      "Couldn't find your account, please try again later.",
      "Red"
    );
  }

  try {
    deleteDb(index);
    localStorage.removeItem("token")
    alertMessage("Account has been deleted. Redirecting to register page");
    setTimeout(() => {
      window.location.href = "./register.html";
    }, 1500);
  } catch (e) {
    console.error(e);
    alertMessage(e.message, "red");
  }
}

function updateAccount(data) {
  const { username, password, email, avatarBase } = data;
  const usernameElement = document.getElementById("username");
  const passwordElement = document.getElementById("password");
  const emailElement = document.getElementById("email");
  const avatarElement = document.getElementById("avatar");
  avatarElement.src = !avatarBase ? "./images/defaultAvatar.png" : avatarBase;
  emailElement.value = email;
  passwordElement.value = password;
  usernameElement.value = username;
}

export { editProfile, submitEdit, deleteAccount };
