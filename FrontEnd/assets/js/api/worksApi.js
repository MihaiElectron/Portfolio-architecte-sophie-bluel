// assets/js/api/worksApi.js

import { fetchData, API_URL } from './api.js';
import { getAuthToken } from './authApi.js';

/**
 * Récupère tous les projets
 */
export async function getWorks() {
    console.log('2. worksApi.js - Appel de getWorks()');
    return fetchData('/works');
}

/**
 * Récupère toutes les catégories
 */
export async function getCategories() {
    return fetchData('/categories');
}

/**
 * Supprime un projet (nécessite authentification)
 * @param {number} workId - ID du projet à supprimer
 */
export async function deleteWork(workId) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Vous devez être connecté pour supprimer un projet');
    }
    
    try {
        const response = await fetch(`${API_URL}/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
    }
}

/**
 * Ajoute un nouveau projet (nécessite authentification)
 * @param {FormData} formData - Données du formulaire (image, title, category)
 */
export async function createWork(formData) {
    const token = getAuthToken();
    
    if (!token) {
        throw new Error('Vous devez être connecté pour ajouter un projet');
    }
    
    try {
        const response = await fetch(`${API_URL}/works`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // ⚠️ Pas de Content-Type pour FormData !
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Erreur API création work', error);
        throw error;
    }
}