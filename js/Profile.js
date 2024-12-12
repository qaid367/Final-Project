import { getDb, insertDb, updateDb, findDb, alertMessage } from "./Utils.js";
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

function updateAccount(data) {
  const { username, password, email, avatarBase } = data;
  const usernameElement = document.getElementById("username");
  const passwordElement = document.getElementById("password");
  const emailElement = document.getElementById("email");
  const avatarElement = document.getElementById("avatar");
  avatarElement.src = !avatarBase ? "./images/defaultAvatar.png" : avatarBase;
  emailElement.value = email;
  passwordElement.value = password;

  usernameElement.innerHTML = username;
}
