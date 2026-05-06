import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.saveProduct = async function () {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const subcategory = document.getElementById("subcategory").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;

  await addDoc(collection(db, "products"), {
    name,
    category,
    subcategory,
    description,
    image,
    pricing: [
      { min: 1, max: 10, price: 10 },
      { min: 11, max: null, price: 8 }
    ]
  });

  alert("Product added!");
};