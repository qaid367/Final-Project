import {
  findDb,
  getDb,
  editAccount,
  alertMessage,
  createTodo,
  getIndexes,
  deleteTodo,
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

let Todos = account.Todos;
if (Todos.length < 1) {
  account = createTodo(getIndexes(["token"], [token]), {
    id: Todos.length,
    title: "Example Todo",
    description: "Example Todo Description",
    createdAt: Date.now(),
  });
  Todos = account.Todos;
}
console.log(Todos);
createTodos(Todos);

function createTodos(todos) {
  const todoList = document.querySelector(".todo-list");

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    todoItem.setAttribute("data-id", todo.id);
    const todoTitle = document.createElement("h2");
    todoTitle.textContent = todo.title;

    const todoDescription = document.createElement("p");
    todoDescription.textContent = todo.description;
    const todoCreatedAt = document.createElement("span");
    todoCreatedAt.classList.add("todo-date");
    todoCreatedAt.textContent = `Created on: ${new Date(
      todo.createdAt
    ).toLocaleDateString()}`;

    const todoActions = document.createElement("div");
    todoActions.classList.add("todo-actions");

    const editButton = document.createElement("button");
    editButton.classList.add("edit-todo");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      editTodo(todo.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-todo");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      docDeleteTodo(todo.id);
    });

    todoActions.appendChild(editButton);
    todoActions.appendChild(deleteButton);

    todoItem.appendChild(todoTitle);
    todoItem.appendChild(todoDescription);
    todoItem.appendChild(todoCreatedAt);
    todoItem.appendChild(todoActions);

    todoList.appendChild(todoItem);
  });
}

function editTodo(id) {
  console.log(id);
}

function docDeleteTodo(id) {
  try {
    db = deleteTodo(index, id);
    alertMessage(`Success!`, "Green");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (e) {
    console.error(e);
    alertMessage(e.message, "Red");
  }
}
