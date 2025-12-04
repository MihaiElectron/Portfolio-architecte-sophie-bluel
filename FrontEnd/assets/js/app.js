// assets/js/app.js

import { getWorks, getCategories } from './api/worksApi.js';
import { displayWorks, filterWorksByCategory } from './components/gallery.js';
import { createFilters, handleFilterClick } from './components/filters.js';
import { updateNavigation } from './components/auth.js';
import { isLoggedIn } from './api/authApi.js';
import { initModal, openModal } from './components/modal.js';

async function init() {
    console.log('1. app.js - Début de init()');
    
    updateNavigation();
    
    try {
        const galleryContainer = document.querySelector('.gallery');
        const filtersContainer = document.querySelector('.filters');
        const portfolioSection = document.getElementById('portfolio');
        
        if (!galleryContainer) {
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
        
        // Gestion en mode connecté ou non
        if (isLoggedIn()) {
            // Mode admin : pas de filtres, bouton modifier
            if (filtersContainer) {
                filtersContainer.style.display = 'none';
            }
            
            // Ajoute le bouton "modifier"
            addEditButton(portfolioSection);
            
            // Initialise la modale
            initModal(works, categories);
            
        } else {
            // Mode visiteur : filtres visibles
            if (filtersContainer) {
                filtersContainer.style.display = 'flex';
                createFilters(categories, filtersContainer);
                handleFilterClick(filtersContainer, (categoryId) => {
                    filterWorksByCategory(works, categoryId, galleryContainer);
                });
            }
        }
        
        console.log('Projets chargés avec succès:', works.length);
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        
        const galleryContainer = document.querySelector('.gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = '<p>Erreur lors du chargement des projets.</p>';
        }
    }
}

/**
 * Ajoute le bouton "modifier" à côté du titre
 */
function addEditButton(portfolioSection) {
    const title = portfolioSection.querySelector('h2');
    
    if (!title) return;
    
    // Crée un conteneur pour le titre et le bouton
    const titleContainer = document.createElement('div');
    titleContainer.className = 'portfolio-header';
    
    // Déplace le titre dans le conteneur
    title.parentNode.insertBefore(titleContainer, title);
    titleContainer.appendChild(title);
    
    // Crée le bouton modifier
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier';
    
    editButton.addEventListener('click', () => {
        openModal();
    });
    
    titleContainer.appendChild(editButton);
}

init();