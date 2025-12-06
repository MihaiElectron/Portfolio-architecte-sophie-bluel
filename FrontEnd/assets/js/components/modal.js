// assets/js/components/modal.js

import { deleteWork, createWork } from '../api/worksApi.js';
import { getAuthToken } from '../api/authApi.js';

let modalWorks = [];
let modalCategories = [];

/**
 * Initialise la modale
 */
export function initModal(works, categories) {
    modalWorks = works;
    modalCategories = categories;
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
                <button class="modal-back" style="display: none;">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <button class="modal-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                
                <!-- Vue Galerie -->
                <div class="modal-gallery-view">
                    <h3 class="modal-title">Galerie photo</h3>
                    <div class="modal-gallery"></div>               
                    <hr class="separator">
                    <button class="modal-add-photo-btn">Ajouter une photo</button>
                </div>
                
                <!-- Vue Ajout Photo -->
                <div class="modal-add-view" style="display: none;">
                    <h3 class="modal-title">Ajout photo</h3>
                    <form id="add-work-form" class="add-work-form">
                        <div class="photo-upload">
                            <i class="fa-regular fa-image upload-icon"></i>
                            <label for="photo-input" class="photo-label">+ Ajouter photo</label>
                            <input type="file" id="photo-input" accept="image/png, image/jpeg" style="display: none;">
                            <p class="photo-info">jpg, png : 4mo max</p>
                            <img id="photo-preview" class="photo-preview" style="display: none;">
                        </div>
                        
                        <div class="form-group">
                            <label for="work-title">Titre</label>
                            <input type="text" id="work-title" name="title" class="form-field" required>

                            <label for="work-category">Catégorie</label>
                            <select id="work-category" name="category" class="form-field" required>
                                <option value=""></option>
                            </select>
                        </div>
                        
                        <hr class="form-add-separator">
                        
                        <button type="submit" class="modal-validate-btn">Valider</button>
                    </form>
                </div>
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
    const backBtn = document.querySelector('.modal-back');
    const modal = document.querySelector('.modal');
    const gallery = document.querySelector('.modal-gallery');
    const addPhotoBtn = document.querySelector('.modal-add-photo-btn');

    if (!overlay || !closeBtn || !backBtn || !modal || !gallery || !addPhotoBtn) {
        console.error('Éléments de la modale introuvables');
        return;
    }

    // Bloque tous les drags
    gallery.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    }, true); // ← true = capture phase

    // Ferme au clic sur l'overlay
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeModal();
        }
    });

    // Ferme au clic sur la croix
    closeBtn.addEventListener('click', closeModal);

    // Retour à la galerie
    backBtn.addEventListener('click', showGalleryView);

    // Passe à la vue ajout
    addPhotoBtn.addEventListener('click', showAddView);

    // Empêche la fermeture au clic dans la modale
    modal.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Configure le formulaire d'ajout
    setupAddWorkForm();
}

/**
 * Ouvre la modale (vue galerie)
 */
export function openModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) {
        console.error('Modal overlay introuvable');
        return;
    }
    overlay.classList.add('active');
    showGalleryView();
}

/**
 * Ferme la modale
 */
function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
}

/**
 * Affiche la vue galerie
 */
function showGalleryView() {
    const galleryView = document.querySelector('.modal-gallery-view');
    const addView = document.querySelector('.modal-add-view');
    const backBtn = document.querySelector('.modal-back');
    
    if (!galleryView || !addView || !backBtn) return;
    
    galleryView.style.display = 'block';
    addView.style.display = 'none';
    backBtn.style.display = 'none';
    
    displayModalWorks();
}

/**
 * Affiche la vue ajout photo
 */
function showAddView() {
    const galleryView = document.querySelector('.modal-gallery-view');
    const addView = document.querySelector('.modal-add-view');
    const backBtn = document.querySelector('.modal-back');
    
    if (!galleryView || !addView || !backBtn) return;
    
    galleryView.style.display = 'none';
    addView.style.display = 'block';
    backBtn.style.display = 'block';
    
    populateCategorySelect();
    resetAddWorkForm();
}

/**
 * Affiche les projets dans la modale
 */
function displayModalWorks() {
    const modalGallery = document.querySelector('.modal-gallery');
    if (!modalGallery) {
        console.error('Modal gallery introuvable');
        return;
    }
    
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
 * Remplit le select des catégories
 */
function populateCategorySelect() {
    const select = document.getElementById('work-category');
    if (!select) return;
    
    select.innerHTML = '<option value=""></option>';
    
    modalCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

/**
 * Configure le formulaire d'ajout
 */
function setupAddWorkForm() {
    const form = document.getElementById('add-work-form');
    const photoInput = document.getElementById('photo-input');
    const titleInput = document.getElementById('work-title');
    const categorySelect = document.getElementById('work-category');
    
    if (!form || !photoInput || !titleInput || !categorySelect) return;

    // Gestion de l'upload de photo
    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const photoPreview = document.getElementById('photo-preview');
        const photoUpload = document.querySelector('.photo-upload');
        
        if (!file || !photoPreview || !photoUpload) return;
        
        // Vérifie la taille (4Mo max)
        if (file.size > 4 * 1024 * 1024) {
            alert('La photo ne doit pas dépasser 4Mo');
            photoInput.value = '';
            return;
        }
        
        // Affiche la preview
        const reader = new FileReader();
        reader.onload = (e) => {
            photoPreview.src = e.target.result;
            photoPreview.style.display = 'block';
            
            // Cache les autres éléments
            const icon = photoUpload.querySelector('.upload-icon');
            const label = photoUpload.querySelector('.photo-label');
            const info = photoUpload.querySelector('.photo-info');
            
            if (icon) icon.style.display = 'none';
            if (label) label.style.display = 'none';
            if (info) info.style.display = 'none';
        };
        reader.readAsDataURL(file);
        
        checkFormValidity();
    });
    
    // Vérifie la validité à chaque changement
    titleInput.addEventListener('input', checkFormValidity);
    categorySelect.addEventListener('change', checkFormValidity);
    
    // Soumission du formulaire
    form.addEventListener('submit', handleAddWork);
}

/**
 * Vérifie si le formulaire est valide
 */
function checkFormValidity() {
    const photoInput = document.getElementById('photo-input');
    const titleInput = document.getElementById('work-title');
    const categorySelect = document.getElementById('work-category');
    const validateBtn = document.querySelector('.modal-add-view .modal-validate-btn');
    
    if (!photoInput || !titleInput || !categorySelect || !validateBtn) return;
    
    const isValid = photoInput.files.length > 0 
                    && titleInput.value.trim() !== '' 
                    && categorySelect.value !== '';
    
    validateBtn.disabled = !isValid;
     
    // Change la couleur selon la validité
    if (isValid) {
        validateBtn.style.backgroundColor = '#1D6154';
        validateBtn.style.borderColor = '#1D6154';
    } else {
        validateBtn.style.backgroundColor = '#A7A7A7';
        validateBtn.style.borderColor = '#A7A7A7';
    }
}

/**
 * Affiche un message de succès
 */
function showSuccessMessage() {
    const addView = document.querySelector('.modal-add-view');
    const title = addView.querySelector('.modal-title');
    
    // Vérifie si le message n'existe pas déjà
    let successMsg = addView.querySelector('.success-message');
    if (successMsg) {
        successMsg.remove();
    }
    
    // Crée le message de succès
    successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.innerHTML = `
        <p>Votre changement a été effectué</p>
        <i class="fa-solid fa-circle-check"></i>
    `;
    
    // Insère après le titre
    title.insertAdjacentElement('afterend', successMsg);
    
    // Disparaît après 3 secondes
    setTimeout(() => {
        successMsg.style.opacity = '0';
        setTimeout(() => successMsg.remove(), 300);
    }, 3000);
}

/**
 * Gère l'ajout d'un nouveau projet
 */
async function handleAddWork(event) {
    event.preventDefault();
    
    const photoInput = document.getElementById('photo-input');
    const titleInput = document.getElementById('work-title');
    const categorySelect = document.getElementById('work-category');
    
    if (!photoInput.files[0]) return;
    
    const formData = new FormData();
    formData.append('image', photoInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categorySelect.value);
    
    try {
        const token = getAuthToken();
        
        if (!token) {
            alert("Vous n'êtes pas connecté !");
            return;
        }

        // 1 Création API
        const newWork = await createWork(formData);
        
        // 2 Ajout dans tableau modale
        modalWorks.push(newWork);
        
        // 3 Rafraîchir affichage modale
        displayModalWorks();
        
        // 4 Ajouter dans galerie principale
        const mainGallery = document.querySelector('.gallery');
        if (mainGallery) {
            const figure = document.createElement('figure');
            figure.dataset.workId = newWork.id;
            figure.dataset.categoryId = newWork.categoryId;

            const img = document.createElement('img');
            img.src = newWork.imageUrl;
            img.alt = newWork.title;

            const caption = document.createElement('figcaption');
            caption.textContent = newWork.title;

            figure.appendChild(img);
            figure.appendChild(caption);
            mainGallery.appendChild(figure);
        }

        // 5 Affiche le message de succès
        showSuccessMessage();
        
        // 6 Réinitialiser formulaire
        resetAddWorkForm();
        
        // 7 Retour à la galerie après 2 secondes
        setTimeout(() => {
            showGalleryView();
        }, 2000);
        
    } catch (error) {
        alert("Erreur lors de l'ajout du projet");
        console.error(error);
    }
}


/**
 * Réinitialise le formulaire
 */
function resetAddWorkForm() {
    const form = document.getElementById('add-work-form');
    const photoPreview = document.getElementById('photo-preview');
    const photoUpload = document.querySelector('.photo-upload');
    
    if (!form || !photoPreview || !photoUpload) return;
    
    form.reset();
    photoPreview.style.display = 'none';
    
    const icon = photoUpload.querySelector('.upload-icon');
    const label = photoUpload.querySelector('.photo-label');
    const info = photoUpload.querySelector('.photo-info');
    
    if (icon) icon.style.display = 'block';
    if (label) label.style.display = 'block';
    if (info) info.style.display = 'block';
    
    checkFormValidity();
}

/**
 * Gère la suppression d'un projet (sans confirm)
 */
async function handleDeleteWork(workId) {
    try {
        // 1 Suppression via API
        await deleteWork(workId);

        // 2 Mise à jour du tableau modale
        modalWorks = modalWorks.filter(work => work.id !== workId);
        displayModalWorks();

        // 3 Suppression dans la galerie principale
        const figure = document.querySelector(`.gallery figure[data-work-id="${workId}"]`);
        if (figure) {
            figure.remove();
        }

        // 4 Affiche le message visuel de suppression
        showDeleteMessage();

    } catch (error) {
        alert('Erreur lors de la suppression du projet');
        console.error(error);
    }
}

/**
 * Affiche un message de suppression réussie
 */
function showDeleteMessage() {
    const galleryView = document.querySelector('.modal-gallery-view');
    const title = galleryView.querySelector('.modal-title');
    
    // Vérifie si le message n'existe pas déjà
    let deleteMsg = galleryView.querySelector('.delete-message');
    if (deleteMsg) {
        deleteMsg.remove();
    }
    
    // Crée le message de suppression
    deleteMsg = document.createElement('div');
    deleteMsg.className = 'delete-message';
    deleteMsg.innerHTML = `
        <p>Le projet a été supprimé</p>
        <i class="fa-solid fa-circle-check"></i>
    `;
    
    // Insère après le titre
    title.insertAdjacentElement('afterend', deleteMsg);
    
    // Disparaît après 3 secondes
    setTimeout(() => {
        deleteMsg.style.opacity = '0';
        setTimeout(() => deleteMsg.remove(), 300);
    }, 3000);
}