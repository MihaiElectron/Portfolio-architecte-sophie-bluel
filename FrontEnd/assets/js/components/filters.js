// assets/js/components/filters.js

/**
 * Crée les boutons de filtre
 * @param {Array} categories - Tableau des catégories depuis l'API
 * @param {HTMLElement} filtersContainer - Conteneur .filters
 */
export function createFilters(categories, filtersContainer) {
    // Vide le conteneur
    filtersContainer.innerHTML = '';
    
    // Bouton "Tous" (actif par défaut)
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.textContent = 'Tous';
    allButton.dataset.categoryId = '0';
    filtersContainer.appendChild(allButton);
    
    // Boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category.name;
        button.dataset.categoryId = category.id;
        filtersContainer.appendChild(button);
    });
}

/**
 * Gère les clics sur les filtres
 * @param {HTMLElement} filtersContainer - Conteneur .filters
 * @param {Function} onFilterClick - Callback au clic
 */
export function handleFilterClick(filtersContainer, onFilterClick) {
    filtersContainer.addEventListener('click', (event) => {
        if (!event.target.classList.contains('filter-btn')) return;
        
        // Retire active de tous les boutons
        filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ajoute active au bouton cliqué
        event.target.classList.add('active');
        
        // Appelle le callback avec l'ID de catégorie
        const categoryId = parseInt(event.target.dataset.categoryId);
        onFilterClick(categoryId);
    });
}