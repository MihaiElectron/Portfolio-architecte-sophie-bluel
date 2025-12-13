// assets/js/components/auth.js

import { isLoggedIn, logout } from '../api/authApi.js';

/**
 * Met à jour l'affichage du menu selon l'état de connexion
 */
export function updateNavigation() {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    
    if (!loginLink) {
        console.error('Lien login introuvable');
        return;
    }
    
    if (isLoggedIn()) {
        // Utilisateur connecté : affiche "logout"
        loginLink.textContent = 'logout';
        loginLink.href = '#';
        
        // Ajoute l'événement de déconnexion
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    } else {
        // Utilisateur non connecté : affiche "login"
        loginLink.textContent = 'login';
        loginLink.href = 'login.html';
    }
}

