// # Appels API spécifiques (GET, POST, DELETE) //

import { fetchData } from './api.js';

/**
 * Récupère tous les projets (works)
 */
export async function getWorks() {
    console.log('2. worksApi.js - Appel de getWorks()');
    const data = await fetchData('/works');
    console.log('4. worksApi.js - Données récupérées', data);
    return data;
}

/**
 * Récupère toutes les catégories
 */
export async function getCategories() {
    console.log(' worksApi.js - Appel de getCategories()');
    const data = await fetchData('/categories');
    console.log(' worksApi.js - Données récupérées', data);
    return data;
}