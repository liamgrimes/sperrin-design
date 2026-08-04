document.addEventListener("DOMContentLoaded", loadCollections);

function loadCollections() {
  const grid = document.querySelector("#collection-grid");

  if (!grid) return;

  const collections = window.SPERRIN_COLLECTIONS.COLLECTIONS;
  const collection = collections.find(item => item.slug === "fw25");

  if (!collection) {
    console.error("Collection not found");
    return;
  }

  collection.pieces.forEach(piece => {
    grid.appendChild(createPieceCard(piece));
  });
}

function createPieceCard(piece) {
  const article = document.createElement("article");
  article.className = "product-card";

  article.innerHTML = `
    <div class="product-photo">
      <img 
        src="${piece.images[0]}" 
        alt="${piece.name}"
        loading="lazy"
      >
    </div>

    <div class="product-body">
      <h2 class="product-name">${piece.name}</h2>
      <p class="product-desc">${piece.description}</p>
    </div>
  `;

  return article;
}