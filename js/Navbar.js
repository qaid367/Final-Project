import { findDb, alertMessage } from "./Utils.js";
const defaultElement = document.querySelector("#original");
window.addEventListener("mouseover", (event) => {
  const element = event.target;
  if (element.tagName != "A" && !defaultElement.classList.contains("current")) {
    const anchorElements = document.querySelectorAll(".nav-content a");
    anchorElements.forEach((a) => {
      a.classList.remove("current");
    });
    defaultElement.classList.add("current");
  }
  if (element.tagName == "A") {
    const activeElement = document.querySelector(".current");
    activeElement.classList.remove("current");
    element.classList.add("current");
  }
});

const signOut = document.querySelector("#signOut");
if (signOut) {
  signOut.addEventListener("click", () => {
    // User clicked the sign out button on the navbar
    const token = localStorage.getItem("token");
    const account = findDb(["token"], [token]);
    if (!token || account.length == 0) {
      alertMessage("Session expired. Redirecting to register page!", "Red");
      setTimeout(() => {
        window.location.href = "./register.html";
      }, 1500);
    }
    // Account exists and token is valid
    localStorage.removeItem("token");
    alertMessage("Signed out. Redirecting to login page!", "red");
    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1500);
  });
}
