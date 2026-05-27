import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let allProducts = [];

let currentProducts = [];

let currentPage = 1;

const PRODUCTS_PER_PAGE = 10;

/* ===================== LOAD DATA ===================== */
async function loadData() {
  const snap = await getDocs(collection(db, "products_leather"));
  
  
  allProducts = snap.docs.map(d => ({
  id: d.id,
  ...d.data()
}));



  renderCategories();
  currentProducts = allProducts;

currentPage = 1;

renderProducts(currentProducts);
}

/* ===================== CATEGORY SIDEBAR ===================== */
function renderCategories() {

  const sidebar =
    document.getElementById("sidebar");

  sidebar.innerHTML = "";

  /* ===== PDF BUTTON ===== */

  const pdfDiv =
    document.createElement("div");

  pdfDiv.innerHTML = `
    <h3 class="pdfTitle">
      📥 Download Catalogs
    </h3>
  `;

  pdfDiv.onclick = () => {
    window.location = "catalogs.html";
  };

  sidebar.appendChild(pdfDiv);




const contactBtn =
document.createElement("div");

contactBtn.innerHTML = `
<h3 onclick="window.location='contact.html'">
📞 Contact Us
</h3>
`;

sidebar.appendChild(contactBtn);



const certBtn =
document.createElement("div");

certBtn.innerHTML = `
<h3 onclick="
window.location='certifications.html'">
🏅 Certifications
</h3>
`;

sidebar.appendChild(certBtn);



  /* ===== NORMAL CATEGORIES ===== */

  const cats =
    [...new Set(
      allProducts.map(p => p.category)
    )];

  cats.forEach(cat => {

    const catDiv =
      document.createElement("div");

    const subs =
      [...new Set(
        allProducts
          .filter(p => p.category === cat)
          .map(p => p.subcategory)
      )];

    catDiv.innerHTML = `
      <h3>${cat}</h3>
    `;

    const subBox =
      document.createElement("div");

    subBox.style.display = "none";
    subBox.style.paddingLeft = "10px";

    catDiv.querySelector("h3")
      .onclick = () => {

      subBox.style.display =
        subBox.style.display === "none"
        ? "block"
        : "none";
    };

    subs.forEach(sub => {

      const s =
        document.createElement("div");

      s.innerText = "→ " + sub;

      s.style.cursor = "pointer";

      s.onclick = () => {

        const filtered =
          allProducts.filter(
            p =>
              p.category === cat &&
              p.subcategory === sub
          );

        currentProducts = filtered;

        currentPage = 1;

        renderProducts(currentProducts);

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

  /* IMPORTANT */
  container.innerHTML = "";

  const start =
    (currentPage - 1) *
    PRODUCTS_PER_PAGE;

  const end =
    start + PRODUCTS_PER_PAGE;

  const paginatedProducts =
    products.slice(start, end);

  paginatedProducts.forEach(p => {

    const div =
      document.createElement("div");

    div.className = "card";

    div.innerHTML = `
      <img src="${p.image || ''}" />

      <h4>${p.name || ''}</h4>

      <div class="desc">
        ${p.description || ''}
      </div>

      <div class="pricingText">
        ${
          typeof p.pricing === "string"
            ? p.pricing
            : ""
        }
      </div>

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

  /* ===== PAGINATION ===== */

  const totalPages =
    Math.ceil(
      products.length /
      PRODUCTS_PER_PAGE
    );

  if (totalPages > 1) {

    const nav =
      document.createElement("div");

    nav.className = "pagination";

    nav.innerHTML = `
      <button id="prevPage"
        ${currentPage === 1 ? "disabled" : ""}>
        Previous
      </button>

      <span>
        Page ${currentPage}
        of
        ${totalPages}
      </span>

      <button id="nextPage"
        ${currentPage === totalPages ? "disabled" : ""}>
        Next
      </button>
    `;

    container.appendChild(nav);

    document.getElementById("prevPage")
      .onclick = () => {

      if (currentPage > 1) {

        currentPage--;

        renderProducts(products);

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    };

    document.getElementById("nextPage")
      .onclick = () => {

      if (
        currentPage < totalPages
      ) {

        currentPage++;

        renderProducts(products);

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
    };
  }
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