import {
  findDb,
  getDb,
  editAccount,
  alertMessage,
  createTodo,
  getIndexes,
  deleteTodo,
  updateDb,
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
createTodos(Todos);

function createTodos(todos) {
  const todoList = document.querySelector(".todo-list");

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    todoItem.setAttribute("data-id", todo.id);
    const todoTitle = document.createElement("input");
    todoTitle.classList.add("todoHeader");
    todoTitle.placeholder = "Todo Header";
    todoTitle.type = "text";
    todoTitle.readOnly = true;
    todoTitle.value = todo.title;

    const todoDescription = document.createElement("input");
    todoDescription.classList.add("todoDescription");
    todoDescription.type = "text";
    todoDescription.readOnly = true;
    todoDescription.placeholder = "Todo Description";
    todoDescription.value = todo.description;
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
    editButton.id = "editBtn";
    editButton.addEventListener("click", function () {
      editTodo(todo.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-todo");
    deleteButton.textContent = "Delete";
    deleteButton.id = "deleteBtn";
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
  const editBtn = document.querySelector("#editBtn");
  const deleteBtn = document.querySelector("#deleteBtn");
  deleteBtn.style.display = "none";
  editBtn.style.display = "none";

  const todoDivElement = document.querySelector(`div[data-id="${id}"]`);
  const todoActions = todoDivElement.querySelector(".todo-actions");

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.id = "cancelBtn";
  cancelBtn.addEventListener("click", function () {
    resetEdit(todoDivElement);
  });
  const sumbitBtn = document.createElement("button");
  sumbitBtn.id = "submitBtn";
  sumbitBtn.textContent = "Submit";
  sumbitBtn.classList.add("submit-btn");
  sumbitBtn.addEventListener("click", function () {
    submitEdits(todoDivElement);
  });
  todoActions.appendChild(sumbitBtn);
  todoActions.appendChild(cancelBtn);
  const todoHeader = todoDivElement.querySelector(".todoHeader");
  const todoDesc = todoDivElement.querySelector(".todoDescription");
  todoHeader.readOnly = false;
  todoDesc.readOnly = false;
}

function resetEdit(todoDivElement) {
  // User wishes to cancel the edit
  const submitBtn = todoDivElement.querySelector("#submitBtn");
  const cancelBtn = todoDivElement.querySelector("#cancelBtn");
  submitBtn.remove();
  cancelBtn.remove();
  const editBtn = todoDivElement.querySelector("#editBtn");
  const deleteBtn = todoDivElement.querySelector("#deleteBtn");
  editBtn.style.display = "inline";
  deleteBtn.style.display = "inline";

  const todoHeader = todoDivElement.querySelector(".todoHeader");
  todoHeader.readOnly = true;
  todoHeader.value =
    Todos[parseInt(todoDivElement.getAttribute("data-id"))].title;
  const todoDesc = todoDivElement.querySelector(".todoDescription");
  todoDesc.readOnly = true;
  todoDesc.value =
    Todos[parseInt(todoDivElement.getAttribute("data-id"))].description;
}

function submitEdits(todoDivElement) {
  const todoDesc = todoDivElement.querySelector(".todoDescription");
  const todoHeader = todoDivElement.querySelector(".todoHeader");
  todoHeader.readOnly = true;
  todoDesc.readOnly = true;

  const submitBtn = todoDivElement.querySelector("#submitBtn");
  const cancelBtn = todoDivElement.querySelector("#cancelBtn");
  submitBtn.remove();
  cancelBtn.remove();

  const editBtn = todoDivElement.querySelector("#editBtn");
  const deleteBtn = todoDivElement.querySelector("#deleteBtn");
  editBtn.style.display = "inline";
  deleteBtn.style.display = "inline";
  const todo = account.Todos.find(
    (todo) => todo.id == parseInt(todoDivElement.getAttribute("data-id"))
  );
  todo.title = todoHeader.value;
  todo.description = todoDesc.value;
  db[index] = account;
  db = updateDb(db);
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
