// assets/js/components/modal.js

import { deleteWork } from '../api/worksApi.js';

let modalWorks = [];

/**
 * Initialise la modale
 * @param {Array} works - Liste des projets
 */
export function initModal(works) {
    modalWorks = works;
    createModalHTML();
    setupModalEvents();
}

/**
 * Crée la structure HTML de la modale
 */
function createModalHTML() {
    const modalHTML = `
        <div id="modal-overlay" class="modal-overlay">
            <div class="modal">
                <button class="modal-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h3>Galerie photo</h3>
                <div class="modal-gallery"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Configure les événements de la modale
 */
function setupModalEvents() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.querySelector('.modal-close');
    const modal = document.querySelector('.modal');
    
    // Ferme au clic sur l'overlay
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal();
        }
    });
    
    // Ferme au clic sur la croix
    closeBtn.addEventListener('click', closeModal);
    
    // Empêche la fermeture au clic dans la modale
    modal.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

/**
 * Ouvre la modale
 */
export function openModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('active');
    displayModalWorks();
}

/**
 * Ferme la modale
 */
function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
}

/**
 * Affiche les projets dans la modale
 */
function displayModalWorks() {
    const modalGallery = document.querySelector('.modal-gallery');
    modalGallery.innerHTML = '';
    
    modalWorks.forEach(work => {
        const figure = document.createElement('figure');
        figure.className = 'modal-work';
        figure.dataset.workId = work.id;
        
        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-work-btn';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteBtn.addEventListener('click', () => handleDeleteWork(work.id));
        
        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    });
}

/**
 * Gère la suppression d'un projet
 * @param {number} workId - ID du projet à supprimer
 */
async function handleDeleteWork(workId) {
    if (!confirm('Voulez-vous vraiment supprimer ce projet ?')) {
        return;
    }
    
    try {
        await deleteWork(workId);
        
        // Retire le projet de la liste
        modalWorks = modalWorks.filter(work => work.id !== workId);
        
        // Met à jour l'affichage de la modale
        displayModalWorks();
        
        // Met à jour la galerie principale
        const figure = document.querySelector(`.gallery figure[data-work-id="${workId}"]`);
        if (figure) {
            figure.remove();
        }
        
        console.log('Projet supprimé avec succès');
        
    } catch (error) {
        alert('Erreur lors de la suppression du projet');
        console.error(error);
    }
}