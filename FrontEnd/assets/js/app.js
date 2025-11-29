// # Point d'entrée principal //

import { getWorks, getCategories } from './api/worksApi.js';
import { displayWorks } from './components/gallery.js';

/**
 * Initialise l'application
 */
async function init() {
    console.log('1. app.js - Début de init()');
    try {
        // Récupère le conteneur de la galerie
        const galleryContainer = document.querySelector('.gallery');
        
        if (!galleryContainer) {
            console.error('Conteneur .gallery introuvable');
            return;
        }
        
        // Affiche un message de chargement
        galleryContainer.innerHTML = '<p>Chargement des projets...</p>';
        
        // Récupère les données depuis l'API
        const works = await getWorks();
        console.log('4. app.js - Données reçues', works);
        
        // Affiche les projets dans la galerie
        displayWorks(works, galleryContainer);
        console.log('6. app.js - Affichage terminé');
        
        console.log('Projets chargés avec succès:', works.length);
        
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        
        const galleryContainer = document.querySelector('.gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = '<p>Erreur lors du chargement des projets.</p>';
        }
    }
}

// Lance l'application quand le DOM est prêt
init();