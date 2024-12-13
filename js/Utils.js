function getDb() {
  let data = JSON.parse(localStorage.getItem("db"));
  if (!data) {
    data = [];
    localStorage.setItem("db", JSON.stringify(data));
  }
  return data;
}

// Updates the database with new information
function updateDb(dbObject) {
  const stringifyObj = JSON.stringify(dbObject);
  localStorage.setItem("db", stringifyObj);
  return dbObject;
}

function createTodo(index, todo) {
  const db = getDb();
  const account = db[index];
  if (!account) {
    throw new Error("Account not found!");
  }

  if (!account.Todos) {
    account["Todos"] = [todo];
  } else {
    account.Todos.push(todo);
    updateDb(db);
    return account;
  }
}

function deleteTodo(index, id) {
  let db = getDb();
  const account = db[index];
  if (!account) {
    throw new Error("Account not found!");
  }

  if (!account.Todos) {
    throw new Error("No todo found!");
  }
  const todo = account.Todos[id];
  if (!todo) {
    throw new Error("No todo found with index!");
  }
  account.Todos.splice(id, 1);
  db = updateDb(db);
  return db;
}

function setItem(key, value) {
  if (!key || !value) throw new Error("Invalid arguments!");
  localStorage.setItem(key, value);
  return value;
}

// Find the account based on the field and value
function getIndexes(field, value) {
  const db = getDb();
  const indexes = [];
  for (let i = 0; i < db.length; i++) {
    const account = db[i];
    if (account[field] == value) {
      indexes.push(i);
    }
  }
  return indexes.length > 0 ? indexes : -1;
}

function insertDb(data) {
  const db = getDb(); // an array of objects of accounts;
  if (!data.password || !data.email || !data.username)
    throw new Error("Invalid arguments!");
  db.push(data);
  return updateDb(db);
}

// Returns an account(S) depending on the fields and search values
function findDb(fields, querys) {
  if (fields.length != querys.length) {
    throw new Error("Fields array length must be the same length as querys");
  }
  const db = getDb();
  if (!db) {
    return null;
  }

  const accounts = [];

  for (const account of db) {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (account[field] == querys[i]) {
        accounts.push(account);
      }
    }
  }
  return accounts;
}

function deleteDb(index) {
  const db = getDb();
  const account = db[index];
  if (!account) return null;
  db.splice(index, 1);
  updateDb(db);
  return account;
}

// Generate a good token
// https://stackoverflow.com/questions/8532406/create-a-random-token-in-javascript-based-on-user-details
function generateToken(number) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var token = "";
  for (var i = 0; i < number; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

function removeExtraSpaces(str) {
  // https://stackoverflow.com/questions/7635952/javascript-how-to-remove-all-extra-spacing-between-words
  return str.replace(/^\s+|\s+$/g, "");
}

function validateUsername(str, token) {
  str = removeExtraSpaces(str);
  // New account conditinal
  if (!token) {
    const accounts = findDb(["username"], [str]);
    if (accounts.length > 0) return false;
  } else {
    // Account already exists
    // Check if the found account isn't just the current user's
    const account = findDb(["username"], [str])[0];
    if (account) {
      // Account was found
      if (account.token != token) return false; // Account was a different account and not the current user's
    }
  }
  return str.length > 4 && str.length < 15;
}

function validatePassword(str) {
  const chars = str.split("");
  if (chars.includes(" ")) {
    throw new Error("Password can't have any spaces!");
  }

  if (!str.match(/[A-Z]/g)) {
    throw new Error("Password must have at least one capital letter!");
  }

  if (!str.match(/[a-z]/g)) {
    throw new Error("Password must have at least one lowercase letter!");
  }

  if (!str.match(/[0-9]/g)) {
    throw new Error("Password must have at least one digit!");
  }

  if (!str.match(/[!@#$%^&*()]/g)) {
    throw new Error("Password must have at least one special character!");
  }

  return true;
}

// Gets the account's index of the database
// Then gets the field and changes it with the value provided in the parameter
function editAccount(index, fields, values) {
  console.log(fields, values);
  if (fields.length != values.length) {
    throw new Error("Fields and values array length must be equal!");
  }
  const db = getDb();
  const account = db[index];
  if (!account) {
    throw new Error("Invalid index provided!");
  }

  const validFields = [
    "username",
    "password",
    "email",
    "avatarBase",
    "token",
    "Todos",
  ];
  for (const field of fields) {
    if (!validFields.includes(field)) {
      throw new Error(field + " is not a valid field option!");
    }
  }

  try {
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      account[field] = values[i];
    }
    updateDb(db);
    return account;
  } catch (e) {
    throw new Error(`error has occured trying to change values, ${e?.message}`);
  }
}

function validateToken(token) {
  const db = getDb();
  // Checks if account exist with token already!
  if (findDb(["token"], [token])) {
    return false;
  }
  return true;
}

function alertMessage(str, color) {
  if (document.querySelector("#alertMessage")) {
    document.querySelector("#alertMessage").remove();
  }
  const div = document.createElement("div");
  div.style.backgroundColor = color;
  div.style.marginTop = "10px";
  div.id = "alertMessage";
  const messageElement = document.createElement("h1");
  messageElement.id = "alertContent";
  div.appendChild(messageElement);
  messageElement.textContent = str;
  document.body.appendChild(div);
}

export {
  editAccount,
  setItem,
  getDb,
  updateDb,
  findDb,
  insertDb,
  deleteDb,
  validateToken,
  validatePassword,
  validateUsername,
  removeExtraSpaces,
  generateToken,
  alertMessage,
  getIndexes,
  createTodo,
  deleteTodo,
};
