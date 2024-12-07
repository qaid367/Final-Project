import { getDb } from "./Utils.js";

const db = getDb();
console.log(db[0]);

// let expirationDate = localStorage.getItem("expirationDate");
// let token = localStorage.getItem("token");

// if (!token) {}

// if (!expirationDate) {
//   expirationDate = localStorage.setItem(
//     "expirationDate",
//     moment().add("days", 7)._d
//   );
// }

// if (moment(expirationDate) > moment()) {
//   console.error("Token is expired!");
//   //   window.location.href = "/register.html";
// } else {
//   console.log("Token is still valid!");
// }

// console.log(moment(expirationDate).format("LLL"));
