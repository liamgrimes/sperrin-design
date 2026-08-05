/*
    Sperrin Design - Collections

    Handles:
    - Collections overview page
    - Individual collection pages
    - Collection cards
    - Collection piece cards
*/


document.addEventListener("DOMContentLoaded", () => {
    loadCollections();
    loadCollectionPage();
});


// ------------------------------------------------
// Collections overview page
// ------------------------------------------------

function loadCollections() {

    const grid = document.querySelector("#collections-grid");

    if (!grid) return;


    window.SPERRIN_COLLECTIONS.COLLECTIONS.forEach(collection => {
        grid.appendChild(createCollectionCard(collection));
    });
}


// Creates collection preview cards

function createCollectionCard(collection) {

    const article = document.createElement("article");

    article.className = "collection-card";


    article.innerHTML = `
        <img
            src="${collection.coverImage}"
            alt="${collection.name}"
            class="collection-cover"
        >

        <div class="collection-body">

            <h2>${collection.name}</h2>

            <p>
                ${collection.description}
            </p>

            <button class="collection-button">
                View Collection
            </button>

        </div>
    `;


    article
        .querySelector("button")
        .addEventListener("click", () => {

            window.location.href =
                `collection.html?collection=${collection.slug}`;

        });


    return article;
}


// ------------------------------------------------
// Individual collection page
// ------------------------------------------------

function loadCollectionPage() {

    const gallery = document.querySelector("#collection-gallery");

    if (!gallery) return;


    const params = new URLSearchParams(
        window.location.search
    );


    const slug = params.get("collection");


    const collection =
        window.SPERRIN_COLLECTIONS.COLLECTIONS.find(
            item => item.slug === slug
        );


    if (!collection) return;


    document.querySelector("#collection-title").textContent =
        collection.name;


    document.querySelector("#collection-description").textContent =
        collection.description;


    collection.pieces.forEach(piece => {

        gallery.appendChild(
            createPieceCard(piece)
        );

    });
}


// Creates individual piece cards

function createPieceCard(piece) {

    const article = document.createElement("article");

    article.className = "collection-piece";


    article.innerHTML = `
        <img
            src="${piece.images[0]}"
            alt="${piece.name}"
        >

        <div class="piece-info">

            <h2>${piece.name}</h2>

            <p>
                ${piece.description}
            </p>

            <p>
                Photographer: ${piece.photographer}
            </p>

            <p>
                Model: ${piece.model}
            </p>

        </div>
    `;


    return article;
}