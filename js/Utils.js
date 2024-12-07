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

function setItem(key, value) {
  if (!key || !value) throw new Error("Invalid arguments!");
  localStorage.setItem(key, value);
  return value;
}

function insertDb(data) {
  const db = getDb(); // an array of objects of accounts;
  if (!data.password || !data.email || !data.username)
    throw new Error("Invalid arguments!");
  db.push(data);
  return updateDb(db);
}

/**
 *
 * @param {string} field The field to search, (e.g: username, password, email)
 * @param {string} query the value of the field
 */
function findDb(field, query) {
  const db = getDb();
  if (!db) {
    return null;
  }

  const accounts = [];

  for (const account of db) {
    if (account[field] == query) {
      accounts.push(account);
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

export { setItem, getDb, updateDb, findDb, insertDb, deleteDb };
