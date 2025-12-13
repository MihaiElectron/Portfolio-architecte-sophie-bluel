// # Fonctions utilitaires pour la galerie (création, affichage, filtrage)

/**
 * Crée un élément figure pour un projet
 */
function createWorkElement(work) {
    const figure = document.createElement('figure');
    figure.dataset.workId = work.id;
    figure.dataset.categoryId = work.categoryId;
    
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;
    
    figure.appendChild(img);
    figure.appendChild(figcaption);
    
    return figure;
}

/**
 * Affiche les projets dans la galerie
 * @param {Array} works - Tableau des projets à afficher
 * @param {HTMLElement} galleryContainer - L'élément DOM conteneur : document.querySelector('.gallery')
 */
export function displayWorks(works, galleryContainer) {
    // Vide la galerie
    galleryContainer.innerHTML = '';

    console.log('6. gallery.js - Affichage en cours');

    // Utilisation d'un fragment pour limiter les reflows
    const fragment = document.createDocumentFragment();

    works.forEach(work => {
        const workElement = createWorkElement(work);
        fragment.appendChild(workElement);
    });

    // Injection en une seule opération
    galleryContainer.appendChild(fragment);
}

/**
 * Filtre et affiche les projets par catégorie
 */
export function filterWorksByCategory(works, categoryId, galleryContainer) {
    const filteredWorks = categoryId === 0 
        ? works 
        : works.filter(work => work.categoryId === categoryId);
    displayWorks(filteredWorks, galleryContainer);
}
