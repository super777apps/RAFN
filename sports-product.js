import { db } from "./firebase.js";

import {
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params =
  new URLSearchParams(
    window.location.search
  );

const id =
  params.get("id");

const container =
  document.getElementById(
    "productContainer"
  );

document
.getElementById("backBtn")
.onclick = () => {

  history.back();
};

if (!id) {

  container.innerHTML =
    "<h3>Product not found</h3>";

} else {

  loadProduct();
}

async function loadProduct() {

  const snap =
    await getDoc(
      doc(
        db,
        "products",
        id
      )
    );

  if (!snap.exists()) {

    container.innerHTML =
      "<h3>Product not found</h3>";

    return;
  }

  const p = snap.data();

  container.innerHTML = `

    <div class="card">

      <img
        src="${p.image || ''}"
        style="
          width:100%;
          border-radius:12px;
        "
      >

      <h2>
        ${p.name || ''}
      </h2>

      <div class="desc">
        ${p.description || ''}
      </div>

      <div class="pricingText">
        ${p.pricing || ''}
      </div>

      <br>

      <button id="waBtn"
        class="buy">
        WhatsApp
      </button>

      <button id="shareBtn"
        class="buy">
        Share
      </button>

      <button id="emailBtn"
        class="buy">
        Email
      </button>

    </div>
  `;

  const productUrl =
    window.location.href;

  document
  .getElementById("waBtn")
  .onclick = () => {

    const text =
      `${p.name}

${productUrl}`;

    window.open(
      "https://wa.me/?text=" +
      encodeURIComponent(text)
    );
  };

  document
  .getElementById("shareBtn")
  .onclick = async () => {

    if (navigator.share) {

      await navigator.share({

        title: p.name,

        text: p.description,

        url: productUrl
      });

    } else {

      alert(
        "Share not supported"
      );
    }
  };

  document
  .getElementById("emailBtn")
  .onclick = () => {

    window.location =
      "mailto:?subject=" +
      encodeURIComponent(
        p.name
      ) +
      "&body=" +
      encodeURIComponent(
        productUrl
      );
  };
}