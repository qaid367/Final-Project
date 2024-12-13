import {
  findDb,
  getDb,
  editAccount,
  alertMessage,
  createTodo,
  getIndexes,
  removeExtraSpaces,
} from "./Utils.js";

const token = localStorage.getItem("token");
let db = getDb();
const index = getIndexes(["token"], [token])[0];
let account = db[index];

if (account.length == 0) {
  alertMessage("Session expired. Please relogin!", "red");
  setTimeout(() => {
    window.location.href = "/login.html";
  }, 1500);
}

function submitTodo(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  let { header, description } = {
    header: formData.get("header"),
    description: formData.get("description"),
  };

  header = removeExtraSpaces(header);
  description = removeExtraSpaces(description);

  if (!header || !description) {
    return alertMessage(
      "Invalid fields provided. Please fill out every input."
    );
  }

  if (header.length > 40 || header.length < 2) {
    return alertMessage(
      "Header length must be between 2 & 40 characters long."
    );
  }

  if (description.length > 150 || description.length < 2) {
    return alertMessage(
      "Description length must be between 2 & 150 characters long."
    );
  }

  const id = account.Todos.length;
  const todo = {
    id,
    title: header,
    description,
    createdAt: Date.now(),
  };

  try {
    createTodo(index, todo);
    alertMessage("Success! Refreshing...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (e) {
    console.error(e);
    alertMessage(e.message, "Red");
  }
}

export { submitTodo };
