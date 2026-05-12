import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= CLOUDINARY ================= */

const CLOUD_NAME = "dc65psg8b";
const UPLOAD_PRESET = "ml_default";

/* ================= VARIABLES ================= */

let editId = null;
let productsCache = [];
let filteredProducts = [];

/* ================= IMAGE UPLOAD ================= */

async function uploadImage(file) {

  const url =
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

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

/* ================= SAVE PRODUCT ================= */

async function saveProduct() {

  const name =
    document.getElementById("name").value;

  const category =
    document.getElementById("category").value;

  const subcategory =
    document.getElementById("subcategory").value;

  const description =
    document.getElementById("description").value;
    
    const pricing =
  document.getElementById("pricing").value;

  const file =
    document.getElementById("image").files[0];

  let imageUrl =
    document.getElementById("preview")?.src || "";

  /* upload image */
  if (file) {
    imageUrl = await uploadImage(file);
  }

  
  const data = {
  name,
  category,
  subcategory,
  description,
  pricing,
  image: imageUrl
};
  
  

  /* UPDATE */
  if (editId) {

    await updateDoc(
      doc(db, "products", editId),
      data
    );

    alert("Product Updated!");

    editId = null;

    document.getElementById("saveBtn").innerText =
      "Add Product";

  } else {

    /* ADD */
    await addDoc(
      collection(db, "products"),
      data
    );

    alert("Product Added!");
  }

  /* CLEAR FORM */
  document.getElementById("name").value = "";
  document.getElementById("category").value = "";
  document.getElementById("subcategory").value = "";
  document.getElementById("description").value = "";
  
  
  document.getElementById("pricing").value = "";
  
  
  document.getElementById("image").value = "";

  const preview =
    document.getElementById("preview");

  if (preview) {
    preview.src = "";
  }

  loadProducts();
}

/* ================= LOAD PRODUCTS ================= */

async function loadProducts() {

  const snap =
    await getDocs(collection(db, "products"));

  productsCache =
    snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

  filteredProducts = [...productsCache];

  renderAdminProducts(filteredProducts);
}

/* ================= RENDER PRODUCTS ================= */

function renderAdminProducts(products) {

  const container =
    document.getElementById("adminList");

  container.innerHTML = "";

  products.forEach(p => {

    const div =
      document.createElement("div");

    div.style.border =
      "1px solid gold";

    div.style.padding =
      "10px";

    div.style.margin =
      "10px 0";

    div.style.borderRadius =
      "10px";

    div.style.background =
      "#111";

    div.innerHTML = `
      <img
        src="${p.image || ''}"
        width="80"
        style="
          border-radius:8px;
          object-fit:cover;
        "
      >

      <br><br>

      <b>${p.name || ''}</b>

      <br>

      ${p.category || ''}
      /
      ${p.subcategory || ''}

      <br><br>

      <button class="editBtn">
        Edit
      </button>

      <button class="deleteBtn">
        Delete
      </button>
    `;

    /* EDIT */
    div.querySelector(".editBtn")
      .onclick = () => {
        editProduct(p.id);
      };

    /* DELETE */
    div.querySelector(".deleteBtn")
      .onclick = () => {
        deleteProduct(p.id);
      };

    container.appendChild(div);
  });
}

/* ================= DELETE ================= */

async function deleteProduct(id) {

  if (confirm("Delete this product?")) {

    await deleteDoc(
      doc(db, "products", id)
    );

    loadProducts();
  }
}

/* ================= EDIT ================= */

function editProduct(id) {

  const product =
    productsCache.find(p => p.id === id);

  if (!product) {
    alert("Product not found");
    return;
  }

  document.getElementById("name").value =
    product.name || "";

  document.getElementById("category").value =
    product.category || "";

  document.getElementById("subcategory").value =
    product.subcategory || "";

  document.getElementById("description").value =
    product.description || "";
    
    
    document.getElementById("pricing").value =
  product.pricing || "";
    

  let preview =
    document.getElementById("preview");

  if (!preview) {

    preview =
      document.createElement("img");

    preview.id = "preview";

    preview.style.width = "100px";
    preview.style.marginTop = "10px";
    preview.style.borderRadius = "8px";

    document.body.appendChild(preview);
  }

  preview.src = product.image || "";

  editId = id;

  document.getElementById("saveBtn").innerText =
    "Update Product";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ================= SEARCH ================= */

document.getElementById("searchInput")
  .oninput = function () {

  const value =
    this.value.toLowerCase();

  filteredProducts =
    productsCache.filter(p =>

      p.name?.toLowerCase().includes(value) ||

      p.category?.toLowerCase().includes(value) ||

      p.subcategory?.toLowerCase().includes(value)
    );

  renderAdminProducts(filteredProducts);
};

/* ================= BUTTON EVENT ================= */

document.getElementById("saveBtn")
  .onclick = saveProduct;

/* ================= INIT ================= */

loadProducts();