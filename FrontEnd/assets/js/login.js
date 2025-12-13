// assets/js/login.js

import { login } from './api/authApi.js';

/**
 * Gère la soumission du formulaire de connexion
 */
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    // Récupère les valeurs du formulaire
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Supprime l'ancien message d'erreur s'il existe
    const oldError = document.querySelector('.error-message');
    if (oldError) {
        oldError.remove();
    }
    
    try {
        // Tentative de connexion
        const data = await login(email, password);
        
        console.log('Connexion réussie:', data);
        
        // Redirige vers la page d'accueil
        window.location.href = 'index.html';
        
    } catch (error) {
        // Crée et affiche le message d'erreur
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = error.message;
        
        const form = document.querySelector('#login form');
        form.insertBefore(errorMessage, form.firstChild);
    }
}   

/**
 * Initialise le formulaire de connexion
 */
function initLoginForm() {
    const loginForm = document.querySelector('#login form');
    
    if (!loginForm) {
        console.error('Formulaire de connexion introuvable');
        return;
    }
    
    loginForm.addEventListener('submit', handleLoginSubmit);
}

// Lance l'initialisation
initLoginForm();
