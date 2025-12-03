// assets/js/api/authApi.js

import { API_URL } from './api.js';

/**
 * Authentifie un utilisateur
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{userId: number, token: string}>}
 */
export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 404) {
                throw new Error('Erreur dans l\'identifiant ou le mot de passe');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        // Stocke le token et userId
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.userId);
        
        return data;
        
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
}

/**
 * Déconnecte l'utilisateur
 */
export function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean}
 */
export function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

/**
 * Récupère le token d'authentification
 * @returns {string|null}
 */
export function getAuthToken() {
    return localStorage.getItem('authToken');
}