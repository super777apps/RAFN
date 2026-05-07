import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const CLOUD_NAME = "dc65psg8b";
const UPLOAD_PRESET = "ml_default";

let editId = null;

/* ================= IMAGE UPLOAD ================= */
async function uploadImage(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: form
  });

  const data = await res.json();
  return data.secure_url;
}

/* ================= SAVE / UPDATE ================= */
window.saveProduct = async function () {
  const name = document.getElementById("name").value;
  const category = document.getElementById("category").value;
  const subcategory = document.getElementById("subcategory").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("image").files[0];

  let imageUrl = document.getElementById("preview")?.src || "";

  if (file) {
    imageUrl = await uploadImage(file);
  }

  const data = {
    name,
    category,
    subcategory,
    description,
    image: imageUrl,
    pricing: [
      { min: 1, max: 10, price: 10 },
      { min: 11, max: null, price: 8 }
    ]
  };

  if (editId) {
    await updateDoc(doc(db, "products", editId), data);
    alert("Updated!");
    editId = null;
  } else {
    await addDoc(collection(db, "products"), data);
    alert("Added!");
  }

  loadProducts();
};

/* ================= LOAD PRODUCTS ================= */
async function loadProducts() {
  const snap = await getDocs(collection(db, "products"));

  const container = document.getElementById("adminList");
  container.innerHTML = "";

  snap.forEach(d => {
    const p = { id: d.id, ...d.data() };

    const div = document.createElement("div");
    div.style.border = "1px solid gold";
    div.style.padding = "10px";
    div.style.margin = "10px 0";

    div.innerHTML = `
      <img src="${p.image}" width="80"><br>
      <b>${p.name}</b><br>
      ${p.category} / ${p.subcategory}<br>

      <button onclick="editProduct('${p.id}')">Edit</button>
      <button onclick="deleteProduct('${p.id}')">Delete</button>
    `;

    container.appendChild(div);
  });
}

/* ================= DELETE ================= */
window.deleteProduct = async function (id) {
  if (confirm("Delete this product?")) {
    await deleteDoc(doc(db, "products", id));
    loadProducts();
  }
};

/* ================= EDIT ================= */
window.editProduct = async function (id) {
  const snap = await getDocs(collection(db, "products"));
  const product = snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .find(p => p.id === id);

  if (!product) return;

  document.getElementById("name").value = product.name;
  document.getElementById("category").value = product.category;
  document.getElementById("subcategory").value = product.subcategory;
  document.getElementById("description").value = product.description;

  let preview = document.getElementById("preview");

  if (!preview) {
    preview = document.createElement("img");
    preview.id = "preview";
    preview.style.width = "100px";
    document.body.appendChild(preview);
  }

  preview.src = product.image;

  editId = id;
};

/* ================= INIT ================= */
loadProducts();