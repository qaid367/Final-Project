import { getDb, insertDb, updateDb } from "./Utils.js";

const db = getDb();

async function submitForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  console.log(formData)
}

export { submitForm };
