import { getWorks, getCategories } from './api/worksApi.js';
import { displayWorks, filterWorksByCategory } from './components/gallery.js';
import { createFilters, handleFilterClick } from './components/filters.js';
import { updateNavigation } from './components/auth.js';

async function init() {
    console.log('1. app.js - Début de init()');

     // Met à jour le menu de navigation
     updateNavigation();
    
    try {
        const galleryContainer = document.querySelector('.gallery');
        const filtersContainer = document.querySelector('.filters');
        
        if (!galleryContainer || !filtersContainer) {
            console.error('Conteneurs introuvables');
            return;
        }
        
        galleryContainer.innerHTML = '<p>Chargement des projets...</p>';
        
        const [works, categories] = await Promise.all([
            getWorks(),
            getCategories()
        ]);
        
        console.log('5. app.js - Données reçues', works, categories);
        
        displayWorks(works, galleryContainer);
        console.log('7. app.js - Affichage terminé');
        
        // Crée les filtres
        createFilters(categories, filtersContainer);
        
        // Gère les clics
        handleFilterClick(filtersContainer, (categoryId) => {
            filterWorksByCategory(works, categoryId, galleryContainer);
        });
        
        console.log('Projets chargés avec succès:', works.length);
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        
        const galleryContainer = document.querySelector('.gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = '<p>Erreur lors du chargement des projets.</p>';
        }
    }
}

init();
