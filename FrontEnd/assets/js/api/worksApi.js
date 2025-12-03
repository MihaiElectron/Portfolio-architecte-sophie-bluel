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