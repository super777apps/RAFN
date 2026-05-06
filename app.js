import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allProducts = [];

async function loadData() {
  const productSnap = await getDocs(collection(db, "products"));
  allProducts = productSnap.docs.map(doc => doc.data());

  renderCategories();
  renderProducts(allProducts);
}

function renderCategories() {
  const sidebar = document.getElementById("sidebar");

  const categories = [...new Set(allProducts.map(p => p.category))];

  sidebar.innerHTML = "";

  categories.forEach(cat => {
    const catDiv = document.createElement("div");
    catDiv.innerHTML = `<h3>${cat}</h3>`;
    
    const subs = [...new Set(
      allProducts
        .filter(p => p.category === cat)
        .map(p => p.subcategory)
    )];

    subs.forEach(sub => {
      const subDiv = document.createElement("div");
      subDiv.innerText = "→ " + sub;
      subDiv.style.cursor = "pointer";

      subDiv.onclick = () => {
        const filtered = allProducts.filter(
          p => p.category === cat && p.subcategory === sub
        );

        document.getElementById("title").innerText = sub;
        renderProducts(filtered);
      };

      catDiv.appendChild(subDiv);
    });

    sidebar.appendChild(catDiv);
  });
}

function getPrice(pricing, qty = 1) {
  const tier = pricing.find(p =>
    qty >= p.min && (p.max === null || qty <= p.max)
  );
  return tier ? tier.price : 0;
}

function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    const price = getPrice(p.pricing, 1);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.image}" />
      <h4>${p.name}</h4>
      <p>${p.description}</p>
      <p>From $${price}</p>

      <a target="_blank"
        href="https://wa.me/923XXXXXXXXX?text=I want this product: ${p.name}">
        Buy on WhatsApp
      </a>
    `;

    container.appendChild(div);
  });
}

loadData();