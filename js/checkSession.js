import { getDb, insertDb, updateDb, findDb, alertMessage } from "./Utils.js";
const token = localStorage.getItem("token");
try {
  const account = findDb(["token"], [token])[0];
  if (!account) {
    window.location.href = "/register.html";
  }
} catch (e) {
  console.error(e);
  alertMessage(e.message, "#FF0000");
}
