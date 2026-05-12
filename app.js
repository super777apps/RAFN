import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allProducts = [];

/* ===================== LOAD DATA ===================== */
async function loadData() {
  const snap = await getDocs(collection(db, "products"));
  
  
  allProducts = snap.docs.map(d => ({
  id: d.id,
  ...d.data()
}));



  renderCategories();
  renderProducts(allProducts);
}

/* ===================== CATEGORY SIDEBAR ===================== */
function renderCategories() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";

  const cats = [...new Set(allProducts.map(p => p.category))];

  cats.forEach(cat => {
    const catDiv = document.createElement("div");

    const subs = [...new Set(
      allProducts
        .filter(p => p.category === cat)
        .map(p => p.subcategory)
    )];

    catDiv.innerHTML = `<h3>${cat}</h3>`;

    const subBox = document.createElement("div");
    subBox.style.display = "none";
    subBox.style.paddingLeft = "10px";

    catDiv.querySelector("h3").onclick = () => {
      subBox.style.display = subBox.style.display === "none" ? "block" : "none";
    };

    subs.forEach(sub => {
      const s = document.createElement("div");
      s.innerText = "→ " + sub;
      s.style.cursor = "pointer";

      s.onclick = () => {
        const filtered = allProducts.filter(
          p => p.category === cat && p.subcategory === sub
        );
        renderProducts(filtered);

        // close sidebar after click (mobile UX)
        closeSidebar();
      };

      subBox.appendChild(s);
    });

    catDiv.appendChild(subBox);
    sidebar.appendChild(catDiv);
  });
}

/* ===================== PRICE LOGIC ===================== */
function getPrice(pricing, qty = 1) {
  if (!pricing) return 0;

  const tier = pricing.find(p =>
    qty >= p.min && (p.max === null || qty <= p.max)
  );

  return tier ? tier.price : 0;
}

/* ===================== PRODUCT RENDER ===================== */
function renderProducts(products) {

  const container =
    document.getElementById("products");

  container.innerHTML = "";

  products.forEach(p => {

    const div =
      document.createElement("div");

    div.className = "card";

    div.innerHTML = `
      <img src="${p.image || ''}" />

      <h4>${p.name || ''}</h4>

      <p>${p.description || ''}</p>

      <p class="pricingText">
        ${
          typeof p.pricing === "string"
            ? p.pricing
            : ""
        }
      </p>

      <button class="buy">
        Buy on WhatsApp
      </button>
    `;

    const btn =
      div.querySelector(".buy");

    btn.onclick = () => {

      const msg =
"Product: " + p.name +
"\n\nHello, I want more information about this product.";

      const url =
  "https://wa.me/61400558676?text=" +
  encodeURIComponent(msg);

window.open(url, "_blank");
    };

    container.appendChild(div);
  });
}
/* ===================== SIDEBAR MENU CONTROL ===================== */
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("show");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

menuBtn.onclick = openSidebar;
overlay.onclick = closeSidebar;

/* ===================== INIT ===================== */
loadData();